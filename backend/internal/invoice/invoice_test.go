package invoice

import "testing"

func TestStatusValid(t *testing.T) {
	tests := []struct {
		name   string
		status Status
		want   bool
	}{
		{"paid", StatusPaid, true},
		{"pending", StatusPending, true},
		{"draft", StatusDraft, true},
		{"lowercase is invalid", Status("draft"), false},
		{"unknown value", Status("CANCELLED"), false},
		{"empty", Status(""), false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := tt.status.Valid(); got != tt.want {
				t.Errorf("Status(%q).Valid() = %v, want %v", tt.status, got, tt.want)
			}
		})
	}
}

func TestInvoiceTotal(t *testing.T) {
	tests := []struct {
		name  string
		items []LineItem
		want  int64
	}{
		{"no items", nil, 0},
		{"single item", []LineItem{{Quantity: 1, Price: 180090}}, 180090},
		{"quantity multiplies the unit price", []LineItem{{Quantity: 3, Price: 1250}}, 3750},
		{
			"sums every line",
			[]LineItem{{Quantity: 2, Price: 20000}, {Quantity: 1, Price: 5599}},
			45599,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := (Invoice{Items: tt.items}).Total(); got != tt.want {
				t.Errorf("Total() = %d, want %d", got, tt.want)
			}
		})
	}
}
