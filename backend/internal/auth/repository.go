package auth

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
)

// ErrSessionNotFound is returned when a session id doesn't exist (or has
// already been swept).
var ErrSessionNotFound = errors.New("session not found")

// ErrUserNotFound is returned when a user id doesn't exist.
var ErrUserNotFound = errors.New("user not found")

// Repository persists users and sessions.
type Repository interface {
	// UpsertUserByGoogleSub creates the user if googleSub hasn't been seen
	// before, or updates their email/name (they can change on Google's
	// side) and returns the existing row otherwise. The bool reports
	// whether this call created the user (their first-ever sign-in).
	UpsertUserByGoogleSub(ctx context.Context, googleSub, email, name, picture string) (User, bool, error)
	GetUser(ctx context.Context, id string) (User, error)
	CreateSession(ctx context.Context, userID *string, expiresAt time.Time) (Session, error)
	GetSession(ctx context.Context, id string) (Session, error)
	DeleteSession(ctx context.Context, id string) error
	// DeleteExpiredSessions removes every session past its expiry and
	// returns how many were deleted. Guest sessions' invoices cascade-delete
	// with them; authenticated sessions' invoices are owned by the user row
	// instead, so they're unaffected.
	DeleteExpiredSessions(ctx context.Context) (int64, error)
}

// PostgresRepository is the Postgres-backed Repository implementation.
type PostgresRepository struct {
	db *sql.DB
}

// NewPostgresRepository returns a Repository backed by db.
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

func (r *PostgresRepository) UpsertUserByGoogleSub(ctx context.Context, googleSub, email, name, picture string) (User, bool, error) {
	var u User
	var inserted bool
	err := r.db.QueryRowContext(ctx, `
		INSERT INTO users (google_sub, email, name, picture)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT (google_sub) DO UPDATE SET
			email = EXCLUDED.email, name = EXCLUDED.name, picture = EXCLUDED.picture
		RETURNING id, google_sub, email, name, picture, (xmax = 0) AS inserted`,
		googleSub, email, name, picture,
	).Scan(&u.ID, &u.GoogleSub, &u.Email, &u.Name, &u.Picture, &inserted)
	if err != nil {
		return User{}, false, fmt.Errorf("upsert user: %w", err)
	}
	return u, inserted, nil
}

func (r *PostgresRepository) GetUser(ctx context.Context, id string) (User, error) {
	var u User
	err := r.db.QueryRowContext(ctx,
		`SELECT id, google_sub, email, name, picture FROM users WHERE id = $1`, id,
	).Scan(&u.ID, &u.GoogleSub, &u.Email, &u.Name, &u.Picture)
	if errors.Is(err, sql.ErrNoRows) {
		return User{}, ErrUserNotFound
	}
	if err != nil {
		return User{}, fmt.Errorf("get user %s: %w", id, err)
	}
	return u, nil
}

func (r *PostgresRepository) CreateSession(ctx context.Context, userID *string, expiresAt time.Time) (Session, error) {
	var s Session
	var scannedUserID sql.NullString
	err := r.db.QueryRowContext(ctx, `
		INSERT INTO sessions (user_id, expires_at) VALUES ($1, $2)
		RETURNING id, user_id, expires_at`,
		userID, expiresAt,
	).Scan(&s.ID, &scannedUserID, &s.ExpiresAt)
	if err != nil {
		return Session{}, fmt.Errorf("create session: %w", err)
	}
	if scannedUserID.Valid {
		s.UserID = &scannedUserID.String
	}
	return s, nil
}

func (r *PostgresRepository) GetSession(ctx context.Context, id string) (Session, error) {
	var s Session
	var scannedUserID sql.NullString
	err := r.db.QueryRowContext(ctx,
		`SELECT id, user_id, expires_at FROM sessions WHERE id = $1`, id,
	).Scan(&s.ID, &scannedUserID, &s.ExpiresAt)
	if errors.Is(err, sql.ErrNoRows) {
		return Session{}, ErrSessionNotFound
	}
	if err != nil {
		return Session{}, fmt.Errorf("get session %s: %w", id, err)
	}
	if scannedUserID.Valid {
		s.UserID = &scannedUserID.String
	}
	return s, nil
}

func (r *PostgresRepository) DeleteSession(ctx context.Context, id string) error {
	if _, err := r.db.ExecContext(ctx, `DELETE FROM sessions WHERE id = $1`, id); err != nil {
		return fmt.Errorf("delete session %s: %w", id, err)
	}
	return nil
}

func (r *PostgresRepository) DeleteExpiredSessions(ctx context.Context) (int64, error) {
	res, err := r.db.ExecContext(ctx, `DELETE FROM sessions WHERE expires_at < now()`)
	if err != nil {
		return 0, fmt.Errorf("delete expired sessions: %w", err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("delete expired sessions: %w", err)
	}
	return n, nil
}
