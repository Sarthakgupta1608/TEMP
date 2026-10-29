#!/bin/sh
set -e

# Run Prisma schema migration or push
echo "==> Preparing database..."
if [ -d "prisma/migrations" ] && [ -n "$(ls -A prisma/migrations 2>/dev/null)" ]; then
  echo "Running prisma migrate deploy..."
  npx prisma migrate deploy
else
  echo "Running prisma db push..."
  npx prisma db push --skip-generate
fi

# Optional database seeding
if [ "$SEED_DB" = "true" ]; then
  echo "==> Seeding database (SEED_DB=true)..."
  if [ -f "dist/prisma/seed.js" ]; then
    node dist/prisma/seed.js
  elif command -v tsx >/dev/null 2>&1; then
    tsx prisma/seed.ts
  else
    npx tsx prisma/seed.ts
  fi
fi

echo "==> Starting backend server..."
exec "$@"

