package auth

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"net/http"
	"strconv"
	"time"
)

const oauthStateCookie = "oauth_state"

// Handler exposes sign-in and session endpoints over HTTP.
type Handler struct {
	svc         *Service
	frontendURL string
}

// NewHandler returns a Handler backed by svc. frontendURL is where the
// browser is sent (with a session token) once a Google login completes.
func NewHandler(svc *Service, frontendURL string) *Handler {
	return &Handler{svc: svc, frontendURL: frontendURL}
}

// RegisterRoutes registers the auth endpoints on mux. None of these require
// an existing session (that's the point) — they're deliberately not wrapped
// with RequireSession.
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /auth/google/login", h.googleLogin)
	mux.HandleFunc("GET /auth/google/callback", h.googleCallback)
	mux.HandleFunc("POST /auth/guest", h.guest)
	mux.HandleFunc("POST /auth/logout", h.logout)
	mux.HandleFunc("GET /auth/me", h.me)
}

func (h *Handler) googleLogin(w http.ResponseWriter, r *http.Request) {
	state, err := randomState()
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	// Round-tripped via a short-lived cookie (not server-side storage) and
	// compared to the callback's state param, for CSRF protection. Both legs
	// of this redirect hit our own origin, so a plain Lax cookie is enough.
	http.SetCookie(w, &http.Cookie{
		Name:     oauthStateCookie,
		Value:    state,
		Path:     "/auth/google",
		MaxAge:   int((5 * time.Minute).Seconds()),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	http.Redirect(w, r, h.svc.GoogleAuthURL(state), http.StatusFound)
}

func (h *Handler) googleCallback(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie(oauthStateCookie)
	if err != nil || r.URL.Query().Get("state") != cookie.Value {
		http.Error(w, "invalid state", http.StatusBadRequest)
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name: oauthStateCookie, Path: "/auth/google", MaxAge: -1, HttpOnly: true,
	})

	code := r.URL.Query().Get("code")
	if code == "" {
		http.Error(w, "missing code", http.StatusBadRequest)
		return
	}

	session, isNewUser, err := h.svc.HandleGoogleCallback(r.Context(), code)
	if err != nil {
		http.Error(w, "google sign-in failed", http.StatusBadGateway)
		return
	}

	redirectURL := h.frontendURL + "/auth/callback#token=" + session.ID +
		"&expiresAt=" + session.ExpiresAt.UTC().Format(time.RFC3339) +
		"&preloaded=" + strconv.FormatBool(isNewUser)
	http.Redirect(w, r, redirectURL, http.StatusFound)
}

func (h *Handler) guest(w http.ResponseWriter, r *http.Request) {
	session, err := h.svc.ContinueAsGuest(r.Context())
	if err != nil {
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
	// Every guest session is brand new, so it was always just preloaded.
	writeSession(w, session, true)
}

func (h *Handler) logout(w http.ResponseWriter, r *http.Request) {
	if token, ok := bearerToken(r); ok {
		_ = h.svc.Logout(r.Context(), token)
	}
	w.WriteHeader(http.StatusNoContent)
}

type meResponse struct {
	Authenticated bool       `json:"authenticated"`
	User          *meUser    `json:"user"`
	ExpiresAt     *time.Time `json:"expiresAt"`
}

type meUser struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	// Picture is the Google avatar URL, or "" when the account has no photo.
	Picture string `json:"picture"`
}

func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
	token, ok := bearerToken(r)
	if !ok {
		writeJSON(w, http.StatusUnauthorized, meResponse{Authenticated: false})
		return
	}

	session, err := h.svc.GetSession(r.Context(), token)
	if err != nil {
		if errors.Is(err, ErrSessionNotFound) || errors.Is(err, ErrSessionExpired) {
			writeJSON(w, http.StatusUnauthorized, meResponse{Authenticated: false})
			return
		}
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	resp := meResponse{Authenticated: true, ExpiresAt: &session.ExpiresAt}
	if session.UserID != nil {
		user, err := h.svc.GetUser(r.Context(), *session.UserID)
		if err != nil {
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		resp.User = &meUser{Email: user.Email, Name: user.Name, Picture: user.Picture}
	}
	writeJSON(w, http.StatusOK, resp)
}

type sessionResponse struct {
	Token     string    `json:"token"`
	ExpiresAt time.Time `json:"expiresAt"`
	// Preloaded reports whether this session's owner was just pre-populated
	// with the example invoices, so the frontend knows to show the banner.
	Preloaded bool `json:"preloaded"`
}

func writeSession(w http.ResponseWriter, session Session, preloaded bool) {
	writeJSON(w, http.StatusOK, sessionResponse{Token: session.ID, ExpiresAt: session.ExpiresAt, Preloaded: preloaded})
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func randomState() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
