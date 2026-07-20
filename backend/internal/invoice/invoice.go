// Package invoice contains the invoice domain model and business rules.
package invoice

// Status is the lifecycle state of an invoice.
type Status string

const (
	StatusPaid    Status = "PAID"
	StatusPending Status = "PENDING"
	StatusDraft   Status = "DRAFT"
)

// Valid reports whether s is a recognised invoice status. It mirrors the
// CHECK constraint on invoices.status in the database.
func (s Status) Valid() bool {
	switch s {
	case StatusPaid, StatusPending, StatusDraft:
		return true
	default:
		return false
	}
}

// Address is a postal address for the sender or the client.
type Address struct {
	Street   string `json:"street"`
	City     string `json:"city"`
	PostCode string `json:"postCode"`
	Country  string `json:"country"`
}

// LineItem is a single billable line on an invoice.
// Price is stored in minor units (cents) to avoid floating-point money errors.
type LineItem struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	Price    int64  `json:"price"`
}

// Invoice is the full invoice record. It mirrors the frontend Invoice type in
// frontend/src/features/invoices/types/invoice.ts.
type Invoice struct {
	ID            string     `json:"id"`
	Description   string     `json:"description"`
	Status        Status     `json:"status"`
	InvoiceDate   string     `json:"invoiceDate"`
	PaymentTerms  int        `json:"paymentTerms"`
	PaymentDue    string     `json:"paymentDue"`
	SenderAddress Address    `json:"senderAddress"`
	ClientName    string     `json:"clientName"`
	ClientEmail   string     `json:"clientEmail"`
	ClientAddress Address    `json:"clientAddress"`
	Items         []LineItem `json:"items"`
	AmountDue     int64      `json:"amountDue"`
}
