#!/usr/bin/env bash
set -euo pipefail

WEBROOT="/var/www/blocks"
SITE_NAME="blocks.probotstudio.com"
CONF_SRC_DIR="$(cd "$(dirname "$0")" && pwd)/nginx"
CONF_FILE_SRC="$CONF_SRC_DIR/$SITE_NAME.conf"
CONF_FILE_TMP="/tmp/$SITE_NAME.conf"
CONF_DST_AVAIL="/etc/nginx/sites-available/$SITE_NAME"
CONF_DST_ENABLED="/etc/nginx/sites-enabled/$SITE_NAME"

SKIP_BUILD=false
if [ "${1:-}" = "--skip-build" ]; then
  SKIP_BUILD=true
fi

# 1) Build
if [ "$SKIP_BUILD" = false ]; then
  if [ -f package.json ]; then
    if command -v npm >/dev/null 2>&1; then
      npm ci
      npm run build
    else
      echo "npm not found" >&2
      exit 1
    fi
  else
    echo "package.json not found" >&2
    exit 1
  fi
else
  echo "Skipping build as requested (--skip-build)"
fi

# 2) Prepare webroot
sudo mkdir -p "$WEBROOT"
sudo rm -rf "$WEBROOT"/*
sudo cp -r dist/* "$WEBROOT"/

# 3) Install nginx config
if [ ! -f "$CONF_FILE_SRC" ]; then
  echo "Config template not found: $CONF_FILE_SRC" >&2
  exit 1
fi

# Replace placeholder with actual webroot
sed "s#__WEBROOT__#$WEBROOT#g" "$CONF_FILE_SRC" | sudo tee "$CONF_DST_AVAIL" >/dev/null

# 4) Disable other sites (as per user request)
if [ -e /etc/nginx/sites-enabled/mebtasarlagelistir ]; then
  sudo rm -f /etc/nginx/sites-enabled/mebtasarlagelistir
fi
if [ -e /etc/nginx/sites-enabled/flux ]; then
  sudo rm -f /etc/nginx/sites-enabled/flux
fi
if [ -e /etc/nginx/sites-enabled/default ]; then
  sudo rm -f /etc/nginx/sites-enabled/default
fi

# 5) Enable our site
sudo ln -sf "$CONF_DST_AVAIL" "$CONF_DST_ENABLED"

# 6) Test & reload nginx
sudo nginx -t
sudo systemctl reload nginx || sudo systemctl restart nginx

echo "Deployment completed. If DNS is set, run: sudo certbot --nginx -d $SITE_NAME" 