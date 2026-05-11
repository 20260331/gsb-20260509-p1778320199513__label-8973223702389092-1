#!/bin/sh
set -e

echo "Starting application..."

# Check if database exists, if not initialize it
if [ ! -f "/app/data/prod.db" ]; then
  echo "Database not found. Initializing..."

  # Run Prisma migrations
  npx prisma db push --schema=/app/lib/db/prisma/schema.prisma

  # Run seed script
  node /app/scripts/seed.js

  echo "Database initialized successfully!"
else
  echo "Database found. Skipping initialization."
fi

# Start the application
exec node server.js
