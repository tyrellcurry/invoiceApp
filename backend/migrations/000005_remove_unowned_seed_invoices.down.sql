-- Mirrors 000002 + 000003's combined result (RG0314 already has its dates
-- backfilled here, since 000003 stays applied when only this migration rolls back).
INSERT INTO invoices (
    reference, status, description,
    invoice_date, payment_terms, payment_due,
    sender_street, sender_city, sender_postcode, sender_country,
    client_name, client_email, client_street, client_city, client_postcode, client_country,
    amount_due
) VALUES
    ('RT3080', 'PAID', 'Re-branding',
     '2021-07-18', 30, '2021-08-17',
     '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom',
     'Jensen Huang', 'jensenh@mail.com', '106 Kendell Street', 'Sharrington', 'NR24 5WQ', 'United Kingdom',
     180090),
    ('XM9141', 'PENDING', 'Graphic Design',
     '2021-08-21', 30, '2021-09-20',
     '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom',
     'Alex Grim', 'alexgrim@mail.com', '84 Church Way', 'Bradford', 'BD1 9PB', 'United Kingdom',
     55600),
    ('RG0314', 'DRAFT', 'Website Redesign',
     '2021-08-30', 30, '2021-09-29',
     '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom',
     'John Morrison', 'jm@myco.com', '79 Dover Road', 'Westhall', 'IP19 3PF', 'United Kingdom',
     1400233),
    ('FV2353', 'PENDING', 'Logo Concept',
     '2021-09-10', 14, '2021-09-24',
     '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom',
     'Alysa Werner', 'alysa.werner@mail.com', '19 Hillcrest Drive', 'Bristol', 'BS1 4DJ', 'United Kingdom',
     10204),
    ('XA5478', 'PAID', 'Consulting Services',
     '2021-10-01', 7, '2021-10-08',
     '19 Union Terrace', 'London', 'E1 3EZ', 'United Kingdom',
     'Thomas Wayne', 'thomas.wayne@mail.com', '1007 Mountain Drive', 'Gotham', 'GT4 2BW', 'United Kingdom',
     255000);

INSERT INTO invoice_items (invoice_id, sort_order, name, quantity, price)
SELECT id, 1, 'Brand Guidelines', 1, 180090 FROM invoices WHERE reference = 'RT3080'
UNION ALL
SELECT id, 1, 'Banner Design', 1, 15600 FROM invoices WHERE reference = 'XM9141'
UNION ALL
SELECT id, 2, 'Email Design', 2, 20000 FROM invoices WHERE reference = 'XM9141'
UNION ALL
SELECT id, 1, 'Website Redesign', 1, 1400233 FROM invoices WHERE reference = 'RG0314'
UNION ALL
SELECT id, 1, 'Logo Design', 1, 10204 FROM invoices WHERE reference = 'FV2353'
UNION ALL
SELECT id, 1, 'Consulting Hours', 10, 25000 FROM invoices WHERE reference = 'XA5478'
UNION ALL
SELECT id, 2, 'Project Setup', 1, 5000 FROM invoices WHERE reference = 'XA5478';
