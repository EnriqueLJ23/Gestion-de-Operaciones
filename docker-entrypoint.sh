chmod +x docker-entrypoint.sh
#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
./prisma-cli db push --skip-generate

# Run migrations (if any)
echo "Running Prisma migrations..."
npx prisma migrate deploy  # This ensures migrations are applied before seeding

# Run seeds if environment variable is set
if [ "$SHOULD_SEED" = "true" ]; then
  echo "Running database seeds..."
  npx prisma db seed
fi

# Start the application
echo "Starting the application..."
exec node server.js