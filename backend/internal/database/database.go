// Package database manages the PostgreSQL connection and schema migrations.
package database

import (
	"database/sql"
	"fmt"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
)

// Connect opens a connection pool and waits for the database to become
// available, retrying briefly to tolerate Postgres still starting up.
func Connect(databaseURL string) (*sql.DB, error) {
	db, err := sql.Open("pgx", databaseURL)
	if err != nil {
		return nil, fmt.Errorf("open database: %w", err)
	}

	var pingErr error
	for range 10 {
		if pingErr = db.Ping(); pingErr == nil {
			return db, nil
		}
		time.Sleep(time.Second)
	}

	db.Close()
	return nil, fmt.Errorf("database not ready: %w", pingErr)
}
