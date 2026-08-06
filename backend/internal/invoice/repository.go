package invoice

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgconn"
)

// ErrNotFound is returned when an invoice does not exist.
var ErrNotFound = errors.New("invoice not found")

// errDuplicateReference is returned by Create when the generated reference
// collides with an existing one. The service retries with a new reference.
var errDuplicateReference = errors.New("invoice reference already exists")

const dateLayout = "2006-01-02"

// Repository persists invoices. The service package depends on this
// interface; PostgresRepository is its only implementation.
type Repository interface {
	List(ctx context.Context) ([]Invoice, error)
	Get(ctx context.Context, id string) (Invoice, error)
	Create(ctx context.Context, inv Invoice) (Invoice, error)
	Update(ctx context.Context, inv Invoice) (Invoice, error)
	Delete(ctx context.Context, id string) error
	UpdateStatus(ctx context.Context, id string, status Status) (Invoice, error)
}

// PostgresRepository is the Postgres-backed Repository implementation.
type PostgresRepository struct {
	db *sql.DB
}

// NewPostgresRepository returns a Repository backed by db.
func NewPostgresRepository(db *sql.DB) *PostgresRepository {
	return &PostgresRepository{db: db}
}

const invoiceColumns = `
	id, reference, status, description,
	invoice_date, payment_terms, payment_due,
	sender_street, sender_city, sender_postcode, sender_country,
	client_name, client_email, client_street, client_city, client_postcode, client_country,
	amount_due`

