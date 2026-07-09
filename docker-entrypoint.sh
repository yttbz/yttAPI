#!/bin/sh
set -e

# Fix permissions for volume mounts
mkdir -p /app/data /home/ytt/photo/ip
touch /app/data/.write_test 2>/dev/null && rm /app/data/.write_test 2>/dev/null || {
    echo "[entrypoint] Fixing /app/data permissions..."
    # Can't fix if not root; just warn
    echo "[entrypoint] WARNING: /app/data may not be writable"
}

echo "[entrypoint] Running prisma db push..."
cd /app && bunx prisma@6 db push 2>&1 || echo "[entrypoint] DB push failed (continuing anyway)"

echo "[entrypoint] Starting yttAPI..."
exec bun server.js
