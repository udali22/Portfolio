#!/usr/bin/env bash
# ==============================================================================
# Routine Maintenance and Health Inspection Script for Portfolio VM
# Run on Azure VM host
# ==============================================================================
set -euo pipefail

echo "=========================================="
echo " System & Application Health Report"
echo " Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "=========================================="

echo "==> 1. Disk Space Utilization:"
df -h / /boot

echo ""
echo "==> 2. Memory & Swap Utilization:"
free -h

echo ""
echo "==> 3. Docker Containers Status:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo ""
echo "==> 4. Docker Container Health Checks:"
echo "Backend: $(curl -fsS http://127.0.0.1:8000/api/health 2>/dev/null || echo 'FAILED')"
echo "Frontend: $(curl -fsSI http://127.0.0.1:3000 2>/dev/null | head -n 1 || echo 'FAILED')"

echo ""
echo "==> 5. UFW Firewall Status:"
sudo ufw status

echo ""
echo "==> 6. Log File Sizes:"
echo "Nginx logs: $(sudo du -sh /var/log/nginx 2>/dev/null | awk '{print $1}')"
echo "System journal: $(sudo du -sh /var/log/journal 2>/dev/null | awk '{print $1}')"

echo ""
echo "==> 7. Docker System Disk Cleanliness:"
docker system df

echo "=========================================="
echo " Routine inspection complete."
echo "=========================================="
