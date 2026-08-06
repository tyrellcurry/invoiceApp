-- Google returns a `picture` URL in its ID token claims. Store it so the nav
-- can show the user's own avatar instead of the bundled default. Nullable in
-- effect (defaults to '') because the claim is optional: a Google account
-- without a photo simply omits it.
ALTER TABLE users ADD COLUMN picture TEXT NOT NULL DEFAULT '';
