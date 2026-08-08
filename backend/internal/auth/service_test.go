package auth

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

// fakeRepository is an in-memory Repository used to test Service without a
// database.
type fakeRepository struct {
	usersByGoogleSub map[string]User
	usersByID        map[string]User
	sessions         map[string]Session
	nextUserID       int
	nextSessionID    int
}

func newFakeRepository() *fakeRepository {
	return &fakeRepository{
		usersByGoogleSub: map[string]User{},
		usersByID:        map[string]User{},
		sessions:         map[string]Session{},
	}
}

func (f *fakeRepository) UpsertUserByGoogleSub(_ context.Context, googleSub, email, name, picture string) (User, bool, error) {
	if u, ok := f.usersByGoogleSub[googleSub]; ok {
		u.Email, u.Name, u.Picture = email, name, picture
		f.usersByGoogleSub[googleSub] = u
		f.usersByID[u.ID] = u
		return u, false, nil
	}
	f.nextUserID++
	u := User{ID: fmt.Sprintf("user-%d", f.nextUserID), GoogleSub: googleSub, Email: email, Name: name, Picture: picture}
	f.usersByGoogleSub[googleSub] = u
	f.usersByID[u.ID] = u
	return u, true, nil
}

// fakeSeeder is an in-memory InvoiceSeeder used to verify Service seeds
// example invoices for the right owner at the right time, without a real
// invoice.Service.
type fakeSeeder struct {
	calls []Owner
	err   error
}

func (f *fakeSeeder) SeedExamples(_ context.Context, owner Owner) error {
	f.calls = append(f.calls, owner)
	return f.err
}

func (f *fakeRepository) GetUser(_ context.Context, id string) (User, error) {
	u, ok := f.usersByID[id]
	if !ok {
		return User{}, ErrUserNotFound
	}
	return u, nil
}

func (f *fakeRepository) CreateSession(_ context.Context, userID *string, expiresAt time.Time) (Session, error) {
	f.nextSessionID++
	s := Session{ID: fmt.Sprintf("session-%d", f.nextSessionID), UserID: userID, ExpiresAt: expiresAt}
	f.sessions[s.ID] = s
	return s, nil
}

func (f *fakeRepository) GetSession(_ context.Context, id string) (Session, error) {
	s, ok := f.sessions[id]
	if !ok {
		return Session{}, ErrSessionNotFound
	}
	return s, nil
}

func (f *fakeRepository) DeleteSession(_ context.Context, id string) error {
	delete(f.sessions, id)
	return nil
}

func (f *fakeRepository) DeleteExpiredSessions(_ context.Context) (int64, error) {
	var n int64
	for id, s := range f.sessions {
		if s.ExpiresAt.Before(time.Now()) {
			delete(f.sessions, id)
			n++
		}
	}
	return n, nil
}

func TestServiceContinueAsGuest(t *testing.T) {
	seeder := &fakeSeeder{}
	svc := NewService(newFakeRepository(), seeder, "client-id", "client-secret", "http://localhost/callback")

	session, err := svc.ContinueAsGuest(context.Background())
	if err != nil {
		t.Fatalf("ContinueAsGuest() error = %v", err)
	}
	if session.UserID != nil {
		t.Errorf("UserID = %v, want nil (guest)", *session.UserID)
	}
	if !session.ExpiresAt.After(time.Now()) {
		t.Errorf("ExpiresAt = %v, want a time in the future", session.ExpiresAt)
	}
	if len(seeder.calls) != 1 || seeder.calls[0].SessionID != session.ID {
		t.Errorf("seeder.calls = %+v, want a single call scoped to the new session", seeder.calls)
	}
}

func TestServiceContinueAsGuestPropagatesSeedFailure(t *testing.T) {
	seeder := &fakeSeeder{err: errors.New("seed failed")}
	svc := NewService(newFakeRepository(), seeder, "client-id", "client-secret", "http://localhost/callback")

	if _, err := svc.ContinueAsGuest(context.Background()); err == nil {
		t.Fatal("expected an error when seeding fails")
	}
}

// googleTestServer stands in for Google's token and tokeninfo endpoints.
func googleTestServer(t *testing.T, idToken string, claims googleClaims) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/token":
			_ = json.NewEncoder(w).Encode(googleTokenResponse{IDToken: idToken})
		case "/tokeninfo":
			if r.URL.Query().Get("id_token") != idToken {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			_ = json.NewEncoder(w).Encode(claims)
		default:
			w.WriteHeader(http.StatusNotFound)
		}
	}))
}

