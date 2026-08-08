package invoice

import (
	"context"
	"errors"
	"fmt"
	"math/rand"
	"time"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
)

// maxReferenceAttempts bounds how many times Create retries after a
// generated reference collides with an existing one.
const maxReferenceAttempts = 5

// referenceLetters and referenceDigits are the alphabets used to generate a
// human-readable reference like "RT3080".
const referenceLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
const referenceDigits = "0123456789"

// ValidationError reports that caller-supplied invoice data was invalid.
type ValidationError struct {
	Msg string
}

func (e *ValidationError) Error() string { return e.Msg }

func validationErrorf(format string, args ...any) error {
	return &ValidationError{Msg: fmt.Sprintf(format, args...)}
}

// Service implements invoice business rules on top of a Repository.
type Service struct {
	repo Repository
}

// NewService returns a Service backed by repo.
func NewService(repo Repository) *Service {
	return &Service{repo: repo}
}

// List returns every invoice owned by owner.
func (s *Service) List(ctx context.Context, owner auth.Owner) ([]Invoice, error) {
	return s.repo.List(ctx, owner)
}

// Get returns the invoice with the given id owned by owner, or ErrNotFound.
func (s *Service) Get(ctx context.Context, owner auth.Owner, id string) (Invoice, error) {
	return s.repo.Get(ctx, owner, id)
}

// Create validates input, computes its derived fields (amount due, payment
// due date, a unique reference) and persists it as owned by owner. Status
// must be DRAFT or PENDING; it defaults to DRAFT when empty.
func (s *Service) Create(ctx context.Context, owner auth.Owner, input Invoice) (Invoice, error) {
	if input.Status == "" {
		input.Status = StatusDraft
	}
	if input.Status != StatusDraft && input.Status != StatusPending {
		return Invoice{}, validationErrorf("status must be %s or %s to create an invoice", StatusDraft, StatusPending)
	}
	if err := validateEditableFields(input); err != nil {
		return Invoice{}, err
	}

	input.AmountDue = input.Total()
	input.PaymentDue = computePaymentDue(input.InvoiceDate, input.PaymentTerms)

	var lastErr error
	for attempt := 0; attempt < maxReferenceAttempts; attempt++ {
		input.Reference = generateReference()
		created, err := s.repo.Create(ctx, owner, input)
		if err == nil {
			return created, nil
		}
		if !errors.Is(err, errDuplicateReference) {
			return Invoice{}, fmt.Errorf("create invoice: %w", err)
		}
		lastErr = err
	}
	return Invoice{}, fmt.Errorf("create invoice: exhausted reference attempts: %w", lastErr)
}

// Update overwrites an existing invoice's editable fields, recomputing its
// amount due and payment due date, if it's owned by owner. A status may be
// supplied to change it as part of the same edit; leaving it empty keeps the
// current one.
func (s *Service) Update(ctx context.Context, owner auth.Owner, id string, input Invoice) (Invoice, error) {
	existing, err := s.repo.Get(ctx, owner, id)
	if err != nil {
		return Invoice{}, err
	}
	if err := validateEditableFields(input); err != nil {
		return Invoice{}, err
	}
	if input.Status == "" {
		input.Status = existing.Status
	} else if !input.Status.Valid() {
		return Invoice{}, validationErrorf("status must be one of %s, %s or %s",
			StatusDraft, StatusPending, StatusPaid)
	}

	input.ID = id
	input.Reference = existing.Reference
	input.AmountDue = input.Total()
	input.PaymentDue = computePaymentDue(input.InvoiceDate, input.PaymentTerms)

	return s.repo.Update(ctx, owner, input)
}

// Delete removes an invoice owned by owner.
func (s *Service) Delete(ctx context.Context, owner auth.Owner, id string) error {
	return s.repo.Delete(ctx, owner, id)
}

// SetStatus transitions an owned invoice to status, which must be one of the
// three recognised statuses. Every transition is permitted, so a PAID invoice
// can be reverted to PENDING.
func (s *Service) SetStatus(ctx context.Context, owner auth.Owner, id string, status Status) (Invoice, error) {
	if !status.Valid() {
		return Invoice{}, validationErrorf("status must be one of %s, %s or %s",
			StatusDraft, StatusPending, StatusPaid)
	}
	return s.repo.UpdateStatus(ctx, owner, id, status)
}

// validateEditableFields checks the fields a caller may set when creating or
// updating an invoice (everything except id, reference, status and the
// server-computed amount/due date).
func validateEditableFields(input Invoice) error {
	if input.ClientName == "" {
		return validationErrorf("clientName is required")
	}
	for i, item := range input.Items {
		if item.Name == "" {
			return validationErrorf("item %d: name is required", i)
		}
		if item.Quantity <= 0 {
			return validationErrorf("item %d: quantity must be greater than zero", i)
		}
		if item.Price < 0 {
			return validationErrorf("item %d: price must not be negative", i)
		}
	}
	if input.InvoiceDate != nil {
		if _, err := time.Parse(dateLayout, *input.InvoiceDate); err != nil {
			return validationErrorf("invoiceDate must be an ISO 8601 date (YYYY-MM-DD)")
		}
	}
	if input.PaymentTerms != nil && *input.PaymentTerms < 0 {
		return validationErrorf("paymentTerms must not be negative")
	}
	return nil
}

// computePaymentDue derives the payment due date from the invoice date plus
// payment terms (in days). It returns nil unless both are set.
func computePaymentDue(invoiceDate *string, paymentTerms *int) *string {
	if invoiceDate == nil || paymentTerms == nil {
		return nil
	}
	t, err := time.Parse(dateLayout, *invoiceDate)
	if err != nil {
		return nil
	}
	due := t.AddDate(0, 0, *paymentTerms).Format(dateLayout)
	return &due
}

// generateReference returns a human-readable invoice reference like
// "RT3080": two uppercase letters followed by four digits.
func generateReference() string {
	letters := make([]byte, 2)
	for i := range letters {
		letters[i] = referenceLetters[rand.Intn(len(referenceLetters))]
	}
	digits := make([]byte, 4)
	for i := range digits {
		digits[i] = referenceDigits[rand.Intn(len(referenceDigits))]
	}
	return string(letters) + string(digits)
}
