//go:build integration

// Integration tests against a real Postgres instance. They require the same
// POSTGRES_* env vars as the application (see internal/config), pointed at a
// disposable database: run `docker compose up -d db` locally, or rely on the
// postgres service CI brings up for the "Integration test" step. Run with:
//
//	go test -tags=integration ./...
package invoice

import (
	"context"
	"database/sql"
	"testing"
	"time"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
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

// resetDB clears every invoice (and, via ON DELETE CASCADE, every item) and
// every session/user before a test, so tests don't see each other's data.
func resetDB(t *testing.T) {
	t.Helper()
	if _, err := testDB.ExecContext(context.Background(),
		"TRUNCATE invoices, sessions, users RESTART IDENTITY CASCADE"); err != nil {
		t.Fatalf("reset db: %v", err)
	}
}

// newGuestOwner creates a real guest session row (invoices.session_id has a
// foreign key into sessions, so a fake id won't satisfy it) and returns the
// Owner a request from it would resolve to.
func newGuestOwner(t *testing.T) auth.Owner {
	t.Helper()
	authRepo := auth.NewPostgresRepository(testDB)
	session, err := authRepo.CreateSession(context.Background(), nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("create guest session: %v", err)
	}
	return auth.Owner{SessionID: session.ID}
}

func TestPostgresRepositoryCreateAndGet(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	input := Invoice{
		Reference:     "RT3080",
		Status:        StatusPending,
		Description:   "Re-branding",
		InvoiceDate:   strPtr("2021-07-18"),
		PaymentTerms:  intPtr(30),
		PaymentDue:    strPtr("2021-08-17"),
		SenderAddress: Address{Street: "19 Union Terrace", City: "London", PostCode: "E1 3EZ", Country: "United Kingdom"},
		ClientName:    "Jensen Huang",
		ClientEmail:   "jensenh@mail.com",
		ClientAddress: Address{Street: "106 Kendell Street", City: "Sharrington", PostCode: "NR24 5WQ", Country: "United Kingdom"},
		Items: []LineItem{
			{Name: "Brand Guidelines", Quantity: 1, Price: 180090},
			{Name: "Logo Design", Quantity: 2, Price: 5000},
		},
		AmountDue: 190090,
	}

	created, err := repo.Create(ctx, owner, input)
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}
	if created.ID == "" {
		t.Fatal("expected a generated id")
	}

	got, err := repo.Get(ctx, owner, created.ID)
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if got.Reference != "RT3080" || got.ClientName != "Jensen Huang" || got.AmountDue != 190090 {
		t.Errorf("Get() = %+v, want reference/clientName/amountDue to round-trip", got)
	}
	if got.InvoiceDate == nil || *got.InvoiceDate != "2021-07-18" {
		t.Errorf("InvoiceDate = %v, want 2021-07-18", got.InvoiceDate)
	}
	if got.PaymentTerms == nil || *got.PaymentTerms != 30 {
		t.Errorf("PaymentTerms = %v, want 30", got.PaymentTerms)
	}
	if len(got.Items) != 2 || got.Items[0].Name != "Brand Guidelines" || got.Items[1].Name != "Logo Design" {
		t.Errorf("Items = %+v, want 2 items in insertion order", got.Items)
	}
}

func TestPostgresRepositoryCreateDraftWithNullableFields(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{
		Reference:  "RG0314",
		Status:     StatusDraft,
		ClientName: "John Morrison",
		Items:      []LineItem{},
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	got, err := repo.Get(ctx, owner, created.ID)
	if err != nil {
		t.Fatalf("Get() error = %v", err)
	}
	if got.InvoiceDate != nil || got.PaymentTerms != nil || got.PaymentDue != nil {
		t.Errorf("expected nil date fields for a draft, got %+v", got)
	}
	if len(got.Items) != 0 {
		t.Errorf("Items = %+v, want none", got.Items)
	}
}

func TestPostgresRepositoryGetNotFound(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	owner := newGuestOwner(t)

	_, err := repo.Get(context.Background(), owner, "00000000-0000-0000-0000-000000000000")
	if err != ErrNotFound {
		t.Fatalf("Get() error = %v, want ErrNotFound", err)
	}
}

func TestPostgresRepositoryGetWrongOwner(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)
	otherOwner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{Reference: "RT3080", Status: StatusDraft, ClientName: "Jensen Huang"})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	if _, err := repo.Get(ctx, otherOwner, created.ID); err != ErrNotFound {
		t.Fatalf("Get() by a different owner error = %v, want ErrNotFound", err)
	}
}

