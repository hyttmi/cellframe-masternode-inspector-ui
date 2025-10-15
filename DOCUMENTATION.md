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
- Node version information (current and latest)
- Plugin version information (current and latest)
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
- Click-to-copy wallet addresses and transaction hashes
- Toast notification on successful copy

### Charts and Analytics
- **Rewards Chart**: Daily rewards visualization
- **Sovereign Rewards Chart**: Sovereign network rewards (when available)
- **Signed Blocks Chart**: Daily signed blocks tracking
- **First Signed Blocks Chart**: First block signing tracking
- Configurable time ranges (7, 14, 30, 60, 90 days)
- Individual chart day selection
- Simplified tooltips showing only date and value on hover

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
- Bootstrap Toast notifications with theme colors (card header style)
- Auto-dismissing notifications (3 second delay)
- Sortable metric cards with visual feedback
- Copy icons on clickable values

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
- Custom tooltips showing only date and value (simplified display)

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

### Copy-to-Clipboard

Click-to-copy functionality for sensitive data:
- Wallet addresses (reward and sovereign)
- Transaction hashes (stake transaction)
- Uses Clipboard API (`navigator.clipboard.writeText`)
- Visual feedback with copy icon on hover
- Toast notification on successful copy
- Graceful fallback if Clipboard API unavailable

### Notification System

Bootstrap Toast notifications with theme integration:
- Background color: `#1E1E1E` (card header style)
- Text color: `#CCC2FF` (accent purple)
- Auto-dismiss after 3 seconds
- Positioned top-right corner
- No close button (auto-dismiss only)
- Success and info notification types
- Used for copy confirmations and user feedback

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
- Chart management and updates with custom tooltips
- Metric visibility and ordering
- Settings persistence
- Auto-refresh scheduling
- `copyToClipboard()` function for copy functionality
- `showNotification()` function for toast notifications

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

### Copying Wallet Addresses and Hashes
1. Locate wallet address or transaction hash metric
2. Click on the displayed value (copy icon visible on hover)
3. Data copied to clipboard automatically
4. Toast notification confirms successful copy
5. Works for:
   - Reward wallet addresses
   - Sovereign wallet addresses (when available)
   - Stake transaction hashes

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

## Change Log

### October 15, 2025 - Version 2.4.1

#### New Network Metric
- **Total Active Masternodes**: Added new network metric to display the total number of active masternodes in the network
  - Added `total_active_masternodes` to NETWORK_METRICS_CONFIG (script.js lines 154-159)
  - Metric retrieves data from root-level `total_active_masternodes` field in network API response
  - Displays formatted number with locale-specific thousand separators (e.g., "1,234")
  - Shows "N/A" if data is not available
  - Uses network-wired icon (fa-network-wired) for visual consistency
  - Added to default enabled network metrics list (script.js line 571)
  - Visible in Manage Metrics modal for all nodes

#### Files Modified
- `script.js`: Lines 154-159 (new metric config), 571 (default enabled list)
- `DOCUMENTATION.md`: Updated Change Log

### October 12, 2025 - Version 2.4.0

#### JSON Export Feature
- **Download Full Rewards Data**: Added ability to download complete rewards and sovereign rewards data as JSON files
  - Added download button to Rewards chart header with Font Awesome download icon (script.js lines 1119-1122)
  - Added download button to Sovereign Rewards chart header (script.js lines 1142-1145)
  - Buttons show loading spinner during download
  - Implemented `downloadRewardsData()` method in NodeManager class (script.js lines 1922-2019)
  - Fetches data from backend using `rewards_full` and `sovereign_rewards_full` network actions
  - Creates JSON Blob and triggers automatic download
  - Filename format: `{NodeName}-{Network}-{DataType}-{YYYY-MM-DD}.json`
  - Toast notifications for success/error states
  - 30-second timeout with proper error handling

#### Bug Fixes
- **Fixed Update Plugin Button**: Corrected `updatePlugin()` method to use proper node lookup pattern
  - Changed `this.getActiveNode()` to `this.nodes.find(n => n.id === this.activeNodeId)` (script.js line 1849)
  - Fixed "Uncaught TypeError: this.getActiveNode is not a function" error
  - Plugin update button now works correctly

#### Files Modified
- `script.js`: Lines 1119-1122 (rewards download button), 1142-1145 (sovereign download button), 1849 (updatePlugin fix), 1922-2019 (downloadRewardsData method)
- `index.html`: Line 166 (version updated to 2.4.0)
- `DOCUMENTATION.md`: Updated Change Log and version number

