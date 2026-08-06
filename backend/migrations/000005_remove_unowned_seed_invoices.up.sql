-- Invoices are now private per owner (000004). The seed fixtures (000002)
-- have no owner, so under strict per-owner filtering they're permanently
-- invisible to everyone. Remove them rather than leave dead, unreachable rows.
DELETE FROM invoices WHERE reference IN ('RT3080', 'XM9141', 'RG0314', 'FV2353', 'XA5478');
