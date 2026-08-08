package auth

import (
	"context"
	"errors"
	"net/http"
	"strings"
)

type contextKey int

const ownerContextKey contextKey = iota

// OwnerFromContext returns the Owner stored by RequireSession. It panics if
// called outside a request handled by that middleware, since that would be
// a programming error (a route that needs an owner but isn't protected).
func OwnerFromContext(ctx context.Context) Owner {
	owner, ok := ctx.Value(ownerContextKey).(Owner)
	if !ok {
		panic("auth: OwnerFromContext called without RequireSession in the middleware chain")
	}
	return owner
}

// RequireSession parses the Authorization: Bearer <token> header, resolves
// it to a session via svc, and stores the resulting Owner on the request
// context for downstream handlers (see OwnerFromContext). Requests with a
// missing, unknown, or expired token get 401 and never reach next.
//
// It's meant to wrap the whole top-level mux (both /auth/* and /invoices*
// routes registered on it) rather than a sub-mux, since the stdlib
// ServeMux doesn't make mounting one mux inside another at multiple
// patterns clean. The /auth/* routes and /healthz are deliberately public —
// signing in or continuing as a guest can't require already having a
// session, and a health check needs to work with no session at all — so
// requests to them skip straight through.
func RequireSession(svc *Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if strings.HasPrefix(r.URL.Path, "/auth/") || r.URL.Path == "/healthz" {
				next.ServeHTTP(w, r)
				return
			}

			token, ok := bearerToken(r)
			if !ok {
				http.Error(w, "missing bearer token", http.StatusUnauthorized)
				return
			}

			session, err := svc.GetSession(r.Context(), token)
			if err != nil {
				if errors.Is(err, ErrSessionNotFound) || errors.Is(err, ErrSessionExpired) {
					http.Error(w, "invalid or expired session", http.StatusUnauthorized)
					return
				}
				http.Error(w, "internal server error", http.StatusInternalServerError)
				return
			}

			owner := Owner{UserID: session.UserID, SessionID: session.ID}
			ctx := context.WithValue(r.Context(), ownerContextKey, owner)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func bearerToken(r *http.Request) (string, bool) {
	header := r.Header.Get("Authorization")
	token, ok := strings.CutPrefix(header, "Bearer ")
	if !ok || token == "" {
		return "", false
	}
	return token, true
}
