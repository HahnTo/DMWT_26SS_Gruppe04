#!/bin/sh
set -e

echo "Waiting briefly for database..."
sleep 3

echo "Running Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

echo "Starting Next.js..."
npm run start