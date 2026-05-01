#!/bin/bash

echo "Booting..."

# Stop any container already bound to port 5432
CONFLICT=$(docker ps --filter "publish=5432" -q)
if [ -n "$CONFLICT" ]; then
  echo "Stopping conflicting container(s) on port 5432..."
  docker stop $CONFLICT
fi

echo "Starting PostgreSQL..."
docker compose up -d

sleep 3

echo "Syncing database schema..."
npx drizzle-kit push

echo "Seeding database..."
npx tsx scripts/seed.ts

echo "Starting next.js..."
npm run dev