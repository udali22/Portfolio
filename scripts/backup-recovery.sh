#!/usr/bin/env bash
# ==============================================================================
# Backup & Recovery Verification Script for Portfolio Server
# Run on Azure VM host: /home/azureuserDali/server-backup/
# ==============================================================================
set -euo pipefail

BACKUP_DIR="${HOME}/server-backup"
ENV_SRC="/web_app/.env"
NGINX_SRC="/etc/nginx/sites-available/portfolio"

ACTION="${1:-status}"

mkdir -p "${BACKUP_DIR}"

case "${ACTION}" in
  backup)
    echo "==> Creating backup..."
    if [ -f "${ENV_SRC}" ]; then
      cp "${ENV_SRC}" "${BACKUP_DIR}/portfolio.env"
      chmod 600 "${BACKUP_DIR}/portfolio.env"
      echo "  [OK] .env backed up to ${BACKUP_DIR}/portfolio.env (permissions 600)"
    else
      echo "  [WARN] ${ENV_SRC} not found"
    fi

    if [ -f "${NGINX_SRC}" ]; then
      cp "${NGINX_SRC}" "${BACKUP_DIR}/portfolio-nginx.conf"
      chmod 644 "${BACKUP_DIR}/portfolio-nginx.conf"
      echo "  [OK] Nginx config backed up to ${BACKUP_DIR}/portfolio-nginx.conf"
    else
      echo "  [WARN] ${NGINX_SRC} not found"
    fi
    ;;

  restore-nginx)
    echo "==> Restoring Nginx configuration..."
    if [ ! -f "${BACKUP_DIR}/portfolio-nginx.conf" ]; then
      echo "  [ERROR] Backup file ${BACKUP_DIR}/portfolio-nginx.conf does not exist."
      exit 1
    fi
    sudo cp "${BACKUP_DIR}/portfolio-nginx.conf" "${NGINX_SRC}"
    echo "  Testing Nginx syntax..."
    sudo nginx -t
    echo "  Reloading Nginx..."
    sudo systemctl reload nginx
    echo "  [OK] Nginx config restored and reloaded successfully."
    ;;

  status|verify)
    echo "==> Verifying backups in ${BACKUP_DIR}..."
    ls -la "${BACKUP_DIR}"

    echo "==> Checking .env permissions:"
    if [ -f "${BACKUP_DIR}/portfolio.env" ]; then
      PERMS=$(stat -c "%a" "${BACKUP_DIR}/portfolio.env" 2>/dev/null || stat -f "%Op" "${BACKUP_DIR}/portfolio.env")
      echo "  portfolio.env permissions: ${PERMS} (Must be 600)"
    fi

    echo "==> Testing Nginx backup syntax:"
    if [ -f "${BACKUP_DIR}/portfolio-nginx.conf" ]; then
      # Test backup config syntax using a temporary test check
      sudo nginx -t -c "${BACKUP_DIR}/portfolio-nginx.conf" 2>&1 || true
    fi
    ;;

  *)
    echo "Usage: $0 {backup|restore-nginx|status|verify}"
    exit 1
    ;;
esac
