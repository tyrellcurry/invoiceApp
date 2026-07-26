-- Keeps updated_at honest: DEFAULT now() only fires on INSERT.
CREATE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE invoices (
    -- Surrogate key. The human-readable "RT3080" the UI shows is `reference`,
    -- which is only unique per owner once accounts exist.
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference       TEXT NOT NULL UNIQUE,

    status          TEXT NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('PAID', 'PENDING', 'DRAFT')),
    description     TEXT NOT NULL DEFAULT '',

    -- Nullable: a DRAFT may not have been dated or termed yet.
    invoice_date    DATE,
    payment_terms   INTEGER CHECK (payment_terms IS NULL OR payment_terms >= 0),
    -- Derived from invoice_date + payment_terms, stored so an issued invoice
    -- keeps the due date it was sent with. The backend writes it.
    payment_due     DATE,

    sender_street   TEXT NOT NULL DEFAULT '',
    sender_city     TEXT NOT NULL DEFAULT '',
    sender_postcode TEXT NOT NULL DEFAULT '',
    sender_country  TEXT NOT NULL DEFAULT '',

    client_name     TEXT NOT NULL DEFAULT '',
    client_email    TEXT NOT NULL DEFAULT '',
    client_street   TEXT NOT NULL DEFAULT '',
    client_city     TEXT NOT NULL DEFAULT '',
    client_postcode TEXT NOT NULL DEFAULT '',
    client_country  TEXT NOT NULL DEFAULT '',

    -- Minor units (cents). Sum of the line items, stored so an issued invoice
    -- keeps the total it was sent with. The backend writes it.
    amount_due      BIGINT NOT NULL DEFAULT 0 CHECK (amount_due >= 0),

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER invoices_set_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE invoice_items (
    id          BIGSERIAL PRIMARY KEY,
    invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    -- Line order is user-meaningful; don't rely on incidental id ordering.
    sort_order  INTEGER NOT NULL,
    name        TEXT NOT NULL,
    quantity    INTEGER NOT NULL CHECK (quantity > 0),
    -- Unit price in minor units (cents).
    price       BIGINT NOT NULL CHECK (price >= 0),

    UNIQUE (invoice_id, sort_order)
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
