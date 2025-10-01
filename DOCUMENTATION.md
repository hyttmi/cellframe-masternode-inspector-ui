# Cellframe Masternode Inspector - Documentation

## Overview

Cellframe Masternode Inspector is a web-based dashboard for monitoring Cellframe masternodes. It provides real-time information about system status, network performance, rewards, and blockchain metrics.

## Features

### Multi-Node Support
- Add and manage multiple masternodes
- Edit node name, URL, and API token per node
- Each node maintains independent settings
- Switch between nodes easily via dropdown selector
- Share nodes via QR code or native device sharing
- Automatic cache clearing when credentials change

### System Monitoring
- CPU usage tracking
- Memory usage monitoring
- System and node uptime
- Version information (current and latest)
- External IP address
- Hostname display

### Network Performance
- Support for multiple networks per node
- Network status and state monitoring
- Block rewards and validation metrics
- Token price information
- Validator fee tracking (min/avg/max)
- Autocollect status

### Wallet Management
- Reward wallet display with balance information
- Sovereign wallet support (when available)
- Hover-to-view detailed wallet information
- Truncated address display for better UX

### Charts and Analytics
- **Rewards Chart**: Daily rewards visualization
- **Sovereign Rewards Chart**: Sovereign network rewards (when available)
- **Signed Blocks Chart**: Daily signed blocks tracking
- **First Signed Blocks Chart**: First block signing tracking
- Configurable time ranges (7, 14, 30, 60, 90 days)
- Individual chart day selection

### Customization
- **Manage Metrics**: Show/hide individual metrics
- **Drag-and-Drop Ordering**: Reorder metrics via drag and drop
- **Chart Visibility**: Toggle individual charts on/off
- **Per-Node Settings**: Each node has independent metric visibility and ordering
- **Auto-Refresh Intervals**: Configurable refresh rates for system (15s-2min) and network data (1min-15min)

### User Interface
- Dark theme with purple accents
- Responsive design for mobile and desktop
- Touch-optimized with 200ms delay on drag operations
- Bootstrap-based alert styling for consistency
- Sortable metric cards with visual feedback

## Technical Implementation

### Storage Structure

All data is stored in browser localStorage with the prefix `cfminspector_`.

#### Global Settings (shared across all nodes)
- `cfminspector_nodes`: Array of all configured nodes
- `cfminspector_active_node`: Currently selected node ID
- `cfminspector_refresh_settings`: Auto-refresh interval settings

#### Per-Node Settings (independent for each node)
- `cfminspector_visible_metrics`: Object keyed by node ID
  ```json
  {
    "node-id-1": {
      "system": ["cpu_usage", "memory_usage", ...],
      "network": ["autocollect_status", "rewards_received_today", ...],
      "sections": ["rewards_chart", "signed_blocks_chart", ...]
    }
  }
  ```
- `cfminspector_network_preferences`: Selected network per node
- `cfminspector_days_preferences`: Chart day ranges per node
- `cfminspector_{nodeId}_system_metric_order`: System metrics order
- `cfminspector_{nodeId}_network_metric_order`: Network metrics order
- `cfminspector_cache_{nodeId}_{network}`: Cached API responses

### API Integration

The application communicates with Cellframe nodes via REST API:
- **Base URL**: Configured per node
- **Authentication**: Bearer token authentication
- **Timeout**: 30 seconds with AbortController
- **Caching**: Network data cached with configurable refresh intervals

#### Key API Endpoints
- `/api/system` - System information and status
- `/api/network/{network}` - Network-specific data
- `/api/network/{network}/all` - Comprehensive network data with optional day filtering

### URL Parameters

Share nodes via URL with automatic configuration:
```
?url=https://node.example.com&token=YOUR_TOKEN&name=Node%20Name
```

Parameters:
- `url`: Node API URL
- `token`: Authentication token
- `name`: Display name (optional, defaults to "URL Node")

### Keyboard Support

- **Enter key**: Submit forms in Add Node and Setup modals
- All forms include hidden submit buttons for proper Enter key handling

### Mobile Optimizations

- Touch-friendly interface with proper touch-action CSS
- 200ms delay on sortable items to prevent accidental dragging while scrolling
- Full-width buttons on mobile devices
- Responsive modal layouts
- QR code generation for easy mobile node sharing

### Chart Implementation

Charts use Chart.js library with the following features:
- Line charts for time-series data
- Responsive sizing
- Color-coded data visualization
- Day range filtering with API support
- Per-chart day selection persistence

### Conditional Rendering

Smart UI that adapts to available data:
- Sovereign metrics only shown when sovereign data exists
- System Information card hidden when all system metrics hidden
- Network Performance card hidden when all network metrics hidden
- Wallet hint only shown when wallet metrics are visible
- Charts section hidden when all charts are disabled

### Drag-and-Drop

Implemented using SortableJS:
- System metrics reordering
- Network metrics reordering
- Per-node order persistence
- Touch support with delay
- Visual feedback (ghost, chosen, drag classes)

## Configuration Files

