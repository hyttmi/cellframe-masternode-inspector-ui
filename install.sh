#!/bin/bash
set -e

INSTALL_DIR="/srv/mninspector-ui"
CADDY_CONFIG="/etc/caddy/Caddyfile"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Cellframe Masternode Inspector UI - Installer"
echo "=============================================="

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo ./install.sh)"
    exit 1
fi

# Check if caddy is installed
if ! command -v caddy &>/dev/null; then
    echo "Error: Caddy is not installed. See https://caddyserver.com/docs/install"
    exit 1
fi

# Copy UI files
echo "Installing UI files to ${INSTALL_DIR}..."
mkdir -p "$INSTALL_DIR"
cp "$SCRIPT_DIR/index.html" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/app.js" "$INSTALL_DIR/"
cp "$SCRIPT_DIR/logo.svg" "$INSTALL_DIR/"

# Set ownership
if id caddy &>/dev/null; then
    chown -R caddy:caddy "$INSTALL_DIR"
fi

# Install Caddyfile
if [ -f "$CADDY_CONFIG" ]; then
    echo "Existing Caddyfile found at ${CADDY_CONFIG}"
    read -p "Overwrite? [y/N] " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Skipping Caddyfile. Update it manually to serve from ${INSTALL_DIR}"
        echo "Done! Restart Caddy to apply changes."
        exit 0
    fi
fi

# Write Caddyfile
cat > "$CADDY_CONFIG" << EOF
:8080 {
    root * ${INSTALL_DIR}
    file_server
    encode gzip
}
EOF
echo "Caddyfile written to ${CADDY_CONFIG}"

# Enable and restart caddy
echo "Enabling and starting Caddy service..."
systemctl enable caddy
systemctl restart caddy

echo ""
echo "Done! Open http://localhost:8080 in your browser."
echo "To use HTTPS with a domain, edit ${CADDY_CONFIG} and replace :8080 with your domain."