func TestServiceHandleGoogleCallback(t *testing.T) {
	t.Run("upserts the user and creates a session", func(t *testing.T) {
		server := googleTestServer(t, "fake-id-token", googleClaims{
			Sub: "google-sub-1", Email: "jensenh@mail.com", Name: "Jensen Huang",
			Picture: "https://lh3.googleusercontent.com/a/avatar", Aud: "client-id",
		})
		defer server.Close()

		repo := newFakeRepository()
		seeder := &fakeSeeder{}
		svc := NewService(repo, seeder, "client-id", "client-secret", "http://localhost/callback")
		svc.tokenURL = server.URL + "/token"
		svc.tokenInfoURL = server.URL + "/tokeninfo"

		session, isNewUser, err := svc.HandleGoogleCallback(context.Background(), "auth-code")
		if err != nil {
			t.Fatalf("HandleGoogleCallback() error = %v", err)
		}
		if session.UserID == nil {
			t.Fatal("UserID = nil, want the signed-in user's id")
		}
		if !isNewUser {
			t.Error("isNewUser = false, want true for a first-ever sign-in")
		}
		user, err := svc.GetUser(context.Background(), *session.UserID)
		if err != nil {
			t.Fatalf("GetUser() error = %v", err)
		}
		if user.Email != "jensenh@mail.com" || user.GoogleSub != "google-sub-1" {
			t.Errorf("user = %+v, want the claims from the id token", user)
		}
		if user.Picture != "https://lh3.googleusercontent.com/a/avatar" {
			t.Errorf("Picture = %q, want the avatar URL from the id token", user.Picture)
		}
		if len(seeder.calls) != 1 || seeder.calls[0].UserID == nil || *seeder.calls[0].UserID != user.ID {
			t.Errorf("seeder.calls = %+v, want a single call scoped to the new user", seeder.calls)
		}
	})

	t.Run("signing in twice reuses the same user and only seeds once", func(t *testing.T) {
		server := googleTestServer(t, "fake-id-token", googleClaims{
			Sub: "google-sub-1", Email: "jensenh@mail.com", Name: "Jensen Huang", Aud: "client-id",
		})
		defer server.Close()

		repo := newFakeRepository()
		seeder := &fakeSeeder{}
		svc := NewService(repo, seeder, "client-id", "client-secret", "http://localhost/callback")
		svc.tokenURL = server.URL + "/token"
		svc.tokenInfoURL = server.URL + "/tokeninfo"

		first, firstIsNew, err := svc.HandleGoogleCallback(context.Background(), "auth-code-1")
		if err != nil {
			t.Fatalf("first HandleGoogleCallback() error = %v", err)
		}
		second, secondIsNew, err := svc.HandleGoogleCallback(context.Background(), "auth-code-2")
		if err != nil {
			t.Fatalf("second HandleGoogleCallback() error = %v", err)
		}
		if *first.UserID != *second.UserID {
			t.Errorf("UserID = %s then %s, want the same user both times", *first.UserID, *second.UserID)
		}
		if !firstIsNew || secondIsNew {
			t.Errorf("isNewUser = %v then %v, want true then false", firstIsNew, secondIsNew)
		}
		if len(seeder.calls) != 1 {
			t.Errorf("seeder.calls = %+v, want exactly one call (only the first sign-in)", seeder.calls)
		}
	})

	t.Run("rejects an id token minted for a different client", func(t *testing.T) {
		server := googleTestServer(t, "fake-id-token", googleClaims{
			Sub: "google-sub-1", Email: "jensenh@mail.com", Name: "Jensen Huang", Aud: "some-other-client",
		})
		defer server.Close()

		svc := NewService(newFakeRepository(), &fakeSeeder{}, "client-id", "client-secret", "http://localhost/callback")
		svc.tokenURL = server.URL + "/token"
		svc.tokenInfoURL = server.URL + "/tokeninfo"

		if _, _, err := svc.HandleGoogleCallback(context.Background(), "auth-code"); err == nil {
			t.Fatal("expected an error for an audience mismatch")
		}
	})

	t.Run("propagates a token exchange failure", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusInternalServerError)
		}))
		defer server.Close()

		svc := NewService(newFakeRepository(), &fakeSeeder{}, "client-id", "client-secret", "http://localhost/callback")
		svc.tokenURL = server.URL + "/token"
		svc.tokenInfoURL = server.URL + "/tokeninfo"

		if _, _, err := svc.HandleGoogleCallback(context.Background(), "auth-code"); err == nil {
			t.Fatal("expected an error when Google's token endpoint fails")
		}
	})
}

func TestServiceGetSession(t *testing.T) {
	repo := newFakeRepository()
	svc := NewService(repo, &fakeSeeder{}, "client-id", "client-secret", "http://localhost/callback")

	valid, err := repo.CreateSession(context.Background(), nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if _, err := svc.GetSession(context.Background(), valid.ID); err != nil {
		t.Errorf("GetSession() for a valid session error = %v", err)
	}

	expired, err := repo.CreateSession(context.Background(), nil, time.Now().Add(-time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if _, err := svc.GetSession(context.Background(), expired.ID); !errors.Is(err, ErrSessionExpired) {
		t.Errorf("GetSession() for an expired session error = %v, want ErrSessionExpired", err)
	}

	if _, err := svc.GetSession(context.Background(), "missing"); !errors.Is(err, ErrSessionNotFound) {
		t.Errorf("GetSession() for an unknown session error = %v, want ErrSessionNotFound", err)
	}
}

func TestServiceLogout(t *testing.T) {
	repo := newFakeRepository()
	svc := NewService(repo, &fakeSeeder{}, "client-id", "client-secret", "http://localhost/callback")

	session, err := repo.CreateSession(context.Background(), nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if err := svc.Logout(context.Background(), session.ID); err != nil {
		t.Fatalf("Logout() error = %v", err)
	}
	if _, err := svc.GetSession(context.Background(), session.ID); !errors.Is(err, ErrSessionNotFound) {
		t.Errorf("GetSession() after logout error = %v, want ErrSessionNotFound", err)
	}
}

func TestServiceSweep(t *testing.T) {
	repo := newFakeRepository()
	svc := NewService(repo, &fakeSeeder{}, "client-id", "client-secret", "http://localhost/callback")

	if _, err := repo.CreateSession(context.Background(), nil, time.Now().Add(-time.Hour)); err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if _, err := repo.CreateSession(context.Background(), nil, time.Now().Add(time.Hour)); err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}

	n, err := svc.Sweep(context.Background())
	if err != nil {
		t.Fatalf("Sweep() error = %v", err)
	}
	if n != 1 {
		t.Errorf("Sweep() = %d, want 1 (only the expired session)", n)
	}
	if len(repo.sessions) != 1 {
		t.Errorf("remaining sessions = %d, want 1", len(repo.sessions))
	}
}
