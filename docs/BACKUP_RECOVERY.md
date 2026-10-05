# Backup and Recovery Procedures

This document details the backup and recovery procedures for the Portfolio application deployed on Azure.

---

## 1. Backup Strategy

The Azure VM stores critical persistent configuration in `~/server-backup`:
1. `portfolio.env`: Production environment variables including SMTP/email credentials (must have permissions `600`).
2. `portfolio-nginx.conf`: Hardened reverse proxy configuration with SSL termination and security headers (must have permissions `644`).

---

## 2. Taking a Backup

SSH to the Azure VM and run:

```bash
# Using the backup utility script
/web_app/scripts/backup-recovery.sh backup

# Or manual backup commands:
mkdir -p ~/server-backup
cp /web_app/.env ~/server-backup/portfolio.env
chmod 600 ~/server-backup/portfolio.env
cp /etc/nginx/sites-available/portfolio ~/server-backup/portfolio-nginx.conf
chmod 644 ~/server-backup/portfolio-nginx.conf
```

---

## 3. Verifying Backups

Run the verification routine on the Azure VM:

```bash
/web_app/scripts/backup-recovery.sh verify
```

Expected checks:
- `portfolio.env` exists and permissions are `600` (readable only by `azureuserDali`).
- `portfolio-nginx.conf` exists and passes syntax validation (`nginx -t`).

---

## 4. Disaster Recovery Procedure

### Scenario A: Nginx Configuration Corrupted or Lost
```bash
/web_app/scripts/backup-recovery.sh restore-nginx
```

### Scenario B: Application / Environment Lost (.env Restoration)
```bash
# Restore .env from backup
cp ~/server-backup/portfolio.env /web_app/.env
chmod 600 /web_app/.env

# Restart containers
cd /web_app
docker compose up -d --build
```