// List returns every invoice, most recently created first, with its items.
func (r *PostgresRepository) List(ctx context.Context) ([]Invoice, error) {
	rows, err := r.db.QueryContext(ctx, `SELECT `+invoiceColumns+` FROM invoices ORDER BY created_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("list invoices: %w", err)
	}
	defer rows.Close()

	var invoices []Invoice
	for rows.Next() {
		inv, err := scanInvoice(rows)
		if err != nil {
			return nil, fmt.Errorf("list invoices: %w", err)
		}
		invoices = append(invoices, inv)
	}
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("list invoices: %w", err)
	}

	if err := attachItems(ctx, r.db, invoices); err != nil {
		return nil, fmt.Errorf("list invoices: %w", err)
	}
	return invoices, nil
}

// Get returns the invoice with the given id, or ErrNotFound.
func (r *PostgresRepository) Get(ctx context.Context, id string) (Invoice, error) {
	row := r.db.QueryRowContext(ctx, `SELECT `+invoiceColumns+` FROM invoices WHERE id = $1`, id)
	inv, err := scanInvoice(row)
	if errors.Is(err, sql.ErrNoRows) {
		return Invoice{}, ErrNotFound
	}
	if err != nil {
		return Invoice{}, fmt.Errorf("get invoice %s: %w", id, err)
	}

	items, err := itemsFor(ctx, r.db, inv.ID)
	if err != nil {
		return Invoice{}, fmt.Errorf("get invoice %s: %w", id, err)
	}
	inv.Items = items
	return inv, nil
}

// Create inserts a new invoice and its items in a single transaction. On a
// unique reference collision it returns errDuplicateReference for the caller
// to retry with a new reference.
func (r *PostgresRepository) Create(ctx context.Context, inv Invoice) (Invoice, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return Invoice{}, fmt.Errorf("create invoice: %w", err)
	}
	defer tx.Rollback()

	row := tx.QueryRowContext(ctx, `
		INSERT INTO invoices (
			reference, status, description,
			invoice_date, payment_terms, payment_due,
			sender_street, sender_city, sender_postcode, sender_country,
			client_name, client_email, client_street, client_city, client_postcode, client_country,
			amount_due
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
		RETURNING id`,
		inv.Reference, inv.Status, inv.Description,
		nullableDate(inv.InvoiceDate), nullableInt(inv.PaymentTerms), nullableDate(inv.PaymentDue),
		inv.SenderAddress.Street, inv.SenderAddress.City, inv.SenderAddress.PostCode, inv.SenderAddress.Country,
		inv.ClientName, inv.ClientEmail, inv.ClientAddress.Street, inv.ClientAddress.City,
		inv.ClientAddress.PostCode, inv.ClientAddress.Country,
		inv.AmountDue,
	)

	var id string
	if err := row.Scan(&id); err != nil {
		var pgErr *pgconn.PgError
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return Invoice{}, errDuplicateReference
		}
		return Invoice{}, fmt.Errorf("create invoice: %w", err)
	}
	inv.ID = id

	if err := insertItems(ctx, tx, inv.ID, inv.Items); err != nil {
		return Invoice{}, fmt.Errorf("create invoice: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return Invoice{}, fmt.Errorf("create invoice: %w", err)
	}
	return inv, nil
}

// Update overwrites an invoice's editable fields and replaces its items.
// Reference, status and id are not touched here.
func (r *PostgresRepository) Update(ctx context.Context, inv Invoice) (Invoice, error) {
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	}
	defer tx.Rollback()

	res, err := tx.ExecContext(ctx, `
		UPDATE invoices SET
			description = $1,
			invoice_date = $2, payment_terms = $3, payment_due = $4,
			sender_street = $5, sender_city = $6, sender_postcode = $7, sender_country = $8,
			client_name = $9, client_email = $10, client_street = $11, client_city = $12,
			client_postcode = $13, client_country = $14,
			amount_due = $15
		WHERE id = $16`,
		inv.Description,
		nullableDate(inv.InvoiceDate), nullableInt(inv.PaymentTerms), nullableDate(inv.PaymentDue),
		inv.SenderAddress.Street, inv.SenderAddress.City, inv.SenderAddress.PostCode, inv.SenderAddress.Country,
		inv.ClientName, inv.ClientEmail, inv.ClientAddress.Street, inv.ClientAddress.City,
		inv.ClientAddress.PostCode, inv.ClientAddress.Country,
		inv.AmountDue, inv.ID,
	)
	if err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	}
	if n, err := res.RowsAffected(); err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	} else if n == 0 {
		return Invoice{}, ErrNotFound
	}

	if _, err := tx.ExecContext(ctx, `DELETE FROM invoice_items WHERE invoice_id = $1`, inv.ID); err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	}
	if err := insertItems(ctx, tx, inv.ID, inv.Items); err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	}

	if err := tx.Commit(); err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s: %w", inv.ID, err)
	}
	return r.Get(ctx, inv.ID)
}

// Delete removes an invoice (and its items, via ON DELETE CASCADE).
func (r *PostgresRepository) Delete(ctx context.Context, id string) error {
	res, err := r.db.ExecContext(ctx, `DELETE FROM invoices WHERE id = $1`, id)
	if err != nil {
		return fmt.Errorf("delete invoice %s: %w", id, err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("delete invoice %s: %w", id, err)
	}
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

// UpdateStatus sets an invoice's status and returns the updated invoice.
func (r *PostgresRepository) UpdateStatus(ctx context.Context, id string, status Status) (Invoice, error) {
	res, err := r.db.ExecContext(ctx, `UPDATE invoices SET status = $1 WHERE id = $2`, status, id)
	if err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s status: %w", id, err)
	}
	n, err := res.RowsAffected()
	if err != nil {
		return Invoice{}, fmt.Errorf("update invoice %s status: %w", id, err)
	}
	if n == 0 {
		return Invoice{}, ErrNotFound
	}
	return r.Get(ctx, id)
}

// scanner is satisfied by both *sql.Row and *sql.Rows.
type scanner interface {
	Scan(dest ...any) error
}

func scanInvoice(s scanner) (Invoice, error) {
	var inv Invoice
	var invoiceDate, paymentDue sql.NullTime
	var paymentTerms sql.NullInt32

	err := s.Scan(
		&inv.ID, &inv.Reference, &inv.Status, &inv.Description,
		&invoiceDate, &paymentTerms, &paymentDue,
		&inv.SenderAddress.Street, &inv.SenderAddress.City, &inv.SenderAddress.PostCode, &inv.SenderAddress.Country,
		&inv.ClientName, &inv.ClientEmail, &inv.ClientAddress.Street, &inv.ClientAddress.City,
		&inv.ClientAddress.PostCode, &inv.ClientAddress.Country,
		&inv.AmountDue,
	)
	if err != nil {
		return Invoice{}, err
	}

	inv.InvoiceDate = fromNullDate(invoiceDate)
	inv.PaymentDue = fromNullDate(paymentDue)
	if paymentTerms.Valid {
		v := int(paymentTerms.Int32)
		inv.PaymentTerms = &v
	}
	inv.Items = []LineItem{}
	return inv, nil
}

func itemsFor(ctx context.Context, db *sql.DB, invoiceID string) ([]LineItem, error) {
	rows, err := db.QueryContext(ctx,
		`SELECT name, quantity, price FROM invoice_items WHERE invoice_id = $1 ORDER BY sort_order`, invoiceID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []LineItem{}
	for rows.Next() {
		var item LineItem
		if err := rows.Scan(&item.Name, &item.Quantity, &item.Price); err != nil {
			return nil, err
		}
		items = append(items, item)
	}
	return items, rows.Err()
}

// attachItems fetches items for every invoice in a single query and assigns
// them back by invoice id, avoiding an N+1 query pattern for List.
func attachItems(ctx context.Context, db *sql.DB, invoices []Invoice) error {
	if len(invoices) == 0 {
		return nil
	}

	ids := make([]string, len(invoices))
	byID := make(map[string]int, len(invoices))
	for i, inv := range invoices {
		ids[i] = inv.ID
		byID[inv.ID] = i
	}

	rows, err := db.QueryContext(ctx,
		`SELECT invoice_id, name, quantity, price FROM invoice_items WHERE invoice_id = ANY($1) ORDER BY invoice_id, sort_order`,
		ids)
	if err != nil {
		return err
	}
	defer rows.Close()

	for rows.Next() {
		var invoiceID string
		var item LineItem
		if err := rows.Scan(&invoiceID, &item.Name, &item.Quantity, &item.Price); err != nil {
			return err
		}
		idx := byID[invoiceID]
		invoices[idx].Items = append(invoices[idx].Items, item)
	}
	return rows.Err()
}

func insertItems(ctx context.Context, tx *sql.Tx, invoiceID string, items []LineItem) error {
	for i, item := range items {
		_, err := tx.ExecContext(ctx,
			`INSERT INTO invoice_items (invoice_id, sort_order, name, quantity, price) VALUES ($1, $2, $3, $4, $5)`,
			invoiceID, i+1, item.Name, item.Quantity, item.Price,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func nullableDate(d *string) sql.NullTime {
	if d == nil {
		return sql.NullTime{}
	}
	t, err := time.Parse(dateLayout, *d)
	if err != nil {
		return sql.NullTime{}
	}
	return sql.NullTime{Time: t, Valid: true}
}

func fromNullDate(t sql.NullTime) *string {
	if !t.Valid {
		return nil
	}
	s := t.Time.Format(dateLayout)
	return &s
}

func nullableInt(i *int) sql.NullInt32 {
	if i == nil {
		return sql.NullInt32{}
	}
	return sql.NullInt32{Int32: int32(*i), Valid: true}
}
