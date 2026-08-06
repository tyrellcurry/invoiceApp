# Invoice App, backend

Go API for the invoice app. Plain `net/http` (no framework), Postgres via `pgx`, package-by-feature layout.

## Stack

- Go 1.26, stdlib `database/sql` + `pgx/v5`
- `golang-migrate` with SQL migrations embedded via `go:embed`
- `godotenv` for local `.env` loading
- No web framework, no ORM, no testify: plain stdlib and table-driven tests

## Structure

```
backend/
  main.go            composition root: wires dependencies, starts the server
  compose.yaml        local Postgres
  migrations/         embedded SQL migrations
  internal/
    config/            env -> validated Config struct
    database/          connection pool + migration runner
    auth/               Google OAuth, guest sessions, ownership scoping
    invoice/            invoice domain, persistence, HTTP handlers
```

Each feature package under `internal/` owns its full vertical slice: domain types, SQL, business rules, and HTTP handlers. Dependencies flow one way, handler to service to repository, and services depend on repository interfaces they define themselves, not concrete Postgres types, so business logic is testable without a database.

## Setup

```bash
cp .env.example .env
docker compose up -d db
go run .
```

`go run .` runs pending migrations on startup, then listens on `:8080`. `.env` needs Postgres credentials and a Google OAuth client:

| Var | Purpose |
| --- | --- |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` / `POSTGRES_HOST` / `POSTGRES_PORT` | Database connection |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client, from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) |
| `GOOGLE_REDIRECT_URL` | Must match the OAuth client's authorized redirect URI |
| `PORT`, `CORS_ALLOWED_ORIGIN`, `FRONTEND_URL` | Optional, default to the local frontend dev server |

Guest sign-in works without any Google credentials configured; only the "Continue with Google" path needs a real client.

## API

| Method | Path | |
| --- | --- | --- |
| `GET` | `/auth/google/login` | Redirects to Google's consent screen |
| `GET` | `/auth/google/callback` | Exchanges the auth code, creates a session |
| `POST` | `/auth/guest` | Creates an ephemeral guest session |
| `POST` | `/auth/logout` | Revokes the current session |
| `GET` | `/auth/me` | Resolves the bearer token to a session |
| `GET`/`POST` | `/invoices` | List / create |
| `GET`/`PUT`/`DELETE` | `/invoices/{id}` | Get / update / delete |
| `POST` | `/invoices/{id}/status` | Transition status (draft, pending, paid, any direction) |

Every route except `/auth/*` and `/healthz` requires a bearer token, resolved to an owner (a user or a guest session) that scopes every query.

## Testing

```bash
go test ./...                    # unit tests, fake repositories, no database
go test -tags=integration ./...  # integration tests, needs `docker compose up -d db`
```

Integration tests live alongside their package as `*_integration_test.go` behind a build tag, so a plain `go test ./...` never touches Postgres. `go vet` runs automatically as part of `go test`.

## Migrations

New schema changes get a new numbered pair (`NNNNNN_name.up.sql` / `.down.sql`). Migrations are forward-only once applied to any shared environment: editing one that has already run is only safe against a throwaway local volume (`docker compose down -v`).
