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
        this.init();
    }

    init() {
        if (this.nodes.length === 0) {
            this.showSetupModal();
        } else {
            this.renderNodeTabs();
            this.loadNodeData(this.activeNodeId || this.nodes[0].id);
            this.startAutoRefresh();
        }
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

    removeNode(nodeId) {
        if (confirm('Are you sure you want to remove this node?')) {
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

    updateRemoveButtonVisibility() {
        const removeBtn = document.getElementById('removeNodeBtn');
        const nodeSelector = document.getElementById('nodeSelector');

        if (removeBtn && nodeSelector) {
            // Show remove button only if a node is selected and we have nodes
            const hasSelection = nodeSelector.value && nodeSelector.value !== '';
            const hasNodes = this.nodes.length > 0;

            removeBtn.style.display = (hasSelection && hasNodes) ? 'block' : 'none';
        }
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

        // Populate node selector
        nodeSelector.innerHTML = '<option value="">Select Node...</option>';
        this.nodes.forEach(node => {
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
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Rewards Daily Chart</h5>
                                <select class="form-select form-select-sm" style="width: auto;"
                                        id="${node.id}-days-selector"
                                        onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'rewards')">
                                    <!-- Days options will be populated dynamically -->
                                </select>
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
                                <select class="form-select form-select-sm" style="width: auto;"
                                        id="${node.id}-sovereign-days-selector"
                                        onchange="nodeManager.changeDays('${node.id}', parseInt(this.value), 'sovereign')">
                                    <!-- Days options will be populated dynamically -->
                                </select>
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
                    <div class="col-md-6">
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

        // Only add standard options based on available data:
        // - 7 days: available if data >= 7
        // - 14 days: available if data >= 14
        // - 30 days: only available if data >= 30 (not for 28 days)
        if (actualDataDays >= 7) smartOptions.push(7);
        if (actualDataDays >= 14) smartOptions.push(14);
        if (actualDataDays >= 30) smartOptions.push(30);

        // For datasets with less than 7 days, offer the actual data length
        if (actualDataDays < 7 && actualDataDays > 1) {
            smartOptions.push(actualDataDays);
        }

        // If we have no valid options, just use the actual data length
        if (smartOptions.length === 0) {
            return [actualDataDays];
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
            // Fetch all network data by calling individual actions separately to avoid truncation
            const networkData = await this.fetchNetworkDataSeparately(node, network);

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
        const response = await fetch(url, {
            headers: {
                'Accept-Encoding': 'gzip'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error(data.error || 'API request failed');
        }

        return data.data;
    }

    async fetchNetworkData(node, network, actions, days = null) {
        let url = `${node.url}?access_token=${node.token}&network=${network}&network_action=${actions}`;
        if (days) {
            url += `&days_cutoff=${days}`;
        }

        const response = await fetch(url, {
            headers: {
                'Accept-Encoding': 'gzip'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status !== 'ok') {
            throw new Error(data.error || 'API request failed');
        }

        return data.data[network] || {};
    }

    async fetchNetworkDataSeparately(node, network, days = null) {
        console.log(`Fetching network data separately for ${network} to avoid truncation`);

        // Define the network actions to fetch (based on available_network_actions from API)
        const networkActions = [
            // Core status and configuration
            'autocollect_status', 'network_status', 'sovereign_reward_wallet_address',
            'reward_wallet_address', 'native_ticker', 'days_cutoff',

            // Block and chain data
            'block_count_today', 'block_count', 'chain_size', 'current_block_reward',

            // First signed blocks
            'first_signed_blocks_count', 'first_signed_blocks_daily_amount',
            'first_signed_blocks_daily', 'first_signed_blocks_all_sums_daily',
            'first_signed_blocks_earliest', 'first_signed_blocks_latest',
            'first_signed_blocks_today_amount', 'first_signed_blocks_today',
            'first_signed_blocks_yesterday_amount', 'first_signed_blocks_yesterday',

            // Signed blocks
            'signed_blocks_count', 'signed_blocks_daily_amount', 'signed_blocks_daily',
            'signed_blocks_all_sums_daily', 'signed_blocks_earliest', 'signed_blocks_latest',
            'signed_blocks_today_amount', 'signed_blocks_today', 'signed_blocks_yesterday_amount',
            'signed_blocks_yesterday',

            // Token and pricing
            'token_price',

            // Reward wallet data
            'reward_wallet_balance', 'reward_wallet_biggest_reward', 'reward_wallet_daily_rewards',
            'reward_wallet_all_sums_daily', 'reward_wallet_earliest_reward', 'reward_wallet_latest_reward',
            'reward_wallet_today_rewards', 'reward_wallet_yesterday_rewards', 'reward_wallet_smallest_reward',
            'reward_wallet_total_rewards',

            // Sovereign wallet data
            'sovereign_wallet_balance', 'sovereign_wallet_biggest_reward', 'sovereign_wallet_daily_rewards',
            'sovereign_wallet_all_sums_daily', 'sovereign_wallet_earliest_reward', 'sovereign_wallet_latest_reward',
            'sovereign_wallet_today_rewards', 'sovereign_wallet_yesterday_rewards', 'sovereign_wallet_smallest_reward',
            'sovereign_wallet_total_rewards',

            // Cache info
            'cache_last_updated'
        ];

        const combinedData = {};
        const fetchPromises = [];
        const batchSize = 10; // Fetch in batches to avoid overwhelming the server

        // Process actions in batches
        for (let i = 0; i < networkActions.length; i += batchSize) {
            const batch = networkActions.slice(i, i + batchSize);
            const batchPromise = this.fetchActionBatch(node, network, batch, days);
            fetchPromises.push(batchPromise);
        }

        try {
            console.log(`Fetching ${networkActions.length} network actions in ${fetchPromises.length} batches of ${batchSize}`);

            // Wait for all batches to complete
            const batchResults = await Promise.all(fetchPromises);

            // Combine all batch results into one object
            for (const batchData of batchResults) {
                Object.assign(combinedData, batchData);
            }

            console.log(`Successfully fetched ${Object.keys(combinedData).length} network actions for ${network}`);
            return combinedData;

        } catch (error) {
            console.error(`Error fetching network data separately for ${network}:`, error);
            // Fallback to the original method if separate fetching fails
            console.log('Falling back to single request with all actions');
            return await this.fetchNetworkData(node, network, 'all', days);
        }
    }

    async fetchActionBatch(node, network, actions, days = null) {
        const batchData = {};
        const promises = actions.map(async (action) => {
            try {
                const actionData = await this.fetchNetworkData(node, network, action, days);
                return { action, data: actionData };
            } catch (error) {
                console.warn(`Failed to fetch action ${action} for ${network}:`, error);
                return { action, data: null };
            }
        });

        const results = await Promise.all(promises);

        // Combine results into batch data
        for (const { action, data } of results) {
            if (data && typeof data === 'object') {
                // If the data has the action as a key, use its value
                if (data[action] !== undefined) {
                    batchData[action] = data[action];
                } else {
                    // Otherwise, use the entire data object
                    batchData[action] = data;
                }
            }
        }

        return batchData;
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
                console.log('No cached data, fetching from API using separate calls');
                // If no cached data, fetch all data using separate calls to avoid truncation
                const chartData = await this.fetchNetworkDataSeparately(node, network);
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

    filterDataByDays(dataArray, days) {
        if (!dataArray || !Array.isArray(dataArray)) {
            return dataArray;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        return dataArray.filter(item => {
            if (!item.date) return false;
            const itemDate = new Date(item.date);
            return itemDate >= cutoffDate;
        }).sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    updateCharts(nodeId, network, data, skipFiltering = false, chartType = 'all') {
        console.log(`updateCharts called: nodeId=${nodeId}, chartType=${chartType}, skipFiltering=${skipFiltering}`);

        // Show charts section when data is ready
        const chartsSection = document.getElementById(`${nodeId}-charts-section`);
        if (chartsSection) {
            chartsSection.style.display = 'block';
        }

        let rewardsData, blocksData, firstBlocksData;

        if (skipFiltering) {
            // Use data as-is (already filtered by API)
            console.log('Using API-filtered data');
            rewardsData = data.reward_wallet_all_sums_daily;
            blocksData = data.signed_blocks_all_sums_daily;
            firstBlocksData = data.first_signed_blocks_all_sums_daily;
        } else {
            // Apply client-side filtering with chart-specific days
            console.log('Using client-side filtering');
            const rewardsDays = this.getSelectedDays(nodeId, 'rewards');
            const blocksDays = this.getSelectedDays(nodeId, 'blocks');
            const firstBlocksDays = this.getSelectedDays(nodeId, 'first-blocks');

            console.log(`Selected days: rewards=${rewardsDays}, blocks=${blocksDays}, first-blocks=${firstBlocksDays}`);

            rewardsData = this.filterDataByDays(data.reward_wallet_all_sums_daily, rewardsDays);
            blocksData = this.filterDataByDays(data.signed_blocks_all_sums_daily, blocksDays);
            firstBlocksData = this.filterDataByDays(data.first_signed_blocks_all_sums_daily, firstBlocksDays);
        }

        // Update charts based on type
        if (chartType === 'all' || chartType === 'rewards') {
            console.log(`Updating rewards chart for ${nodeId}`, rewardsData);
            this.updateChart(`${nodeId}-rewards-chart`, 'Rewards', rewardsData, data.native_ticker);
        }

        if (chartType === 'all' || chartType === 'blocks') {
            console.log(`Updating blocks chart for ${nodeId}`, blocksData);
            this.updateChart(`${nodeId}-blocks-chart`, 'Blocks', blocksData, 'blocks');
        }

        if (chartType === 'all' || chartType === 'first-blocks') {
            console.log(`Updating first-blocks chart for ${nodeId}`, firstBlocksData);
            this.updateChart(`${nodeId}-first-blocks-chart`, 'First Signed Blocks', firstBlocksData, 'blocks');
        }

        // Handle sovereign chart positioning - show next to rewards when available
        const sovereignChartContainer = document.getElementById(`${nodeId}-sovereign-chart-container`);
        const blocksChartContainer = document.getElementById(`${nodeId}-blocks-chart-container`);
        const secondRow = document.getElementById(`${nodeId}-second-row`);

        if (data.sovereign_reward_wallet_address && data.sovereign_wallet_all_sums_daily) {
            // Show sovereign chart next to rewards
            if (sovereignChartContainer) {
                sovereignChartContainer.style.display = 'block';
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
                    sovereignData = data.sovereign_wallet_all_sums_daily;
                } else {
                    const sovereignDays = this.getSelectedDays(nodeId, 'sovereign');
                    sovereignData = this.filterDataByDays(data.sovereign_wallet_all_sums_daily, sovereignDays);
                }

                this.updateChart(`${nodeId}-sovereign-chart`, 'Sovereign Rewards', sovereignData, data.native_ticker);
            }
        } else {
            // Hide sovereign chart and keep blocks chart in first row
            if (sovereignChartContainer) {
                sovereignChartContainer.style.display = 'none';
            }

            // Ensure blocks chart stays in first row if no sovereign
            if (blocksChartContainer && blocksChartContainer.parentElement !== document.querySelector(`#${nodeId}-charts-section .row`)) {
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
            }

            // Choose icon based on status
            let statusIcon = 'fa-circle-check'; // Default for online
            if (statusClass === 'status-offline') {
                statusIcon = 'fa-circle-xmark'; // X for offline
            } else if (statusClass === 'status-loading') {
                statusIcon = 'fa-circle-question'; // Question mark for loading
            }

            const systemMetrics = [
                {
                    title: 'NODE STATUS',
                    icon: statusIcon,
                    value: nodeStatus,
                    statusClass: statusClass
                },
                {
                    title: 'CURRENT VERSION',
                    icon: 'fa-code-branch',
                    value: systemData.current_node_version || 'N/A',
                    isUpToDate: systemData.current_node_version === systemData.latest_node_version
                },
                {
                    title: 'LATEST VERSION',
                    icon: 'fa-download',
                    value: systemData.latest_node_version || 'N/A'
                },
                {
                    title: 'CPU USAGE',
                    icon: 'fa-microchip',
                    value: `${(systemData.node_cpu_usage || 0).toFixed(1)}%`
                },
                {
                    title: 'MEMORY USAGE',
                    icon: 'fa-memory',
                    value: `${(systemData.node_memory_usage || 0).toFixed(2)} MB`
                },
                {
                    title: 'NODE UPTIME',
                    icon: 'fa-clock',
                    value: this.formatUptime(systemData.node_uptime || 0)
                },
                {
                    title: 'SYSTEM UPTIME',
                    icon: 'fa-server',
                    value: this.formatUptime(systemData.system_uptime || 0)
                },
                {
                    title: 'EXTERNAL IP',
                    icon: 'fa-globe',
                    value: systemData.external_ip || 'N/A'
                },
                {
                    title: 'HOSTNAME',
                    icon: 'fa-desktop',
                    value: systemData.hostname || 'Unknown'
                }
            ];

            systemCards.innerHTML = systemMetrics.map(metric => `
                <div class="col-md-4 mb-3">
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

        // Build network metrics array
        const networkMetrics = [
            {
                title: 'NETWORK STATE',
                icon: networkStateIcon,
                value: networkStateStatus,
                statusClass: networkStateClass
            },
            {
                title: 'SIGNED BLOCKS TODAY',
                icon: 'fa-cube',
                value: networkData.signed_blocks_today_amount || 0
            },
            {
                title: 'FIRST SIGNED BLOCKS TODAY',
                icon: 'fa-trophy',
                value: networkData.first_signed_blocks_today_amount || 0
            },
            {
                title: 'REWARDS RECEIVED TODAY',
                icon: 'fa-coins',
                value: `${(parseFloat(networkData.reward_wallet_today_rewards) || 0).toFixed(2)} ${networkData.native_ticker || 'TOKEN'}`
            },
            {
                title: 'BLOCKS TODAY (NETWORK)',
                icon: 'fa-cubes',
                value: networkData.block_count_today || 0
            },
            {
                title: 'TOTAL BLOCKS (NETWORK)',
                icon: 'fa-layer-group',
                value: (networkData.block_count || 0).toLocaleString()
            },
            {
                title: 'REWARD WALLET',
                icon: 'fa-wallet',
                value: this.formatWalletAddress(networkData.reward_wallet_address),
                isWallet: true,
                walletType: 'reward',
                fullAddress: networkData.reward_wallet_address,
                balances: networkData.reward_wallet_balance,
                hasInfo: true
            }
        ];

        // Add sovereign wallet only if it exists
        if (networkData.sovereign_reward_wallet_address) {
            networkMetrics.push({
                title: 'SOVEREIGN WALLET',
                icon: 'fa-shield-halved',
                value: this.formatWalletAddress(networkData.sovereign_reward_wallet_address),
                isWallet: true,
                walletType: 'sovereign',
                fullAddress: networkData.sovereign_reward_wallet_address,
                balances: networkData.sovereign_wallet_balance,
                hasInfo: true
            });
        }

        // Continue with other metrics
        networkMetrics.push(
            {
                title: 'AUTOCOLLECT',
                icon: 'fa-robot',
                value: networkData.autocollect_status?.active ? 'Active' : 'Inactive'
            },
            {
                title: 'TOKEN PRICE',
                icon: 'fa-chart-line',
                value: `$${networkData.token_price || 0}`
            },
            {
                title: 'CURRENT BLOCK REWARD',
                icon: 'fa-gift',
                value: `${(parseFloat(networkData.current_block_reward) || 0).toFixed(2)} ${networkData.native_ticker || 'TOKEN'}`
            },
            {
                title: 'BIGGEST REWARD',
                icon: 'fa-crown',
                value: `${(parseFloat(networkData.reward_wallet_biggest_reward?.recv_coins) || 0).toFixed(2)} ${networkData.native_ticker || 'TOKEN'}`
            },
            {
                title: 'SMALLEST REWARD',
                icon: 'fa-arrow-down',
                value: `${(parseFloat(networkData.reward_wallet_smallest_reward?.recv_coins) || 0).toFixed(2)} ${networkData.native_ticker || 'TOKEN'}`
            },
            {
                title: 'LATEST REWARD',
                icon: 'fa-clock-rotate-left',
                value: networkData.reward_wallet_latest_reward ?
                    `${(parseFloat(networkData.reward_wallet_latest_reward.recv_coins) || 0).toFixed(2)} ${networkData.native_ticker || 'TOKEN'} (${this.formatSmartDateTime(networkData.reward_wallet_latest_reward.tx_created)})` :
                    'N/A'
            },
            {
                title: 'NETWORK STATUS',
                icon: 'fa-network-wired',
                value: networkData.network_status?.synced ? 'Synced' : 'Not Synced'
            },
            {
                title: 'NODE ADDRESS',
                icon: 'fa-fingerprint',
                value: networkData.network_status?.node_address ?
                    (networkData.network_status.node_address.length > 30 ?
                        networkData.network_status.node_address.substring(0, 30) + '...' :
                        networkData.network_status.node_address) : 'N/A'
            },
            {
                title: 'REMOTE CACHE UPDATED',
                icon: 'fa-database',
                value: networkData.cache_last_updated ? this.formatLocaleDateTime(networkData.cache_last_updated) : 'N/A'
            }
        );

        // Add hint below header if wallets exist
        const walletHint = networkMetrics.some(m => m.isWallet) ?
            `<div class="col-12 mb-2">
                <div class="wallet-info-hint text-center">
                    <i class="fas fa-info-circle"></i> Hover over wallet addresses to view balances and full address
                </div>
            </div>` : '';

        networkPerfCards.innerHTML = walletHint + networkMetrics.map(metric => {
            if (metric.isWallet) {
                // Special rendering for wallet metrics with popup
                const popupHtml = this.createWalletPopup(
                    metric.fullAddress,
                    metric.balances,
                    `${metric.title} Details`
                );

                return `
                    <div class="col-md-4 mb-3">
                        <div class="text-center wallet-metric">
                            ${popupHtml}
                            <div class="metric-icon mb-2">
                                <i class="fas ${metric.icon}"></i>
                            </div>
                            <div class="metric-value" style="cursor: help;">
                                ${metric.value}
                            </div>
                            <div class="metric-label">${metric.title}</div>
                        </div>
                    </div>
                `;
            } else {
                // Regular metric rendering
                return `
                    <div class="col-md-4 mb-3">
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
        }).join('');
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

    updateChart(canvasId, label, dailyData, unit) {
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

        // Handle both array format (from API) and object format
        if (Array.isArray(dailyData)) {
            dates = dailyData.map(item => item.date);
            values = dailyData.map(item => {
                // Handle different value fields based on data type
                return item.total_rewards || item.block_count || item.value || 0;
            });
        } else {
            dates = Object.keys(dailyData).sort();
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
}

// Global functions for modal access
function showAddNodeModal() {
    nodeManager.showAddNodeModal();
}

function addNode() {
    nodeManager.addNode();
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
        const response = await fetch(testUrl, {
            headers: {
                'Accept-Encoding': 'gzip'
            }
        });

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
        const response = await fetch(testUrl, {
            headers: {
                'Accept-Encoding': 'gzip'
            }
        });

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
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Initialize the application
let nodeManager;
document.addEventListener('DOMContentLoaded', function() {
    nodeManager = new NodeManager();
});