ALTER TABLE invoices
    DROP COLUMN session_id,
    DROP COLUMN user_id;

DROP TABLE sessions;
DROP TABLE users;
