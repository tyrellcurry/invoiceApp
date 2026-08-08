-- The RG0314 seed fixture (000002) left invoice_date/payment_terms/payment_due
-- NULL to demonstrate a DRAFT with no dates yet. In practice that made the
-- seeded dataset the only row with gaps, which is awkward for manually
-- exercising the UI and for E2E tests that expect every seeded invoice to
-- render a full set of fields. Backfill them; the invoice stays a DRAFT.
UPDATE invoices
SET invoice_date = '2021-08-30',
    payment_terms = 30,
    payment_due = '2021-09-29'
WHERE reference = 'RG0314';
