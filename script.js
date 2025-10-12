// Network metrics configuration - single source of truth for all metrics
const NETWORK_METRICS_CONFIG = {
    autocollect_status: {
        label: 'Autocollect Status',
        title: 'AUTOCOLLECT STATUS',
        icon: 'fa-robot',
        formatter: (data) => data.autocollect_status?.active ? 'Active' : 'Inactive'
    },
    biggest_reward: {
        label: 'Biggest Reward',
        title: 'BIGGEST REWARD',
        icon: 'fa-crown',
        formatter: (data) => `${(parseFloat(data.reward_wallet_biggest_reward?.recv_coins) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`
    },
    blocks_today_in_network: {
        label: 'Blocks Today in Network',
        title: 'BLOCKS TODAY IN NETWORK',
        icon: 'fa-cubes',
        formatter: (data) => data.block_count_today || 0
    },
    current_block_reward: {
        label: 'Current Block Reward',
        title: 'CURRENT BLOCK REWARD',
        icon: 'fa-gift',
        formatter: (data) => `${(parseFloat(data.current_block_reward) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`
    },
    effective_value: {
        label: 'Effective Stake Value',
        title: 'EFFECTIVE STAKE VALUE',
        icon: 'fa-scale-balanced',
        formatter: (data) => data.effective_value ?
            `${(parseFloat(data.effective_value) || 0).toFixed(2)} m${data.native_ticker || 'TOKEN'}` :
            'N/A'
    },
    first_signed_blocks_today: {
        label: 'First Signed Blocks Today',
        title: 'FIRST SIGNED BLOCKS TODAY',
        icon: 'fa-trophy',
        formatter: (data) => data.first_signed_blocks_today_amount || 0
    },
    first_signed_blocks_yesterday: {
        label: 'First Signed Blocks Yesterday',
        title: 'FIRST SIGNED BLOCKS YESTERDAY',
        icon: 'fa-trophy',
        formatter: (data) => data.first_signed_blocks_yesterday_amount || 0
    },
    latest_reward: {
        label: 'Latest Reward',
        title: 'LATEST REWARD',
        icon: 'fa-clock-rotate-left',
        formatter: (data, manager) => data.reward_wallet_latest_reward ?
            `${(parseFloat(data.reward_wallet_latest_reward.recv_coins) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'} (${manager.formatSmartDateTime(data.reward_wallet_latest_reward.tx_created)})` :
            'N/A'
    },
    network_state: {
        label: 'Network State',
        title: 'NETWORK STATE',
        icon: null, // Dynamic
        formatter: (data) => {
            // This needs special handling for status class and icon
            return null; // Handled specially in display
        },
        special: 'network_state'
    },
    network_status: {
        label: 'Network Status',
        title: 'NETWORK STATUS',
        icon: 'fa-network-wired',
        formatter: (data) => data.network_status?.synced ? 'Synced' : 'Not Synced'
    },
    node_address: {
        label: 'Node Address',
        title: 'NODE ADDRESS',
        icon: 'fa-fingerprint',
        formatter: (data) => data.network_status?.node_address ?
            (data.network_status.node_address.length > 30 ?
                data.network_status.node_address.substring(0, 30) + '...' :
                data.network_status.node_address) : 'N/A'
    },
    relative_weight: {
        label: 'Relative Weight',
        title: 'RELATIVE WEIGHT',
        icon: 'fa-percent',
        formatter: (data) => data.relative_weight ?
            `${(parseFloat(data.relative_weight) || 0).toFixed(6)}%` :
            'N/A'
    },
    remote_cache_updated: {
        label: 'Remote Cache Updated',
        title: 'REMOTE CACHE UPDATED',
        icon: 'fa-database',
        formatter: (data, manager) => data.cache_last_updated ? manager.formatLocaleDateTime(data.cache_last_updated) : 'N/A'
    },
    reward_wallet: {
        label: 'Reward Wallet',
        title: 'REWARD WALLET',
        icon: 'fa-wallet',
        formatter: (data, manager) => manager.formatWalletAddress(data.reward_wallet_address),
        isWallet: true,
        walletType: 'reward',
        getFullAddress: (data) => data.reward_wallet_address,
        getBalances: (data) => data.reward_wallet_balance
    },
    rewards_received_today: {
        label: 'Rewards Received Today',
        title: 'REWARDS RECEIVED TODAY',
        icon: 'fa-coins',
        formatter: (data) => `${(parseFloat(data.reward_wallet_today_rewards) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`
    },
    rewards_received_yesterday: {
        label: 'Rewards Received Yesterday',
        title: 'REWARDS RECEIVED YESTERDAY',
        icon: 'fa-coins',
        formatter: (data) => `${(parseFloat(data.reward_wallet_yesterday_rewards) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`
    },
    signed_blocks_today: {
        label: 'Signed Blocks Today',
        title: 'SIGNED BLOCKS TODAY',
        icon: 'fa-cube',
        formatter: (data) => data.signed_blocks_today_amount || 0
    },
    signed_blocks_yesterday: {
        label: 'Signed Blocks Yesterday',
        title: 'SIGNED BLOCKS YESTERDAY',
        icon: 'fa-cube',
        formatter: (data) => data.signed_blocks_yesterday_amount || 0
    },
    smallest_reward: {
        label: 'Smallest Reward',
        title: 'SMALLEST REWARD',
        icon: 'fa-arrow-down',
        formatter: (data) => `${(parseFloat(data.reward_wallet_smallest_reward?.recv_coins) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`
    },
    stake_value: {
        label: 'Stake Value',
        title: 'STAKE VALUE',
        icon: 'fa-coins',
        formatter: (data) => data.stake_value ?
            `${(parseFloat(data.stake_value) || 0).toFixed(2)} m${data.native_ticker || 'TOKEN'}` :
            'N/A'
    },
    token_price: {
        label: 'Token Price',
        title: 'TOKEN PRICE',
        icon: 'fa-chart-line',
        formatter: (data) => `$${data.token_price || 0}`
    },
    total_blocks_in_network: {
        label: 'Total Blocks in Network',
        title: 'TOTAL BLOCKS IN NETWORK',
        icon: 'fa-layer-group',
        formatter: (data) => (data.block_count || 0).toLocaleString()
    },
    tx_hash: {
        label: 'Stake Transaction Hash',
        title: 'STAKE TRANSACTION HASH',
        icon: 'fa-hashtag',
        formatter: (data) => data.tx_hash ?
            (data.tx_hash.length > 16 ?
                data.tx_hash.substring(0, 8) + '...' + data.tx_hash.substring(data.tx_hash.length - 8) :
                data.tx_hash) : 'N/A',
        hasHover: true,
        getFullValue: (data) => data.tx_hash || null
    },
    // Sovereign metrics (conditionally added)
    sovereign_rewards_received_today: {
        label: 'Sovereign Rewards Received Today',
        title: 'SOVEREIGN REWARDS RECEIVED TODAY',
        icon: 'fa-shield-halved',
        formatter: (data) => `${(parseFloat(data.sovereign_wallet_today_rewards) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`,
        conditional: (data) => data.sovereign_reward_wallet_address
    },
    sovereign_rewards_received_yesterday: {
        label: 'Sovereign Rewards Received Yesterday',
        title: 'SOVEREIGN REWARDS RECEIVED YESTERDAY',
        icon: 'fa-shield-halved',
        formatter: (data) => `${(parseFloat(data.sovereign_wallet_yesterday_rewards) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`,
        conditional: (data) => data.sovereign_reward_wallet_address
    },
    sovereign_wallet_latest_reward: {
        label: 'Latest Sovereign Reward',
        title: 'LATEST SOVEREIGN REWARD',
        icon: 'fa-shield-halved',
        formatter: (data) => data.sovereign_wallet_latest_reward?.recv_coins ?
            `${parseFloat(data.sovereign_wallet_latest_reward.recv_coins).toFixed(2)} ${data.sovereign_wallet_latest_reward.token || data.native_ticker || 'TOKEN'}` :
            'N/A',
        conditional: (data) => data.sovereign_reward_wallet_address
    },
    sovereign_wallet_biggest_reward: {
        label: 'Biggest Sovereign Reward',
        title: 'BIGGEST SOVEREIGN REWARD',
        icon: 'fa-crown',
        formatter: (data) => `${(parseFloat(data.sovereign_wallet_biggest_reward?.recv_coins) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`,
        conditional: (data) => data.sovereign_reward_wallet_address
    },
    sovereign_wallet_smallest_reward: {
        label: 'Smallest Sovereign Reward',
        title: 'SMALLEST SOVEREIGN REWARD',
        icon: 'fa-arrow-down',
        formatter: (data) => `${(parseFloat(data.sovereign_wallet_smallest_reward?.recv_coins) || 0).toFixed(2)} ${data.native_ticker || 'TOKEN'}`,
        conditional: (data) => data.sovereign_reward_wallet_address
    },
    sovereign_wallet: {
        label: 'Sovereign Wallet',
        title: 'SOVEREIGN WALLET',
        icon: 'fa-shield-halved',
        formatter: (data, manager) => manager.formatWalletAddress(data.sovereign_reward_wallet_address),
        isWallet: true,
        walletType: 'sovereign',
        getFullAddress: (data) => data.sovereign_reward_wallet_address,
        getBalances: (data) => data.sovereign_wallet_balance,
        conditional: (data) => data.sovereign_reward_wallet_address
    }
};

// System metrics configuration - single source of truth for all system metrics
const SYSTEM_METRICS_CONFIG = {
    cpu_usage: {
        label: 'CPU Usage',
        title: 'CPU USAGE',
        icon: 'fa-microchip',
        formatter: (data) => `${(data.node_cpu_usage || 0).toFixed(1)}%`
    },
    current_plugin_version: {
        label: 'Current Plugin Version',
        title: 'CURRENT PLUGIN VERSION',
        icon: 'fa-puzzle-piece',
        formatter: (data) => data.current_plugin_version || 'N/A',
        hasVersionCheck: true,
        compareWith: 'latest_plugin_version'
    },
    current_version: {
        label: 'Current Node Version',
        title: 'CURRENT NODE VERSION',
        icon: 'fa-code-branch',
        formatter: (data) => data.current_node_version || 'N/A',
        hasVersionCheck: true,
        compareWith: 'latest_node_version'
    },
    external_ip: {
        label: 'External IP',
        title: 'EXTERNAL IP',
        icon: 'fa-globe',
        formatter: (data) => data.external_ip || 'N/A'
    },
    hostname: {
        label: 'Hostname',
        title: 'HOSTNAME',
        icon: 'fa-desktop',
        formatter: (data) => data.hostname || 'Unknown'
    },
    latest_plugin_version: {
        label: 'Latest Plugin Version',
        title: 'LATEST PLUGIN VERSION',
        icon: 'fa-puzzle-piece',
        formatter: (data) => data.latest_plugin_version || 'N/A'
    },
    latest_version: {
        label: 'Latest Node Version',
        title: 'LATEST NODE VERSION',
        icon: 'fa-download',
        formatter: (data) => data.latest_node_version || 'N/A'
    },
    memory_usage: {
        label: 'Memory Usage',
        title: 'MEMORY USAGE',
        icon: 'fa-memory',
        formatter: (data) => `${(data.node_memory_usage || 0).toFixed(2)} MB`
    },
    node_status: {
        label: 'Node Status',
        title: 'NODE STATUS',
        icon: null, // Dynamic
        formatter: (data) => null, // Handled specially
        special: 'node_status'
    },
    node_uptime: {
        label: 'Node Uptime',
        title: 'NODE UPTIME',
        icon: 'fa-clock',
        formatter: (data, manager) => manager.formatUptime(data.node_uptime || 0)
    },
    system_uptime: {
        label: 'System Uptime',
        title: 'SYSTEM UPTIME',
        icon: 'fa-server',
        formatter: (data, manager) => manager.formatUptime(data.system_uptime || 0)
    }
};

class NodeManager {
    constructor() {
        this.nodes = this.loadNodes();
        this.activeNodeId = this.loadActiveNode();
        this.charts = {};
        this.systemRefreshInterval = null;
        this.networkRefreshInterval = null;
        this.networkPreferences = this.loadNetworkPreferences();
        this.daysPreferences = this.loadDaysPreferences();
        this.availableNetworks = {};
        this.cachedNetworkData = {}; // Cache for network data
        this.cachedSystemData = {}; // Cache for system data
        this.lastUpdateTimestamps = {}; // Track when data was last updated
        this.lastNetworkUpdate = {}; // Track when network data was last updated
        this.refreshSettings = this.loadRefreshSettings();
        this.visibleMetrics = this.loadVisibleMetrics();
        this.init();
    }

