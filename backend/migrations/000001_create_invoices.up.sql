CREATE TABLE invoices (
    id              TEXT PRIMARY KEY,               
    status          TEXT NOT NULL DEFAULT 'DRAFT'
                        CHECK (status IN ('PAID', 'PENDING', 'DRAFT')),
    description     TEXT NOT NULL DEFAULT '',
    invoice_date    DATE,                          
    payment_terms   INTEGER,
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

    amount_due      NUMERIC(12,2) NOT NULL DEFAULT 0,

    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE invoice_items (
    id          BIGSERIAL PRIMARY KEY,            
    invoice_id  TEXT NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    quantity    INTEGER NOT NULL,
    price       NUMERIC(12,2) NOT NULL
);

CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);
