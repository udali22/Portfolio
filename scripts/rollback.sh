#!/usr/bin/env bash
# ==============================================================================
# Deployment Rollback Script for Portfolio Application
# Usage: ./scripts/rollback.sh [COMMIT_OR_TAG]
# Example: ./scripts/rollback.sh main~1
# ==============================================================================
set -euo pipefail

TARGET_REF="${1:-HEAD~1}"
APP_DIR="/web_app"

echo "=========================================="
echo " Starting Portfolio Rollback Process"
echo " Target Reference: ${TARGET_REF}"
echo " Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=========================================="

cd "${APP_DIR}"

# 1. Capture current state for auditing
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "==> Current active commit: ${CURRENT_COMMIT}"

# 2. Fetch latest refs
echo "==> Fetching Git updates..."
git fetch origin

# 3. Checkout target commit/tag
echo "==> Checking out target ref: ${TARGET_REF}..."
git checkout "${TARGET_REF}"
NEW_COMMIT=$(git rev-parse HEAD)
echo "==> Checked out: ${NEW_COMMIT}"

# 4. Rebuild and restart containers
echo "==> Rebuilding and restarting containers..."
docker compose up -d --build

# 5. Wait for services to stabilize
echo "==> Waiting 10s for containers to initialize..."
sleep 10

# 6. Check container status
echo "==> Container status:"
docker compose ps

# 7. Perform health checks
echo "==> Validating backend health..."
BACKEND_HEALTH=$(curl -fsS http://127.0.0.1:8000/api/health)
echo "Backend response: ${BACKEND_HEALTH}"

echo "==> Validating frontend availability..."
FRONTEND_CODE=$(curl -fsSI http://127.0.0.1:3000 | head -n 1)
echo "Frontend response: ${FRONTEND_CODE}"

echo "=========================================="
echo " Rollback completed successfully!"
echo " Rolled back from ${CURRENT_COMMIT} to ${NEW_COMMIT}"
echo "=========================================="
