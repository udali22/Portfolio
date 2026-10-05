# Server Maintenance & Log Retention Guide

This document outlines routine maintenance, disk management, and log retention policies for the Portfolio host on Azure.

---

## 1. Resource and Storage Management

- **Storage:** 29 GB OS disk (approx. ~18% used, 24 GB free).
- **Swap:** 1 GiB swap configured on Ubuntu 24.04.
- **Docker Resource Limits:** CPU and Memory reservations & limits are configured in `docker-compose.yml` (256MB max memory per container).

---

## 2. Log Retention Policies

### Nginx Logs
- Managed by `logrotate` via `/etc/logrotate.d/nginx`.
- **Policy:** Rotated daily, retained for 14 days, with compression enabled (`compress`, `delaycompress`).

### Docker Container Logs
- Configured in `docker-compose.yml` with `json-file` driver:
  - `max-size`: `10m`
  - `max-file`: `3`
- Total log storage per container cannot exceed 30MB.

### System Journal
- Managed by `systemd-journald`.

---

## 3. Routine Inspection Commands

SSH to the Azure VM and run:

```bash
# Run the automated health & maintenance report
/web_app/scripts/maintenance.sh

# Clean up dangling Docker images and build caches (safe)
docker image prune -f
docker builder prune -f --keep-storage 1GB
```
