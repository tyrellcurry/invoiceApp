package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/tyrellcurry/invoiceApp/internal/auth"
	"github.com/tyrellcurry/invoiceApp/internal/config"
	"github.com/tyrellcurry/invoiceApp/internal/database"
	"github.com/tyrellcurry/invoiceApp/internal/invoice"
)

// sweepInterval is how often expired sessions (and, via ON DELETE CASCADE,
// their guest invoices) are cleaned up.
const sweepInterval = 5 * time.Minute

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

	invoiceRepo := invoice.NewPostgresRepository(db)
	invoiceSvc := invoice.NewService(invoiceRepo)
	invoiceHandler := invoice.NewHandler(invoiceSvc)

	authRepo := auth.NewPostgresRepository(db)
	authSvc := auth.NewService(authRepo, invoiceSvc, cfg.GoogleClientID, cfg.GoogleClientSecret, cfg.GoogleRedirectURL)
	authHandler := auth.NewHandler(authSvc, cfg.FrontendURL)

	mux := http.NewServeMux()
	authHandler.RegisterRoutes(mux)
	invoiceHandler.RegisterRoutes(mux)
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	go sweepExpiredSessions(authSvc)

	addr := ":" + cfg.Port
	log.Printf("listening on %s", addr)
	handler := withCORS(cfg.AllowedOrigin, auth.RequireSession(authSvc)(mux))
	log.Fatal(http.ListenAndServe(addr, handler))
}

// sweepExpiredSessions periodically deletes expired sessions so guest data
// actually gets cleaned up even if nobody makes another request.
func sweepExpiredSessions(svc *auth.Service) {
	ticker := time.NewTicker(sweepInterval)
	defer ticker.Stop()
	for range ticker.C {
		if n, err := svc.Sweep(context.Background()); err != nil {
			log.Printf("session sweep failed: %v", err)
		} else if n > 0 {
			log.Printf("swept %d expired session(s)", n)
		}
	}
}

// withCORS allows the frontend dev server to call the API from a different
// origin. No web framework is installed, so this is plain net/http.
func withCORS(allowedOrigin string, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
