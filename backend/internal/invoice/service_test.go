package invoice

import (
	"context"
	"errors"
	"fmt"
	"testing"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
)

// fakeRepository is an in-memory Repository used to test Service without a
// database. It tracks an owner key per invoice so List/Get/Update/Delete/
// UpdateStatus can exercise the same ownership scoping the real Postgres
// repository does.
type fakeRepository struct {
	invoices   map[string]Invoice
	owners     map[string]string
	nextID     int
	createErrs []error
	getErr     error
}

func newFakeRepository() *fakeRepository {
	return &fakeRepository{invoices: map[string]Invoice{}, owners: map[string]string{}}
}

// seed pre-populates an invoice owned by owner, for tests that need one to
// already exist before calling the method under test.
func (f *fakeRepository) seed(id string, owner auth.Owner, inv Invoice) {
	inv.ID = id
	f.invoices[id] = inv
	f.owners[id] = ownerKey(owner)
}

func ownerKey(owner auth.Owner) string {
	if owner.UserID != nil {
		return "user:" + *owner.UserID
	}
	return "session:" + owner.SessionID
}

func (f *fakeRepository) List(_ context.Context, owner auth.Owner) ([]Invoice, error) {
	key := ownerKey(owner)
	var out []Invoice
	for id, inv := range f.invoices {
		if f.owners[id] == key {
			out = append(out, inv)
		}
	}
	return out, nil
}

func (f *fakeRepository) Get(_ context.Context, owner auth.Owner, id string) (Invoice, error) {
	if f.getErr != nil {
		return Invoice{}, f.getErr
	}
	inv, ok := f.invoices[id]
	if !ok || f.owners[id] != ownerKey(owner) {
		return Invoice{}, ErrNotFound
	}
	return inv, nil
}

func (f *fakeRepository) Create(_ context.Context, owner auth.Owner, inv Invoice) (Invoice, error) {
	if len(f.createErrs) > 0 {
		err := f.createErrs[0]
		f.createErrs = f.createErrs[1:]
		if err != nil {
			return Invoice{}, err
		}
	}
	f.nextID++
	inv.ID = fmt.Sprintf("id-%d", f.nextID)
	f.invoices[inv.ID] = inv
	f.owners[inv.ID] = ownerKey(owner)
	return inv, nil
}

func (f *fakeRepository) Update(_ context.Context, owner auth.Owner, inv Invoice) (Invoice, error) {
	if _, ok := f.invoices[inv.ID]; !ok || f.owners[inv.ID] != ownerKey(owner) {
		return Invoice{}, ErrNotFound
	}
	f.invoices[inv.ID] = inv
	return inv, nil
}

func (f *fakeRepository) Delete(_ context.Context, owner auth.Owner, id string) error {
	if _, ok := f.invoices[id]; !ok || f.owners[id] != ownerKey(owner) {
		return ErrNotFound
	}
	delete(f.invoices, id)
	delete(f.owners, id)
	return nil
}

func (f *fakeRepository) UpdateStatus(_ context.Context, owner auth.Owner, id string, status Status) (Invoice, error) {
	inv, ok := f.invoices[id]
	if !ok || f.owners[id] != ownerKey(owner) {
		return Invoice{}, ErrNotFound
	}
	inv.Status = status
	f.invoices[id] = inv
	return inv, nil
}

func strPtr(s string) *string { return &s }
func intPtr(i int) *int       { return &i }

// guestOwner and otherGuestOwner are two distinct guest owners, used to
// exercise both "owns it" and "doesn't own it" paths.
var guestOwner = auth.Owner{SessionID: "sess-1"}
var otherGuestOwner = auth.Owner{SessionID: "sess-2"}

func validCreateInput() Invoice {
	return Invoice{
		ClientName:  "Jensen Huang",
		Description: "Re-branding",
		Items: []LineItem{
			{Name: "Brand Guidelines", Quantity: 1, Price: 180090},
		},
	}
}

