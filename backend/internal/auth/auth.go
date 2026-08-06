// Package auth handles Google sign-in, guest sessions, and the ownership
// context ("Owner") that internal/invoice uses to scope data per user.
package auth

import "time"

// User is a person who has signed in with Google at least once.
type User struct {
	ID        string
	GoogleSub string
	Email     string
	Name      string
}

// Session is a bearer-token session. UserID is nil for a guest session
// (ephemeral, swept once ExpiresAt passes) and set for an authenticated one
// (permanent, tied to a User).
type Session struct {
	ID        string
	UserID    *string
	ExpiresAt time.Time
}

// Owner identifies who a request is acting as. Exactly one of UserID or
// SessionID is used to scope invoice ownership: an authenticated request is
// scoped by UserID (stable across that user's sessions/devices), a guest
// request by SessionID (scoped to that one ephemeral session).
type Owner struct {
	UserID    *string
	SessionID string
}
