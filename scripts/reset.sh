#!/bin/bash
set -e
cd "$(dirname "$0")/.."
export $(grep -v '^#' src/.env | grep DATABASE_URL | xargs)

psql "$DATABASE_URL" -c 'DELETE FROM "Session";'
rm -f cookies.txt
echo "--- baza očišćena ---"