func TestServiceCreate(t *testing.T) {
	t.Run("defaults status to draft and computes amount due", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		got, err := svc.Create(context.Background(), guestOwner, validCreateInput())
		if err != nil {
			t.Fatalf("Create() error = %v", err)
		}
		if got.Status != StatusDraft {
			t.Errorf("Status = %q, want %q", got.Status, StatusDraft)
		}
		if got.AmountDue != 180090 {
			t.Errorf("AmountDue = %d, want 180090", got.AmountDue)
		}
		if len(got.Reference) != 6 {
			t.Errorf("Reference = %q, want length 6", got.Reference)
		}
		if got.PaymentDue != nil {
			t.Errorf("PaymentDue = %v, want nil (no invoice date set)", *got.PaymentDue)
		}
	})

	t.Run("computes payment due from invoice date and terms", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		input := validCreateInput()
		input.Status = StatusPending
		input.InvoiceDate = strPtr("2021-08-21")
		input.PaymentTerms = intPtr(30)

		got, err := svc.Create(context.Background(), guestOwner, input)
		if err != nil {
			t.Fatalf("Create() error = %v", err)
		}
		if got.PaymentDue == nil || *got.PaymentDue != "2021-09-20" {
			t.Errorf("PaymentDue = %v, want 2021-09-20", got.PaymentDue)
		}
	})

	t.Run("rejects a paid status", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		input := validCreateInput()
		input.Status = StatusPaid

		_, err := svc.Create(context.Background(), guestOwner, input)
		var validationErr *ValidationError
		if !errors.As(err, &validationErr) {
			t.Fatalf("Create() error = %v, want *ValidationError", err)
		}
	})

	t.Run("rejects missing client name", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		input := validCreateInput()
		input.ClientName = ""

		_, err := svc.Create(context.Background(), guestOwner, input)
		var validationErr *ValidationError
		if !errors.As(err, &validationErr) {
			t.Fatalf("Create() error = %v, want *ValidationError", err)
		}
	})

	t.Run("rejects a zero quantity item", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		input := validCreateInput()
		input.Items[0].Quantity = 0

		_, err := svc.Create(context.Background(), guestOwner, input)
		var validationErr *ValidationError
		if !errors.As(err, &validationErr) {
			t.Fatalf("Create() error = %v, want *ValidationError", err)
		}
	})

	t.Run("retries on a duplicate reference", func(t *testing.T) {
		repo := newFakeRepository()
		repo.createErrs = []error{errDuplicateReference, errDuplicateReference}
		svc := NewService(repo)

		got, err := svc.Create(context.Background(), guestOwner, validCreateInput())
		if err != nil {
			t.Fatalf("Create() error = %v", err)
		}
		if got.ID == "" {
			t.Error("expected invoice to be created after retrying")
		}
	})

	t.Run("gives up after exhausting reference attempts", func(t *testing.T) {
		repo := newFakeRepository()
		errs := make([]error, maxReferenceAttempts)
		for i := range errs {
			errs[i] = errDuplicateReference
		}
		repo.createErrs = errs
		svc := NewService(repo)

		_, err := svc.Create(context.Background(), guestOwner, validCreateInput())
		if err == nil {
			t.Fatal("expected an error after exhausting reference attempts")
		}
	})
}

func TestServiceList(t *testing.T) {
	repo := newFakeRepository()
	repo.seed("id-1", guestOwner, Invoice{Reference: "RT3080"})
	repo.seed("id-2", otherGuestOwner, Invoice{Reference: "XM9141"})
	svc := NewService(repo)

	got, err := svc.List(context.Background(), guestOwner)
	if err != nil {
		t.Fatalf("List() error = %v", err)
	}
	if len(got) != 1 || got[0].Reference != "RT3080" {
		t.Errorf("List() = %+v, want only guestOwner's invoice", got)
	}
}

func TestServiceGet(t *testing.T) {
	repo := newFakeRepository()
	repo.seed("id-1", guestOwner, Invoice{Reference: "RT3080"})
	svc := NewService(repo)

	if _, err := svc.Get(context.Background(), guestOwner, "id-1"); err != nil {
		t.Fatalf("Get() by owner error = %v", err)
	}
	if _, err := svc.Get(context.Background(), otherGuestOwner, "id-1"); !errors.Is(err, ErrNotFound) {
		t.Errorf("Get() by a different owner error = %v, want ErrNotFound", err)
	}
}

func TestServiceUpdate(t *testing.T) {
	t.Run("recomputes amount due and preserves status and reference", func(t *testing.T) {
		repo := newFakeRepository()
		repo.seed("id-1", guestOwner, Invoice{
			Reference: "RT3080",
			Status:    StatusPending,
			AmountDue: 100,
		})
		svc := NewService(repo)

		input := validCreateInput()
		input.Items = []LineItem{{Name: "Consulting", Quantity: 2, Price: 5000}}

		got, err := svc.Update(context.Background(), guestOwner, "id-1", input)
		if err != nil {
			t.Fatalf("Update() error = %v", err)
		}
		if got.AmountDue != 10000 {
			t.Errorf("AmountDue = %d, want 10000", got.AmountDue)
		}
		if got.Status != StatusPending {
			t.Errorf("Status = %q, want %q (unchanged)", got.Status, StatusPending)
		}
		if got.Reference != "RT3080" {
			t.Errorf("Reference = %q, want RT3080 (unchanged)", got.Reference)
		}
	})

	t.Run("returns ErrNotFound for a missing invoice", func(t *testing.T) {
		repo := newFakeRepository()
		svc := NewService(repo)

		_, err := svc.Update(context.Background(), guestOwner, "missing", validCreateInput())
		if !errors.Is(err, ErrNotFound) {
			t.Fatalf("Update() error = %v, want ErrNotFound", err)
		}
	})

	t.Run("returns ErrNotFound for another owner's invoice", func(t *testing.T) {
		repo := newFakeRepository()
		repo.seed("id-1", otherGuestOwner, Invoice{Reference: "RT3080", Status: StatusDraft})
		svc := NewService(repo)

		_, err := svc.Update(context.Background(), guestOwner, "id-1", validCreateInput())
		if !errors.Is(err, ErrNotFound) {
			t.Fatalf("Update() error = %v, want ErrNotFound", err)
		}
	})

	t.Run("validates before updating", func(t *testing.T) {
		repo := newFakeRepository()
		repo.seed("id-1", guestOwner, Invoice{Reference: "RT3080", Status: StatusDraft})
		svc := NewService(repo)

		input := validCreateInput()
		input.ClientName = ""

		_, err := svc.Update(context.Background(), guestOwner, "id-1", input)
		var validationErr *ValidationError
		if !errors.As(err, &validationErr) {
			t.Fatalf("Update() error = %v, want *ValidationError", err)
		}
	})
}

