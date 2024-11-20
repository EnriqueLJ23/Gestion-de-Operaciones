#!/bin/sh
set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  echo "Database is not ready. Waiting..."
  sleep 2
done

# Push Prisma schema to database
echo "Pushing Prisma schema to database..."
npx prisma db push --skip-generate

# Apply migrations
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Run seeds if enabled
if [ "$SHOULD_SEED" = "true" ]; then
  echo "Running database seeds..."
  npx prisma db seed
fi

# Start the application
echo "Starting the application..."
exec node server.js