const { createApp, ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } = Vue;

createApp({
    setup() {
        // --- Config (multi-node) ---
        const nodes = ref(JSON.parse(localStorage.getItem('mni_nodes') || '[]'));
        const activeNodeIndex = ref(parseInt(localStorage.getItem('mni_active') || '0'));
        const config = reactive({ baseUrl: '', apiKey: '' });
        const showSetup = ref(true);
        const setupForm = reactive({ baseUrl: '', apiKey: '' });
        const setupLoading = ref(false);
        const setupError = ref('');
        const setupSuccess = ref('');

        const saveNodes = () => {
            localStorage.setItem('mni_nodes', JSON.stringify(nodes.value));
            localStorage.setItem('mni_active', String(activeNodeIndex.value));
        };

        const loadActiveNode = () => {
            const node = nodes.value[activeNodeIndex.value];
            if (node) {
                config.baseUrl = node.baseUrl;
                config.apiKey = node.apiKey;
                return true;
            }
            return false;
        };

        const switchNode = (index) => {
            stopPolling();
            activeNodeIndex.value = index;
            saveNodes();
            if (loadActiveNode()) {
                // Reset state
                network.value = {};
                networkName.value = '';
                activeNetworks.value = [];
                isSovereign.value = false;
                lastCacheTimestamp.value = '';
                txLoaded.value = false;
                txHistory.value = [];
                txSovHistory.value = [];
                updateStatus.value = '';
                updateFailed.value = false;
                startPolling();
            }
        };

        const openSettings = () => {
            setupForm.baseUrl = '';
            setupForm.apiKey = '';
            setupError.value = '';
            setupSuccess.value = '';
            showSetup.value = true;
        };

        const shareNode = (index) => {
            const node = nodes.value[index];
            const link = `${window.location.origin}${window.location.pathname}?url=${encodeURIComponent(node.baseUrl)}&key=${encodeURIComponent(node.apiKey)}`;
            copyToClipboard(link);
        };

        const removeNode = (index) => {
            nodes.value.splice(index, 1);
            if (nodes.value.length === 0) {
                activeNodeIndex.value = 0;
                config.baseUrl = '';
                config.apiKey = '';
                stopPolling();
            } else if (activeNodeIndex.value >= nodes.value.length) {
                activeNodeIndex.value = nodes.value.length - 1;
                switchNode(activeNodeIndex.value);
            } else if (index === activeNodeIndex.value) {
                switchNode(activeNodeIndex.value);
            }
            saveNodes();
        };

        // Check for shared link params
        const urlParams = new URLSearchParams(window.location.search);
        const sharedUrl = urlParams.get('url');
        const sharedKey = urlParams.get('key');
        if (sharedUrl && sharedKey) {
            setupForm.baseUrl = sharedUrl;
            setupForm.apiKey = sharedKey;
            // Clean URL without reloading
            window.history.replaceState({}, '', window.location.pathname);
        }

        // Init active node
        if (!sharedUrl && nodes.value.length && loadActiveNode()) {
            showSetup.value = false;
        }

        // --- API ---
        const apiFetch = async (params) => {
            const url = `${config.baseUrl}?${params}`;
            const res = await fetch(url, { headers: { 'X-API-Key': config.apiKey } });
            if (res.status === 403) throw new Error('auth');
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.status === 'error') throw new Error(json.message);
            return json.data;
        };

        const testConnection = async () => {
            setupLoading.value = true;
            setupError.value = '';
            setupSuccess.value = '';
            try {
                const baseUrl = setupForm.baseUrl.replace(/\/+$/, '');
                const res = await fetch(`${baseUrl}?action=hostname`, {
                    headers: { 'X-API-Key': setupForm.apiKey },
                });
                if (res.status === 403) {
                    setupError.value = 'Invalid API key';
                    return;
                }
                if (!res.ok) {
                    setupError.value = `Connection failed (HTTP ${res.status})`;
                    return;
                }
                const json = await res.json();
                if (json.status === 'error') {
                    setupError.value = json.message;
                    return;
                }
                const hostname = json.data.hostname;
                const nodeUrl = setupForm.baseUrl.replace(/\/+$/, '');
                const existing = nodes.value.findIndex(n => n.baseUrl === nodeUrl);
                if (existing >= 0) {
                    nodes.value[existing].apiKey = setupForm.apiKey;
                    nodes.value[existing].name = hostname;
                    activeNodeIndex.value = existing;
                } else {
                    nodes.value.push({ name: hostname, baseUrl: nodeUrl, apiKey: setupForm.apiKey });
                    activeNodeIndex.value = nodes.value.length - 1;
                }
                setupSuccess.value = `Connected to ${hostname}`;
                activeNodeIndex.value = nodes.value.length - 1;
                saveNodes();
                loadActiveNode();
                setTimeout(() => {
                    showSetup.value = false;
                    startPolling();
                }, 800);
            } catch (e) {
                setupError.value = e.message === 'Failed to fetch' ? 'Cannot reach node. Check the URL.' : e.message;
            } finally {
                setupLoading.value = false;
            }
        };

        // --- Plugin Update ---
        const updateStatus = ref('');
        const updateFailed = ref(false);

        const updatePlugin = async () => {
            if (updateStatus.value) return;
            updateStatus.value = 'Updating...';
            updateFailed.value = false;
            try {
                const data = await apiFetch('action=update_plugin');
                const msg = data.update_plugin || 'Update initiated';
                updateStatus.value = msg;
                if (!msg.includes('initiated') && !msg.includes('restarted')) {
                    updateFailed.value = true;
                }
            } catch (e) {
                updateStatus.value = 'Update failed';
                updateFailed.value = true;
            }
        };

        // --- State ---
        const system = ref({});
        const network = ref({});
        const networkName = ref('');
        const activeNetworks = ref([]);
        const isSovereign = ref(false);
        const loading = ref(false);
        const connectionError = ref('');
        const lastCacheTimestamp = ref('');

        // --- Theme ---
        const darkMode = ref(localStorage.getItem('mni_theme') !== 'light');
        if (!darkMode.value) document.documentElement.classList.add('light');

        const toggleTheme = () => {
            darkMode.value = !darkMode.value;
            document.documentElement.classList.toggle('light', !darkMode.value);
            localStorage.setItem('mni_theme', darkMode.value ? 'dark' : 'light');
            lucide.createIcons();
            nextTick(() => {
                updateCharts();
            });
        };

        // --- Polling ---
        let systemTimer = null;
        let networkTimer = null;

        const SYSTEM_ACTIONS = 'action=all';

        const NETWORK_ACTIONS = 'all';

        const fetchSystem = async () => {
            try {
                const data = await apiFetch(SYSTEM_ACTIONS);
                system.value = data;
                nextTick(() => { try { lucide.createIcons(); } catch(e) {} });
                if (data.active_networks && data.active_networks.length && !networkName.value) {
                    activeNetworks.value = data.active_networks;
                    networkName.value = data.active_networks[0];
                }
                connectionError.value = '';
            } catch (e) {
                if (e.message === 'auth') { connectionError.value = 'Authentication failed'; openSettings(); return; }
                connectionError.value = e.message;
            }
        };

        const fetchNetwork = async (force = false) => {
            if (!networkName.value) return;
            try {
                if (!force) {
                    const cacheData = await apiFetch(`network=${networkName.value}&network_action=cache_last_updated`);
                    const ts = cacheData[networkName.value]?.cache_last_updated;
                    if (ts && ts === lastCacheTimestamp.value) return;
                    lastCacheTimestamp.value = ts || '';
                }
                const data = await apiFetch(`network=${networkName.value}&network_action=${NETWORK_ACTIONS}`);
                const netData = data[networkName.value];
                network.value = netData;

                // Detect sovereign
                const sovAddr = netData.sovereign_reward_wallet_address;
                isSovereign.value = !!sovAddr && typeof sovAddr === 'string' && sovAddr.length > 20;
                connectionError.value = '';
                nextTick(() => {
                    updateCharts();
                    // Sovereign chart canvas may not exist until after this render cycle
                    nextTick(() => updateCharts());
                });
                loadTransactions();
            } catch (e) {
                if (e.message === 'auth') { connectionError.value = 'Authentication failed'; openSettings(); return; }
                connectionError.value = e.message;
            }
        };

        const fetchAllData = async () => {
            loading.value = true;
            await fetchSystem();
            await fetchNetwork(true);
            loading.value = false;
            nextTick(() => { try { lucide.createIcons(); } catch(e) {} startTutorial(); });
        };

        const refreshDashboard = async () => {
            await fetchAllData();
            nextTick(() => {
                document.querySelectorAll('.card').forEach(el => {
                    el.style.animation = 'none';
                    el.offsetHeight;
                    el.style.animation = '';
                });
            });
        };

        const startPolling = () => {
            stopPolling();
            fetchAllData();
            systemTimer = setInterval(fetchSystem, 30000);
            networkTimer = setInterval(() => fetchNetwork(false), 60000);
        };

        const downloadCSV = (data, filename, header) => {
            if (!data.length) return;
            const rows = [header];
            for (const d of data) rows.push(`${d.date},${d.total_rewards}`);
            const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            a.click();
            URL.revokeObjectURL(a.href);
        };

        const exportCSV = () => {
            const ticker = network.value.native_ticker || 'unknown';
            downloadCSV(network.value.reward_wallet_all_sums_daily || [], `rewards_${networkName.value}_${new Date().toISOString().split('T')[0]}.csv`, `Date,Rewards (${ticker})`);
        };

        const exportSovereignCSV = () => {
            const ticker = network.value.native_ticker || 'unknown';
            downloadCSV(network.value.sovereign_wallet_all_sums_daily || [], `sovereign_rewards_${networkName.value}_${new Date().toISOString().split('T')[0]}.csv`, `Date,Sovereign Rewards (${ticker})`);
        };

        const stopPolling = () => {
            if (systemTimer) { clearInterval(systemTimer); systemTimer = null; }
            if (networkTimer) { clearInterval(networkTimer); networkTimer = null; }
        };

        // --- Formatting Helpers ---
        const formatNumber = (num, decimals = 4) => {
            if (num === null || num === undefined || num === '') return '—';
            const n = parseFloat(num);
            if (isNaN(n)) return '—';
            return n.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            });
        };

        const formatUptime = (seconds) => {
            if (!seconds) return '—';
            const d = Math.floor(seconds / 86400);
            const h = Math.floor((seconds % 86400) / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            if (d > 0) return `${d}d ${h}h ${m}m`;
            if (h > 0) return `${h}h ${m}m`;
            return `${m}m`;
        };

        const formatBytes = (bytes) => {
            if (!bytes) return '—';
            const gb = bytes / (1024 * 1024 * 1024);
            return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(bytes / (1024 * 1024)).toFixed(0)} MB`;
        };

        const formatDate = (isoStr) => {
            if (!isoStr) return '—';
            return new Date(isoStr).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
                hour: '2-digit', minute: '2-digit',
            });
        };

        const formatDateShort = (isoStr) => {
            if (!isoStr) return '—';
            return new Date(isoStr).toLocaleString(undefined, {
                year: 'numeric', month: 'short', day: 'numeric',
            });
        };

        const truncateHash = (hash) => {
            if (!hash) return '—';
            return hash.length > 16 ? `${hash.slice(0, 8)}...${hash.slice(-8)}` : hash;
        };

        const scanUrl = (hash) => {
            if (!hash) return '';
            return `https://scan.cellframe.net/datum-details/${hash}?net=${networkName.value}`;
        };

        const toast = ref('');
        let toastTimer = null;

        const showToast = (msg) => {
            toast.value = msg;
            if (toastTimer) clearTimeout(toastTimer);
            toastTimer = setTimeout(() => { toast.value = ''; }, 2000);
        };

        const sortedBalances = (balances) => {
            if (!balances) return [];
            return Object.entries(balances).sort((a, b) => b[1] - a[1]);
        };

        const copyToClipboard = (text) => {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(() => {});
            } else {
                const ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            showToast('Copied to clipboard');
        };

        // --- Charts ---
        const chartDays = ref(30);
        const availableChartDays = computed(() => {
            const totalDays = (network.value.reward_wallet_all_sums_daily || []).length;
            if (!totalDays) return [];
            return [7, 14, 30, 90].filter(d => d <= totalDays);
        });
        let rewardsChart = null;
        let blocksChart = null;
        let sovereignChart = null;

        const updateCharts = () => {
            const days = chartDays.value;
            const gridColor = darkMode.value ? 'rgba(30, 41, 59, 0.4)' : 'rgba(148, 163, 184, 0.2)';
            const tickColor = '#64748B';
            const chartOpts = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'Outfit' } } },
                    x: { grid: { color: gridColor }, ticks: { color: tickColor, font: { family: 'Outfit' }, maxRotation: 45, maxTicksLimit: 15 } },
                },
            };
            const chartOptsLegend = {
                ...chartOpts,
                plugins: { legend: { labels: { color: '#94A3B8', usePointStyle: true, pointStyle: 'circle', font: { family: 'Outfit' } } } },
            };

            // Rewards Chart (combined: reward wallet + sovereign if present)
            const rewardsData = (network.value.reward_wallet_all_sums_daily || []).slice(-days);
            const sovData = (network.value.sovereign_wallet_all_sums_daily || []).slice(-days);
            const ctxR = document.getElementById('rewardsChart');
            if (ctxR) {
                if (rewardsChart) rewardsChart.destroy();
                const ctx2d = ctxR.getContext('2d');
                const rewardGradient = ctx2d.createLinearGradient(0, 0, 0, 250);
                rewardGradient.addColorStop(0, 'rgba(167, 139, 250, 0.25)');
                rewardGradient.addColorStop(1, 'rgba(167, 139, 250, 0)');
                const datasets = [{
                    label: 'Reward Wallet',
                    data: rewardsData.map(d => d.total_rewards),
                    borderColor: '#A78BFA',
                    backgroundColor: rewardGradient,
                    fill: true,
                    tension: 0.3,
                    pointRadius: days <= 30 ? 3 : 0,
                    pointBackgroundColor: '#A78BFA',
                    borderWidth: 2,
                }];
                if (sovData.length) {
                    const sovGradient = ctx2d.createLinearGradient(0, 0, 0, 250);
                    sovGradient.addColorStop(0, 'rgba(251, 191, 36, 0.2)');
                    sovGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
                    datasets.push({
                        label: 'Sovereign Wallet',
                        data: sovData.map(d => d.total_rewards),
                        borderColor: '#FBBF24',
                        backgroundColor: sovGradient,
                        fill: true,
                        tension: 0.3,
                        pointRadius: days <= 30 ? 3 : 0,
                        pointBackgroundColor: '#FBBF24',
                        borderWidth: 2,
                    });
                }
                rewardsChart = new Chart(ctxR.getContext('2d'), {
                    type: 'line',
                    data: {
                        labels: rewardsData.map(d => d.date),
                        datasets,
                    },
                    options: sovData.length ? chartOptsLegend : chartOpts,
                });
            }

            // Blocks Chart
            const blocksData = (network.value.signed_blocks_all_sums_daily || []).slice(-days);
            const firstBlocksData = (network.value.first_signed_blocks_all_sums_daily || []).slice(-days);
            const ctxB = document.getElementById('blocksChart');
            if (ctxB) {
                if (blocksChart) blocksChart.destroy();
                const ctxB2d = ctxB.getContext('2d');
                const signedGradient = ctxB2d.createLinearGradient(0, 0, 0, 250);
                signedGradient.addColorStop(0, 'rgba(96, 165, 250, 0.15)');
                signedGradient.addColorStop(1, 'rgba(96, 165, 250, 0)');
                const firstGradient = ctxB2d.createLinearGradient(0, 0, 0, 250);
                firstGradient.addColorStop(0, 'rgba(248, 113, 113, 0.1)');
                firstGradient.addColorStop(1, 'rgba(248, 113, 113, 0)');
                blocksChart = new Chart(ctxB2d, {
                    type: 'line',
                    data: {
                        labels: blocksData.map(d => d.date),
                        datasets: [
                            {
                                label: 'Signed Blocks',
                                data: blocksData.map(d => d.block_count),
                                borderColor: '#60A5FA',
                                backgroundColor: signedGradient,
                                fill: true,
                                tension: 0.3,
                                pointRadius: days <= 30 ? 3 : 0,
                                pointBackgroundColor: '#60A5FA',
                                borderWidth: 2,
                            },
                            {
                                label: 'First Signed Blocks',
                                data: firstBlocksData.map(d => d.block_count),
                                borderColor: '#F87171',
                                backgroundColor: firstGradient,
                                fill: true,
                                tension: 0.3,
                                pointRadius: days <= 30 ? 3 : 0,
                                pointBackgroundColor: '#F87171',
                                borderWidth: 2,
                            },
                        ],
                    },
                    options: chartOptsLegend,
                });
            }

        };

        // --- Transaction History ---
        const txHistory = ref([]);
        const txLoading = ref(false);
        const txLoaded = ref(false);
        const txSovHistory = ref([]);
        const txTab = ref('reward');
        const txPage = ref(1);
        const txPerPage = 25;
        const txSort = reactive({ field: 'tx_created', asc: false });

        const loadTransactions = () => {
            txHistory.value = parseTxList(network.value.reward_wallet_daily_rewards || []);
            txSovHistory.value = parseTxList(network.value.sovereign_wallet_daily_rewards || []);
            txLoaded.value = true;
            txPage.value = 1;
        };

        const parseTxList = (raw) => {
            if (!Array.isArray(raw)) return [];
            return raw.map(tx => ({
                hash: tx.tx_hash || '',
                tx_created: tx.tx_created || '',
                amount: parseFloat(tx.recv_coins || 0),
                token: tx.token || '',
            }));
        };

        const toggleTxSort = (field) => {
            if (txSort.field === field) {
                txSort.asc = !txSort.asc;
            } else {
                txSort.field = field;
                txSort.asc = false;
            }
            txPage.value = 1;
        };

        const txActiveList = computed(() => {
            const list = txTab.value === 'sovereign' ? txSovHistory.value : txHistory.value;
            const sorted = [...list].sort((a, b) => {
                let va = a[txSort.field], vb = b[txSort.field];
                if (txSort.field === 'tx_created') { va = new Date(va); vb = new Date(vb); }
                if (va < vb) return txSort.asc ? -1 : 1;
                if (va > vb) return txSort.asc ? 1 : -1;
                return 0;
            });
            return sorted;
        });

        const txTotalPages = computed(() => Math.max(1, Math.ceil(txActiveList.value.length / txPerPage)));

        const txPageData = computed(() => {
            const start = (txPage.value - 1) * txPerPage;
            return txActiveList.value.slice(start, start + txPerPage);
        });

        // --- Tutorial ---
        const startTutorial = (manual = false) => {
            if (manual) localStorage.removeItem('mni_tutorial_seen');
            if (!manual && localStorage.getItem('mni_tutorial_seen')) return;

            const steps = [
                { element: '#tour-nodes', popover: { title: 'Node Selector', description: 'Switch between your configured nodes.', side: 'bottom' } },
                { element: '#tour-network', popover: { title: 'Network', description: 'Switch between available networks on this node.', side: 'bottom' } },
                { element: '#tour-days', popover: { title: 'Chart Range', description: 'Choose how many days of data to display in the charts.', side: 'bottom' } },
                { element: '#tour-refresh', popover: { title: 'Refresh', description: 'Manually refresh the dashboard data.', side: 'bottom' } },
                { element: '#tour-share', popover: { title: 'Share', description: 'Copy a shareable link to this node\'s dashboard.', side: 'bottom' } },
                { element: '#tour-theme', popover: { title: 'Theme', description: 'Switch between dark and light mode.', side: 'bottom' } },
                { element: '#tour-settings', popover: { title: 'Node Selector', description: 'Go back to the node selector to add or switch between nodes.', side: 'bottom', align: 'end' } },
                { element: '#tour-help', popover: { title: 'Help', description: 'Click here anytime to replay this tour.', side: 'bottom', align: 'end' } },
            ];

            // Filter out steps whose target element doesn't exist (e.g. day selector hidden when no data)
            const activeSteps = steps.filter(s => document.querySelector(s.element));

            const driverObj = window.driver.js.driver({
                showProgress: true,
                animate: true,
                onDestroyed: () => { localStorage.setItem('mni_tutorial_seen', 'true'); },
                steps: activeSteps,
            });
            driverObj.drive();
        };

        // --- Lifecycle ---
        onMounted(() => {
            if (loadActiveNode()) startPolling();
            nextTick(() => { try { lucide.createIcons(); } catch(e) {} });
        });

        onUnmounted(() => stopPolling());

        watch(networkName, () => { lastCacheTimestamp.value = ''; fetchNetwork(true); });
        watch(chartDays, () => updateCharts());

        return {
            // Config
            showSetup, setupForm, setupLoading, setupError, setupSuccess,
            testConnection, openSettings, config, updatePlugin, updateStatus, updateFailed,
            nodes, activeNodeIndex, switchNode, removeNode, shareNode,
            // State
            system, network, networkName, activeNetworks, isSovereign,
            loading, connectionError, lastCacheTimestamp, darkMode, toggleTheme,
            // Formatting
            formatNumber, formatUptime, formatBytes, formatDate, formatDateShort,
            truncateHash, copyToClipboard, scanUrl, toast, sortedBalances,
            // Charts
            chartDays, availableChartDays,
            // Transactions
            txHistory, txSovHistory, txLoading, txLoaded, txTab, txPage, txPerPage, txSort,
            loadTransactions, toggleTxSort, txActiveList, txTotalPages, txPageData,
            // Actions
            fetchAllData, refreshDashboard, startPolling, exportCSV, exportSovereignCSV, startTutorial,
        };
    }
}).mount('#app');
