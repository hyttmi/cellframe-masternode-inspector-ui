#!/bin/bash
set -e

INSTALL_DIR="/srv/mninspector-ui"
CADDY_CONFIG="/etc/caddy/Caddyfile"
REPO_URL="https://github.com/hyttmi/cellframe-masternode-inspector-ui"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
UI_FILES="index.html app.js logo.svg"

usage() {
    echo "Usage: $0 [install|update]"
    echo "  install  - Full install (UI files + Caddy setup)"
    echo "  update   - Update UI files from GitHub"
    exit 1
}

install_files() {
    local src_dir="$1"
    echo "Installing UI files to ${INSTALL_DIR}..."
    mkdir -p "$INSTALL_DIR"
    for f in $UI_FILES; do
        cp "$src_dir/$f" "$INSTALL_DIR/"
    done
    if id caddy &>/dev/null; then
        chown -R caddy:caddy "$INSTALL_DIR"
    fi
}

do_update() {
    echo "Updating..."
    cd "$SCRIPT_DIR"
    git pull
    install_files "$SCRIPT_DIR"
    echo "Update complete!"
}

do_install() {
    echo "Cellframe Masternode Inspector UI - Installer"
    echo "=============================================="

    # Check if caddy is installed
    if ! command -v caddy &>/dev/null; then
        echo "Error: Caddy is not installed. See https://caddyserver.com/docs/install"
        exit 1
    fi

    install_files "$SCRIPT_DIR"

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
:8081 {
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
    echo "Done! Open http://localhost:8081 in your browser."
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run as root (sudo ./install.sh)"
    exit 1
fi

case "${1:-install}" in
    install) do_install ;;
    update)  do_update ;;
    *)       usage ;;
esac
