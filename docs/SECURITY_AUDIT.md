# Security Posture & Verification Guide

This document details the security hardening measures implemented across the application and host, along with manual reproduction commands.

---

## 1. Network & Attack Surface

The Azure NSG and host UFW firewalls strictly isolate public traffic:
- **Port 22 (SSH):** Open for authenticated key-based management.
- **Port 80 (HTTP):** Open, automatically redirects (301) to HTTPS.
- **Port 443 (HTTPS):** Open, TLS secured with Let's Encrypt certificates.
- **Port 3000 & 8000:** Docker containers bind exclusively to `127.0.0.1` and are **not** reachable over the public internet.

---

## 2. HTTP Security Headers

Nginx has been hardened with the following HTTP response headers:
- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (HSTS)
- `X-Content-Type-Options: nosniff` (MIME sniffing protection)
- `X-Frame-Options: SAMEORIGIN` (Clickjacking mitigation)
- `Referrer-Policy: strict-origin-when-cross-origin` (Information leakage prevention)
- `Permissions-Policy: geolocation=(), camera=(), microphone=()` (Feature lockdown)
- `server_tokens off` (Information disclosure suppression)

---

## 3. Static & Dynamic Security Scanning

- **SAST (Static Application Security Testing):** Bandit runs on the Python FastAPI codebase (`bandit -r backend -c .bandit`).
- **SCA (Software Composition Analysis):** `pip-audit` for Python and `npm audit` for Node.js dependencies in CI and scheduled weekly scans.
- **E2E Integration Testing:** Playwright verifies all application workflows, contact form submission handling, and security headers.
- **DAST / Load Testing:** Locust (`load_tests/locustfile.py`) performs non-destructive availability and performance testing.

---

## 4. Manual Reproduction Commands

You can run these commands at any time to verify the security posture:

```bash
# 1. Verify Security Headers from the internet
curl -sI https://mohamedali-maali.duckdns.org

# 2. Verify Port Isolation (8000 / 3000 should fail or time out)
curl --connect-timeout 3 http://158.158.1.171:8000/api/health || echo "Port 8000 correctly blocked"
curl --connect-timeout 3 http://158.158.1.171:3000 || echo "Port 3000 correctly blocked"

# 3. Run Backend SAST & SCA locally
bandit -r backend -c .bandit
pip-audit -r backend/requirements.txt

# 4. Run Frontend SCA locally
cd frontend && npm audit

# 5. Run Backend Unit / API Tests
pytest backend/tests -v

# 6. Run Locust Load Test
locust -f load_tests/locustfile.py --headless -u 5 -r 1 --run-time 15s --host https://mohamedali-maali.duckdns.org
```
