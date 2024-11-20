#!/bin/sh
set -e  # Asegura que el script falle si ocurre un error

# Esperar a que la base de datos esté lista
echo "Waiting for database to be ready..."
until nc -z db 5432; do
  echo "Database is not ready. Waiting..."
  sleep 2
done

# Ejecutar Prisma db push para sincronizar el esquema
echo "Pushing Prisma schema to database..."
if ! npx prisma db push --skip-generate; then
  echo "Error: Failed to push schema."
  exit 1
fi

# Aplicar migraciones
echo "Running Prisma migrations..."
if ! npx prisma migrate deploy; then
  echo "Error: Failed to apply migrations."
  exit 1
fi

# Ejecutar semillas si está habilitado
if [ "$SHOULD_SEED" = "true" ]; then
  echo "Running database seeds..."
  if ! npx prisma db seed; then
    echo "Error: Failed to seed database."
    exit 1
  fi
fi

# Iniciar la aplicación
echo "Starting the application..."
exec node ./server.js