# Invoice App

A full-stack invoicing app: create, edit, and track invoices from draft through pending to paid. Built as a personal showcase of two things done properly: a [bulletproof-react](https://github.com/alan2207/bulletproof-react) frontend and a small, idiomatic Go backend, wired together with real authentication and tested end to end.

<p align="center">
  <a href="./frontend/README.md">Frontend README</a> ·
  <a href="./backend/README.md">Backend README</a>
</p>

## What's here

- **Frontend**: React 19, TypeScript, Tailwind 4, react-router. Feature-sliced per bulletproof-react, with a small shared UI kit documented in Storybook. Every user-facing string runs through `use-intl`, so the app is internationalized end to end, not just English hardcoded with a translation function wrapped around it.
- **Backend**: Go, stdlib `net/http` only (no framework), Postgres via `pgx`, package-by-feature (`internal/invoice`, `internal/auth`), embedded SQL migrations.
- **Auth**: Google OAuth sign-in alongside an ephemeral guest mode, both backed by the same session model. A guest account is scoped to its session; a Google account is scoped to the user, so signing in on a new device sees the same invoices.
- **Testing**: Go unit and Postgres-backed integration tests, Vitest unit and snapshot tests on the frontend, and a Playwright suite that drives the real UI against the real API and a real database, not mocks.
- **CI**: GitHub Actions, path-filtered so a frontend-only change doesn't spin up the Go job and vice versa.

Two independent halves in one repo: `backend/` is a Go module, `frontend/` is a plain Vite/npm project. They're joined only by `go.work` (for the Go workspace) and a shared domain shape at the API boundary, no monorepo tooling.

## Local development

**Prerequisites**: Node 24, Go 1.26+, Docker (for Postgres).

```bash
git clone https://github.com/tyrellcurry/invoiceApp.git
cd invoiceApp
```

**1. Start Postgres and the backend**

```bash
cd backend
cp .env.example .env
docker compose up -d db
go run .
```

`go run .` applies migrations on startup and seeds nothing globally: each account gets its own 3 example invoices the first time it's created. See the [backend README](./backend/README.md) for what's in `.env` and why.

**2. Start the frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Guest mode works immediately with no further setup; Google sign-in needs a real OAuth client (see the backend README).

## Testing

```bash
# Backend, from backend/
go test ./...                      # unit, no database needed
go test -tags=integration ./...    # integration, needs db running

# Frontend, from frontend/
npm test                           # unit + snapshot
npm run test:e2e                   # Playwright, starts both servers itself
npm run storybook                  # component catalog
```

Full details, including how each suite is structured, live in the [backend](./backend/README.md) and [frontend](./frontend/README.md) READMEs.
