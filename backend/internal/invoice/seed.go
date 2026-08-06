package invoice

import (
	"context"
	"errors"
	"fmt"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
)

// exampleSenderAddress is shared by every example invoice below, matching
// the original fixture data.
var exampleSenderAddress = Address{
	Street: "19 Union Terrace", City: "London", PostCode: "E1 3EZ", Country: "United Kingdom",
}

// exampleInvoices is the canonical example dataset used to pre-populate a
// newly created owner's account (a brand-new guest session, or a user's
// first-ever Google sign-in) so it isn't empty at first look: one invoice of
// each status, mirroring the original fixture data from migration
// 000002_seed_invoices.up.sql (since trimmed there from five to three).
// Migrations are forward-only once applied, so this is the dataset's
// canonical home going forward rather than the SQL file.
//
// Reference and PaymentDue are left unset here: SeedExamples generates a
// fresh reference per invoice per owner (invoices.reference is unique across
// every owner, so the template can't reuse a fixed code) and derives
// PaymentDue the same way Create does.
var exampleInvoices = []Invoice{
	{
		Status:        StatusPaid,
		Description:   "Re-branding",
		InvoiceDate:   ptr("2021-07-18"),
		PaymentTerms:  ptr(30),
		SenderAddress: exampleSenderAddress,
		ClientName:    "Jensen Huang",
		ClientEmail:   "jensenh@mail.com",
		ClientAddress: Address{
			Street: "106 Kendell Street", City: "Sharrington", PostCode: "NR24 5WQ", Country: "United Kingdom",
		},
		Items: []LineItem{
			{Name: "Brand Guidelines", Quantity: 1, Price: 180090},
		},
	},
	{
		Status:        StatusPending,
		Description:   "Graphic Design",
		InvoiceDate:   ptr("2021-08-21"),
		PaymentTerms:  ptr(30),
		SenderAddress: exampleSenderAddress,
		ClientName:    "Alex Grim",
		ClientEmail:   "alexgrim@mail.com",
		ClientAddress: Address{
			Street: "84 Church Way", City: "Bradford", PostCode: "BD1 9PB", Country: "United Kingdom",
		},
		Items: []LineItem{
			{Name: "Banner Design", Quantity: 1, Price: 15600},
			{Name: "Email Design", Quantity: 2, Price: 20000},
		},
	},
	{
		Status:        StatusDraft,
		Description:   "Website Redesign",
		InvoiceDate:   ptr("2021-08-30"),
		PaymentTerms:  ptr(30),
		SenderAddress: exampleSenderAddress,
		ClientName:    "John Morrison",
		ClientEmail:   "jm@myco.com",
		ClientAddress: Address{
			Street: "79 Dover Road", City: "Westhall", PostCode: "IP19 3PF", Country: "United Kingdom",
		},
		Items: []LineItem{
			{Name: "Website Redesign", Quantity: 1, Price: 1400233},
		},
	},
}

// SeedExamples creates the canonical example invoices for a newly created
// owner, so a fresh account isn't empty. Each invoice gets its own freshly
// generated reference (retried on collision, like Create), and bypasses
// Create's status restriction (DRAFT/PENDING only) since the seed data
// legitimately includes a PAID example.
func (s *Service) SeedExamples(ctx context.Context, owner auth.Owner) error {
	for _, tmpl := range exampleInvoices {
		inv := tmpl
		inv.Items = append([]LineItem(nil), tmpl.Items...)
		inv.AmountDue = inv.Total()
		inv.PaymentDue = computePaymentDue(inv.InvoiceDate, inv.PaymentTerms)

		created := false
		var lastErr error
		for attempt := 0; attempt < maxReferenceAttempts; attempt++ {
			inv.Reference = generateReference()
			_, err := s.repo.Create(ctx, owner, inv)
			if err == nil {
				created = true
				break
			}
			if !errors.Is(err, errDuplicateReference) {
				return fmt.Errorf("seed example invoices: %w", err)
			}
			lastErr = err
		}
		if !created {
			return fmt.Errorf("seed example invoices: exhausted reference attempts: %w", lastErr)
		}
	}
	return nil
}

func ptr[T any](v T) *T { return &v }
