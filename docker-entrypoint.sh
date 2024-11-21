#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
./prisma-cli db push --skip-generate

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