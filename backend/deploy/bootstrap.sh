#!/usr/bin/env bash
# One-time setup for the invoiceApp backend on the Pi. Run once, on the Pi,
# from a checkout of this repo:
#
#   cd backend/deploy && ./bootstrap.sh
#
# Idempotent: safe to re-run (e.g. after editing .env) except where noted.
set -euo pipefail

APP_DIR=/opt/invoiceapp
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "==> Creating $APP_DIR"
sudo mkdir -p "$APP_DIR"
sudo chown "$(id -u):$(id -g)" "$APP_DIR"

if [ ! -f "$APP_DIR/.env" ]; then
  cp "$SCRIPT_DIR/.env.example" "$APP_DIR/.env"
  echo
  echo "==> Wrote $APP_DIR/.env from the template. Fill in the blank values"
  echo "    (POSTGRES_PASSWORD, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and"
  echo "    the CORS_ALLOWED_ORIGIN / FRONTEND_URL once you have a Vercel"
  echo "    URL), then re-run this script."
  exit 0
fi

echo "==> Starting Postgres"
cp "$SCRIPT_DIR/docker-compose.yml" "$APP_DIR/docker-compose.yml"
# docker compose reads .env from the same directory as the compose file by
# default, which is also where the systemd unit's EnvironmentFile points, a
# single .env is the only copy of these values that exists on disk.
(cd "$APP_DIR" && docker compose up -d db)

echo "==> Waiting for Postgres to be healthy"
# `docker compose ps --format '{{.Health}}'` isn't reliable across compose
# versions, it can silently return empty instead of erroring, which made
# this loop spin the full timeout with no visible output and no clear
# failure. `docker inspect` against the container's own ID is the direct,
# well-documented way to read healthcheck state.
container_id="$(cd "$APP_DIR" && docker compose ps -q db)"
healthy=false
for _ in $(seq 1 30); do
  status="$(docker inspect --format='{{.State.Health.Status}}' "$container_id" 2>/dev/null || echo "unknown")"
  if [ "$status" = "healthy" ]; then
    healthy=true
    break
  fi
  printf '.'
  sleep 1
done
echo
if [ "$healthy" != true ]; then
  echo "==> Postgres did not report healthy within 30s (last status: $status)."
  echo "    Check what's wrong with:"
  echo "      docker compose -f $APP_DIR/docker-compose.yml logs db"
  exit 1
fi

echo "==> Installing the systemd unit (enabled, not started yet)"
sudo cp "$SCRIPT_DIR/invoice-api.service" /etc/systemd/system/invoice-api.service
sudo systemctl daemon-reload
sudo systemctl enable invoice-api
# Not started here: there's no /opt/invoiceapp/invoice-api binary yet, that
# only exists after the first CI deploy uploads it and restarts the unit.

cat <<'EOF'

==> Done. What's left, outside this script:

  1. Add the block in Caddyfile.snippet to your Caddyfile, then:
       sudo systemctl reload caddy

  2. Add this repo's deploy public key to this user's authorized_keys
     (you were given the exact key alongside this script).

  3. Set the GitHub Actions secrets on the invoiceApp repo:
       SSH_USER, PI_TAILSCALE_IP, TS_OAUTH_CLIENT_ID, TS_OAUTH_SECRET

  4. Push to `develop`. The deploy workflow builds the binary, uploads it,
     and starts the service for the first time.

  5. Once Vercel gives you a URL, update CORS_ALLOWED_ORIGIN and
     FRONTEND_URL in /opt/invoiceapp/.env, then:
       sudo systemctl restart invoice-api
EOF
