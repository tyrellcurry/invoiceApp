-- invoice_items rows cascade-delete via their invoices FK (ON DELETE CASCADE).
DELETE FROM invoices WHERE reference IN ('RT3080', 'XM9141', 'RG0314', 'FV2353', 'XA5478');