    init() {
        // Check for URL parameters first
        const urlParams = this.getUrlParameters();
        if (urlParams.url && urlParams.token) {
            this.handleUrlParameters(urlParams);
            return;
        }

        if (this.nodes.length === 0) {
            this.showSetupModal();
        } else {
            this.renderNodeTabs();
            this.loadNodeData(this.activeNodeId || this.nodes[0].id);
            this.startAutoRefresh();
        }
    }

    getUrlParameters() {
        const params = new URLSearchParams(window.location.search);
        return {
            url: params.get('url'),
            token: params.get('token'),
            name: params.get('name') || 'URL Node'
        };
    }

    async handleUrlParameters(params) {
        // Check if node with same URL already exists
        const existingNode = this.nodes.find(n => n.url === params.url);

        if (existingNode) {
            // Update token if different and load existing node
            if (existingNode.token !== params.token) {
                existingNode.token = params.token;
                this.saveNodes();
            }
            this.saveActiveNode(existingNode.id);
            this.renderNodeTabs();
            this.loadNodeData(existingNode.id);
            this.startAutoRefresh();
            // Clean URL after loading
            this.cleanUrl();
            return;
        }

        // Test connection before adding
        try {
            const testNode = { url: params.url, token: params.token };
            await this.fetchNodeData(testNode, 'all');

            // Connection successful, add the node
            const newNode = {
                id: `node_${Date.now()}`,
                name: params.name,
                url: params.url,
                token: params.token
            };

            this.nodes.push(newNode);
            this.saveNodes();
            this.saveActiveNode(newNode.id);
            this.renderNodeTabs();
            this.loadNodeData(newNode.id);
            this.startAutoRefresh();

            // Clean URL after loading
            this.cleanUrl();
        } catch (error) {
            console.error('Failed to connect to node from URL:', error);
            alert(`Failed to connect to node: ${error.message}\n\nPlease check the URL and token parameters.`);

            // Show setup modal if no other nodes exist
            if (this.nodes.length === 0) {
                this.showSetupModal();
            } else {
                this.renderNodeTabs();
                this.loadNodeData(this.activeNodeId || this.nodes[0].id);
                this.startAutoRefresh();
            }

            // Clean URL even on failure
            this.cleanUrl();
        }
    }

    cleanUrl() {
        // Remove URL parameters without reloading the page
        const url = new URL(window.location);
        url.search = '';
        window.history.replaceState({}, document.title, url);
    }

    loadNodes() {
        const stored = localStorage.getItem('cfminspector_nodes');
        return stored ? JSON.parse(stored) : [];
    }

    saveNodes() {
        localStorage.setItem('cfminspector_nodes', JSON.stringify(this.nodes));
    }

    loadActiveNode() {
        return localStorage.getItem('cfminspector_active_node');
    }

    saveActiveNode(nodeId) {
        this.activeNodeId = nodeId;
        localStorage.setItem('cfminspector_active_node', nodeId);
    }

    loadNetworkPreferences() {
        const stored = localStorage.getItem('cfminspector_network_preferences');
        return stored ? JSON.parse(stored) : {};
    }

    saveNetworkPreferences() {
        localStorage.setItem('cfminspector_network_preferences', JSON.stringify(this.networkPreferences));
    }

    getSelectedNetwork(nodeId) {
        // If no preference stored, return the first available network
        if (!this.networkPreferences[nodeId] && this.availableNetworks[nodeId]) {
            const networks = this.availableNetworks[nodeId];
            if (networks && networks.length > 0) {
                // Auto-select the first network and save it
                this.setSelectedNetwork(nodeId, networks[0]);
                return networks[0];
            }
        }
        return this.networkPreferences[nodeId] || null;
    }

    setSelectedNetwork(nodeId, network) {
        this.networkPreferences[nodeId] = network;
        this.saveNetworkPreferences();
    }

    loadDaysPreferences() {
        const stored = localStorage.getItem('cfminspector_days_preferences');
        return stored ? JSON.parse(stored) : {};
    }

    saveDaysPreferences() {
        localStorage.setItem('cfminspector_days_preferences', JSON.stringify(this.daysPreferences));
    }

    getSelectedDays(nodeId, chartType = 'rewards') {
        // Support both old format (number) and new format (object)
        const prefs = this.daysPreferences[nodeId];
        if (typeof prefs === 'number') {
            return prefs; // Backward compatibility
        } else if (typeof prefs === 'object' && prefs) {
            return prefs[chartType] || 30; // Default to 30 days
        }
        return 30; // Default to 30 days
    }

    setSelectedDays(nodeId, days, chartType = 'rewards') {
        // Initialize as object if not exists or is number (for backward compatibility)
        if (!this.daysPreferences[nodeId] || typeof this.daysPreferences[nodeId] === 'number') {
            const oldDays = this.daysPreferences[nodeId] || 30;
            this.daysPreferences[nodeId] = {
                rewards: oldDays,
                blocks: oldDays,
                'first-blocks': oldDays,
                sovereign: oldDays
            };
        }

        this.daysPreferences[nodeId][chartType] = days;
        this.saveDaysPreferences();
    }

    loadRefreshSettings() {
        const stored = localStorage.getItem('cfminspector_refresh_settings');
        const defaults = {
            systemInterval: 30,    // 30 seconds
            networkInterval: 300   // 5 minutes
        };
        return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
    }

    saveRefreshSettings() {
        localStorage.setItem('cfminspector_refresh_settings', JSON.stringify(this.refreshSettings));
    }

    loadVisibleMetrics() {
        const stored = localStorage.getItem('cfminspector_visible_metrics');
        return stored ? JSON.parse(stored) : {};
    }

    saveVisibleMetrics() {
        localStorage.setItem('cfminspector_visible_metrics', JSON.stringify(this.visibleMetrics));
    }

    getVisibleMetricsForNode(nodeId) {
        if (!this.visibleMetrics[nodeId]) {
            // Default: all metrics visible for this node (first time only)
            this.visibleMetrics[nodeId] = {
                system: this.getAllSystemMetricIds(),
                network: this.getAllNetworkMetricIds(),
                sections: this.getAllSectionIds()
            };
            this.saveVisibleMetrics();
        }
        // Return saved preferences without auto-merging new defaults
        // This respects user choices (unchecked metrics stay unchecked)
        return this.visibleMetrics[nodeId];
    }

    getAllSystemMetricIds() {
        return [
            'cpu_usage',
            'current_plugin_version',
            'current_version',
            'external_ip',
            'hostname',
            'latest_plugin_version',
            'latest_version',
            'memory_usage',
            'node_status',
            'node_uptime',
            'system_uptime'
        ];
    }

    getAllNetworkMetricIds() {
        return [
            'autocollect_status',
            'biggest_reward',
            'blocks_today_in_network',
            'current_block_reward',
            'effective_value',
            'first_signed_blocks_today',
            'first_signed_blocks_yesterday',
            'latest_reward',
            'network_state',
            'network_status',
            'node_address',
            'relative_weight',
            'remote_cache_updated',
            'reward_wallet',
            'rewards_received_today',
            'rewards_received_yesterday',
            'signed_blocks_today',
            'signed_blocks_yesterday',
            'smallest_reward',
            'sovereign_rewards_received_today',
            'sovereign_rewards_received_yesterday',
            'sovereign_wallet_latest_reward',
            'sovereign_wallet_biggest_reward',
            'sovereign_wallet_smallest_reward',
            'sovereign_wallet',
            'stake_value',
            'token_price',
            'total_blocks_in_network',
            'tx_hash'
        ];
    }

    getAllSectionIds() {
        return [
            'rewards_chart',
            'sovereign_rewards_chart',
            'signed_blocks_chart',
            'first_signed_blocks_chart'
        ];
    }

    isMetricVisible(metricId, type, nodeId = null) {
        const targetNodeId = nodeId || this.activeNodeId;
        if (!targetNodeId) return true; // Default to visible if no node
        const nodeMetrics = this.getVisibleMetricsForNode(targetNodeId);
        return nodeMetrics[type]?.includes(metricId) || false;
    }

    toggleMetricVisibility(metricId, type) {
        if (!this.activeNodeId) return;

        const nodeMetrics = this.getVisibleMetricsForNode(this.activeNodeId);

        if (!nodeMetrics[type]) {
            nodeMetrics[type] = [];
        }

        const index = nodeMetrics[type].indexOf(metricId);
        if (index > -1) {
            // Remove from visible
            nodeMetrics[type].splice(index, 1);
        } else {
            // Add to visible
            nodeMetrics[type].push(metricId);
        }

        this.saveVisibleMetrics();

        // Refresh the appropriate section
        if (type === 'system') {
            this.refreshSystemData(this.activeNodeId);
        } else if (type === 'network') {
            this.refreshNetworkData(this.activeNodeId);
        } else if (type === 'sections') {
            this.refreshNetworkData(this.activeNodeId);
        }
    }

    selectAllMetrics(type, select) {
        if (!this.activeNodeId) return;

        const nodeMetrics = this.getVisibleMetricsForNode(this.activeNodeId);

        if (select) {
            // Select all
            if (type === 'system') {
                nodeMetrics.system = this.getAllSystemMetricIds();
            } else if (type === 'network') {
                nodeMetrics.network = this.getAllNetworkMetricIds();
            } else if (type === 'sections') {
                nodeMetrics.sections = this.getAllSectionIds();
            }
        } else {
            // Deselect all
            nodeMetrics[type] = [];
        }

        this.saveVisibleMetrics();
        this.populateManageMetricsModal();

        // Refresh the appropriate section
        if (type === 'system') {
            this.refreshSystemData(this.activeNodeId);
        } else if (type === 'network') {
            this.refreshNetworkData(this.activeNodeId);
        } else if (type === 'sections') {
            this.refreshNetworkData(this.activeNodeId);
        }
    }

    showManageMetricsModal() {
        this.populateManageMetricsModal();
        const modal = new bootstrap.Modal(document.getElementById('manageMetricsModal'));
        modal.show();
    }

