package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
	"strings"
	"time"
)

// ErrSessionExpired is returned by GetSession for a session past its
// ExpiresAt. The periodic sweep (Sweep) is what actually deletes it.
var ErrSessionExpired = errors.New("session expired")

const (
	guestSessionTTL = 24 * time.Hour
	userSessionTTL  = 30 * 24 * time.Hour

	googleAuthURL      = "https://accounts.google.com/o/oauth2/v2/auth"
	googleTokenURL     = "https://oauth2.googleapis.com/token"
	googleTokenInfoURL = "https://oauth2.googleapis.com/tokeninfo"
)

// InvoiceSeeder pre-populates a newly created owner's account with example
// invoices, so it isn't empty at first look. Implemented by *invoice.Service;
// declared here (the consumer) rather than there, per this project's
// interfaces-at-the-consumer convention.
type InvoiceSeeder interface {
	SeedExamples(ctx context.Context, owner Owner) error
}

// Service implements sign-in (Google and guest) and session lifecycle.
type Service struct {
	repo         Repository
	seeder       InvoiceSeeder
	clientID     string
	clientSecret string
	redirectURL  string
	httpClient   *http.Client
	// tokenURL and tokenInfoURL point at Google by default; tests override
	// them to a local httptest.Server instead of calling the real Google.
	tokenURL     string
	tokenInfoURL string
}

// NewService returns a Service backed by repo, configured with the Google
// OAuth client credentials and the backend's own callback URL. seeder
// pre-populates example invoices for newly created owners.
func NewService(repo Repository, seeder InvoiceSeeder, clientID, clientSecret, redirectURL string) *Service {
	return &Service{
		repo:         repo,
		seeder:       seeder,
		clientID:     clientID,
		clientSecret: clientSecret,
		redirectURL:  redirectURL,
		httpClient:   http.DefaultClient,
		tokenURL:     googleTokenURL,
		tokenInfoURL: googleTokenInfoURL,
	}
}

// ContinueAsGuest creates a short-lived, unowned session, pre-populated with
// the example invoices since every guest session starts fresh.
func (s *Service) ContinueAsGuest(ctx context.Context) (Session, error) {
	session, err := s.repo.CreateSession(ctx, nil, time.Now().Add(guestSessionTTL))
	if err != nil {
		return Session{}, err
	}
	if err := s.seeder.SeedExamples(ctx, Owner{SessionID: session.ID}); err != nil {
		return Session{}, fmt.Errorf("continue as guest: %w", err)
	}
	return session, nil
}

// GoogleAuthURL returns the URL to send the browser to for Google's consent
// screen. state is an opaque value the caller round-trips (and validates)
// via the callback for CSRF protection.
func (s *Service) GoogleAuthURL(state string) string {
	q := url.Values{
		"client_id":     {s.clientID},
		"redirect_uri":  {s.redirectURL},
		"response_type": {"code"},
		"scope":         {"openid email profile"},
		"state":         {state},
		"prompt":        {"select_account"},
	}
	return googleAuthURL + "?" + q.Encode()
}

// HandleGoogleCallback exchanges an authorization code for Google tokens,
// verifies the resulting ID token, upserts the corresponding user, and
// creates a long-lived, permanent session for them. The returned bool
// reports whether this was the user's first-ever sign-in, in which case
// their account was just pre-populated with the example invoices.
func (s *Service) HandleGoogleCallback(ctx context.Context, code string) (Session, bool, error) {
	idToken, err := s.exchangeCode(ctx, code)
	if err != nil {
		return Session{}, false, fmt.Errorf("google callback: %w", err)
	}

	claims, err := s.verifyIDToken(ctx, idToken)
	if err != nil {
		return Session{}, false, fmt.Errorf("google callback: %w", err)
	}

	user, isNewUser, err := s.repo.UpsertUserByGoogleSub(ctx, claims.Sub, claims.Email, claims.Name)
	if err != nil {
		return Session{}, false, fmt.Errorf("google callback: %w", err)
	}

	if isNewUser {
		if err := s.seeder.SeedExamples(ctx, Owner{UserID: &user.ID}); err != nil {
			return Session{}, false, fmt.Errorf("google callback: %w", err)
		}
	}

	session, err := s.repo.CreateSession(ctx, &user.ID, time.Now().Add(userSessionTTL))
	if err != nil {
		return Session{}, false, fmt.Errorf("google callback: %w", err)
	}
	return session, isNewUser, nil
}

// GetSession looks up a session by its bearer token, treating an expired
// one as not found (the periodic Sweep is what actually deletes it).
func (s *Service) GetSession(ctx context.Context, token string) (Session, error) {
	session, err := s.repo.GetSession(ctx, token)
	if err != nil {
		return Session{}, err
	}
	if session.ExpiresAt.Before(time.Now()) {
		return Session{}, ErrSessionExpired
	}
	return session, nil
}

// GetUser returns the user with the given id.
func (s *Service) GetUser(ctx context.Context, id string) (User, error) {
	return s.repo.GetUser(ctx, id)
}

// Logout deletes a session immediately, rather than waiting for it to expire.
func (s *Service) Logout(ctx context.Context, token string) error {
	return s.repo.DeleteSession(ctx, token)
}

// Sweep deletes every expired session (and, via ON DELETE CASCADE, every
// guest invoice that belonged to one). Call it periodically.
func (s *Service) Sweep(ctx context.Context) (int64, error) {
	return s.repo.DeleteExpiredSessions(ctx)
}

// googleTokenResponse is the subset of Google's token endpoint response we need.
type googleTokenResponse struct {
	IDToken string `json:"id_token"`
}

func (s *Service) exchangeCode(ctx context.Context, code string) (string, error) {
	form := url.Values{
		"code":          {code},
		"client_id":     {s.clientID},
		"client_secret": {s.clientSecret},
		"redirect_uri":  {s.redirectURL},
		"grant_type":    {"authorization_code"},
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, s.tokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", fmt.Errorf("build token request: %w", err)
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("exchange code: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("exchange code: google returned status %d", resp.StatusCode)
	}

	var tok googleTokenResponse
	if err := json.NewDecoder(resp.Body).Decode(&tok); err != nil {
		return "", fmt.Errorf("decode token response: %w", err)
	}
	if tok.IDToken == "" {
		return "", fmt.Errorf("token response missing id_token")
	}
	return tok.IDToken, nil
}

// googleClaims is the subset of Google's tokeninfo response we need.
type googleClaims struct {
	Sub   string `json:"sub"`
	Email string `json:"email"`
	Name  string `json:"name"`
	Aud   string `json:"aud"`
}

// verifyIDToken asks Google to verify idToken's signature and decode its
// claims (avoiding a local JWT/JWKS dependency), then checks the audience
// matches our client id so a token minted for a different app is rejected.
func (s *Service) verifyIDToken(ctx context.Context, idToken string) (googleClaims, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet,
		s.tokenInfoURL+"?id_token="+url.QueryEscape(idToken), nil)
	if err != nil {
		return googleClaims{}, fmt.Errorf("build tokeninfo request: %w", err)
	}

	resp, err := s.httpClient.Do(req)
	if err != nil {
		return googleClaims{}, fmt.Errorf("verify id token: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return googleClaims{}, fmt.Errorf("verify id token: google returned status %d", resp.StatusCode)
	}

	var claims googleClaims
	if err := json.NewDecoder(resp.Body).Decode(&claims); err != nil {
		return googleClaims{}, fmt.Errorf("decode tokeninfo response: %w", err)
	}
	if claims.Aud != s.clientID {
		return googleClaims{}, fmt.Errorf("id token audience mismatch")
	}
	return claims, nil
}
