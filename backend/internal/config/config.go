// Package config loads application configuration from environment variables.
package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

// Config holds the application's runtime configuration.
type Config struct {
	DatabaseURL string
	// Port is the TCP port the HTTP server listens on.
	Port string
	// AllowedOrigin is the origin allowed to make cross-origin requests to the
	// API (the frontend dev server).
	AllowedOrigin string
	// GoogleClientID and GoogleClientSecret identify this app to Google's
	// OAuth endpoints. GoogleRedirectURL must be registered as an authorized
	// redirect URI on that OAuth client.
	GoogleClientID     string
	GoogleClientSecret string
	GoogleRedirectURL  string
	// FrontendURL is where the browser is sent, with a session token, once a
	// Google login completes.
	FrontendURL string
}

// Load reads configuration from the environment (and a .env file if present)
// and returns a populated Config.
func Load() (Config, error) {
	_ = godotenv.Load()

	required := []string{
		"POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "POSTGRES_HOST", "POSTGRES_PORT",
		"GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET",
	}
	for _, k := range required {
		if os.Getenv(k) == "" {
			return Config{}, fmt.Errorf("missing required env var: %s", k)
		}
	}

	return Config{
		DatabaseURL: fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"),
			os.Getenv("POSTGRES_HOST"), os.Getenv("POSTGRES_PORT"), os.Getenv("POSTGRES_DB")),
		Port:               getOrDefault("PORT", "8080"),
		AllowedOrigin:      getOrDefault("CORS_ALLOWED_ORIGIN", "http://localhost:5173"),
		GoogleClientID:     os.Getenv("GOOGLE_CLIENT_ID"),
		GoogleClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
		GoogleRedirectURL:  getOrDefault("GOOGLE_REDIRECT_URL", "http://localhost:8080/auth/google/callback"),
		FrontendURL:        getOrDefault("FRONTEND_URL", "http://localhost:5173"),
	}, nil
}

// getOrDefault returns the environment variable named by key, or fallback if
// it is unset or empty.
func getOrDefault(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