func TestServiceDelete(t *testing.T) {
	repo := newFakeRepository()
	repo.seed("id-1", guestOwner, Invoice{})
	svc := NewService(repo)

	if err := svc.Delete(context.Background(), otherGuestOwner, "id-1"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("Delete() by a different owner error = %v, want ErrNotFound", err)
	}

	if err := svc.Delete(context.Background(), guestOwner, "id-1"); err != nil {
		t.Fatalf("Delete() error = %v", err)
	}
	if _, ok := repo.invoices["id-1"]; ok {
		t.Error("expected invoice to be removed")
	}

	if err := svc.Delete(context.Background(), guestOwner, "id-1"); !errors.Is(err, ErrNotFound) {
		t.Errorf("Delete() error = %v, want ErrNotFound", err)
	}
}

func TestServiceMarkAsPaid(t *testing.T) {
	repo := newFakeRepository()
	repo.seed("id-1", guestOwner, Invoice{Status: StatusPending})
	svc := NewService(repo)

	if _, err := svc.MarkAsPaid(context.Background(), otherGuestOwner, "id-1"); !errors.Is(err, ErrNotFound) {
		t.Fatalf("MarkAsPaid() by a different owner error = %v, want ErrNotFound", err)
	}

	got, err := svc.MarkAsPaid(context.Background(), guestOwner, "id-1")
	if err != nil {
		t.Fatalf("MarkAsPaid() error = %v", err)
	}
	if got.Status != StatusPaid {
		t.Errorf("Status = %q, want %q", got.Status, StatusPaid)
	}

	if _, err := svc.MarkAsPaid(context.Background(), guestOwner, "missing"); !errors.Is(err, ErrNotFound) {
		t.Errorf("MarkAsPaid() error = %v, want ErrNotFound", err)
	}
}

func TestServiceSeedExamples(t *testing.T) {
	repo := newFakeRepository()
	svc := NewService(repo)

	if err := svc.SeedExamples(context.Background(), guestOwner); err != nil {
		t.Fatalf("SeedExamples() error = %v", err)
	}

	got, err := svc.List(context.Background(), guestOwner)
	if err != nil {
		t.Fatalf("List() error = %v", err)
	}
	if len(got) != len(exampleInvoices) {
		t.Fatalf("List() = %d invoices, want %d", len(got), len(exampleInvoices))
	}

	statuses := map[Status]bool{}
	refs := map[string]bool{}
	for _, inv := range got {
		statuses[inv.Status] = true
		if refs[inv.Reference] {
			t.Errorf("duplicate reference %q among seeded invoices", inv.Reference)
		}
		refs[inv.Reference] = true
		if inv.AmountDue != inv.Total() {
			t.Errorf("AmountDue = %d, want Total() = %d", inv.AmountDue, inv.Total())
		}
	}
	for _, want := range []Status{StatusPaid, StatusPending, StatusDraft} {
		if !statuses[want] {
			t.Errorf("missing an example invoice with status %q", want)
		}
	}

	// A second owner's seed run must not collide with the first's
	// references, since invoices.reference is unique across every owner.
	if err := svc.SeedExamples(context.Background(), otherGuestOwner); err != nil {
		t.Fatalf("SeedExamples() for a second owner error = %v", err)
	}
	gotOther, err := svc.List(context.Background(), otherGuestOwner)
	if err != nil {
		t.Fatalf("List() for a second owner error = %v", err)
	}
	if len(gotOther) != len(exampleInvoices) {
		t.Fatalf("List() for a second owner = %d invoices, want %d", len(gotOther), len(exampleInvoices))
	}
}

func TestComputePaymentDue(t *testing.T) {
	tests := []struct {
		name         string
		invoiceDate  *string
		paymentTerms *int
		want         *string
	}{
		{"nil invoice date", nil, intPtr(30), nil},
		{"nil payment terms", strPtr("2021-08-21"), nil, nil},
		{"adds terms in days", strPtr("2021-08-21"), intPtr(30), strPtr("2021-09-20")},
		{"crosses a year boundary", strPtr("2021-12-20"), intPtr(14), strPtr("2022-01-03")},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := computePaymentDue(tt.invoiceDate, tt.paymentTerms)
			switch {
			case tt.want == nil && got != nil:
				t.Errorf("computePaymentDue() = %v, want nil", *got)
			case tt.want != nil && (got == nil || *got != *tt.want):
				t.Errorf("computePaymentDue() = %v, want %v", got, *tt.want)
			}
		})
	}
}
