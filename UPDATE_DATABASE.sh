#!/bin/bash
# Quick script to update your database URL

echo "====================================="
echo "  Update Database URL"
echo "====================================="
echo ""
echo "Enter your PostgreSQL connection string:"
echo "(Example: postgresql://user:pass@host:5432/db)"
echo ""
read -p "POSTGRES_URL: " db_url

if [ -z "$db_url" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Update the POSTGRES_URL in .env
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s|POSTGRES_URL=.*|POSTGRES_URL=$db_url|g" .env
else
    # Linux
    sed -i "s|POSTGRES_URL=.*|POSTGRES_URL=$db_url|g" .env
fi

echo ""
echo "✅ Database URL updated in .env"
echo ""
echo "Next steps:"
echo "  1. npm run db:push"
echo "  2. npm run dev"
echo ""
