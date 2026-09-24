# ==========================================
# Production Dockerfile for FastAPI Backend
# Lightweight Debian Slim image (~130MB base)
# ==========================================
FROM python:3.12-slim AS runtime

# Set environment variables for optimal container execution
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PORT=8000

# Create a non-root system group and user for container security
RUN groupadd -r appgroup && useradd -r -g appgroup -d /app -s /sbin/nologin -c "Production Application User" appuser

WORKDIR /app

# Install Python dependencies first to leverage Docker layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend application source code with non-root ownership
COPY --chown=appuser:appgroup main.py .

# Switch to the non-root user
USER appuser

# Expose backend port for internal Docker network communication
EXPOSE 8000

# Built-in lightweight healthcheck using standard Python urllib (no external tools like curl needed)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/api/health')" || exit 1

# Production command: single uvicorn worker tuned for small VM memory constraints (< 50MB RAM)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1", "--proxy-headers"]
