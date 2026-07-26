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
type LineItem struct {
	Name     string `json:"name"`
	Quantity int    `json:"quantity"`
	// Price is the unit price in minor units (cents), matching
	// invoice_items.price. The frontend converts to major units for display.
	Price int64 `json:"price"`
}

// Invoice is the full invoice record.
//
// Money is in minor units (cents) throughout, as it is in the database. The
// frontend works in major units and converts at its API boundary.
//
// Dates are ISO 8601 calendar dates ("2006-01-02"). InvoiceDate, PaymentTerms
// and PaymentDue are pointers because a DRAFT may not have them set yet.
type Invoice struct {
	ID string `json:"id"`
	// Reference is the human-readable invoice number shown in the UI (e.g.
	// "RT3080"). ID is the surrogate key and is what the API routes on.
	Reference     string     `json:"reference"`
	Description   string     `json:"description"`
	Status        Status     `json:"status"`
	InvoiceDate   *string    `json:"invoiceDate"`
	PaymentTerms  *int       `json:"paymentTerms"`
	PaymentDue    *string    `json:"paymentDue"`
	SenderAddress Address    `json:"senderAddress"`
	ClientName    string     `json:"clientName"`
	ClientEmail   string     `json:"clientEmail"`
	ClientAddress Address    `json:"clientAddress"`
	Items         []LineItem `json:"items"`
	// AmountDue is the sum of the line items in minor units. It is stored
	// rather than recomputed on read so an issued invoice keeps the total it
	// was sent with.
	AmountDue int64 `json:"amountDue"`
}

// Total returns the sum of the line items in minor units. Callers use it to
// populate AmountDue when creating or amending an invoice.
func (i Invoice) Total() int64 {
	var total int64
	for _, item := range i.Items {
		total += int64(item.Quantity) * item.Price
	}
	return total
}
