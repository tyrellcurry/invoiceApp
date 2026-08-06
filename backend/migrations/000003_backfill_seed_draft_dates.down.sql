UPDATE invoices
SET invoice_date = NULL,
    payment_terms = NULL,
    payment_due = NULL
WHERE reference = 'RG0314';