### October 8, 2025 - Version 2.3.2

#### Mobile UI Improvements
- **Added Navigation Spacing**: Fixed spacing between node selector, network pills, and refresh button on mobile platforms
  - Added responsive CSS for mobile screens (max-width: 768px)
  - Network pills and refresh button sections now have 0.75rem top padding when dropdown wraps to new line
  - Prevents navigation elements from appearing too close to node selector buttons on mobile
  - Improves touch usability and visual clarity on smaller screens

#### Files Modified
- `styles.css`: Lines 650-656 (added mobile media query for navigation spacing)
- `DOCUMENTATION.md`: Updated Change Log and version number

### October 7, 2025 - Version 2.3.1

#### Code Cleanup
- **Removed Deprecated sovereign_addr Reference**: Removed all references to the old `sovereign_addr` field
  - Backend now exclusively uses `sovereign_reward_wallet_address`
  - Updated all conditional checks in NETWORK_METRICS_CONFIG (script.js lines 171, 178, 187, 194, 201, 207, 210, 212)
  - Updated sovereign data detection in Manage Metrics modal (script.js line 671)
  - Updated sovereign chart display conditional (script.js line 2071)
  - Cleaner, more consistent codebase with single field name

#### Files Modified
- `script.js`: Lines 171, 178, 187, 194, 201, 207, 210, 212, 671, 2071 (removed sovereign_addr references)
- `DOCUMENTATION.md`: Updated Change Log and version number

### October 7, 2025 - Version 2.3.0

#### Plugin Update Feature
- **One-Click Plugin Update**: Added ability to update the Cellframe Inspector plugin directly from the UI
  - Added "Update Now" button to plugin update notification banner (index.html line 99-101)
  - Button triggers `updatePlugin()` method when clicked
  - Implemented `updatePlugin()` method in NodeManager class (script.js lines 1838-1910)
  - Makes API call to `?action=update_plugin` endpoint
  - Shows loading state with spinner while update is in progress
  - Displays success/error messages via toast notifications
  - Automatically hides update banner on successful update initiation
  - Informs user that node will restart after update
  - 30-second timeout with proper error handling

