# Deployment Rollback Procedure

This document provides step-by-step instructions for safely rolling back a deployment on the Azure VM in the event of a failed or buggy release.

---

## 1. Rollback Overview

The Portfolio deployment is git-driven with Docker Compose. Rollback does **not** modify public git history on GitHub; it checks out a known-good commit on the deployment VM and rebuilds the containers.

- **VM Host:** `158.158.1.171`
- **Application Directory:** `/web_app`
- **Containers:** `portfolio-frontend` (port 3000), `portfolio-backend` (port 8000)

---

## 2. Automated Rollback (Recommended)

SSH to the Azure VM and execute the rollback script:

```bash
# Roll back to the previous commit
/web_app/scripts/rollback.sh

# Or roll back to a specific commit SHA / tag
/web_app/scripts/rollback.sh <commit-sha-or-tag>
```

---

## 3. Manual Step-by-Step Rollback

If you need to perform the rollback manually:

### Step 1: SSH to the Azure VM
```bash
ssh -i ~/.ssh/your_key.pem azureuserDali@158.158.1.171
```

### Step 2: Navigate to App Directory & Review History
```bash
cd /web_app
git log -n 5 --oneline
```

### Step 3: Checkout Known-Good Commit
```bash
# Fetch latest state from origin
git fetch origin

# Check out the desired stable commit
git checkout <COMMIT_SHA>
```

### Step 4: Rebuild and Restart Containers
```bash
docker compose up -d --build
```

### Step 5: Verify Health
```bash
# Verify container statuses
docker compose ps

# Check backend health
curl -fsS http://127.0.0.1:8000/api/health

# Check frontend HTTP response
curl -fsSI http://127.0.0.1:3000

# Check public HTTPS endpoint
curl -sI https://mohamedali-maali.duckdns.org
```

---

## 4. Returning to the Main Branch

Once a fix has been tested, reviewed, and merged into `main` on GitHub:

```bash
cd /web_app
git checkout main
git reset --hard origin/main
docker compose up -d --build
```
