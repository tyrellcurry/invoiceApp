# Invoice App, frontend

React frontend for the invoice app, structured per [bulletproof-react](https://github.com/alan2207/bulletproof-react).

## Stack

- React 19, TypeScript, Vite, react-router (client-side routing, no SSR)
- Tailwind 4 plus a small hand-rolled component CSS layer
- `use-intl` for i18n: every user-facing string is externalized, not just wrapped
- Redux Toolkit (wired, currently just a placeholder slice)
- Storybook for the shared UI kit, Vitest and Testing Library for tests, Playwright for end-to-end

## Structure

```
src/
  app/          routing layer, app-wide provider composition
  components/
    ui/          shared design system: button, text, icon, flex, grid, ...
    layouts/     app chrome: main menu, app shell
  features/      feature modules (invoices, auth), the bulk of the app
  hooks/         shared hooks
  lib/           preconfigured third-party libraries (i18n, API client)
  stores/        Redux store and typed hooks
  styles/        global stylesheets
```

A feature owns its own `api/`, `components/`, `hooks/`, and `utils/` as needed. Imports flow one way, shared to features to app; features can't import each other, enforced by `eslint.config.mjs`. Presentation components render props and stay free of data fetching or business logic; that lives in `utils/` (pure, unit-tested) and `api/` (fetching, mapping to and from the wire shape).

## i18n

All copy lives in `messages/en.json`, loaded through `use-intl`'s `useTranslations` hook rather than hardcoded in components. `src/lib/i18n/routing.ts` already declares the locale type as a union (`en` and a scaffolded `fr`), so adding a second language is a matter of dropping in `messages/fr.json`, not restructuring components.

## Setup

```bash
npm install
npm run dev
```

Needs the backend running (see the [backend README](../backend/README.md)); `VITE_API_URL` defaults to `http://localhost:8080`.

## Testing

```bash
npm test              # Vitest: unit + snapshot
npm run test:watch    # same, watch mode
npm run test:e2e      # Playwright, starts the frontend and backend itself
npm run storybook     # component catalog at localhost:6006
npm run lint          # eslint, including the feature-boundary rules
```

Playwright drives the real app in a real browser against the real Go API and a real Postgres database, seeded fresh per test via a guest session, not a mocked backend. It needs Postgres running (`docker compose up -d db` in `backend/`); its own `webServer` config starts both the Vite dev server and `go run .` if they aren't already up.

Component tests are co-located (`x.test.tsx`, `x.snapshot.test.tsx`, `x.stories.tsx` next to `x.tsx`); coverage is heaviest on the UI kit and the invoices feature.