### index.html
Main HTML structure including:
- Dashboard header with action buttons
- Navigation bar with node selector and network pills
- Modal dialogs (Add Node, Setup, Settings, Manage Metrics, Share)
- System and network metric containers
- Chart sections
- Footer with last updated timestamp

### script.js
Core application logic:
- `NodeManager` class handling all functionality
- Node CRUD operations
- API communication with error handling
- Chart management and updates
- Metric visibility and ordering
- Settings persistence
- Auto-refresh scheduling

### styles.css
Custom styling:
- CSS variables for theming
- Dark mode color scheme
- Purple accent colors (#7C3AED, #8B5CF6, #A78BFA)
- Responsive layouts
- Card and metric styling
- Modal customizations
- Animation and transition effects

## Workflow

### Adding a Node
1. Click "+ Add Node" or access Setup modal on first launch
2. Enter node name, API URL, and token
3. Optional: Test connection before adding
4. Press Enter or click "Add Node"
5. Node is saved to localStorage
6. Dashboard loads with default settings

### Switching Networks
1. Select node from dropdown
2. Network pills appear showing available networks
3. Click network pill to switch
4. Data refreshes for selected network
5. Network preference saved per node

### Customizing Metrics
1. Click "Manage Metrics" button
2. Toggle system metrics, network metrics, and chart visibility
3. Changes apply immediately
4. Settings saved per node
5. Close modal when done

### Reordering Metrics
1. Click and hold on a metric card (or touch and hold on mobile)
2. Wait 200ms for drag to activate
3. Drag to desired position
4. Release to drop
5. Order saved automatically per node

### Editing a Node
1. Select node to edit
2. Click edit button (pencil icon) next to node selector
3. Edit Node modal appears with current settings
4. Modify node name, API URL, or token as needed
5. Click "Save Changes"
6. If URL or token changed, cache is automatically cleared and data reloaded

### Sharing a Node
1. Select node to share
2. Click share button (icon with arrows)
3. QR code modal appears
4. Scan QR code with mobile device OR
5. Click "Share via Device" for native share sheet OR
6. Click "Copy Link" to copy URL

### Removing a Node
1. Select node to remove
2. Click trash icon next to node selector
3. Confirm removal
4. All node-specific settings cleaned up:
   - Visible metrics removed
   - Network preferences removed
   - Days preferences removed
   - Metric order removed
   - Cached data removed

## Browser Compatibility

- Modern browsers with ES6 support required
- localStorage support required
- Optional: Navigator.share API for native sharing
- Optional: Clipboard API for copy functionality

## Dependencies

### External Libraries
- **Bootstrap 5.3.3**: UI framework
- **Chart.js**: Chart rendering
- **SortableJS 1.15.0**: Drag-and-drop functionality
- **QRious 4.0.2**: QR code generation
- **Font Awesome 6.5.1**: Icons

### Fonts
- **Inter**: Primary UI font
- **Rubik**: Alternative font
- **Play**: Monospace/technical font

## Performance Considerations

### Auto-Refresh
- System data: Default 30 seconds (configurable 15s-2min)
- Network data: Default 5 minutes (configurable 1min-15min)
- Separate intervals for different data types
- Automatic refresh pause when offline

### Caching
- Network API responses cached in localStorage
- Cache invalidated based on refresh intervals
- Reduces unnecessary API calls
- Improves perceived performance

### Optimization
- Conditional data loading
- Lazy chart rendering
- Debounced drag operations
- Efficient DOM updates
- Minimal re-renders on settings changes

## Security Notes

- API tokens stored in browser localStorage (unencrypted)
- No server-side storage - all data client-side
- Share URLs contain full token - use with caution
- HTTPS recommended for production deployments
- No sensitive data transmitted except to configured node APIs

## Future Enhancement Ideas

- Export/import node configurations
- Multi-node dashboard view
- Alert/notification system
- Historical data analysis
- Comparison charts between nodes
- Dark/light theme toggle
- Custom color themes
- CSV export for charts
- Backup/restore settings
- Node grouping/tagging

## Troubleshooting

### Node Won't Connect
- Verify API URL is correct and accessible
- Check token is valid
- Ensure CORS is enabled on node API
- Check network connectivity
- Review browser console for errors

### Charts Not Updating
- Check network data refresh interval
- Verify network has data available
- Check browser console for API errors
- Ensure node is online

### Settings Not Persisting
- Check localStorage is enabled in browser
- Verify browser has storage space available
- Check for browser extensions blocking localStorage
- Try clearing cache and re-adding node

### Mobile Issues
- Ensure touch events are enabled
- Check screen size meets minimum requirements
- Try different browser if issues persist
- Verify JavaScript is enabled

## Development

### File Structure
```
/
├── index.html          # Main HTML structure
├── script.js           # Application logic
├── styles.css          # Custom styling
└── DOCUMENTATION.md    # This file
```

### Making Changes
1. Edit source files directly
2. Test in browser (no build process needed)
3. Clear browser cache if needed
4. Check browser console for errors

### Git Repository
Repository: https://github.com/hyttmi/cellframe-masternode-inspector-ui

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Support

For issues, feature requests, or contributions, please use the GitHub repository issue tracker.

---

**Last Updated**: September 30, 2025
**Version**: 2.0