// Package migrations manages the DB setup via SQL.
package migrations

import "embed"

//go:embed *.sql
var FS embed.FS
