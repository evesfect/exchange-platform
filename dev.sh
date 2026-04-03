#!/bin/bash

echo "Booting..."

echo "Starting PostgreSQL..."
docker-compose up -d

sleep 3

echo "Syncing database schema..."
npx drizzle-kit push

echo "Starting next.js..."
npm run dev