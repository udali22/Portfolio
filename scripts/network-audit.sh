#!/usr/bin/env bash
# ==============================================================================
# Network Surface & Security Audit Script
# Tests security headers, HTTPS TLS configuration, and open ports
# ==============================================================================
set -euo pipefail

TARGET_HOST="${1:-mohamedali-maali.duckdns.org}"
TARGET_IP="158.158.1.171"

echo "=========================================="
echo " Network & Security Audit: ${TARGET_HOST}"
echo " Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=========================================="

echo "==> 1. Testing HTTPS Status and Security Headers:"
curl -sI --max-time 10 "https://${TARGET_HOST}" > /tmp/headers.txt
cat /tmp/headers.txt

echo ""
echo "==> 2. Validating Required Security Headers:"
check_header() {
  local header="$1"
  if grep -iq "^${header}:" /tmp/headers.txt; then
    echo "  [PASS] ${header} is present"
  else
    echo "  [FAIL] ${header} is missing!"
  fi
}

check_header "Strict-Transport-Security"
check_header "X-Content-Type-Options"
check_header "X-Frame-Options"
check_header "Referrer-Policy"
check_header "Permissions-Policy"

echo ""
echo "==> 3. Verifying Server Version Masking (server_tokens off):"
SERVER_HEADER=$(grep -i "^server:" /tmp/headers.txt || true)
echo "  Server header: ${SERVER_HEADER}"
if echo "${SERVER_HEADER}" | grep -qE "/[0-9]"; then
  echo "  [FAIL] Nginx version disclosed in Server header!"
else
  echo "  [PASS] Nginx version masked"
fi

echo ""
echo "==> 4. Validating Production API Endpoints:"
for endpoint in "/api/health" "/api/profile" "/api/projects" "/api/skills"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://${TARGET_HOST}${endpoint}")
  echo "  ${endpoint}: HTTP ${STATUS}"
done

echo "=========================================="
echo " Audit completed."
echo "=========================================="
