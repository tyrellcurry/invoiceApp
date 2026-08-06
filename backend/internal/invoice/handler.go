package invoice

import (
	"encoding/json"
	"errors"
	"net/http"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
)

// Handler exposes the invoice service over HTTP.
type Handler struct {
	svc *Service
}

// NewHandler returns a Handler backed by svc.
func NewHandler(svc *Service) *Handler {
	return &Handler{svc: svc}
}

// RegisterRoutes registers the invoice endpoints on mux.
func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /invoices", h.list)
	mux.HandleFunc("POST /invoices", h.create)
	mux.HandleFunc("GET /invoices/{id}", h.get)
	mux.HandleFunc("PUT /invoices/{id}", h.update)
	mux.HandleFunc("DELETE /invoices/{id}", h.delete)
	mux.HandleFunc("POST /invoices/{id}/mark-as-paid", h.markAsPaid)
}

func (h *Handler) list(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	invoices, err := h.svc.List(r.Context(), owner)
	if err != nil {
		writeError(w, err)
		return
	}
	if invoices == nil {
		invoices = []Invoice{}
	}
	writeJSON(w, http.StatusOK, invoices)
}

func (h *Handler) get(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	inv, err := h.svc.Get(r.Context(), owner, r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, inv)
}

func (h *Handler) create(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	var input Invoice
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, errorBody{Error: "invalid request body"})
		return
	}

	created, err := h.svc.Create(r.Context(), owner, input)
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, created)
}

func (h *Handler) update(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	var input Invoice
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		writeJSON(w, http.StatusBadRequest, errorBody{Error: "invalid request body"})
		return
	}

	updated, err := h.svc.Update(r.Context(), owner, r.PathValue("id"), input)
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, updated)
}

func (h *Handler) delete(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	if err := h.svc.Delete(r.Context(), owner, r.PathValue("id")); err != nil {
		writeError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) markAsPaid(w http.ResponseWriter, r *http.Request) {
	owner := auth.OwnerFromContext(r.Context())
	updated, err := h.svc.MarkAsPaid(r.Context(), owner, r.PathValue("id"))
	if err != nil {
		writeError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, updated)
}

type errorBody struct {
	Error string `json:"error"`
}

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(body)
}

func writeError(w http.ResponseWriter, err error) {
	var validationErr *ValidationError
	switch {
	case errors.Is(err, ErrNotFound):
		writeJSON(w, http.StatusNotFound, errorBody{Error: err.Error()})
	case errors.As(err, &validationErr):
		writeJSON(w, http.StatusBadRequest, errorBody{Error: err.Error()})
	default:
		writeJSON(w, http.StatusInternalServerError, errorBody{Error: "internal server error"})
	}
}
