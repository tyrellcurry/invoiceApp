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
}

// Load reads configuration from the environment (and a .env file if present)
// and returns a populated Config.
func Load() (Config, error) {
	_ = godotenv.Load()

	for _, k := range []string{"POSTGRES_USER", "POSTGRES_PASSWORD", "POSTGRES_DB", "POSTGRES_HOST", "POSTGRES_PORT"} {
		if os.Getenv(k) == "" {
			return Config{}, fmt.Errorf("missing required env var: %s", k)
		}
	}

	return Config{
		DatabaseURL: fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
			os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"),
			os.Getenv("POSTGRES_HOST"), os.Getenv("POSTGRES_PORT"), os.Getenv("POSTGRES_DB")),
	}, nil
}