func TestPostgresRepositoryCreateDuplicateReference(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	inv := Invoice{Reference: "XM9141", Status: StatusDraft, ClientName: "Alex Grim"}
	if _, err := repo.Create(ctx, owner, inv); err != nil {
		t.Fatalf("first Create() error = %v", err)
	}
	if _, err := repo.Create(ctx, owner, inv); err != errDuplicateReference {
		t.Fatalf("second Create() error = %v, want errDuplicateReference", err)
	}
}

func TestPostgresRepositoryList(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)
	otherOwner := newGuestOwner(t)

	first, err := repo.Create(ctx, owner, Invoice{
		Reference: "RT3080", Status: StatusPaid, ClientName: "Jensen Huang",
		Items: []LineItem{{Name: "Brand Guidelines", Quantity: 1, Price: 180090}},
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}
	second, err := repo.Create(ctx, owner, Invoice{
		Reference: "XM9141", Status: StatusPending, ClientName: "Alex Grim",
		Items: []LineItem{{Name: "Banner Design", Quantity: 1, Price: 15600}},
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}
	if _, err := repo.Create(ctx, otherOwner, Invoice{Reference: "FV2353", Status: StatusDraft, ClientName: "Someone Else"}); err != nil {
		t.Fatalf("Create() for otherOwner error = %v", err)
	}

	list, err := repo.List(ctx, owner)
	if err != nil {
		t.Fatalf("List() error = %v", err)
	}
	if len(list) != 2 {
		t.Fatalf("List() returned %d invoices, want 2 (owner's own, not otherOwner's)", len(list))
	}

	byID := map[string]Invoice{}
	for _, inv := range list {
		byID[inv.ID] = inv
	}
	if len(byID[first.ID].Items) != 1 || byID[first.ID].Items[0].Name != "Brand Guidelines" {
		t.Errorf("first invoice items = %+v", byID[first.ID].Items)
	}
	if len(byID[second.ID].Items) != 1 || byID[second.ID].Items[0].Name != "Banner Design" {
		t.Errorf("second invoice items = %+v", byID[second.ID].Items)
	}
}

func TestPostgresRepositoryUpdate(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{
		Reference: "FV2353", Status: StatusPending, ClientName: "Alysa Werner",
		Items: []LineItem{{Name: "Logo Concept", Quantity: 1, Price: 10204}},
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	updated := created
	updated.ClientName = "Alysa W. Werner"
	updated.Status = StatusPaid
	updated.Items = []LineItem{
		{Name: "Logo Concept", Quantity: 1, Price: 10204},
		{Name: "Business Card", Quantity: 3, Price: 500},
	}
	updated.AmountDue = updated.Total()

	got, err := repo.Update(ctx, owner, updated)
	if err != nil {
		t.Fatalf("Update() error = %v", err)
	}
	if got.ClientName != "Alysa W. Werner" {
		t.Errorf("ClientName = %q, want updated value", got.ClientName)
	}
	if got.Status != StatusPaid {
		t.Errorf("Status = %q, want %q (Update persists status)", got.Status, StatusPaid)
	}
	if len(got.Items) != 2 || got.AmountDue != 11704 {
		t.Errorf("Items/AmountDue = %+v/%d, want 2 items and 11704", got.Items, got.AmountDue)
	}
}

func TestPostgresRepositoryUpdateNotFound(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	owner := newGuestOwner(t)

	_, err := repo.Update(context.Background(), owner, Invoice{ID: "00000000-0000-0000-0000-000000000000", ClientName: "Nobody"})
	if err != ErrNotFound {
		t.Fatalf("Update() error = %v, want ErrNotFound", err)
	}
}

func TestPostgresRepositoryUpdateWrongOwner(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)
	otherOwner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{Reference: "XA5478", Status: StatusDraft, ClientName: "Thomas Wayne"})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	updated := created
	updated.ClientName = "Hacked"
	if _, err := repo.Update(ctx, otherOwner, updated); err != ErrNotFound {
		t.Fatalf("Update() by a different owner error = %v, want ErrNotFound", err)
	}
}