    populateManageMetricsModal() {
        const systemMetricsList = document.getElementById('systemMetricsList');
        const networkMetricsList = document.getElementById('networkMetricsList');
        const sectionsList = document.getElementById('sectionsList');

        // Build system metrics from config
        const systemMetrics = Object.entries(SYSTEM_METRICS_CONFIG)
            .map(([id, config]) => ({
                id: id,
                label: config.label
            }));

        // Check if current network has sovereign data
        const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
        let hasSovereignData = false;
        if (activeNode && this.selectedNetwork) {
            const cachedData = this.getStoredNetworkData(activeNode.id, this.selectedNetwork);
            hasSovereignData = cachedData?.sovereign_reward_wallet_address && cachedData?.sovereign_wallet_all_sums_daily;
        }

        // Build network metrics from config - show ALL metrics in modal
        // The actual display is still controlled by conditionals, but users should see all options
        const networkMetrics = Object.entries(NETWORK_METRICS_CONFIG)
            .map(([id, config]) => ({
                id: id,
                label: config.label
            }));

        // Chart and section visibility options
        const sections = [
            { id: 'rewards_chart', label: 'Rewards Chart' },
            { id: 'signed_blocks_chart', label: 'Signed Blocks Chart' },
            { id: 'first_signed_blocks_chart', label: 'First Signed Blocks Chart' }
        ];

        // Only add sovereign chart if data is available
        if (hasSovereignData) {
            sections.splice(1, 0, { id: 'sovereign_rewards_chart', label: 'Sovereign Rewards Chart' });
        }

        systemMetricsList.innerHTML = systemMetrics.map(metric => {
            const isVisible = this.isMetricVisible(metric.id, 'system');
            return `
                <div class="col-md-6 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                               id="system_${metric.id}"
                               ${isVisible ? 'checked' : ''}
                               onchange="nodeManager.toggleMetricVisibility('${metric.id}', 'system')">
                        <label class="form-check-label" for="system_${metric.id}">
                            ${metric.label}
                        </label>
                    </div>
                </div>
            `;
        }).join('');

        networkMetricsList.innerHTML = networkMetrics.map(metric => {
            const isVisible = this.isMetricVisible(metric.id, 'network');
            return `
                <div class="col-md-6 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                               id="network_${metric.id}"
                               ${isVisible ? 'checked' : ''}
                               onchange="nodeManager.toggleMetricVisibility('${metric.id}', 'network')">
                        <label class="form-check-label" for="network_${metric.id}">
                            ${metric.label}
                        </label>
                    </div>
                </div>
            `;
        }).join('');

        sectionsList.innerHTML = sections.map(section => {
            const isVisible = this.isMetricVisible(section.id, 'sections');
            return `
                <div class="col-md-6 mb-2">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox"
                               id="section_${section.id}"
                               ${isVisible ? 'checked' : ''}
                               onchange="nodeManager.toggleMetricVisibility('${section.id}', 'sections')">
                        <label class="form-check-label" for="section_${section.id}">
                            ${section.label}
                        </label>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateRefreshSettings(systemInterval, networkInterval) {
        this.refreshSettings.systemInterval = systemInterval;
        this.refreshSettings.networkInterval = networkInterval;
        this.saveRefreshSettings();

        // Restart auto-refresh with new intervals
        this.startAutoRefresh();

        // Update footer display
        this.updateFooterRefreshInfo();
    }

    showSetupModal() {
        const modal = new bootstrap.Modal(document.getElementById('setupModal'));
        modal.show();
    }

    setupFirstNode() {
        const name = document.getElementById('setupNodeName').value;
        const url = document.getElementById('setupNodeUrl').value;
        const token = document.getElementById('setupApiToken').value;

        if (!name || !url || !token) {
            alert('Please fill in all fields');
            return;
        }

        this.addNewNode(name, url, token);
        const modal = bootstrap.Modal.getInstance(document.getElementById('setupModal'));
        modal.hide();
        this.init();
    }

    showAddNodeModal() {
        const modal = new bootstrap.Modal(document.getElementById('addNodeModal'));
        modal.show();
    }

    addNode() {
        const name = document.getElementById('nodeName').value;
        const url = document.getElementById('nodeUrl').value;
        const token = document.getElementById('apiToken').value;

        if (!name || !url || !token) {
            alert('Please fill in all fields');
            return;
        }

        this.addNewNode(name, url, token);
        const modal = bootstrap.Modal.getInstance(document.getElementById('addNodeModal'));
        modal.hide();
        document.getElementById('addNodeForm').reset();
    }

    addNewNode(name, url, token) {
        const nodeId = 'node_' + Date.now();
        const newNode = {
            id: nodeId,
            name: name,
            url: url.replace(/\/$/, ''), // Remove trailing slash
            token: token
        };

        this.nodes.push(newNode);
        this.saveNodes();
        this.renderNodeTabs();
        this.switchToNode(nodeId);
    }

    showEditNodeModal() {
        const node = this.nodes.find(n => n.id === this.activeNodeId);
        if (!node) return;

        // Populate the form with current node data
        document.getElementById('editNodeName').value = node.name;
        document.getElementById('editNodeUrl').value = node.url;
        document.getElementById('editApiToken').value = node.token;

        const modal = new bootstrap.Modal(document.getElementById('editNodeModal'));
        modal.show();
    }

    editNode() {
        const name = document.getElementById('editNodeName').value;
        const url = document.getElementById('editNodeUrl').value;
        const token = document.getElementById('editApiToken').value;

        if (!name || !url || !token) {
            alert('Please fill in all fields');
            return;
        }

        const node = this.nodes.find(n => n.id === this.activeNodeId);
        if (!node) return;

        // Check if URL or token changed (need to clear cache)
        const urlChanged = node.url !== url.replace(/\/$/, '');
        const tokenChanged = node.token !== token;

        // Update node data
        node.name = name;
        node.url = url.replace(/\/$/, ''); // Remove trailing slash
        node.token = token;

        this.saveNodes();
        this.renderNodeTabs();

        // Clear cache if URL or token changed
        if (urlChanged || tokenChanged) {
            this.clearNodeCache(this.activeNodeId);
            // Reload data with new credentials
            this.loadNodeData(this.activeNodeId);
        }

        const modal = bootstrap.Modal.getInstance(document.getElementById('editNodeModal'));
        modal.hide();
        document.getElementById('editNodeForm').reset();
    }

    clearNodeCache(nodeId) {
        // Remove all cached data for this node
        const cacheKeys = Object.keys(localStorage).filter(key =>
            key.startsWith(`cfminspector_cache_${nodeId}_`)
        );
        cacheKeys.forEach(key => localStorage.removeItem(key));
    }

    removeNode(nodeId) {
        if (confirm('Are you sure you want to remove this node?')) {
            // Clean up node-specific settings
            this.cleanupNodeSettings(nodeId);

            this.nodes = this.nodes.filter(node => node.id !== nodeId);
            this.saveNodes();

            if (this.activeNodeId === nodeId) {
                this.activeNodeId = this.nodes.length > 0 ? this.nodes[0].id : null;
                this.saveActiveNode(this.activeNodeId);
            }

            this.renderNodeTabs();
            if (this.nodes.length === 0) {
                this.showSetupModal();
            } else {
                this.loadNodeData(this.activeNodeId);
            }
        }
    }

    removeCurrentNode() {
        if (this.activeNodeId) {
            const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
            const nodeName = activeNode ? activeNode.name : 'this node';

            if (confirm(`Are you sure you want to remove "${nodeName}"?`)) {
                // Clean up node-specific settings
                this.cleanupNodeSettings(this.activeNodeId);

                // Remove node without additional confirmation
                this.nodes = this.nodes.filter(node => node.id !== this.activeNodeId);
                this.saveNodes();

                if (this.activeNodeId) {
                    this.activeNodeId = this.nodes.length > 0 ? this.nodes[0].id : null;
                    this.saveActiveNode(this.activeNodeId);
                }

                this.renderNodeTabs();
                if (this.nodes.length === 0) {
                    this.showSetupModal();
                } else {
                    this.loadNodeData(this.activeNodeId);
                }
            }
        }
    }

    cleanupNodeSettings(nodeId) {
        // Remove visible metrics for this node
        if (this.visibleMetrics[nodeId]) {
            delete this.visibleMetrics[nodeId];
            this.saveVisibleMetrics();
        }

        // Remove network preferences for this node
        if (this.networkPreferences[nodeId]) {
            delete this.networkPreferences[nodeId];
            this.saveNetworkPreferences();
        }

        // Remove days preferences for this node
        if (this.daysPreferences[nodeId]) {
            delete this.daysPreferences[nodeId];
            this.saveDaysPreferences();
        }

        // Remove metric order for this node (system and network)
        localStorage.removeItem(`cfminspector_${nodeId}_system_metric_order`);
        localStorage.removeItem(`cfminspector_${nodeId}_network_metric_order`);

        // Remove any cached data for this node
        const cacheKeys = Object.keys(localStorage).filter(key =>
            key.startsWith(`cfminspector_cache_${nodeId}_`)
        );
        cacheKeys.forEach(key => localStorage.removeItem(key));
    }

    updateRemoveButtonVisibility() {
        const removeBtn = document.getElementById('removeNodeBtn');
        const editBtn = document.getElementById('editNodeBtn');
        const shareBtn = document.getElementById('shareNodeBtn');
        const nodeSelector = document.getElementById('nodeSelector');

        if (removeBtn && editBtn && shareBtn && nodeSelector) {
            // Show buttons only if a node is selected and we have nodes
            const hasSelection = nodeSelector.value && nodeSelector.value !== '';
            const hasNodes = this.nodes.length > 0;
            const showButtons = hasSelection && hasNodes;

            editBtn.style.display = showButtons ? 'block' : 'none';
            removeBtn.style.display = showButtons ? 'block' : 'none';
            shareBtn.style.display = showButtons ? 'block' : 'none';
        }
    }

    getShareUrl() {
        const node = this.nodes.find(n => n.id === this.activeNodeId);
        if (!node) return null;

        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams({
            url: node.url,
            token: node.token,
            name: node.name
        });
        return `${baseUrl}?${params.toString()}`;
    }

    shareCurrentNode() {
        const shareUrl = this.getShareUrl();
        if (!shareUrl) return;

        // Clear previous QR code
        const container = document.getElementById('qrCodeContainer');
        container.innerHTML = '<canvas id="qrcode"></canvas>';

        // Generate QR code using QRious
        new QRious({
            element: document.getElementById('qrcode'),
            value: shareUrl,
            size: 300,
            level: 'H',
            background: '#ffffff',
            foreground: '#000000'
        });

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('shareNodeModal'));
        modal.show();
    }

    async shareViaShareAPI() {
        const shareUrl = this.getShareUrl();
        if (!shareUrl) return;

        const node = this.nodes.find(n => n.id === this.activeNodeId);

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Share Node: ${node.name}`,
                    text: `Access this Cellframe masternode`,
                    url: shareUrl
                });
                // Don't show notification on success - the share action itself is confirmation enough
            } catch (err) {
                // AbortError means user cancelled - this is normal, don't show notification
                if (err.name !== 'AbortError') {
                    console.error('Share failed:', err);
                    showNotification('Share failed. Please try copying the link instead.');
                }
            }
        } else {
            showNotification('Share API not supported. Link copied to clipboard!');
            this.copyShareLink(true);
        }
    }

    copyShareLink(silent = false) {
        const shareUrl = this.getShareUrl();
        if (!shareUrl) return;

        navigator.clipboard.writeText(shareUrl).then(() => {
            if (!silent) {
                showNotification('Link copied to clipboard!');
            }
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            prompt('Copy this link:', shareUrl);
        });
    }

    renderNodeTabs() {
        this.renderNavigation();
    }

    renderNavigation() {
        const dashboardNav = document.getElementById('dashboardNav');
        const nodeSelector = document.getElementById('nodeSelector');
        const nodeContent = document.getElementById('nodeContent');

        // Show/hide navigation based on whether we have nodes
        if (this.nodes.length === 0) {
            dashboardNav.style.display = 'none';
            nodeContent.innerHTML = '';
            return;
        }

        dashboardNav.style.display = 'block';

        // Clear existing content
        nodeContent.innerHTML = '';

        // Populate node selector with sorted nodes
        nodeSelector.innerHTML = '<option value="">Select Node...</option>';
        // Sort nodes alphabetically by name
        const sortedNodes = [...this.nodes].sort((a, b) => a.name.localeCompare(b.name));
        sortedNodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.name;
            option.selected = node.id === this.activeNodeId;
            nodeSelector.appendChild(option);
        });

        // Set up node selector change handler
        nodeSelector.onchange = (e) => {
            if (e.target.value) {
                this.switchToNode(e.target.value);
            }
            this.updateRemoveButtonVisibility();
        };

        // Show/hide remove button based on node selection
        this.updateRemoveButtonVisibility();

        // Show content for active node
        const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
        if (activeNode) {
            const contentDiv = document.createElement('div');
            contentDiv.id = activeNode.id;
            contentDiv.innerHTML = this.createNodeContent(activeNode);
            nodeContent.appendChild(contentDiv);

            // Set up refresh button
            const refreshButton = document.getElementById('refreshButton');
            refreshButton.onclick = () => this.refreshNode(activeNode.id);
            document.getElementById('refreshSection').style.display = 'block';
        } else {
            document.getElementById('refreshSection').style.display = 'none';
            document.getElementById('networkNavSection').style.display = 'none';
        }
    }

    createNodeContent(node) {
        return `
            <!-- Charts Section - Hidden initially until data loads -->
            <div id="${node.id}-charts-section" style="display: none;">
                <div class="row mb-4">
                    <div class="col-md-6" id="${node.id}-rewards-chart-container">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Rewards Daily Chart</h5>
                                <div class="d-flex align-items-center gap-2">
                                    <button class="btn btn-sm btn-outline-light" onclick="nodeManager.downloadRewardsData('${node.id}', 'rewards_full')" title="Download Full Rewards Data" id="${node.id}-download-rewards-btn" style="display: none;">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <select class="form-select form-select-sm" style="width: auto;"
                                            id="${node.id}-days-selector"
                                            onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'rewards')">
                                        <!-- Days options will be populated dynamically -->
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="${node.id}-rewards-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Sovereign Rewards Chart (next to rewards when available) -->
                    <div class="col-md-6" id="${node.id}-sovereign-chart-container" style="display: none;">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Sovereign Rewards Daily Chart</h5>
                                <div class="d-flex align-items-center gap-2">
                                    <button class="btn btn-sm btn-outline-light" onclick="nodeManager.downloadRewardsData('${node.id}', 'sovereign_rewards_full')" title="Download Full Sovereign Rewards Data" id="${node.id}-download-sovereign-btn" style="display: none;">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <select class="form-select form-select-sm" style="width: auto;"
                                            id="${node.id}-sovereign-days-selector"
                                            onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'sovereign')">
                                        <!-- Days options will be populated dynamically -->
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="${node.id}-sovereign-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Signed Blocks Chart (moves to second row if sovereign exists) -->
                    <div class="col-md-6" id="${node.id}-blocks-chart-container">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Signed Blocks Daily Chart</h5>
                                <select class="form-select form-select-sm" style="width: auto;"
                                        id="${node.id}-blocks-days-selector"
                                        onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'blocks')">
                                    <!-- Days options will be populated dynamically -->
                                </select>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="${node.id}-blocks-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mb-4" id="${node.id}-second-row">
                    <div class="col-md-6" id="${node.id}-first-blocks-chart-container">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">First Signed Blocks Daily Chart</h5>
                                <select class="form-select form-select-sm" style="width: auto;"
                                        id="${node.id}-first-blocks-days-selector"
                                        onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'first-blocks')">
                                    <!-- Days options will be populated dynamically -->
                                </select>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="${node.id}-first-blocks-chart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    switchToNode(nodeId) {
        this.activeNodeId = nodeId;
        this.saveActiveNode(nodeId);

        // Update node selector
        const nodeSelector = document.getElementById('nodeSelector');
        if (nodeSelector) {
            nodeSelector.value = nodeId;
        }

        // Update content
        const nodeContent = document.getElementById('nodeContent');
        const node = this.nodes.find(n => n.id === nodeId);
        if (nodeContent && node) {
            nodeContent.innerHTML = `
                <div id="${node.id}">
                    ${this.createNodeContent(node)}
                </div>
            `;
        }

        // Set up refresh button
        const refreshButton = document.getElementById('refreshButton');
        if (refreshButton) {
            refreshButton.onclick = () => this.refreshNode(nodeId);
            document.getElementById('refreshSection').style.display = 'block';
        }

        // Hide network section initially
        document.getElementById('networkNavSection').style.display = 'none';

        // Show loading state immediately
        this.showLoadingState();

        // Update remove button visibility
        this.updateRemoveButtonVisibility();

        this.loadNodeData(nodeId);
    }

    showLoadingState() {
        // Show loading spinner in all sections
        const systemSection = document.getElementById('systemInfoSection');
        const networkPerfSection = document.getElementById('networkPerfSection');
        const systemCards = document.getElementById('systemInfoCards');
        const networkPerfCards = document.getElementById('networkPerfCards');

        if (systemSection) {
            systemSection.style.display = 'block';
        }
        if (networkPerfSection) {
            networkPerfSection.style.display = 'block';
        }

        // Show loading spinner in system info
        if (systemCards) {
            systemCards.innerHTML = `
                <div class="col-12">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <div class="loading-text">Loading system information...</div>
                    </div>
                </div>
            `;
        }

        // Show loading spinner in network performance
        if (networkPerfCards) {
            networkPerfCards.innerHTML = `
                <div class="col-12">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <div class="loading-text">Loading network metrics...</div>
                    </div>
                </div>
            `;
        }


        // Hide charts section while loading
        const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
        if (activeNode) {
            const chartsSection = document.getElementById(`${activeNode.id}-charts-section`);
            if (chartsSection) {
                chartsSection.style.display = 'none';
            }
        }
    }

    async loadNodeData(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        try {
            // First, get all system data
            const systemData = await this.fetchNodeData(node, 'all');

            // Cache the system data
            this.setStoredSystemData(nodeId, systemData);

            const networks = systemData.active_networks || [];

            if (networks.length === 0) {
                this.showError(nodeId, 'No active networks found');
                return;
            }

            // Store available networks for this node
            this.availableNetworks[nodeId] = networks;

            // Update network selector
            this.populateNetworkSelector(nodeId, networks);

            // Update system information
            console.log('System data:', systemData);
            this.updateSystemInfo(systemData, true); // API is connected if we reach here

            // Get selected network or use first available
            let selectedNetwork = this.getSelectedNetwork(nodeId);

            // If no network selected, or selected network not in available list, select first
            if (!selectedNetwork || !networks.includes(selectedNetwork)) {
                console.log(`Auto-selecting first network: ${networks[0]}`);
                this.setSelectedNetwork(nodeId, networks[0]);
                selectedNetwork = networks[0];
            }

            // Load data for selected network only
            await this.loadNetworkData(node, selectedNetwork);

            // Update last updated timestamp on successful load
            this.updateLastUpdatedTimestamp();
            this.lastNetworkUpdate[nodeId] = Date.now();

            // Update footer refresh info on first load
            this.updateFooterRefreshInfo();

        } catch (error) {
            console.error('Error loading node data:', error);

            // Try to use cached system data
            const cachedSystemData = this.getStoredSystemData(nodeId);
            if (cachedSystemData) {
                console.log('Using cached system data due to API error');
                this.updateSystemInfo(cachedSystemData, false); // API is not connected, using cache
                this.showCacheNotification(nodeId, 'system');

                // Try to load cached network data too
                const selectedNetwork = this.getSelectedNetwork(nodeId);
                if (selectedNetwork) {
                    const cachedNetworkData = this.getStoredNetworkData(nodeId, selectedNetwork);
                    if (cachedNetworkData) {
                        console.log('Using cached network data due to API error');
                        this.updateNetworkPerformance(cachedNetworkData);
                        this.updateCharts(nodeId, selectedNetwork, cachedNetworkData);
                        this.showCacheNotification(nodeId, 'network', selectedNetwork);
                        return;
                    }
                }
            } else {
                this.showError(nodeId, `Connection failed: ${error.message}`);
                // Show offline status when there's an error and no cache
                this.updateSystemInfo({}, false); // No system data, API not connected
            }
        }
    }

    populateNetworkSelector(nodeId, networks) {
        const networkPills = document.getElementById('networkPills');
        const networkNavSection = document.getElementById('networkNavSection');

        if (!networkPills) return;

        // Ensure a network is always selected
        let selectedNetwork = this.getSelectedNetwork(nodeId);
        if (!selectedNetwork && networks.length > 0) {
            // Auto-select first network if none selected
            this.setSelectedNetwork(nodeId, networks[0]);
            selectedNetwork = networks[0];
        }

        // Show network section and populate pills
        networkNavSection.style.display = 'block';
        networkPills.innerHTML = networks.map(network =>
            `<span class="network-pill ${network === selectedNetwork ? 'active' : ''}"
                   onclick="nodeManager.switchNetwork('${nodeId}', '${network}')">${network}</span>`
        ).join('');
    }

    populateDaysSelector(nodeId, maxDays, networkData = null) {
        // Chart types mapping to their selectors and data fields
        const chartSelectors = [
            { id: `${nodeId}-days-selector`, type: 'rewards', dataField: 'reward_wallet_all_sums_daily' },
            { id: `${nodeId}-blocks-days-selector`, type: 'blocks', dataField: 'signed_blocks_all_sums_daily' },
            { id: `${nodeId}-first-blocks-days-selector`, type: 'first-blocks', dataField: 'first_signed_blocks_all_sums_daily' },
            { id: `${nodeId}-sovereign-days-selector`, type: 'sovereign', dataField: 'sovereign_wallet_all_sums_daily' }
        ];

        chartSelectors.forEach(({ id, type, dataField }) => {
            const sel = document.getElementById(id);
            if (!sel) return;

            // Get actual data length for this specific chart
            let actualDataDays = maxDays || 30; // Default fallback
            if (networkData && networkData[dataField]) {
                const data = networkData[dataField];
                if (Array.isArray(data)) {
                    actualDataDays = data.length;
                } else if (typeof data === 'object') {
                    actualDataDays = Object.keys(data).length;
                }
            }

            // Hide selector if no data or only 1 data point
            if (actualDataDays <= 1) {
                sel.closest('.form-select').style.display = 'none';
                return;
            } else {
                sel.closest('.form-select').style.display = 'inline-block';
            }

            // Generate smart day options based on actual data
            const daysOptions = this.generateSmartDaysOptions(actualDataDays);

            // Filter options to only show those <= actual available data
            const availableOptions = daysOptions.filter(days => days <= actualDataDays);

            // Ensure we have at least one option
            if (availableOptions.length === 0) {
                availableOptions.push(actualDataDays);
            }

            const selectedDays = this.getSelectedDays(nodeId, type);
            // If selected days exceeds available data, select the best available option
            let validSelectedDays;
            if (selectedDays <= actualDataDays) {
                validSelectedDays = selectedDays;
            } else {
                // Prioritize 30 days if available, then 14, then 7, then whatever is available
                if (actualDataDays >= 30) {
                    validSelectedDays = 30;
                } else if (actualDataDays >= 14) {
                    validSelectedDays = 14;
                } else if (actualDataDays >= 7) {
                    validSelectedDays = 7;
                } else {
                    validSelectedDays = Math.max(...availableOptions);
                }
            }

            const optionsHtml = availableOptions.map(days =>
                `<option value="${days}" ${days === validSelectedDays ? 'selected' : ''}>${days} day${days === 1 ? '' : 's'}</option>`
            ).join('');
            sel.innerHTML = optionsHtml;

            // Update preference if it was adjusted
            if (validSelectedDays !== selectedDays) {
                this.setSelectedDays(nodeId, validSelectedDays, type);
            }
        });
    }

    generateSmartDaysOptions(actualDataDays) {
        const standardOptions = [7, 14, 30];
        let smartOptions = [];

        // Add standard options based on available data
        if (actualDataDays >= 7) smartOptions.push(7);
        if (actualDataDays >= 14) smartOptions.push(14);
        if (actualDataDays >= 30) smartOptions.push(30);

        // For datasets with more than 30 days but less than or equal to 90 days,
        // add the actual data length as an option (e.g., 45 days, 67 days, 87 days)
        if (actualDataDays > 30 && actualDataDays <= 90) {
            smartOptions.push(actualDataDays);
        }

        // For datasets with more than 90 days, cap at 90
        if (actualDataDays > 90) {
            smartOptions.push(90);
        }

        // For datasets with less than 7 days, offer the actual data length
        if (actualDataDays < 7 && actualDataDays > 1) {
            smartOptions.push(actualDataDays);
        }

        // If we have no valid options, just use the actual data length
        if (smartOptions.length === 0) {
            return [Math.min(actualDataDays, 90)];
        }

        return smartOptions.sort((a, b) => a - b);
    }

    hasNetworkData(networkData) {
        if (!networkData) return false;

        // Check if we have any meaningful chart data with actual values
        const chartDataFields = [
            'reward_wallet_all_sums_daily',
            'signed_blocks_all_sums_daily',
            'first_signed_blocks_all_sums_daily'
        ];

        let hasAnyChartData = false;
        for (const field of chartDataFields) {
            const data = networkData[field];
            if (data && Array.isArray(data) && data.length > 0) {
                // Check if any data point has meaningful values (not just zeros)
                const hasNonZeroValues = data.some(item => {
                    const value = item.total_rewards || item.block_count || item.value || 0;
                    return parseFloat(value) > 0;
                });
                if (hasNonZeroValues) {
                    hasAnyChartData = true;
                    break;
                }
            } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
                // Check object format for non-zero values
                const hasNonZeroValues = Object.values(data).some(value => parseFloat(value) > 0);
                if (hasNonZeroValues) {
                    hasAnyChartData = true;
                    break;
                }
            }
        }

        // Check if we have meaningful metrics (not just zeros)
        const hasBasicMetrics = (networkData.reward_wallet_address && networkData.reward_wallet_address !== '') ||
                               (networkData.block_count && parseFloat(networkData.block_count) > 0) ||
                               (networkData.reward_wallet_today_rewards && parseFloat(networkData.reward_wallet_today_rewards) > 0) ||
                               (networkData.signed_blocks_today_amount && parseFloat(networkData.signed_blocks_today_amount) > 0);

        // Only show data sections if we have meaningful non-zero data
        return hasAnyChartData || hasBasicMetrics;
    }

    hideDataSections(nodeId) {
        // Hide charts section
        const chartsSection = document.getElementById(`${nodeId}-charts-section`);
        if (chartsSection) {
            chartsSection.style.display = 'none';
        }

        // Hide network performance section
        const networkPerfSection = document.getElementById('networkPerfSection');
        if (networkPerfSection) {
            networkPerfSection.style.display = 'none';
        }

        console.log(`Hidden data sections for node ${nodeId} - no meaningful data available yet`);
    }

    showDataSections(nodeId) {
        // Show charts section
        const chartsSection = document.getElementById(`${nodeId}-charts-section`);
        if (chartsSection) {
            chartsSection.style.display = 'block';
        }

        // Show network performance section
        const networkPerfSection = document.getElementById('networkPerfSection');
        if (networkPerfSection) {
            networkPerfSection.style.display = 'block';
        }

        console.log(`Showed data sections for node ${nodeId} - meaningful data is available`);
    }

    showNoDataMessage(canvas, message) {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Set text properties
        ctx.fillStyle = '#CFCFCF'; // Secondary font color
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw message in center of canvas
        ctx.fillText(message, canvasWidth / 2, canvasHeight / 2);
    }

    showSingleDataPointMessage(canvas, message) {
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Set text properties for main message
        ctx.fillStyle = '#B3A3FF'; // Accent color for data
        ctx.font = 'bold 16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Draw main message
        ctx.fillText(message, canvasWidth / 2, canvasHeight / 2 - 10);

        // Add subtitle
        ctx.fillStyle = '#CFCFCF'; // Secondary font color
        ctx.font = '12px Inter, sans-serif';
        ctx.fillText('Need more data points for chart visualization', canvasWidth / 2, canvasHeight / 2 + 15);
    }

    switchNetwork(nodeId, network) {
        this.setSelectedNetwork(nodeId, network);

        // Update network pill states
        const networkPills = document.getElementById('networkPills');
        if (networkPills) {
            const pills = networkPills.querySelectorAll('.network-pill');
            pills.forEach(pill => {
                if (pill.textContent === network) {
                    pill.className = 'network-pill active';
                } else {
                    pill.className = 'network-pill';
                }
            });
        }

        const node = this.nodes.find(n => n.id === nodeId);
        if (node) {
            this.loadNetworkData(node, network);
        }
    }

    changeDays(nodeId, days, chartType = 'all') {
        console.log(`=== changeDays called ===`);
        console.log(`nodeId: ${nodeId}, days: ${days}, chartType: ${chartType}`);

        // Save the preference for this specific chart type
        if (chartType !== 'all') {
            console.log(`Saving preference: nodeId=${nodeId}, days=${days}, chartType=${chartType}`);
            this.setSelectedDays(nodeId, days, chartType);
        }

        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) {
            console.error('Node not found:', nodeId);
            return;
        }

        // Get selected network - this should now auto-select if needed
        const selectedNetwork = this.getSelectedNetwork(nodeId);
        console.log(`Found node:`, node.name);
        console.log(`Selected network:`, selectedNetwork);
        console.log(`Available networks:`, this.availableNetworks[nodeId]);

        if (!selectedNetwork) {
            console.error('No network selected and no available networks found');
            console.log('Attempting to fetch available networks...');
            // Try to load node data first to get networks
            this.loadNodeData(nodeId).then(() => {
                // Retry after loading node data
                const network = this.getSelectedNetwork(nodeId);
                if (network) {
                    console.log('Network found after reload:', network);
                    this.changeDays(nodeId, days, chartType);
                }
            });
            return;
        }

        console.log(`Proceeding with chart update for network: ${selectedNetwork}`);

        // Use stored data for immediate update
        const storedData = this.getStoredNetworkData(nodeId, selectedNetwork);
        if (storedData) {
            console.log('Using stored data for immediate update');
            this.updateCharts(nodeId, selectedNetwork, storedData, false, chartType);
        }

        // Also load fresh chart data
        this.loadChartData(node, selectedNetwork, days, chartType);
    }

    getStoredNetworkData(nodeId, network) {
        const key = `${nodeId}-${network}`;
        return this.cachedNetworkData[key] || null;
    }

    setStoredNetworkData(nodeId, network, data) {
        const key = `${nodeId}-${network}`;
        this.cachedNetworkData[key] = data;
        this.lastUpdateTimestamps[key] = Date.now();
    }

    getStoredSystemData(nodeId) {
        return this.cachedSystemData[nodeId] || null;
    }

    setStoredSystemData(nodeId, data) {
        this.cachedSystemData[nodeId] = data;
        this.lastUpdateTimestamps[`system-${nodeId}`] = Date.now();
    }

    getLastUpdateTime(nodeId, network = null) {
        const key = network ? `${nodeId}-${network}` : `system-${nodeId}`;
        return this.lastUpdateTimestamps[key] || null;
    }

    async loadNetworkData(node, network) {
        try {
            // Fetch all network data using 'all' method (data truncation now fixed in server)
            const networkData = await this.fetchNetworkData(node, network, 'all');

            // Cache the network data for later use
            this.setStoredNetworkData(node.id, network, networkData);

            // Check if we have meaningful data to display
            const hasData = this.hasNetworkData(networkData);

            if (hasData) {
                // Show data sections since we have meaningful data
                this.showDataSections(node.id);

                // Populate days selector with max days from API
                if (networkData.days_cutoff) {
                    this.populateDaysSelector(node.id, networkData.days_cutoff, networkData);
                }

                // Update charts with filtered data
                this.updateCharts(node.id, network, networkData);

                // Update network performance and metrics (including wallet info)
                this.updateNetworkPerformance(networkData);
            } else {
                // Hide all data sections when no meaningful data is available
                this.hideDataSections(node.id);
            }

            // Update system info (without network status)
            const systemData = await this.fetchNodeData(node, 'all');
            this.updateSystemInfo(systemData, true); // API connected if we get here

        } catch (error) {
            console.error(`Error loading data for network ${network}:`, error);

            // Try to use cached network data
            const cachedData = this.getStoredNetworkData(node.id, network);
            if (cachedData) {
                console.log('Using cached network data due to API error');

                // Check if cached data has meaningful content
                const hasData = this.hasNetworkData(cachedData);
                if (hasData) {
                    this.showDataSections(node.id);
                    this.updateCharts(node.id, network, cachedData);
                    this.updateNetworkPerformance(cachedData);
                } else {
                    this.hideDataSections(node.id);
                }

                this.showCacheNotification(node.id, 'network', network);
            } else {
                // No cached data and API error - hide sections
                this.hideDataSections(node.id);
            }
        }
    }

    async fetchNodeData(node, actions) {
        const url = `${node.url}?access_token=${node.token}&action=${actions}`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error(data.error || 'API request failed');
            }

            return data.data;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout (30 seconds)');
            }
            throw error;
        }
    }

    async fetchNetworkData(node, network, actions, days = null) {
        let url = `${node.url}?access_token=${node.token}&network=${network}&network_action=${actions}`;
        if (days) {
            url += `&days_cutoff=${days}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        try {
            const response = await fetch(url, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error(data.error || 'API request failed');
            }

            // Include request_timestamp in the network data for server date filtering
            const networkData = data.data[network] || {};
            if (data.request_timestamp) {
                networkData.request_timestamp = data.request_timestamp;
            }
            return networkData;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error('Request timeout (30 seconds)');
            }
            throw error;
        }
    }

    async updatePlugin() {
        const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
        if (!activeNode) {
            showNotification('No active node selected', 'error');
            return;
        }

        const updateBtn = document.getElementById('updatePluginBtn');
        const originalBtnContent = updateBtn.innerHTML;

        try {
            // Disable button and show loading state
            updateBtn.disabled = true;
            updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Updating...';

            // Hide the update notification banner immediately
            const notificationBanner = document.getElementById('pluginUpdateNotification');
            if (notificationBanner) {
                notificationBanner.style.display = 'none';
            }

            // Make API call to trigger update
            const url = `${activeNode.url}?access_token=${activeNode.token}&action=update_plugin`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(url, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error(data.error || 'API request failed');
            }

            // Get the update message from response
            const updateMessage = data.data.update_plugin;

            // Check if update was successful
            if (updateMessage.includes('Update initiated')) {
                showNotification(updateMessage, 'success');
                // Note: Node will restart, so connection will be lost temporarily
                setTimeout(() => {
                    showNotification('Node is restarting. Please refresh in a moment.', 'info');
                }, 3000);
            } else {
                // No update available or other message
                showNotification(updateMessage, 'info');
            }

        } catch (error) {
            console.error('Error updating plugin:', error);
            let errorMessage = 'Failed to update plugin';
            if (error.name === 'AbortError') {
                errorMessage = 'Update request timeout (30 seconds)';
            } else if (error.message) {
                errorMessage = `Update failed: ${error.message}`;
            }
            showNotification(errorMessage, 'error');
        } finally {
            // Re-enable button and restore original content
            updateBtn.disabled = false;
            updateBtn.innerHTML = originalBtnContent;
        }
    }

    async downloadRewardsData(nodeId, dataType) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) {
            showNotification('No active node selected', 'error');
            return;
        }

        // Get the selected network for this node
        const network = this.getSelectedNetwork(nodeId);
        if (!network) {
            showNotification('No network selected', 'error');
            return;
        }

        // Determine button ID and data type name for filename
        const isRewards = dataType === 'rewards_full';
        const buttonId = isRewards ? `${nodeId}-download-rewards-btn` : `${nodeId}-download-sovereign-btn`;
        const dataTypeName = isRewards ? 'rewards' : 'sovereign-rewards';

        const downloadBtn = document.getElementById(buttonId);
        if (!downloadBtn) {
            showNotification('Download button not found', 'error');
            return;
        }

        const originalBtnContent = downloadBtn.innerHTML;

        try {
            // Disable button and show loading state
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            // Fetch data from API
            const url = `${node.url}?access_token=${node.token}&network=${network}&network_action=${dataType}`;
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(url, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            if (data.status !== 'ok') {
                throw new Error(data.error || 'API request failed');
            }

            // Extract the data from response
            const rewardsData = data.data[network][dataType];

            if (!rewardsData) {
                throw new Error('No data available for download');
            }

            // Create blob and download
            const jsonString = JSON.stringify(rewardsData, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });

            // Generate filename with current date
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const filename = `${node.name}-${network}-${dataTypeName}-${today}.json`;

            // Create download link and trigger download
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = filename;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up blob URL
            URL.revokeObjectURL(downloadLink.href);

            showNotification(`Downloaded ${filename}`, 'success');

        } catch (error) {
            console.error('Error downloading rewards data:', error);
            let errorMessage = 'Failed to download data';
            if (error.name === 'AbortError') {
                errorMessage = 'Download request timeout (30 seconds)';
            } else if (error.message) {
                errorMessage = `Download failed: ${error.message}`;
            }
            showNotification(errorMessage, 'error');
        } finally {
            // Re-enable button and restore original content
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = originalBtnContent;
        }
    }

    async loadChartData(node, network, days, chartType = 'all') {
        try {
            console.log(`Loading chart data for node ${node.id}, network ${network}, type: ${chartType}`);

            // Check if we have cached data to use
            const cachedData = this.getStoredNetworkData(node.id, network);

            if (cachedData) {
                console.log('Using cached data for chart update with client-side filtering');
                // Use cached data with client-side filtering - this is key!
                // We DON'T pass skipFiltering=true because we want client-side filtering
                this.updateCharts(node.id, network, cachedData, false, chartType);
            } else {
                console.log('No cached data, fetching from API using all method');
                // If no cached data, fetch all data using 'all' method
                const chartData = await this.fetchNetworkData(node, network, 'all');
                this.setStoredNetworkData(node.id, network, chartData);
                // Use client-side filtering
                this.updateCharts(node.id, network, chartData, false, chartType);
            }

        } catch (error) {
            console.error('Error loading chart data:', error);
        }
    }



    getChangeIndicator(today, yesterday) {
        if (today === undefined || yesterday === undefined || today === null || yesterday === null) {
            return null;
        }

        const todayVal = parseFloat(today) || 0;
        const yesterdayVal = parseFloat(yesterday) || 0;

        if (todayVal > yesterdayVal) {
            const increase = ((todayVal - yesterdayVal) / Math.max(yesterdayVal, 1) * 100).toFixed(1);
            return { text: `↗ +${increase}%`, color: 'text-success' };
        } else if (todayVal < yesterdayVal) {
            const decrease = ((yesterdayVal - todayVal) / Math.max(yesterdayVal, 1) * 100).toFixed(1);
            return { text: `↘ -${decrease}%`, color: 'text-danger' };
        } else {
            return { text: '→ 0%', color: 'text-muted' };
        }
    }

    // Helper function to get date in YYYY-MM-DD format using local timezone
    getLocalDateString(date) {
        return date.getFullYear() + '-' +
            String(date.getMonth() + 1).padStart(2, '0') + '-' +
            String(date.getDate()).padStart(2, '0');
    }

    // Extract server date from request_timestamp (format: "2025-10-04T11:51:24.360028+00:00")
    getServerDateFromTimestamp(timestamp) {
        if (!timestamp) return null;
        return timestamp.split('T')[0];
    }

    filterDataByDays(dataArray, days, serverDate = null) {
        if (!dataArray || !Array.isArray(dataArray)) {
            return dataArray;
        }

        // Use server date if provided, otherwise fall back to browser local timezone
        const todayStr = serverDate || this.getLocalDateString(new Date());

        // Calculate cutoff date: go back 'days' from today
        const cutoffDate = new Date(todayStr);
        cutoffDate.setDate(cutoffDate.getDate() - days);
        const cutoffStr = this.getLocalDateString(cutoffDate);

        return dataArray.filter(item => {
            if (!item.date) return false;
            // Compare date strings directly
            // Include dates >= cutoffStr but exclude today
            return item.date >= cutoffStr && item.date !== todayStr;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateCharts(nodeId, network, data, skipFiltering = false, chartType = 'all') {
        console.log(`updateCharts called: nodeId=${nodeId}, chartType=${chartType}, skipFiltering=${skipFiltering}`);

        // Check if any charts are visible
        const anyChartVisible = this.isMetricVisible('rewards_chart', 'sections') ||
                                this.isMetricVisible('sovereign_rewards_chart', 'sections') ||
                                this.isMetricVisible('signed_blocks_chart', 'sections') ||
                                this.isMetricVisible('first_signed_blocks_chart', 'sections');

        // Show charts section only if at least one chart is visible
        const chartsSection = document.getElementById(`${nodeId}-charts-section`);
        if (chartsSection) {
            chartsSection.style.display = anyChartVisible ? 'block' : 'none';
        }

        if (!anyChartVisible) {
            return; // No need to update charts if none are visible
        }

        let rewardsData, blocksData, firstBlocksData;

        // Get server date from request_timestamp, fallback to browser local timezone
        const serverDate = this.getServerDateFromTimestamp(data.request_timestamp);
        const todayStr = serverDate || this.getLocalDateString(new Date());

        if (skipFiltering) {
            // Use data as-is (already filtered by API) but still exclude today
            console.log('Using API-filtered data');
            rewardsData = data.reward_wallet_all_sums_daily?.filter(item => item.date !== todayStr) || [];
            blocksData = data.signed_blocks_all_sums_daily?.filter(item => item.date !== todayStr) || [];
            firstBlocksData = data.first_signed_blocks_all_sums_daily?.filter(item => item.date !== todayStr) || [];
        } else {
            // Apply client-side filtering with chart-specific days
            console.log('Using client-side filtering');
            const rewardsDays = this.getSelectedDays(nodeId, 'rewards');
            const blocksDays = this.getSelectedDays(nodeId, 'blocks');
            const firstBlocksDays = this.getSelectedDays(nodeId, 'first-blocks');

            console.log(`Selected days: rewards=${rewardsDays}, blocks=${blocksDays}, first-blocks=${firstBlocksDays}`);

            rewardsData = this.filterDataByDays(data.reward_wallet_all_sums_daily, rewardsDays, serverDate);
            blocksData = this.filterDataByDays(data.signed_blocks_all_sums_daily, blocksDays, serverDate);
            firstBlocksData = this.filterDataByDays(data.first_signed_blocks_all_sums_daily, firstBlocksDays, serverDate);
        }

        // Update charts based on type and visibility
        const rewardsChartContainer = document.getElementById(`${nodeId}-rewards-chart-container`);
        if (rewardsChartContainer) {
            rewardsChartContainer.style.display = this.isMetricVisible('rewards_chart', 'sections') ? 'block' : 'none';
        }

        // Show/hide rewards download button based on rewards_full availability
        const rewardsDownloadBtn = document.getElementById(`${nodeId}-download-rewards-btn`);
        if (rewardsDownloadBtn) {
            const hasRewardsFull = data.rewards_full &&
                                   (Array.isArray(data.rewards_full) && data.rewards_full.length > 0 ||
                                    typeof data.rewards_full === 'object' && Object.keys(data.rewards_full).length > 0);
            rewardsDownloadBtn.style.display = hasRewardsFull ? 'inline-block' : 'none';
        }

        if ((chartType === 'all' || chartType === 'rewards') && this.isMetricVisible('rewards_chart', 'sections')) {
            console.log(`Updating rewards chart for ${nodeId}`, rewardsData);
            this.updateChart(`${nodeId}-rewards-chart`, 'Rewards', rewardsData, data.native_ticker, serverDate);
        }

        const blocksChartContainer = document.getElementById(`${nodeId}-blocks-chart-container`);
        if (blocksChartContainer) {
            blocksChartContainer.style.display = this.isMetricVisible('signed_blocks_chart', 'sections') ? 'block' : 'none';
        }
        if ((chartType === 'all' || chartType === 'blocks') && this.isMetricVisible('signed_blocks_chart', 'sections')) {
            console.log(`Updating blocks chart for ${nodeId}`, blocksData);
            this.updateChart(`${nodeId}-blocks-chart`, 'Blocks', blocksData, 'blocks', serverDate);
        }

        const firstBlocksChartContainer = document.getElementById(`${nodeId}-first-blocks-chart-container`);
        if (firstBlocksChartContainer) {
            firstBlocksChartContainer.style.display = this.isMetricVisible('first_signed_blocks_chart', 'sections') ? 'block' : 'none';
        }
        if ((chartType === 'all' || chartType === 'first-blocks') && this.isMetricVisible('first_signed_blocks_chart', 'sections')) {
            console.log(`Updating first-blocks chart for ${nodeId}`, firstBlocksData);
            this.updateChart(`${nodeId}-first-blocks-chart`, 'First Signed Blocks', firstBlocksData, 'blocks', serverDate);
        }

        // Handle sovereign chart positioning - show next to rewards when available
        const sovereignChartContainer = document.getElementById(`${nodeId}-sovereign-chart-container`);
        const secondRow = document.getElementById(`${nodeId}-second-row`);

        if (data.sovereign_reward_wallet_address && data.sovereign_wallet_all_sums_daily && this.isMetricVisible('sovereign_rewards_chart', 'sections')) {
            // Show sovereign chart next to rewards if visible
            if (sovereignChartContainer) {
                sovereignChartContainer.style.display = 'block';
            }

            // Show/hide sovereign download button based on sovereign_rewards_full availability
            const sovereignDownloadBtn = document.getElementById(`${nodeId}-download-sovereign-btn`);
            if (sovereignDownloadBtn) {
                const hasSovereignRewardsFull = data.sovereign_rewards_full &&
                                                (Array.isArray(data.sovereign_rewards_full) && data.sovereign_rewards_full.length > 0 ||
                                                 typeof data.sovereign_rewards_full === 'object' && Object.keys(data.sovereign_rewards_full).length > 0);
                sovereignDownloadBtn.style.display = hasSovereignRewardsFull ? 'inline-block' : 'none';
            }

            // Move blocks chart to second row by appending it there
            if (blocksChartContainer && secondRow) {
                // Remove from first row and add to second row
                blocksChartContainer.remove();
                secondRow.appendChild(blocksChartContainer);
            }

            // Only update sovereign chart if chart type is 'all' or 'sovereign'
            if (chartType === 'all' || chartType === 'sovereign') {
                let sovereignData;
                if (skipFiltering) {
                    sovereignData = data.sovereign_wallet_all_sums_daily?.filter(item => item.date !== todayStr) || [];
                } else {
                    const sovereignDays = this.getSelectedDays(nodeId, 'sovereign');
                    sovereignData = this.filterDataByDays(data.sovereign_wallet_all_sums_daily, sovereignDays, serverDate);
                }

                this.updateChart(`${nodeId}-sovereign-chart`, 'Sovereign Rewards', sovereignData, data.native_ticker, serverDate);
            }
        } else {
            // Hide sovereign chart and keep blocks chart in first row
            if (sovereignChartContainer) {
                sovereignChartContainer.style.display = 'none';
            }

            // Hide sovereign download button when no sovereign data
            const sovereignDownloadBtn = document.getElementById(`${nodeId}-download-sovereign-btn`);
            if (sovereignDownloadBtn) {
                sovereignDownloadBtn.style.display = 'none';
            }

            // Ensure blocks chart stays in first row if no sovereign
            if (blocksChartContainer && blocksChartContainer.parentElement !== document.querySelector(`${nodeId}-charts-section .row`)) {
                // Move blocks chart back to first row
                const firstRow = document.querySelector(`#${nodeId}-charts-section .row`);
                if (firstRow) {
                    firstRow.appendChild(blocksChartContainer);
                }
            }
        }
    }


    updateWalletBalances(nodeId, data) {
        const balancesContainer = document.getElementById(`${nodeId}-wallet-balances`);
        if (!balancesContainer || !data.reward_wallet_balance) return;

        const balances = Object.entries(data.reward_wallet_balance)
            .filter(([token, amount]) => amount > 0)
            .sort(([,a], [,b]) => b - a);

        balancesContainer.innerHTML = balances.map(([token, amount]) => `
            <div class="row mb-2">
                <div class="col-4">
                    <div class="metric-label">${token}</div>
                </div>
                <div class="col-8 text-end">
                    <div class="metric-value" style="font-size: 0.9rem;">${this.formatNumber(amount)}</div>
                </div>
            </div>
        `).join('');
    }

    updateSystemInfo(systemData, isApiConnected = true, networkStatus = null) {
        const systemSection = document.getElementById('systemInfoSection');
        const systemCards = document.getElementById('systemInfoCards');

        // Check for plugin update availability and show/hide notification
        const pluginUpdateNotification = document.getElementById('pluginUpdateNotification');
        if (pluginUpdateNotification) {
            if (systemData && systemData.plugin_update_available === true) {
                pluginUpdateNotification.style.display = 'block';
            } else {
                pluginUpdateNotification.style.display = 'none';
            }
        }

        if (systemSection && systemCards) {
            systemSection.style.display = 'block';

            // Determine node status based on API connectivity (not network state)
            let nodeStatus = 'Loading...';
            let statusClass = 'status-loading';
            let isOnline = false;

            if (isApiConnected && systemData) {
                nodeStatus = 'Online';
                statusClass = 'status-online';
                isOnline = true;
            } else if (!isApiConnected) {
                nodeStatus = 'Offline';
                statusClass = 'status-offline';

                // Hide network sections when node is offline
                const networkNavSection = document.getElementById('networkNavSection');
                const networkPerfSection = document.getElementById('networkPerfSection');
                if (networkNavSection) networkNavSection.style.display = 'none';
                if (networkPerfSection) networkPerfSection.style.display = 'none';

                // Hide charts section for offline node
                const activeNode = this.nodes.find(n => n.id === this.activeNodeId);
                if (activeNode) {
                    const chartsSection = document.getElementById(`${activeNode.id}-charts-section`);
                    if (chartsSection) chartsSection.style.display = 'none';
                }
            }

            // Choose icon based on status
            let statusIcon = 'fa-circle-check'; // Default for online
            if (statusClass === 'status-offline') {
                statusIcon = 'fa-circle-xmark'; // X for offline
            } else if (statusClass === 'status-loading') {
                statusIcon = 'fa-circle-question'; // Question mark for loading
            }

            // Build system metrics array from config
            const systemMetrics = Object.entries(SYSTEM_METRICS_CONFIG)
                .map(([id, config]) => {
                    const metric = {
                        id: id,
                        title: config.title,
                        icon: config.icon
                    };

                    // Handle special case for node_status
                    if (config.special === 'node_status') {
                        metric.icon = statusIcon;
                        metric.value = nodeStatus;
                        metric.statusClass = statusClass;
                        return metric;
                    }

                    // Format the value using the formatter
                    metric.value = config.formatter(systemData, this);

                    // Add version check if needed
                    if (config.hasVersionCheck) {
                        // Map metric id to systemData key
                        const dataKeyMap = {
                            'current_version': 'current_node_version',
                            'current_plugin_version': 'current_plugin_version',
                            'latest_version': 'latest_node_version',
                            'latest_plugin_version': 'latest_plugin_version'
                        };
                        const currentKey = dataKeyMap[id] || id;
                        const latestKey = dataKeyMap[config.compareWith] || config.compareWith;
                        metric.isUpToDate = systemData[currentKey] === systemData[latestKey];
                    }

                    return metric;
                });

            // Filter only visible metrics
            const visibleSystemMetrics = systemMetrics.filter(metric =>
                this.isMetricVisible(metric.id, 'system')
            );

            // Hide section if no metrics are visible
            if (visibleSystemMetrics.length === 0) {
                systemSection.style.display = 'none';
                return;
            }

            // Get saved metric order or use default alphabetical order
            const savedSystemOrder = this.getSavedMetricOrder('system');
            const orderedSystemMetrics = this.reorderMetrics(visibleSystemMetrics, savedSystemOrder);

            systemCards.innerHTML = orderedSystemMetrics.map((metric, index) => `
                <div class="col-md-4 mb-3"
                     data-metric-id="${metric.title.toLowerCase().replace(/\s+/g, '_')}">
                    <div class="text-center">
                        <div class="metric-icon mb-2">
                            <i class="fas ${metric.icon}"></i>
                        </div>
                        <div class="metric-value ${metric.isUpToDate === false ? 'text-warning' : ''} ${metric.statusClass === 'status-offline' ? 'text-danger' : ''}">
                            ${metric.value}
                        </div>
                        <div class="metric-label">${metric.title}</div>
                    </div>
                </div>
            `).join('');
        }

        // Initialize sortable for system metrics
        this.initializeSortable();
    }

    formatWalletAddress(address) {
        if (!address) return 'N/A';
        if (address.length > 20) {
            return address.substring(0, 8) + '...' + address.substring(address.length - 8);
        }
        return address;
    }

    createWalletPopup(address, balances, title) {
        if (!address && !balances) return '';

        let balanceRows = '';
        if (balances) {
            const balanceEntries = Object.entries(balances)
                .filter(([token, amount]) => amount > 0)
                .sort(([,a], [,b]) => b - a);

            if (balanceEntries.length > 0) {
                balanceRows = balanceEntries.map(([token, amount]) =>
                    `<tr>
                        <td>${token}</td>
                        <td>${amount}</td>
                    </tr>`
                ).join('');
            } else {
                balanceRows = '<tr><td colspan="2" style="text-align: center; opacity: 0.7;">No balances</td></tr>';
            }
        }

        return `
            <div class="wallet-popup">
                <div class="wallet-popup-title">${title}</div>
                ${balances ? `
                <table class="wallet-balance-table">
                    ${balanceRows}
                </table>
                ` : ''}
                ${address ? `
                <div class="wallet-address-full">
                    ${address}
                </div>
                ` : ''}
            </div>
        `;
    }

    updateNetworkPerformance(networkData) {
        const networkPerfSection = document.getElementById('networkPerfSection');
        const networkPerfCards = document.getElementById('networkPerfCards');
        if (!networkPerfCards) return;

        // Show the network performance section
        if (networkPerfSection) {
            networkPerfSection.style.display = 'block';
        }

        // Determine network state status
        let networkStateStatus = 'Loading...';
        let networkStateIcon = 'fa-circle-question';
        let networkStateClass = '';

        const currentState = networkData.network_status?.current_state || networkData.current_state;

        if (currentState === 'NET_STATE_ONLINE') {
            networkStateStatus = 'Online';
            networkStateIcon = 'fa-globe';
            networkStateClass = 'status-online';
        } else if (currentState === 'NET_STATE_SYNC_CHAINS') {
            networkStateStatus = 'Syncing';
            networkStateIcon = 'fa-arrows-rotate';
            networkStateClass = 'status-syncing';
        } else if (currentState === 'NET_STATE_OFFLINE') {
            networkStateStatus = 'Offline';
            networkStateIcon = 'fa-globe';
            networkStateClass = 'status-offline';
        }

        // Build network metrics array from config
        const networkMetrics = Object.entries(NETWORK_METRICS_CONFIG)
            .filter(([id, config]) => {
                // Filter out conditional metrics if condition not met
                if (config.conditional) {
                    return config.conditional(networkData);
                }
                return true;
            })
            .map(([id, config]) => {
                const metric = {
                    id: id,
                    title: config.title,
                    icon: config.icon
                };

                // Handle special case for network_state
                if (config.special === 'network_state') {
                    metric.icon = networkStateIcon;
                    metric.value = networkStateStatus;
                    metric.statusClass = networkStateClass;
                    return metric;
                }

                // Format the value using the formatter
                metric.value = config.formatter(networkData, this);

                // Add wallet-specific properties
                if (config.isWallet) {
                    metric.isWallet = true;
                    metric.walletType = config.walletType;
                    metric.fullAddress = config.getFullAddress(networkData);
                    metric.balances = config.getBalances(networkData);
                    metric.hasInfo = true;
                }

                // Add hover properties
                if (config.hasHover) {
                    metric.hasHover = true;
                    metric.fullValue = config.getFullValue(networkData);
                }

                return metric;
            });

        const visibleNetworkMetrics = networkMetrics.filter(metric =>
            this.isMetricVisible(metric.id, 'network')
        );

        // Hide section if no metrics are visible
        if (visibleNetworkMetrics.length === 0) {
            networkPerfSection.style.display = 'none';
            return;
        }

        // Get saved metric order or use default alphabetical order
        const savedNetworkOrder = this.getSavedMetricOrder('network');
        const orderedNetworkMetrics = this.reorderMetrics(visibleNetworkMetrics, savedNetworkOrder);

        // Create wallet hint as a separate element before the sortable cards container
        const hasWallets = networkMetrics.some(m => m.isWallet);
        const hasVisibleWallets = orderedNetworkMetrics.some(m => m.isWallet);
        const cardBody = networkPerfCards.parentElement;

        // Remove any existing wallet hint
        const existingHint = cardBody.querySelector('.wallet-info-hint-wrapper');
        if (existingHint) {
            existingHint.remove();
        }

        // Add wallet hint only if wallets exist AND at least one wallet is visible
        if (hasWallets && hasVisibleWallets) {
            const walletHintWrapper = document.createElement('div');
            walletHintWrapper.className = 'wallet-info-hint-wrapper mb-3';
            walletHintWrapper.innerHTML = `
                <div class="alert alert-info">
                    <small>
                        <i class="fas fa-info-circle me-1"></i>
                        Hover over wallet addresses to view balances • Click to copy full address
                    </small>
                </div>
            `;
            cardBody.insertBefore(walletHintWrapper, networkPerfCards);
        }

        // Only put sortable metric cards in networkPerfCards
        networkPerfCards.innerHTML = orderedNetworkMetrics.map((metric, index) => {
            if (metric.isWallet) {
                // Special rendering for wallet metrics with popup
                const popupHtml = this.createWalletPopup(
                    metric.fullAddress,
                    metric.balances,
                    `${metric.title} Details`
                );

                return `
                    <div class="col-md-4 mb-3"
                         data-metric-id="${metric.title.toLowerCase().replace(/\s+/g, '_')}">
                        <div class="text-center wallet-metric">
                            ${popupHtml}
                            <div class="metric-icon mb-2">
                                <i class="fas ${metric.icon}"></i>
                            </div>
                            <div class="metric-value" style="cursor: pointer;"
                                 onclick="copyToClipboard('${metric.fullAddress}', '${metric.title}')"
                                 title="Click to copy full address">
                                ${metric.value}
                                <i class="fas fa-copy ms-1" style="font-size: 0.8em; opacity: 0.6;"></i>
                            </div>
                            <div class="metric-label">${metric.title}</div>
                        </div>
                    </div>
                `;
            } else {
                // Regular metric rendering
                if (metric.hasHover && metric.fullValue) {
                    // Metrics with copyable values (like tx_hash)
                    return `
                        <div class="col-md-4 mb-3"
                             data-metric-id="${metric.title.toLowerCase().replace(/\s+/g, '_')}">
                            <div class="text-center">
                                <div class="metric-icon mb-2">
                                    <i class="fas ${metric.icon}"></i>
                                </div>
                                <div class="metric-value" style="cursor: pointer;"
                                     onclick="copyToClipboard('${metric.fullValue}', '${metric.title}')"
                                     title="Click to copy full value">
                                    ${metric.value}
                                    <i class="fas fa-copy ms-1" style="font-size: 0.8em; opacity: 0.6;"></i>
                                </div>
                                <div class="metric-label">${metric.title}</div>
                            </div>
                        </div>
                    `;
                } else {
                    // Regular metrics without copy
                    return `
                        <div class="col-md-4 mb-3"
                             data-metric-id="${metric.title.toLowerCase().replace(/\s+/g, '_')}">
                            <div class="text-center">
                                <div class="metric-icon mb-2">
                                    <i class="fas ${metric.icon}"></i>
                                </div>
                                <div class="metric-value">${metric.value}</div>
                                <div class="metric-label">${metric.title}</div>
                            </div>
                        </div>
                    `;
                }
            }
        }).join('');

        // Initialize sortable for network metrics
        this.initializeSortable();
    }

    formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0) {
            return `${days}d ${hours}h ${minutes}m`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    formatLocaleDateTime(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch (error) {
            return 'Invalid Date';
        }
    }

    formatLocaleDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return 'Invalid Date';
        }
    }

    formatSmartDateTime(dateString) {
        try {
            const date = new Date(dateString);
            const now = new Date();

            // Check if the date is today
            const isToday = date.toDateString() === now.toDateString();

            if (isToday) {
                // Show time only (hours:minutes:seconds)
                return date.toLocaleTimeString();
            } else {
                // Show date only
                return date.toLocaleDateString();
            }
        } catch (error) {
            return 'Invalid Date';
        }
    }

    updateChart(canvasId, label, dailyData, unit, serverDate = null) {
        console.log(`updateChart called: canvasId=${canvasId}, label=${label}, data:`, dailyData);
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.error(`Canvas not found: ${canvasId}`);
            return;
        }

        // Destroy existing chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        if (!dailyData || (Array.isArray(dailyData) && dailyData.length === 0) || (typeof dailyData === 'object' && Object.keys(dailyData).length === 0)) {
            // Clear canvas and show no data message
            this.showNoDataMessage(canvas, `No ${label.toLowerCase()} data available`);
            return;
        }

        let dates, values;

        // Get server date from parameter, fallback to browser local timezone
        const todayStr = serverDate || this.getLocalDateString(new Date());

        // Handle both array format (from API) and object format
        if (Array.isArray(dailyData)) {
            dates = dailyData.map(item => item.date);
            values = dailyData.map(item => {
                // Handle different value fields based on data type
                return item.total_rewards || item.block_count || item.value || 0;
            });
        } else {
            // Filter out today's date from object format data
            dates = Object.keys(dailyData).filter(date => date !== todayStr).sort();
            values = dates.map(date => dailyData[date] || 0);
        }

        // Handle single data point scenario
        if (dates.length === 1) {
            this.showSingleDataPointMessage(canvas, `${label}: ${values[0]} ${unit || ''} on ${this.formatLocaleDate(dates[0])}`);
            return;
        }

        this.charts[canvasId] = new Chart(canvas, {
            type: 'line',
            data: {
                labels: dates.map(date => this.formatLocaleDate(date)),
                datasets: [{
                    label: `${label} (${unit || ''})`,
                    data: values,
                    borderColor: '#B3A3FF',
                    backgroundColor: 'rgba(179, 163, 255, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return context[0].label;
                            },
                            label: function(context) {
                                return `${context.parsed.y} ${unit || ''}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#CFCFCF'
                        },
                        grid: {
                            color: 'rgba(54, 54, 54, 0.5)'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#CFCFCF'
                        },
                        grid: {
                            color: 'rgba(54, 54, 54, 0.5)'
                        }
                    }
                }
            }
        });
    }

    showCacheNotification(nodeId, dataType, network = null) {
        const timestamp = this.getLastUpdateTime(nodeId, network);
        const timeStr = timestamp ? new Date(timestamp).toLocaleString() : 'Unknown';
        const networkStr = network ? ` (${network})` : '';

        // Add notification banner at top of dashboard
        const existingBanner = document.getElementById('cache-notification');
        if (existingBanner) {
            existingBanner.remove();
        }

        const banner = document.createElement('div');
        banner.id = 'cache-notification';
        banner.className = 'alert alert-warning alert-dismissible fade show mb-3';
        banner.innerHTML = `
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>Using cached data:</strong> Unable to fetch fresh ${dataType} data${networkStr}.
            Showing last updated: ${timeStr}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        const container = document.querySelector('.container-fluid');
        if (container) {
            container.insertBefore(banner, container.firstChild);
        }

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (banner.parentNode) {
                banner.remove();
            }
        }, 10000);
    }

    showError(nodeId, message) {
        const statusContainer = document.getElementById(`${nodeId}-status`);
        if (statusContainer) {
            statusContainer.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <strong>Error:</strong> ${message}
                    </div>
                </div>
            `;
        }
    }

    refreshNode(nodeId) {
        this.loadNodeData(nodeId);
    }

    startAutoRefresh() {
        // Clear any existing intervals
        if (this.systemRefreshInterval) {
            clearInterval(this.systemRefreshInterval);
        }
        if (this.networkRefreshInterval) {
            clearInterval(this.networkRefreshInterval);
        }

        // System data refresh using stored interval
        this.systemRefreshInterval = setInterval(() => {
            if (this.activeNodeId) {
                this.refreshSystemData(this.activeNodeId);
            }
        }, this.refreshSettings.systemInterval * 1000);

        // Network data refresh using stored interval
        this.networkRefreshInterval = setInterval(() => {
            if (this.activeNodeId) {
                this.refreshNetworkData(this.activeNodeId);
            }
        }, this.refreshSettings.networkInterval * 1000);
    }

    async refreshSystemData(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        try {
            // Fetch only system data
            const systemData = await this.fetchNodeData(node, 'all');

            // Cache the system data
            this.setStoredSystemData(nodeId, systemData);

            // Update system information
            this.updateSystemInfo(systemData, true); // API connected if we get here

            // Update system timestamp (not network timestamp)
            this.updateSystemTimestamp();

        } catch (error) {
            console.error('Error refreshing system data:', error);

            // Try to use cached system data
            const cachedSystemData = this.getStoredSystemData(nodeId);
            if (cachedSystemData) {
                console.log('Using cached system data due to API error');
                this.updateSystemInfo(cachedSystemData, false); // Using cache, API not connected
            }
        }
    }

    async refreshNetworkData(nodeId) {
        const node = this.nodes.find(n => n.id === nodeId);
        if (!node) return;

        try {
            const selectedNetwork = this.getSelectedNetwork(nodeId);
            if (!selectedNetwork) return;

            // Load network data
            await this.loadNetworkData(node, selectedNetwork);

            // Update full timestamp on network refresh
            this.updateLastUpdatedTimestamp();
            this.lastNetworkUpdate[nodeId] = Date.now();

        } catch (error) {
            console.error('Error refreshing network data:', error);
        }
    }

    updateSystemTimestamp() {
        // Update just the system part without changing the main timestamp
        // This could be expanded to show separate timestamps if needed
    }

    updateLastUpdatedTimestamp() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();

        const lastUpdatedElement = document.getElementById('lastUpdatedTime');
        const dashboardFooter = document.getElementById('dashboardFooter');

        if (lastUpdatedElement && dashboardFooter) {
            lastUpdatedElement.textContent = `${dateString} ${timeString}`;
            dashboardFooter.style.display = 'block';
        }
    }

    updateFooterRefreshInfo() {
        const systemSeconds = this.refreshSettings.systemInterval;
        const networkSeconds = this.refreshSettings.networkInterval;

        // Format display text
        const formatTime = (seconds) => {
            if (seconds < 60) return `${seconds}s`;
            if (seconds < 3600) return `${seconds / 60}min`;
            return `${(seconds / 3600).toFixed(1)}h`;
        };

        const refreshText = `System: ${formatTime(systemSeconds)} | Network: ${formatTime(networkSeconds)}`;

        // Find the refresh info span and update it
        const footerElement = document.querySelector('.last-updated-info span:last-child span');
        if (footerElement) {
            footerElement.textContent = refreshText;
        }
    }


    formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
        return num.toString();
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Initialize SortableJS for metric cards
    initializeSortable() {
        const systemCards = document.getElementById('systemInfoCards');
        const networkCards = document.getElementById('networkPerfCards');

        if (systemCards && !systemCards.sortableInstance) {
            systemCards.sortableInstance = Sortable.create(systemCards, {
                animation: 150,
                delay: 200,
                delayOnTouchOnly: true,
                touchStartThreshold: 3,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: () => {
                    this.saveMetricOrder('system');
                }
            });
        }

        if (networkCards && !networkCards.sortableInstance) {
            networkCards.sortableInstance = Sortable.create(networkCards, {
                animation: 150,
                delay: 200,
                delayOnTouchOnly: true,
                touchStartThreshold: 3,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: () => {
                    this.saveMetricOrder('network');
                }
            });
        }
    }

    // Save metric order preferences
    saveMetricOrder(metricType) {
        if (!this.activeNodeId) return;

        const container = metricType === 'system'
            ? document.getElementById('systemInfoCards')
            : document.getElementById('networkPerfCards');

        if (!container) return;

        const metricIds = Array.from(container.children)
            .map(card => card.dataset.metricId);

        const orderKey = `cfminspector_${this.activeNodeId}_${metricType}_metric_order`;
        localStorage.setItem(orderKey, JSON.stringify(metricIds));
    }

    getSavedMetricOrder(metricType, nodeId = null) {
        const targetNodeId = nodeId || this.activeNodeId;
        if (!targetNodeId) return null;

        const orderKey = `cfminspector_${targetNodeId}_${metricType}_metric_order`;
        const saved = localStorage.getItem(orderKey);
        return saved ? JSON.parse(saved) : null;
    }

    reorderMetrics(metrics, savedOrder) {
        if (!savedOrder || !Array.isArray(savedOrder)) {
            return metrics; // Return in original order if no saved order
        }

        // Create a map for quick lookup
        const metricMap = new Map();
        metrics.forEach(metric => {
            const id = metric.title.toLowerCase().replace(/\s+/g, '_');
            metricMap.set(id, metric);
        });

        // Reorder based on saved order, append any new metrics at the end
        const orderedMetrics = [];
        const processedIds = new Set();

        // First, add metrics in saved order
        savedOrder.forEach(id => {
            if (metricMap.has(id)) {
                orderedMetrics.push(metricMap.get(id));
                processedIds.add(id);
            }
        });

        // Then add any new metrics that weren't in saved order
        metrics.forEach(metric => {
            const id = metric.title.toLowerCase().replace(/\s+/g, '_');
            if (!processedIds.has(id)) {
                orderedMetrics.push(metric);
            }
        });

        return orderedMetrics;
    }
}

// Global functions for modal access
function showAddNodeModal() {
    nodeManager.showAddNodeModal();
}

function addNode() {
    nodeManager.addNode();
}

function editNode() {
    nodeManager.editNode();
}

async function testNodeConnection() {
    const name = document.getElementById('nodeName').value;
    const url = document.getElementById('nodeUrl').value;
    const token = document.getElementById('apiToken').value;

    if (!name || !url || !token) {
        alert('Please fill in all fields before testing connection.');
        return;
    }

    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Testing...';
    button.disabled = true;

    try {
        // Test basic connection with system data
        const testUrl = `${url}?access_token=${token}&action=active_networks`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        let response;
        try {
            response = await fetch(testUrl, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout (30 seconds)');
            }
            throw fetchError;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error(data.error || 'API request failed');
        }

        if (!data.data || !data.data.active_networks || data.data.active_networks.length === 0) {
            throw new Error('No active networks found');
        }

        // Success
        button.textContent = '✓ Connected';
        button.className = 'btn btn-success';

        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-secondary';
            button.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Connection test failed:', error);

        button.textContent = '✗ Failed';
        button.className = 'btn btn-danger';

        alert(`Connection test failed: ${error.message}`);

        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-secondary';
            button.disabled = false;
        }, 2000);
    }
}

function setupFirstNode() {
    nodeManager.setupFirstNode();
}

async function testSetupConnection() {
    const name = document.getElementById('setupNodeName').value;
    const url = document.getElementById('setupNodeUrl').value;
    const token = document.getElementById('setupApiToken').value;

    if (!name || !url || !token) {
        alert('Please fill in all fields before testing connection.');
        return;
    }

    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Testing...';
    button.disabled = true;

    try {
        // Test basic connection with system data
        const testUrl = `${url}?access_token=${token}&action=active_networks`;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        let response;
        try {
            response = await fetch(testUrl, {
                headers: {
                    'Accept-Encoding': 'gzip'
                },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
        } catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                throw new Error('Request timeout (30 seconds)');
            }
            throw fetchError;
        }

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error(data.error || 'API request failed');
        }

        if (!data.data || !data.data.active_networks || data.data.active_networks.length === 0) {
            throw new Error('No active networks found');
        }

        // Success
        button.textContent = '✓ Connected';
        button.className = 'btn btn-success';

        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-secondary';
            button.disabled = false;
        }, 2000);

    } catch (error) {
        console.error('Connection test failed:', error);

        button.textContent = '✗ Failed';
        button.className = 'btn btn-danger';

        alert(`Connection test failed: ${error.message}`);

        setTimeout(() => {
            button.textContent = originalText;
            button.className = 'btn btn-secondary';
            button.disabled = false;
        }, 2000);
    }
}

// Settings Modal Functions
function showSettingsModal() {
    const modal = new bootstrap.Modal(document.getElementById('settingsModal'));

    // Load current settings into the form
    const systemSelect = document.getElementById('systemRefreshInterval');
    const networkSelect = document.getElementById('networkRefreshInterval');

    if (nodeManager && systemSelect && networkSelect) {
        systemSelect.value = nodeManager.refreshSettings.systemInterval;
        networkSelect.value = nodeManager.refreshSettings.networkInterval;
    }

    modal.show();
}

function saveSettings() {
    const systemInterval = parseInt(document.getElementById('systemRefreshInterval').value);
    const networkInterval = parseInt(document.getElementById('networkRefreshInterval').value);

    if (nodeManager) {
        nodeManager.updateRefreshSettings(systemInterval, networkInterval);
    }

    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
    modal.hide();

    // Show success feedback
    showNotification('Settings saved successfully!', 'success');
}

function resetToDefaults() {
    document.getElementById('systemRefreshInterval').value = 30;
    document.getElementById('networkRefreshInterval').value = 300;
}

function showNotification(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }

    // Create Bootstrap toast with theme colors (card header style)
    const toastId = 'toast-' + Date.now();

    // Set icon and color based on type
    let iconClass, backgroundColor, textColor;
    if (type === 'success') {
        iconClass = 'check-circle';
        backgroundColor = '#1E1E1E';
        textColor = '#CCC2FF';
    } else if (type === 'error') {
        iconClass = 'exclamation-circle';
        backgroundColor = '#DC3545'; // Bootstrap danger red
        textColor = '#FFFFFF';
    } else {
        iconClass = 'info-circle';
        backgroundColor = '#1E1E1E';
        textColor = '#CCC2FF';
    }

    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center border-0" role="alert" aria-live="assertive" aria-atomic="true"
             style="background-color: ${backgroundColor} !important; color: ${textColor} !important;">
            <div class="toast-body">
                <i class="fas fa-${iconClass} me-2"></i>
                ${message}
            </div>
        </div>
    `;

    toastContainer.insertAdjacentHTML('beforeend', toastHtml);

    // Initialize and show toast
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 3000
    });

    toast.show();

    // Remove toast element after it's hidden
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

function copyToClipboard(text, label = 'Value') {
    if (!text) {
        showNotification(`No ${label} to copy`, 'info');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showNotification(`${label} copied to clipboard!`, 'success');
    }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        showNotification('Failed to copy to clipboard', 'info');
    });
}

// Initialize the application
let nodeManager;
document.addEventListener('DOMContentLoaded', function() {
    nodeManager = new NodeManager();
});