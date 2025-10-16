# Cellframe Masternode Inspector

A modern, web-based dashboard for monitoring and managing Cellframe masternodes. Monitor multiple nodes, track rewards, analyze performance metrics, and visualize blockchain data—all from a sleek, responsive interface.

![License](https://img.shields.io/badge/license-GPL--3.0-blue.svg)
![Version](https://img.shields.io/badge/version-2.4.1-green.svg)

## Features

### Multi-Node Management
- **Add & Manage Multiple Nodes** - Monitor all your masternodes from a single dashboard
- **Easy Node Switching** - Quick dropdown selector to switch between nodes
- **Share Nodes** - Generate QR codes or share links with embedded credentials
- **Node Editing** - Update node names, URLs, and API tokens on the fly

### Real-Time Monitoring
- **System Metrics** - CPU usage, memory usage, uptime, and version information
- **Network Performance** - Block rewards, validation metrics, token prices, and network state
- **Wallet Tracking** - Monitor reward and sovereign wallet balances with click-to-copy addresses
- **Auto-Refresh** - Configurable refresh intervals for system (15s-2min) and network data (1min-15min)

### Advanced Analytics
- **Interactive Charts** - Visualize daily rewards, sovereign rewards, signed blocks, and first signed blocks
- **Flexible Time Ranges** - View data across 7, 14, 30, 60, or 90 days
- **Per-Chart Day Selection** - Independent time range for each chart
- **Historical Data** - Track performance trends over time

### Customization
- **Manage Metrics** - Show/hide individual metrics based on your needs
- **Drag-and-Drop Ordering** - Reorder metrics via intuitive drag-and-drop
- **Per-Node Settings** - Each node maintains independent metric visibility and ordering
- **Chart Toggles** - Enable/disable individual charts

### User Experience
- **Dark Theme** - Eye-friendly dark mode with purple accents
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Touch-Optimized** - Full touch support with smart gesture handling
- **Copy-to-Clipboard** - One-click copy for wallet addresses and transaction hashes
- **Toast Notifications** - Non-intrusive feedback for user actions

### Sovereign Node Support
- **Sovereign Metrics** - Dedicated metrics for sovereign rewards and wallets
- **Sovereign Charts** - Separate visualization for sovereign network rewards
- **Auto-Detection** - Automatically detects and displays sovereign data when available

## Quick Start

### Prerequisites
No installation required! This is a client-side web application that runs entirely in your browser.

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/hyttmi/cellframe-masternode-inspector-ui.git
   cd cellframe-masternode-inspector-ui
   ```

2. **Serve the files**

   Using Python:
   ```bash
   python3 -m http.server 8000
   ```

   Using Node.js:
   ```bash
   npx http-server -p 8000
   ```

   Or simply open `index.html` in your browser.

3. **Add your first node**
   - Click "+ Add Node" button
   - Enter your node details:
     - **Name**: A friendly name for your node
     - **API URL**: Your Cellframe node API endpoint
     - **Token**: Your API authentication token
   - Click "Add Node"

4. **Start monitoring!**
   Your dashboard will automatically load and display real-time data from your masternode.

## Usage

### Adding Nodes

Add nodes manually through the UI or share nodes via URL parameters:

```
https://your-domain.com/?url=https://node.example.com&token=YOUR_TOKEN&name=My%20Node
```

### Managing Metrics

Click **Manage Metrics** to:
- Toggle visibility of system metrics
- Toggle visibility of network metrics
- Enable/disable charts
- All changes are saved per-node automatically

### Reordering Metrics

Simply **click and drag** any metric card to reorder. Your preferences are saved automatically.

### Switching Networks

If your node supports multiple networks, click the network pills in the navigation bar to switch between them.

## Technology Stack

- **Frontend**: Pure JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.3
- **Charts**: Chart.js
- **Drag & Drop**: SortableJS 1.15.0
- **QR Codes**: QRious 4.0.2
- **Icons**: Font Awesome 6.5.1
- **Storage**: Browser localStorage (client-side only)

## File Structure

```
.
├── index.html          # Main HTML structure
├── script.js           # Application logic and API handling
├── styles.css          # Custom styling and theme
├── DOCUMENTATION.md    # Detailed technical documentation
├── LICENSE             # GPL-3.0 license
└── README.md           # This file
```

## Configuration

### Auto-Refresh Settings

Access via **Settings** button:
- **System Data**: 15s, 30s (default), 45s, 1min, 2min
- **Network Data**: 1min, 2min, 5min (default), 10min, 15min

### Storage

All data is stored locally in your browser using `localStorage`:
- Node configurations
- API tokens (unencrypted)
- Metric preferences
- Chart settings
- Network selections
- Cached API responses

**Security Note**: API tokens are stored unencrypted in browser storage. Use HTTPS in production and be cautious when sharing URLs with embedded tokens.

## Browser Compatibility

- Modern browsers with ES6 support
- localStorage support required
- Tested on Chrome, Firefox, Safari, and Edge

## API Integration

The application communicates with Cellframe nodes via REST API with Bearer token authentication. For API details and endpoint documentation, see [DOCUMENTATION.md](DOCUMENTATION.md).

## Contributing

Contributions are welcome! Please feel free to submit issues, fork the repository, and create pull requests.

### Development Guidelines

1. Document changes in `DOCUMENTATION.md` Change Log
2. Update version numbers for significant changes
3. Test on multiple browsers and devices
4. Follow existing code style and conventions

## Support

For issues, feature requests, or questions:
- Open an issue on [GitHub Issues](https://github.com/hyttmi/cellframe-masternode-inspector-ui/issues)
- Check [DOCUMENTATION.md](DOCUMENTATION.md) for detailed technical information

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built for the Cellframe Network community
- Powered by [Cellframe](https://cellframe.net/)

---

**Current Version**: 2.4.1
**Last Updated**: October 16, 2025
**Repository**: https://github.com/hyttmi/cellframe-masternode-inspector-ui