func TestPostgresRepositoryDelete(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{
		Reference: "XA5478", Status: StatusDraft, ClientName: "Thomas Wayne",
		Items: []LineItem{{Name: "Consulting Hours", Quantity: 10, Price: 25000}},
	})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	if err := repo.Delete(ctx, owner, created.ID); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}
	if _, err := repo.Get(ctx, owner, created.ID); err != ErrNotFound {
		t.Fatalf("Get() after delete error = %v, want ErrNotFound", err)
	}

	var itemCount int
	if err := testDB.QueryRowContext(ctx, "SELECT count(*) FROM invoice_items WHERE invoice_id = $1", created.ID).Scan(&itemCount); err != nil {
		t.Fatalf("count items: %v", err)
	}
	if itemCount != 0 {
		t.Errorf("invoice_items count = %d, want 0 (cascade delete)", itemCount)
	}

	if err := repo.Delete(ctx, owner, created.ID); err != ErrNotFound {
		t.Fatalf("second Delete() error = %v, want ErrNotFound", err)
	}
}

func TestPostgresRepositoryUpdateStatus(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	ctx := context.Background()
	owner := newGuestOwner(t)

	created, err := repo.Create(ctx, owner, Invoice{Reference: "RT3080", Status: StatusPending, ClientName: "Jensen Huang"})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	got, err := repo.UpdateStatus(ctx, owner, created.ID, StatusPaid)
	if err != nil {
		t.Fatalf("UpdateStatus() error = %v", err)
	}
	if got.Status != StatusPaid {
		t.Errorf("Status = %q, want %q", got.Status, StatusPaid)
	}

	if _, err := repo.UpdateStatus(ctx, owner, "00000000-0000-0000-0000-000000000000", StatusPaid); err != ErrNotFound {
		t.Fatalf("UpdateStatus() on missing id error = %v, want ErrNotFound", err)
	}
}

// TestSessionCascadeDeletesGuestInvoices proves the whole point of tying a
// guest invoice to session_id ON DELETE CASCADE: deleting the session (what
// the periodic sweep does to expired ones) removes its invoices too.
func TestSessionCascadeDeletesGuestInvoices(t *testing.T) {
	resetDB(t)
	repo := NewPostgresRepository(testDB)
	authRepo := auth.NewPostgresRepository(testDB)
	ctx := context.Background()

	session, err := authRepo.CreateSession(ctx, nil, time.Now().Add(time.Hour))
	if err != nil {
		t.Fatalf("CreateSession() error = %v", err)
	}
	owner := auth.Owner{SessionID: session.ID}

	created, err := repo.Create(ctx, owner, Invoice{Reference: "RT3080", Status: StatusDraft, ClientName: "Jensen Huang"})
	if err != nil {
		t.Fatalf("Create() error = %v", err)
	}

	if err := authRepo.DeleteSession(ctx, session.ID); err != nil {
		t.Fatalf("DeleteSession() error = %v", err)
	}

	if _, err := repo.Get(ctx, owner, created.ID); err != ErrNotFound {
		t.Fatalf("Get() after session deletion error = %v, want ErrNotFound (cascade delete)", err)
	}
}