#### Enhanced Notification System
- **Error Notifications**: Extended `showNotification()` function to support error notifications (script.js lines 3125-3179)
  - Added 'error' type with red background (#DC3545) and white text
  - Uses exclamation-circle icon for error notifications
  - Maintains existing 'success' and 'info' notification styling
  - Provides clear visual distinction between notification types

#### Files Modified
- `index.html`: Lines 99-101 (added Update Now button)
- `script.js`: Lines 1838-1910 (updatePlugin method), 3125-3179 (enhanced showNotification)
- `DOCUMENTATION.md`: Updated Change Log and version number

### October 6, 2025 - Version 2.2.0

#### Added Plugin Update Notification
- **Plugin Update Alert**: Added persistent notification banner to inform users when a plugin update is available
  - Added notification banner in HTML (index.html lines 94-101) - displays below navigation bar
  - Banner shows when `plugin_update_available` field is true in API response
  - Uses Bootstrap alert-warning styling with yellow background
  - Includes dismissible close button
  - Auto-hides when no update is available
  - Updated `updateSystemInfo()` method (script.js lines 2065-2073) to check and show/hide notification
  - Notification is checked every time system data is refreshed

#### Added GitHub Link in Footer
- **GitHub Link**: Added GitHub repository link and version number to footer
  - Added second row in footer (index.html lines 157-164) below last updated info
  - Includes GitHub icon and "View on GitHub" link
  - Shows current version number (v2.2.0)
  - Opens in new tab with proper security attributes (noopener noreferrer)
  - Styled with purple accent color (#A78BFA) to match theme

#### Files Modified
- `index.html`: Lines 94-101 (notification banner), 157-164 (GitHub footer link)
- `script.js`: Lines 2065-2073 (notification logic)
- `DOCUMENTATION.md`: Updated Change Log

### October 5, 2025 - Version 2.1.9

#### Added README.md
- **Created Comprehensive README**: Added professional README.md with complete project information
  - Project overview and feature highlights
  - Quick start guide and installation instructions
  - Usage examples and configuration details
  - Technology stack and file structure
  - Contributing guidelines and support information
  - License and acknowledgments
  - Includes badges for license and version

#### Files Modified
- `README.md`: New file created
- `DOCUMENTATION.md`: Updated Change Log

### October 5, 2025 - Version 2.1.8

#### Added Sovereign Biggest and Smallest Reward Metrics
- **Added Missing Sovereign Metrics**: Added sovereign wallet biggest and smallest reward metrics
  - Added `sovereign_wallet_biggest_reward` metric (script.js lines 189-195)
  - Added `sovereign_wallet_smallest_reward` metric (script.js lines 196-202)
  - Both metrics display amount and token ticker (e.g., "185.07 CELL")
  - Show crown icon for biggest reward and arrow-down icon for smallest reward
  - Conditional display based on sovereign wallet presence
  - Added to default enabled metrics list (script.js lines 560-561)
  - Available in Manage Metrics modal for all sovereign nodes

#### Files Modified
- `script.js`: Lines 189-202 (new metrics), 560-561 (default enabled list)
- `claude.md`: Added sovereign node test credentials, added note about adding metrics to Manage Metrics modal
- `DOCUMENTATION.md`: Updated Change Log

### October 5, 2025 - Version 2.1.7

#### Favicon Added
- **Added Favicon**: Added a purple-themed SVG favicon matching the application's color scheme
  - Created SVG favicon with gradient using project colors (#7C3AED and #A78BFA)
  - Features a node network icon (main node connected to two sub-nodes)
  - Implemented as data URI for simplified deployment (no additional files)
  - Vector-based design ensures crisp display at all sizes

#### Files Modified
- `index.html`: Line 7 (added favicon link)
- `DOCUMENTATION.md`: Updated Change Log

### October 4, 2025 - Version 2.1.6

#### Node Selector Sorting
- **Added Alphabetical Sorting**: Nodes in the dropdown selector are now sorted alphabetically by name
  - Updated node selector population (script.js lines 1059-1069) to sort nodes before rendering
  - Uses `localeCompare` for proper alphabetical sorting
  - Improves usability when managing multiple nodes

#### Fixed Metrics Toggle Persistence
- **Fixed Unchecked Metrics Re-appearing**: Removed auto-merge logic that was re-enabling unchecked metrics
  - Updated `getVisibleMetricsForNode()` (script.js lines 491-504) to respect user preferences
  - Removed automatic merging of new default metrics with saved preferences
  - When users uncheck metrics, they now stay unchecked when reopening the modal
  - New metrics added to the app will be off by default for existing users (can be manually enabled)

#### Manage Metrics Modal Fix
- **Show All Metrics in Modal**: Manage Metrics modal now displays all available metrics, including conditional ones
  - Removed conditional filtering from modal (script.js lines 677-683)
  - Sovereign metrics now always appear in the Manage Metrics modal
  - Users can toggle any metric on/off, even if it's not currently applicable
  - The actual page display still respects conditional logic (metrics only show when data is available)

#### Files Modified
- `script.js`: Lines 1059-1069 (node sorting), 491-504 (metrics toggle fix), 677-683 (modal fix)
- `DOCUMENTATION.md`: Updated Change Log

### October 4, 2025 - Version 2.1.5

#### Stake Value Unit Display Fix
- **Fixed Stake Value Units**: Updated effective_value and stake_value metrics to display in milli-token units (e.g., mCELL)
  - Updated `effective_value` formatter (script.js line 32) to prefix "m" before native_ticker
  - Updated `stake_value` formatter (script.js line 139) to prefix "m" before native_ticker
  - Now displays "101.20 mCELL" instead of "101.20 CELL"
  - Applies to all networks consistently

#### Added Sovereign Rewards Metrics
- **Added Sovereign Rewards Today and Yesterday**: New metrics showing sovereign rewards received
  - Added `sovereign_rewards_received_today` metric (script.js lines 166-172)
  - Added `sovereign_rewards_received_yesterday` metric (script.js lines 173-179) - renamed from `sovereign_rewards_yesterday`
  - Both metrics use consistent naming with regular rewards ("Received Today/Yesterday")
  - Displays amount and native ticker (e.g., "126.63 CELL")
  - Enabled by default for nodes with sovereign data

#### Files Modified
- `script.js`: Lines 32, 139 (stake value unit formatters), 166-179 (sovereign rewards metrics), 541-542 (default metrics)
- `DOCUMENTATION.md`: Updated Change Log

### October 4, 2025 - Version 2.1.4

#### Sovereign Node Support Fix
- **Fixed Sovereign Metrics Display**: Updated conditional checks to support both `sovereign_addr` and `sovereign_reward_wallet_address` fields
  - Some nodes return `sovereign_addr` instead of `sovereign_reward_wallet_address`
  - Updated NETWORK_METRICS_CONFIG sovereign metrics (script.js lines 166-192) to check for both fields
  - Updated sovereign chart conditional check (script.js lines 645, 1968) to check for both fields
  - Sovereign metrics and charts now display correctly for all sovereign node types

- **Added Latest Sovereign Reward Metric**: New metric showing the most recent sovereign reward received
  - Added `sovereign_wallet_latest_reward` metric (script.js lines 173-181)
  - Displays amount and token from latest sovereign reward transaction
  - Shows "N/A" if no reward data available
  - Enabled by default for nodes with sovereign data

- **Fixed Manage Metrics Modal**: Fixed bug where sovereign metrics weren't showing in the Manage Metrics modal
  - Changed `getCachedNetworkData` to `getStoredNetworkData` (script.js lines 644, 654)
  - Function name was incorrect, causing undefined return and filtering out sovereign metrics
  - Sovereign metrics now correctly appear in Manage Metrics modal when sovereign data is available

#### Files Modified
- `script.js`: Lines 171, 177, 180, 182 (sovereign metrics), 173-181 (latest sovereign reward), 535 (default metrics), 644, 645, 654 (Manage Metrics fix), 1968 (sovereign chart check)
- `DOCUMENTATION.md`: Updated Change Log

### October 4, 2025 - Version 2.1.3

#### Chart Data Filtering - Server-Side Date Synchronization
- **Exclude Current Date from Charts**: Charts now exclude data from the current date and only show historical data from previous days. This prevents incomplete or in-progress data from being displayed in the charts.
  - Added `getServerDateFromTimestamp()` helper method (script.js lines 1859-1863) to extract server date from API `request_timestamp`
  - Updated `fetchNetworkData()` (script.js lines 1793-1798) to include `request_timestamp` in returned network data
  - Updated `filterDataByDays()` method (script.js lines 1865-1884) to accept optional `serverDate` parameter and use server's date for filtering instead of browser's timezone
  - Updated `updateChart()` method (script.js lines 2430-2465) to accept and use server date
  - Updated `updateCharts()` method (script.js lines 1912-1933, 1987-1988, 1943, 1952, 1961, 1991) to extract server date from `request_timestamp` and pass it to all filtering functions
  - **Fixed critical timezone synchronization**: Frontend now uses server's date from `request_timestamp` instead of browser's local timezone, ensuring perfect synchronization between backend and frontend regardless of user's timezone
  - Both array and object format data are now filtered to exclude the current date based on server time
  - Fallback to browser local timezone if `request_timestamp` is not available (backward compatibility)

#### Files Modified
- `script.js`: Lines 1859-1863 (getServerDateFromTimestamp), 1793-1798 (fetchNetworkData), 1865-1884 (filterDataByDays), 1912-1933 (updateCharts), 1943, 1952, 1961, 1991 (updateChart calls), 2430-2465 (updateChart)
- `DOCUMENTATION.md`: Updated Change Log

### October 2, 2025 - Version 2.1.2

#### Removed Features
- **Removed Validator Average Fee Metric**: Removed `validator_average_fee` metric from the frontend as it was removed from the backend API. This metric is no longer available in the Manage Metrics modal or network performance section.
  - Removed from `NETWORK_METRICS_CONFIG` (script.js lines 165-170)
  - Removed from `getAllNetworkMetricIds()` array (script.js line 531)

#### Files Modified
- `script.js`: Lines 165-170 (removed), 531 (removed from array)
- `DOCUMENTATION.md`: Updated Change Log

### October 2, 2025 - Version 2.1.1

#### Bug Fixes
- **Fixed Edit Node Save Button**: Corrected the `editNode()` method in script.js (line 836) - changed `this.loadData()` to `this.loadNodeData(this.activeNodeId)`. This fixes the issue where users had to click "Save Changes" twice for the changes to take effect.

#### Enhancements
- **All Metrics Enabled by Default**: Added missing staking metrics to the default enabled list in `getAllNetworkMetricIds()` method (script.js lines 510-539):
  - `effective_value` - Effective Stake Value
  - `relative_weight` - Relative Weight percentage
  - `stake_value` - Stake Value
  - `tx_hash` - Stake Transaction Hash

  Previously these metrics were available but disabled by default for new nodes. Now all metrics are enabled by default.

#### Files Modified
- `script.js`: Lines 516, 523, 533, 536, 836
- `claude.md`: Added development guidelines section
- `DOCUMENTATION.md`: Added this Change Log section

---

**Last Updated**: October 15, 2025
**Version**: 2.4.1