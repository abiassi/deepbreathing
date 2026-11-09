#!/usr/bin/env bash
# Local Mac dev database. `vercel env pull --environment=development` points at the
# production Neon host, so local dev uses a local Postgres instead.
set -euo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO"

pg_isready -q -h 127.0.0.1 -p 5432 || { echo "Postgres is not running on 127.0.0.1:5432. Try: brew services start postgresql@16" >&2; exit 1; }
DB_URL="postgres://$(whoami)@127.0.0.1:5432/deepbreathing"
psql -h 127.0.0.1 -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='deepbreathing'" | grep -q 1 || createdb -h 127.0.0.1 deepbreathing

if [ ! -f .env.local ]; then
  cat > .env.local <<ENV
DATABASE_URL=$DB_URL
BETTER_AUTH_SECRET=$(openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_HOLIDAY_BANNER=true
ENV
  echo "wrote .env.local"
elif grep -qE '^DATABASE_URL=.*neon\.tech' .env.local; then
  echo ".env.local points DATABASE_URL at Neon. Remove it and rerun to use the local database." >&2
  exit 1
fi

set -a; . ./.env.local; set +a
pnpm dlx @better-auth/cli@latest migrate --yes --config src/lib/auth.ts
for f in src/lib/db/migrations/*.sql; do
  PGOPTIONS='--client-min-messages=warning' psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -q -f "$f" >/dev/null
done
echo "local database ready: $DATABASE_URL"
