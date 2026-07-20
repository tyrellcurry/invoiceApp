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
