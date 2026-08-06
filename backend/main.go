package main

import (
	"log"
	"net/http"

	"github.com/tyrellcurry/invoiceApp/internal/config"
	"github.com/tyrellcurry/invoiceApp/internal/database"
	"github.com/tyrellcurry/invoiceApp/internal/invoice"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}

	db, err := database.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := database.Migrate(db); err != nil {
		log.Fatal(err)
	}

	repo := invoice.NewPostgresRepository(db)
	svc := invoice.NewService(repo)
	handler := invoice.NewHandler(svc)

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	addr := ":" + cfg.Port
	log.Printf("listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, withCORS(cfg.AllowedOrigin, mux)))
}

// withCORS allows the frontend dev server to call the API from a different
// origin. No web framework is installed, so this is plain net/http.
func withCORS(allowedOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
