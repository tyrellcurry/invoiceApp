//go:build integration

// Integration tests against a real Postgres instance. Run with:
//
//	go test -tags=integration ./...
package auth

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"github.com/tyrellcurry/invoiceApp/internal/config"
	"github.com/tyrellcurry/invoiceApp/internal/database"
)

var testDB *sql.DB

func TestMain(m *testing.M) {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}
	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		panic(err)
	}
	if err := database.Migrate(db); err != nil {
		panic(err)
	}
	testDB = db
	defer db.Close()

	m.Run()
}

func resetDB(t *testing.T) {
	t.Helper()
	if _, err := testDB.ExecContext(context.Background(),
		"TRUNCATE invoices, sessions, users RESTART IDENTITY CASCADE"); err != nil {
		t.Fatalf("reset db: %v", err)
	}
}

func TestPostgresRepositoryUpsertUserByGoogleSub(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()

	created, isNew, err := repo.UpsertUserByGoogleSub(ctx, "google-sub-1", "jensenh@mail.com", "Jensen Huang", "https://avatar/1")
	if err != nil {
		t.Fatalf("first UpsertUserByGoogleSub() error = %v", err)
	}
	if !isNew {
		t.Error("first UpsertUserByGoogleSub() isNew = false, want true")
	}

	updated, isNew, err := repo.UpsertUserByGoogleSub(ctx, "google-sub-1", "jensen.h@mail.com", "Jensen H.", "https://avatar/2")
	if err != nil {
		t.Fatalf("second UpsertUserByGoogleSub() error = %v", err)
	}
	if isNew {
		t.Error("second UpsertUserByGoogleSub() isNew = true, want false (existing user)")
	}
	if updated.ID != created.ID {
		t.Errorf("ID = %q, want %q (same user, not a duplicate)", updated.ID, created.ID)
	}
	if updated.Email != "jensen.h@mail.com" || updated.Name != "Jensen H." {
		t.Errorf("updated user = %+v, want the new email/name", updated)
	}

	got, err := repo.GetUser(ctx, created.ID)
	if err != nil {
		t.Fatalf("GetUser() error = %v", err)
	}
	if got.Email != "jensen.h@mail.com" {
		t.Errorf("GetUser().Email = %q, want the updated value", got.Email)
	}
	if got.Picture != "https://avatar/2" {
		t.Errorf("GetUser().Picture = %q, want the updated value", got.Picture)
	}
}

func TestPostgresRepositoryGetUserNotFound(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)

	_, err := repo.GetUser(context.Background(), "00000000-0000-0000-0000-000000000000")
	if err != ErrUserNotFound {
		t.Fatalf("GetUser() error = %v, want ErrUserNotFound", err)
	}
}

func TestPostgresRepositorySessionLifecycle(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()

	guest, err := repo.CreateSession(ctx, nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if guest.UserID != nil {
		t.Errorf("UserID = %v, want nil for a guest session", *guest.UserID)
	}

	got, err := repo.GetSession(ctx, guest.ID)
	if err != nil {
		t.Fatalf("GetSession() error = %v", err)
	}
	if got.ID != guest.ID {
		t.Errorf("GetSession().ID = %q, want %q", got.ID, guest.ID)
	}

	if err := repo.DeleteSession(ctx, guest.ID); err != nil {
		t.Fatalf("DeleteSession() error = %v", err)
	}
	if _, err := repo.GetSession(ctx, guest.ID); err != ErrSessionNotFound {
		t.Fatalf("GetSession() after delete error = %v, want ErrSessionNotFound", err)
	}
}

func TestPostgresRepositoryAuthenticatedSession(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()

	user, _, err := repo.UpsertUserByGoogleSub(ctx, "google-sub-1", "jensenh@mail.com", "Jensen Huang", "https://avatar/1")
	if err != nil {
		t.Fatalf("UpsertUserByGoogleSub() error = %v", err)
	}

	session, err := repo.CreateSession(ctx, &user.ID, time.Now().Add(userSessionTTL))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	if session.UserID == nil || *session.UserID != user.ID {
		t.Errorf("UserID = %v, want %q", session.UserID, user.ID)
	}
}

func TestPostgresRepositoryDeleteExpiredSessions(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()

	expired, err := repo.CreateSession(ctx, nil, time.Now().Add(-time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	active, err := repo.CreateSession(ctx, nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}

	n, err := repo.DeleteExpiredSessions(ctx)
	if err != nil {
		t.Fatalf("DeleteExpiredSessions() error = %v", err)
	}
	if n != 1 {
		t.Errorf("DeleteExpiredSessions() = %d, want 1", n)
	}

	if _, err := repo.GetSession(ctx, expired.ID); err != ErrSessionNotFound {
		t.Errorf("GetSession(expired) error = %v, want ErrSessionNotFound", err)
	}
	if _, err := repo.GetSession(ctx, active.ID); err != nil {
		t.Errorf("GetSession(active) error = %v, want it to still exist", err)
	}
}
