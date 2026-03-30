# Cellframe Masternode Inspector UI

Web dashboard for the [Cellframe Masternode Inspector](https://github.com/hyttmi/cellframe_masternode_inspector) plugin. Shows node health, rewards, blocks, wallet balances, and transaction history. Supports both regular and sovereign masternodes.

## Quick Start

1. Install [Caddy](https://caddyserver.com/docs/install)
2. Clone and install:

```bash
git clone https://github.com/hyttmi/cellframe-masternode-inspector-ui.git
cd cellframe-masternode-inspector-ui
sudo ./install.sh
```

3. Open `http://localhost:8080` in your browser
4. Enter your node URL (e.g. `http://mynode:61000/mninspector`) and API key

The install script copies files to `/srv/mninspector-ui`, sets up the Caddyfile at `/etc/caddy/Caddyfile`, and enables the Caddy systemd service.

For a manual setup or development, just run `caddy run` from the repo directory. The port is configured in `Caddyfile` (default `:8080`).

## Requirements

- A running Cellframe node with the [Masternode Inspector plugin](https://github.com/hyttmi/cellframe_masternode_inspector) (v1.12+)
- [Caddy](https://caddyserver.com/) (or any static file server)

## How It Works

Caddy serves the static files. The browser connects directly to your node's API using the `X-API-Key` header. No proxy needed — the plugin supports CORS out of the box.

Configuration (node URL + API key) is saved in your browser's localStorage.

## Password Protecting the Dashboard

To require a username and password before accessing the dashboard, add `basicauth` to your Caddyfile:

```
:8080 {
    root * /srv/mninspector-ui
    basicauth {
        admin $2a$14$HASHED_PASSWORD_HERE
    }
    file_server
    encode gzip
}
```

Generate a password hash with:

```bash
caddy hash-password
```

Enter your desired password and it will output a bcrypt hash. Replace `admin` with your username and `$2a$14$HASHED_PASSWORD_HERE` with the hash. Then restart Caddy:

```bash
sudo systemctl restart caddy
```

## Features

- System health (CPU, memory, uptime, IP)
- Network status, stake info, wallet balances (multi-token)
- Reward metrics with daily chart (7/14/30/90 day toggle)
- Block metrics with signed vs first-signed chart
- Sovereign node support (tax rate, sovereign wallet, combined rewards chart)
- Reward transaction history (sortable, paginated)
- Plugin update from the UI
- Auto-refresh (system every 30s, network data on cache updates)
- Multi-network support (dropdown selector)
