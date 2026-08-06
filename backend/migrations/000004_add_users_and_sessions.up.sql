CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_sub  TEXT NOT NULL UNIQUE,
    email       TEXT NOT NULL,
    name        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sessions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- NULL user_id means a guest session: ephemeral, swept on expiry.
    user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at  TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- Ownership is exclusive: an authenticated invoice has user_id set (and
-- session_id null); a guest invoice has session_id set (and user_id null).
-- Deleting the owning session/user cascades to their invoices.
ALTER TABLE invoices
    ADD COLUMN user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
    ADD COLUMN session_id UUID REFERENCES sessions(id) ON DELETE CASCADE;

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_session_id ON invoices(session_id);
