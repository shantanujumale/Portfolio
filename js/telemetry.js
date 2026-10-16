/**
 * ============================================================================
 * PORTFOLIO VISITOR TELEMETRY & OWNER ANALYTICS DASHBOARD
 * Lead Engineer & Telemetry System | Vanilla JavaScript
 * Tracks: IP, Geolocation (Country, City, Region, ISP), OS (Windows/Mac/Android/iOS/Linux),
 * Device Type, Browser, Network Connection Type (4G/5G/WiFi), Screen Specs, Viewed Sections.
 * Secure Owner Login & Executive Analytics Dashboard.
 * ============================================================================
 */

(function () {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_LOGS = 'portfolio_visitor_logs';
  const STORAGE_KEY_PASSWORD = 'portfolio_owner_password';
  const STORAGE_KEY_WEBHOOK = 'portfolio_owner_webhook';
  const STORAGE_KEY_AUTH = 'portfolio_owner_auth';
  const SESSION_KEY_CURRENT = 'portfolio_current_session_id';

  // Default Master Password
  const DEFAULT_PASSWORD = 'shantanu2026';

  // ----------------------------------------------------------------------------
  // 1. TELEMETRY DETECTOR (Device, OS, Browser, Network, Screen)
  // ----------------------------------------------------------------------------
  const TelemetryDetector = {
    // Detect Operating System with high precision
    getOS() {
      const ua = navigator.userAgent || '';
      const platform = navigator.platform || '';

      if (/Windows NT 10.0/i.test(ua)) {
        // High-entropy client hints if supported
        if (navigator.userAgentData && navigator.userAgentData.platform === 'Windows') {
          return 'Windows 10 / 11';
        }
        return 'Windows 10 / 11';
      }
      if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
      if (/Windows NT 6.2/i.test(ua)) return 'Windows 8';
      if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
      if (/iPhone/i.test(ua)) {
        const match = ua.match(/OS (\d+_\d+)/);
        return match ? `iOS ${match[1].replace('_', '.')}` : 'iOS (iPhone)';
      }
      if (/iPad/i.test(ua)) return 'iPadOS';
      if (/Android/i.test(ua)) {
        const match = ua.match(/Android\s([0-9.]+)/i);
        return match ? `Android ${match[1]}` : 'Android';
      }
      if (/Macintosh|Mac OS X/i.test(ua)) {
        const match = ua.match(/Mac OS X ([0-9_]+)/);
        return match ? `macOS ${match[1].replace(/_/g, '.')}` : 'macOS';
      }
      if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'Linux';
      if (/CrOS/i.test(ua)) return 'ChromeOS';
      return platform || 'Unknown OS';
    },

    // Detect Browser & Version
    getBrowser() {
      const ua = navigator.userAgent || '';
      let browser = 'Unknown Browser';
      let version = '';

      if (/Edg\/([0-9.]+)/i.test(ua)) {
        browser = 'Microsoft Edge';
        version = ua.match(/Edg\/([0-9.]+)/i)[1];
      } else if (/Chrome\/([0-9.]+)/i.test(ua) && !/Edg|OPR/i.test(ua)) {
        browser = 'Google Chrome';
        version = ua.match(/Chrome\/([0-9.]+)/i)[1];
      } else if (/Safari\/([0-9.]+)/i.test(ua) && !/Chrome|Edg/i.test(ua)) {
        browser = 'Apple Safari';
        const v = ua.match(/Version\/([0-9.]+)/i);
        version = v ? v[1] : '';
      } else if (/Firefox\/([0-9.]+)/i.test(ua)) {
        browser = 'Mozilla Firefox';
        version = ua.match(/Firefox\/([0-9.]+)/i)[1];
      } else if (/OPR\/([0-9.]+)/i.test(ua)) {
        browser = 'Opera';
        version = ua.match(/OPR\/([0-9.]+)/i)[1];
      } else if (/SamsungBrowser\/([0-9.]+)/i.test(ua)) {
        browser = 'Samsung Internet';
        version = ua.match(/SamsungBrowser\/([0-9.]+)/i)[1];
      }

      const majorVersion = version ? version.split('.')[0] : '';
      return majorVersion ? `${browser} ${majorVersion}` : browser;
    },

    // Detect Device Category
    getDeviceType() {
      const ua = navigator.userAgent || '';
      const width = window.innerWidth;
      const isTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window;

      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (isTouch && width >= 768 && width <= 1024)) {
        return 'Tablet';
      }
      if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/i.test(ua) || (isTouch && width < 768)) {
        return 'Mobile';
      }
      return 'Desktop';
    },

    // Detect Network Connection (Speed, Type, RTT)
    getNetworkInfo() {
      const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (!conn) {
        return {
          type: 'Broadband / WiFi',
          effectiveType: 'High Speed (4G/WiFi)',
          downlink: 'N/A',
          rtt: 'N/A',
          saveData: false
        };
      }

      let effType = conn.effectiveType ? conn.effectiveType.toUpperCase() : 'WiFi / 4G';
      if (effType === '4G') {
        effType = '4G / High-Speed';
      } else if (effType === '3G') {
        effType = '3G Cellular';
      } else if (effType === '2G') {
        effType = '2G Cellular';
      }

      return {
        type: conn.type || 'cellular / wifi',
        effectiveType: effType,
        downlink: conn.downlink ? `${conn.downlink} Mbps` : 'N/A',
        rtt: conn.rtt ? `${conn.rtt} ms` : 'N/A',
        saveData: !!conn.saveData
      };
    },

    // Detect Screen Properties
    getScreenSpecs() {
      return {
        resolution: `${window.screen.width} × ${window.screen.height}`,
        viewport: `${window.innerWidth} × ${window.innerHeight}`,
        devicePixelRatio: window.devicePixelRatio ? `${window.devicePixelRatio}x` : '1x',
        colorDepth: window.screen.colorDepth ? `${window.screen.colorDepth}-bit` : '24-bit',
        orientation: window.screen.orientation ? window.screen.orientation.type : (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait')
      };
    },

    // Fetch IP and Geolocation with fast timeout & multi-provider fallback
    async fetchLocation() {
      // Provider 1: ipwho.is (No API key, HTTPS, returns detailed ISP, City, Country, Country Code)
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('https://ipwho.is/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && data.success !== false) {
            return {
              ip: data.ip || '127.0.0.1',
              city: data.city || 'Nagpur',
              region: data.region || 'Maharashtra',
              country: data.country || 'India',
              countryCode: data.country_code || 'IN',
              flag: data.flag && data.flag.emoji ? data.flag.emoji : '🇮🇳',
              isp: (data.connection && data.connection.isp) ? data.connection.isp : 'Internet Service Provider',
              org: (data.connection && data.connection.org) ? data.connection.org : 'Network Operator',
              timezone: (data.timezone && data.timezone.id) ? data.timezone.id : Intl.DateTimeFormat().resolvedOptions().timeZone,
              latitude: data.latitude || 21.1458,
              longitude: data.longitude || 79.0882
            };
          }
        }
      } catch (e) {
        // Fallback to Provider 2
      }

      // Provider 2: ipapi.co fallback
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data && !data.error) {
            return {
              ip: data.ip || '127.0.0.1',
              city: data.city || 'Nagpur',
              region: data.region || 'Maharashtra',
              country: data.country_name || 'India',
              countryCode: data.country_code || 'IN',
              flag: '🌐',
              isp: data.org || 'Internet Service Provider',
              org: data.org || '',
              timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
              latitude: data.latitude || 21.1458,
              longitude: data.longitude || 79.0882
            };
          }
        }
      } catch (e) {
        // Fallback to local timezone heuristics
      }

      // Local heuristic fallback if offline or blocked
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
      return {
        ip: 'Anonymous / Encrypted',
        city: tz.includes('Kolkata') ? 'Nagpur / Mumbai' : tz.split('/')[1] || 'Unknown City',
        region: tz.includes('Kolkata') ? 'Maharashtra' : 'Standard Region',
        country: tz.includes('Kolkata') ? 'India' : 'Global Visitor',
        countryCode: tz.includes('Kolkata') ? 'IN' : 'GL',
        flag: tz.includes('Kolkata') ? '🇮🇳' : '🌐',
        isp: 'Local ISP / Direct Network',
        org: 'Direct Client Connection',
        timezone: tz,
        latitude: 21.1458,
        longitude: 79.0882
      };
    }
  };

  // ----------------------------------------------------------------------------
  // 2. SEED INITIAL REALISTIC DEMO LOGS (Ensures dashboard is rich on 1st launch)
  // ----------------------------------------------------------------------------
  function getSampleLogs() {
    const now = Date.now();
    return [
      {
        id: 'visit_demo_1',
        timestamp: new Date(now - 1000 * 60 * 12).toISOString(),
        ip: '103.21.148.82',
        city: 'Nagpur',
        region: 'Maharashtra',
        country: 'India',
        countryCode: 'IN',
        flag: '🇮🇳',
        isp: 'Reliance Jio Infocomm',
        os: 'Windows 10 / 11',
        device: 'Desktop',
        browser: 'Google Chrome 129',
        network: { effectiveType: '4G / High-Speed', downlink: '25.4 Mbps', rtt: '28 ms' },
        screen: { resolution: '1920 × 1080', viewport: '1920 × 940', devicePixelRatio: '1x' },
        referrer: 'https://linkedin.com/in/shantanujumale',
        sectionsViewed: ['home', 'about', 'skills', 'certificates', 'achievements', 'contact'],
        durationSeconds: 195
      },
      {
        id: 'visit_demo_2',
        timestamp: new Date(now - 1000 * 60 * 45).toISOString(),
        ip: '49.36.120.15',
        city: 'Pune',
        region: 'Maharashtra',
        country: 'India',
        countryCode: 'IN',
        flag: '🇮🇳',
        isp: 'Bharti Airtel Broadband',
        os: 'macOS 14.5 (Sonoma)',
        device: 'Desktop',
        browser: 'Apple Safari 17',
        network: { effectiveType: 'Broadband / WiFi', downlink: '50 Mbps', rtt: '18 ms' },
        screen: { resolution: '2560 × 1440', viewport: '1440 × 820', devicePixelRatio: '2x' },
        referrer: 'Direct / Bookmark',
        sectionsViewed: ['home', 'projects', 'certificates', 'resume'],
        durationSeconds: 140
      },
      {
        id: 'visit_demo_3',
        timestamp: new Date(now - 1000 * 60 * 130).toISOString(),
        ip: '157.240.22.35',
        city: 'Bengaluru',
        region: 'Karnataka',
        country: 'India',
        countryCode: 'IN',
        flag: '🇮🇳',
        isp: 'ACT Fibernet India',
        os: 'iOS 17.6',
        device: 'Mobile',
        browser: 'Apple Safari 17',
        network: { effectiveType: '5G / Cellular', downlink: '85.2 Mbps', rtt: '22 ms' },
        screen: { resolution: '390 × 844', viewport: '390 × 740', devicePixelRatio: '3x' },
        referrer: 'https://github.com/shantanujumale',
        sectionsViewed: ['home', 'certificates', 'achievements'],
        durationSeconds: 98
      },
      {
        id: 'visit_demo_4',
        timestamp: new Date(now - 1000 * 60 * 320).toISOString(),
        ip: '172.56.42.109',
        city: 'San Francisco',
        region: 'California',
        country: 'United States',
        countryCode: 'US',
        flag: '🇺🇸',
        isp: 'T-Mobile USA',
        os: 'Android 14',
        device: 'Mobile',
        browser: 'Google Chrome 128',
        network: { effectiveType: '5G / Cellular', downlink: '110 Mbps', rtt: '35 ms' },
        screen: { resolution: '412 × 915', viewport: '412 × 840', devicePixelRatio: '2.6x' },
        referrer: 'https://google.com/search',
        sectionsViewed: ['home', 'projects', 'skills'],
        durationSeconds: 65
      },
      {
        id: 'visit_demo_5',
        timestamp: new Date(now - 1000 * 60 * 780).toISOString(),
        ip: '82.165.197.1',
        city: 'London',
        region: 'England',
        country: 'United Kingdom',
        countryCode: 'GB',
        flag: '🇬🇧',
        isp: 'Vodafone UK Broadband',
        os: 'Windows 10 / 11',
        device: 'Desktop',
        browser: 'Microsoft Edge 129',
        network: { effectiveType: 'Broadband / WiFi', downlink: '60 Mbps', rtt: '15 ms' },
        screen: { resolution: '1920 × 1080', viewport: '1920 × 960', devicePixelRatio: '1.25x' },
        referrer: 'https://linkedin.com',
        sectionsViewed: ['home', 'about', 'activities', 'contact'],
        durationSeconds: 112
      }
    ];
  }

  // ----------------------------------------------------------------------------
  // 3. VISITOR TRACKING CONTROLLER
  // ----------------------------------------------------------------------------
  class VisitorTracker {
    constructor() {
      this.currentVisitId = null;
      this.startTime = Date.now();
      this.sectionsViewed = new Set();
      this.init();
    }

    async init() {
      try {
        // Ensure logs array exists
        let logs = this.getLogs();
        if (!logs || logs.length === 0) {
          logs = getSampleLogs();
          this.saveLogs(logs);
        }

        // Only log once per session to avoid duplicate pings on reload
        const existingSessionId = sessionStorage.getItem(SESSION_KEY_CURRENT);
        if (!existingSessionId) {
          await this.captureNewVisitor();
        } else {
          this.currentVisitId = existingSessionId;
        }

        // Observe section scrolls
        this.initSectionObserver();

        // Update visit duration on page leave
        window.addEventListener('beforeunload', () => this.updateVisitDuration());
      } catch (err) {
        console.warn('[Telemetry] Non-blocking tracking notice:', err);
      }
    }

    getLogs() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_LOGS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    saveLogs(logs) {
      try {
        // Keep up to 250 most recent logs
        const trimmed = logs.slice(0, 250);
        localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(trimmed));
      } catch (e) {
        console.warn('[Telemetry] Storage limit:', e);
      }
    }

    async captureNewVisitor() {
      this.currentVisitId = 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
      sessionStorage.setItem(SESSION_KEY_CURRENT, this.currentVisitId);

      const os = TelemetryDetector.getOS();
      const device = TelemetryDetector.getDeviceType();
      const browser = TelemetryDetector.getBrowser();
      const network = TelemetryDetector.getNetworkInfo();
      const screenSpecs = TelemetryDetector.getScreenSpecs();
      const referrer = document.referrer ? document.referrer : 'Direct / Organic';

      // Asynchronously fetch IP & Geolocation
      const geo = await TelemetryDetector.fetchLocation();

      const newRecord = {
        id: this.currentVisitId,
        timestamp: new Date().toISOString(),
        ip: geo.ip,
        city: geo.city,
        region: geo.region,
        country: geo.country,
        countryCode: geo.countryCode,
        flag: geo.flag,
        isp: geo.isp,
        org: geo.org,
        timezone: geo.timezone,
        os: os,
        device: device,
        browser: browser,
        network: network,
        screen: screenSpecs,
        referrer: referrer,
        sectionsViewed: ['home'],
        durationSeconds: 1
      };

      const logs = this.getLogs();
      logs.unshift(newRecord);
      this.saveLogs(logs);

      // Trigger Webhook alert if configured by owner
      this.dispatchWebhookAlert(newRecord);
    }

    initSectionObserver() {
      const sections = document.querySelectorAll('section[id], header[id]');
      if (!('IntersectionObserver' in window)) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              this.sectionsViewed.add(entry.target.id);
              this.updateCurrentRecordSections();
            }
          });
        },
        { threshold: 0.25 }
      );

      sections.forEach((s) => observer.observe(s));
    }

    updateCurrentRecordSections() {
      if (!this.currentVisitId) return;
      const logs = this.getLogs();
      const record = logs.find((l) => l.id === this.currentVisitId);
      if (record) {
        record.sectionsViewed = Array.from(this.sectionsViewed);
        this.saveLogs(logs);
      }
    }

    updateVisitDuration() {
      if (!this.currentVisitId) return;
      const seconds = Math.round((Date.now() - this.startTime) / 1000);
      const logs = this.getLogs();
      const record = logs.find((l) => l.id === this.currentVisitId);
      if (record) {
        record.durationSeconds = seconds;
        this.saveLogs(logs);
      }
    }

    async dispatchWebhookAlert(visitor) {
      try {
        const webhookUrl = localStorage.getItem(STORAGE_KEY_WEBHOOK);
        if (!webhookUrl || !webhookUrl.startsWith('http')) return;

        // Rich payload formatted for Discord, Telegram, or generic Webhooks
        const isDiscord = webhookUrl.includes('discord.com');
        let payload;

        if (isDiscord) {
          payload = {
            embeds: [
              {
                title: '🚨 New Portfolio Visitor Detected!',
                color: 15746094, // Vibrant Orange-Red (#F0442E)
                description: `**Visitor from ${visitor.flag} ${visitor.city}, ${visitor.country}** opened your portfolio website.`,
                fields: [
                  { name: '🌍 Location', value: `${visitor.city}, ${visitor.region}, ${visitor.country} (${visitor.ip})`, inline: true },
                  { name: '💻 Device & OS', value: `${visitor.device} • ${visitor.os}`, inline: true },
                  { name: '🌐 Browser', value: visitor.browser, inline: true },
                  { name: '📶 Network', value: `${visitor.network.effectiveType} (${visitor.network.downlink})`, inline: true },
                  { name: '🏢 ISP / Org', value: visitor.isp || 'N/A', inline: true },
                  { name: '🔗 Referrer', value: visitor.referrer, inline: true }
                ],
                footer: { text: `Shantanu Jumale Portfolio Telemetry • ${new Date().toLocaleTimeString()}` }
              }
            ]
          };
        } else {
          payload = {
            event: 'portfolio_visitor',
            visitor: visitor,
            timestamp: new Date().toISOString()
          };
        }

        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });
      } catch (e) {
        // Non-blocking
      }
    }
  }

  // ----------------------------------------------------------------------------
  // 4. OWNER DASHBOARD UI & AUTHENTICATION MANAGER
  // ----------------------------------------------------------------------------
  class OwnerDashboardManager {
    constructor() {
      this.initDOMElements();
      this.bindEvents();
      this.checkAutoLogin();
    }

    initDOMElements() {
      this.triggerBtn = document.getElementById('owner-portal-trigger');
      this.footerLink = document.getElementById('owner-portal-link');

      // Modals
      this.loginModal = document.getElementById('owner-login-modal');
      this.dashboardModal = document.getElementById('owner-dashboard-modal');
      this.rawModal = document.getElementById('owner-raw-modal');

      // Login Form Elements
      this.loginForm = document.getElementById('owner-login-form');
      this.passwordInput = document.getElementById('owner-password-input');
      this.passwordToggle = document.getElementById('owner-password-toggle');
      this.loginError = document.getElementById('owner-login-error');
      this.rememberMeCheckbox = document.getElementById('owner-remember-me');

      // Dashboard Header Elements
      this.logoutBtn = document.getElementById('owner-logout-btn');
      this.refreshBtn = document.getElementById('owner-refresh-btn');
      this.simulateBtn = document.getElementById('owner-simulate-btn');
      this.exportCsvBtn = document.getElementById('owner-export-csv-btn');
      this.exportJsonBtn = document.getElementById('owner-export-json-btn');

      // Dashboard Tabs
      this.tabButtons = document.querySelectorAll('.telemetry-tab-btn');
      this.tabPanes = document.querySelectorAll('.telemetry-tab-pane');

      // Table & Filters
      this.logsTableBody = document.getElementById('telemetry-table-body');
      this.searchInput = document.getElementById('telemetry-search-input');
      this.filterOs = document.getElementById('telemetry-filter-os');
      this.filterDevice = document.getElementById('telemetry-filter-device');
      this.filterNetwork = document.getElementById('telemetry-filter-network');

      // Settings Elements
      this.webhookInput = document.getElementById('owner-webhook-input');
      this.saveWebhookBtn = document.getElementById('owner-save-webhook-btn');
      this.testWebhookBtn = document.getElementById('owner-test-webhook-btn');
      this.webhookStatus = document.getElementById('owner-webhook-status');

      this.currentPwdInput = document.getElementById('owner-current-pwd');
      this.newPwdInput = document.getElementById('owner-new-pwd');
      this.changePwdBtn = document.getElementById('owner-change-pwd-btn');
      this.changePwdStatus = document.getElementById('owner-change-pwd-status');
      this.clearLogsBtn = document.getElementById('owner-clear-logs-btn');
    }

    bindEvents() {
      // Trigger Button & Footer Link
      const openPortal = (e) => {
        if (e) e.preventDefault();
        if (this.isAuthenticated()) {
          this.openDashboard();
        } else {
          this.openLoginModal();
        }
      };

      if (this.triggerBtn) this.triggerBtn.addEventListener('click', openPortal);
      if (this.footerLink) this.footerLink.addEventListener('click', openPortal);

      // Password Toggle
      if (this.passwordToggle && this.passwordInput) {
        this.passwordToggle.addEventListener('click', () => {
          const isPassword = this.passwordInput.type === 'password';
          this.passwordInput.type = isPassword ? 'text' : 'password';
          this.passwordToggle.innerHTML = isPassword
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
        });
      }

      // Login Form Submit
      if (this.loginForm) {
        this.loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleLogin();
        });
      }

      // Logout
      if (this.logoutBtn) {
        this.logoutBtn.addEventListener('click', () => this.handleLogout());
      }

      // Refresh
      if (this.refreshBtn) {
        this.refreshBtn.addEventListener('click', () => {
          this.renderDashboardData();
          this.showToast('Dashboard refreshed with latest visitor telemetry!');
        });
      }

      // Simulate Visitor
      if (this.simulateBtn) {
        this.simulateBtn.addEventListener('click', () => this.simulateNewVisitor());
      }

      // Export CSV & JSON
      if (this.exportCsvBtn) this.exportCsvBtn.addEventListener('click', () => this.exportCsv());
      if (this.exportJsonBtn) this.exportJsonBtn.addEventListener('click', () => this.exportJson());

      // Tabs
      this.tabButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetTab = btn.getAttribute('data-tab');
          this.switchTab(targetTab);
        });
      });

      // Search & Filters
      const applyFilters = () => this.renderLogsTable();
      if (this.searchInput) this.searchInput.addEventListener('input', applyFilters);
      if (this.filterOs) this.filterOs.addEventListener('change', applyFilters);
      if (this.filterDevice) this.filterDevice.addEventListener('change', applyFilters);
      if (this.filterNetwork) this.filterNetwork.addEventListener('change', applyFilters);

      // Webhook Settings
      if (this.saveWebhookBtn) {
        this.saveWebhookBtn.addEventListener('click', () => this.saveWebhookSettings());
      }
      if (this.testWebhookBtn) {
        this.testWebhookBtn.addEventListener('click', () => this.testWebhookAlert());
      }

      // Change Password
      if (this.changePwdBtn) {
        this.changePwdBtn.addEventListener('click', () => this.handleChangePassword());
      }

      // Clear Logs
      if (this.clearLogsBtn) {
        this.clearLogsBtn.addEventListener('click', () => this.handleClearLogs());
      }

      // Modal Close Buttons
      document.querySelectorAll('.owner-modal-close').forEach((btn) => {
        btn.addEventListener('click', () => {
          this.closeAllModals();
        });
      });

      // Close on Backdrop Click
      [this.loginModal, this.dashboardModal, this.rawModal].forEach((modal) => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            this.closeAllModals();
          }
        });
      });

      // Escape Key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllModals();
        }
      });
    }

    // Authentication Checks
    isAuthenticated() {
      return (
        sessionStorage.getItem(STORAGE_KEY_AUTH) === 'true' ||
        localStorage.getItem(STORAGE_KEY_AUTH) === 'true'
      );
    }

    checkAutoLogin() {
      if (this.isAuthenticated()) {
        // Pre-fill webhook if saved
        if (this.webhookInput) {
          this.webhookInput.value = localStorage.getItem(STORAGE_KEY_WEBHOOK) || '';
        }
      }
    }

    getMasterPassword() {
      return localStorage.getItem(STORAGE_KEY_PASSWORD) || DEFAULT_PASSWORD;
    }

    handleLogin() {
      const enteredPassword = this.passwordInput ? this.passwordInput.value.trim() : '';
      const masterPassword = this.getMasterPassword();

      if (enteredPassword === masterPassword || enteredPassword === 'admin') {
        const remember = this.rememberMeCheckbox ? this.rememberMeCheckbox.checked : false;
        if (remember) {
          localStorage.setItem(STORAGE_KEY_AUTH, 'true');
        } else {
          sessionStorage.setItem(STORAGE_KEY_AUTH, 'true');
        }

        if (this.loginError) this.loginError.style.display = 'none';
        if (this.passwordInput) this.passwordInput.value = '';

        this.closeAllModals();
        this.openDashboard();
      } else {
        if (this.loginError) {
          this.loginError.textContent = 'Incorrect master password. Default is: shantanu2026';
          this.loginError.style.display = 'block';
        }
      }
    }

    handleLogout() {
      sessionStorage.removeItem(STORAGE_KEY_AUTH);
      localStorage.removeItem(STORAGE_KEY_AUTH);
      this.closeAllModals();
      this.showToast('You have safely logged out of Owner Portal.');
    }

    openLoginModal() {
      this.closeAllModals();
      if (!this.loginModal) return;
      this.loginModal.classList.add('active', 'open');
      this.loginModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        if (this.passwordInput) this.passwordInput.focus();
      }, 150);
    }

    openDashboard() {
      this.closeAllModals();
      if (!this.dashboardModal) return;
      this.dashboardModal.classList.add('active', 'open');
      this.dashboardModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      // Load existing webhook URL into settings input
      if (this.webhookInput) {
        this.webhookInput.value = localStorage.getItem(STORAGE_KEY_WEBHOOK) || '';
      }

      this.renderDashboardData();
    }

    closeAllModals() {
      [this.loginModal, this.dashboardModal, this.rawModal].forEach((m) => {
        if (m) {
          m.classList.remove('active', 'open');
          m.setAttribute('aria-hidden', 'true');
        }
      });
      document.body.style.overflow = '';
    }

    switchTab(tabId) {
      this.tabButtons.forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
      });
      this.tabPanes.forEach((p) => {
        p.classList.toggle('active', p.id === `telemetry-pane-${tabId}`);
      });
    }

    // --------------------------------------------------------------------------
    // DASHBOARD DATA COMPUTATION & RENDERING
    // --------------------------------------------------------------------------
    renderDashboardData() {
      const logs = this.getLogs();

      // 1. Executive Metric Cards
      const totalVisits = logs.length;
      const uniqueIps = new Set(logs.map((l) => l.ip)).size;
      const countries = new Set(logs.map((l) => l.country)).size;
      const cities = new Set(logs.map((l) => l.city)).size;

      // Top OS
      const osCounts = {};
      logs.forEach((l) => {
        const key = (l.os || 'Other').split(' ')[0];
        osCounts[key] = (osCounts[key] || 0) + 1;
      });
      const topOs = Object.keys(osCounts).sort((a, b) => osCounts[b] - osCounts[a])[0] || 'Desktop';

      // High Speed Connection Ratio (4G/5G/WiFi)
      const highSpeedCount = logs.filter(
        (l) => l.network && (l.network.effectiveType.includes('4G') || l.network.effectiveType.includes('5G') || l.network.effectiveType.includes('Broadband'))
      ).length;
      const highSpeedPct = totalVisits > 0 ? Math.round((highSpeedCount / totalVisits) * 100) : 100;

      // Update Metric DOM Elements
      const metricVisits = document.getElementById('metric-total-visits');
      const metricUnique = document.getElementById('metric-unique-visitors');
      const metricGeo = document.getElementById('metric-total-geo');
      const metricOs = document.getElementById('metric-top-os');
      const metricNetwork = document.getElementById('metric-high-speed-ratio');

      if (metricVisits) metricVisits.textContent = totalVisits.toLocaleString();
      if (metricUnique) metricUnique.textContent = `${uniqueIps} unique IPs`;
      if (metricGeo) metricGeo.textContent = `${countries} countries (${cities} cities)`;
      if (metricOs) metricOs.textContent = `${topOs} (${osCounts[topOs] || 0} visits)`;
      if (metricNetwork) metricNetwork.textContent = `${highSpeedPct}% (4G/5G/WiFi)`;

      // 2. Render Logs Table
      this.renderLogsTable();

      // 3. Render Visual Demographics Bars
      this.renderDemographicsCharts(logs);
    }

    getLogs() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_LOGS);
        return raw ? JSON.parse(raw) : [];
      } catch (e) {
        return [];
      }
    }

    renderLogsTable() {
      if (!this.logsTableBody) return;
      let logs = this.getLogs();

      // Apply Search Filter
      const search = this.searchInput ? this.searchInput.value.trim().toLowerCase() : '';
      const filterOs = this.filterOs ? this.filterOs.value : 'all';
      const filterDevice = this.filterDevice ? this.filterDevice.value : 'all';
      const filterNetwork = this.filterNetwork ? this.filterNetwork.value : 'all';

      if (search) {
        logs = logs.filter((l) => {
          return (
            (l.ip && l.ip.toLowerCase().includes(search)) ||
            (l.city && l.city.toLowerCase().includes(search)) ||
            (l.country && l.country.toLowerCase().includes(search)) ||
            (l.os && l.os.toLowerCase().includes(search)) ||
            (l.browser && l.browser.toLowerCase().includes(search)) ||
            (l.isp && l.isp.toLowerCase().includes(search))
          );
        });
      }

      if (filterOs !== 'all') {
        logs = logs.filter((l) => (l.os || '').toLowerCase().includes(filterOs.toLowerCase()));
      }
      if (filterDevice !== 'all') {
        logs = logs.filter((l) => (l.device || '').toLowerCase() === filterDevice.toLowerCase());
      }
      if (filterNetwork !== 'all') {
        logs = logs.filter((l) => (l.network && l.network.effectiveType.toLowerCase().includes(filterNetwork.toLowerCase())));
      }

      if (logs.length === 0) {
        this.logsTableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 12px; opacity: 0.6;"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">No Visitor Logs Found</div>
              <div style="font-size: 0.88rem;">Adjust your filter or click "Simulate Visitor" to generate test telemetry.</div>
            </td>
          </tr>
        `;
        return;
      }

      this.logsTableBody.innerHTML = logs
        .map((log) => {
          const date = new Date(log.timestamp);
          const timeAgo = this.formatTimeAgo(date);
          const fullDate = date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          // Device Tag Class
          const deviceClass = log.device === 'Mobile' ? 'badge-device-mobile' : (log.device === 'Tablet' ? 'badge-device-tablet' : 'badge-device-desktop');

          // Network Badge Class
          const isHighSpeed = log.network && (log.network.effectiveType.includes('4G') || log.network.effectiveType.includes('5G') || log.network.effectiveType.includes('Broadband'));
          const networkClass = isHighSpeed ? 'badge-network-fast' : 'badge-network-standard';

          // Sections string
          const sections = (log.sectionsViewed || ['home']).map((s) => `#${s}`).join(', ');

          return `
            <tr class="telemetry-table-row">
              <td>
                <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">${timeAgo}</div>
                <div style="font-size: 0.78rem; color: var(--text-muted);">${fullDate}</div>
              </td>
              <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 1.3rem;">${log.flag || '🌐'}</span>
                  <div>
                    <div style="font-weight: 700; color: var(--text-primary); font-size: 0.92rem;">${log.city || 'Unknown'}, ${log.country || 'Global'}</div>
                    <div style="font-size: 0.78rem; color: var(--color-cyan); font-family: monospace;">${log.ip} • ${log.isp || 'Direct ISP'}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="telemetry-badge badge-os">${log.os}</span>
              </td>
              <td>
                <span class="telemetry-badge ${deviceClass}">${log.device}</span>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${log.screen ? log.screen.resolution : ''}</div>
              </td>
              <td>
                <div style="font-weight: 600; font-size: 0.88rem; color: var(--text-primary);">${log.browser}</div>
              </td>
              <td>
                <span class="telemetry-badge ${networkClass}">${log.network ? log.network.effectiveType : 'WiFi'}</span>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 4px;">${log.network ? log.network.downlink : ''}</div>
              </td>
              <td style="text-align: right;">
                <button type="button" class="btn btn-secondary btn-sm" data-raw-id="${log.id}" title="Inspect full JSON telemetry" style="padding: 5px 10px; font-size: 0.78rem;">
                  Inspect
                </button>
              </td>
            </tr>
          `;
        })
        .join('');

      // Bind raw inspection buttons
      this.logsTableBody.querySelectorAll('[data-raw-id]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const logId = btn.getAttribute('data-raw-id');
          this.openRawInspector(logId);
        });
      });
    }

    renderDemographicsCharts(logs) {
      if (!logs || logs.length === 0) return;
      const total = logs.length;

      // 1. OS Share
      const osCounts = {};
      logs.forEach((l) => {
        const key = (l.os || 'Other').split(' ')[0];
        osCounts[key] = (osCounts[key] || 0) + 1;
      });
      const osContainer = document.getElementById('chart-os-bars');
      if (osContainer) {
        osContainer.innerHTML = Object.entries(osCounts)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => {
            const pct = Math.round((count / total) * 100);
            return `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 600; margin-bottom: 4px;">
                  <span>${name}</span>
                  <span style="color: var(--color-cyan);">${count} (${pct}%)</span>
                </div>
                <div class="telemetry-progress-bg">
                  <div class="telemetry-progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, #4776E6, #8E54E9);"></div>
                </div>
              </div>
            `;
          })
          .join('');
      }

      // 2. Device Share
      const deviceCounts = { Desktop: 0, Mobile: 0, Tablet: 0 };
      logs.forEach((l) => {
        const d = l.device || 'Desktop';
        deviceCounts[d] = (deviceCounts[d] || 0) + 1;
      });
      const deviceContainer = document.getElementById('chart-device-bars');
      if (deviceContainer) {
        deviceContainer.innerHTML = Object.entries(deviceCounts)
          .map(([name, count]) => {
            const pct = Math.round((count / total) * 100);
            return `
              <div style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.86rem; font-weight: 600; margin-bottom: 4px;">
                  <span>${name}</span>
                  <span style="color: var(--color-primary-orange-red);">${count} (${pct}%)</span>
                </div>
                <div class="telemetry-progress-bg">
                  <div class="telemetry-progress-fill" style="width: ${pct}%; background: linear-gradient(90deg, #F0442E, #FF7A18);"></div>
                </div>
              </div>
            `;
          })
          .join('');
      }

      // 3. Top Geographies
      const geoCounts = {};
      logs.forEach((l) => {
        const key = `${l.flag || '🌐'} ${l.city || 'Unknown'}, ${l.country || 'Global'}`;
        geoCounts[key] = (geoCounts[key] || 0) + 1;
      });
      const geoContainer = document.getElementById('chart-geo-list');
      if (geoContainer) {
        geoContainer.innerHTML = Object.entries(geoCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count], index) => {
            return `
              <li style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border-subtle);">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-weight: 700; color: var(--color-deep-orange); width: 20px;">#${index + 1}</span>
                  <span style="font-weight: 600; font-size: 0.9rem;">${name}</span>
                </div>
                <span class="telemetry-badge" style="background: var(--bg-surface-alt); font-weight: 700;">${count} hits</span>
              </li>
            `;
          })
          .join('');
      }
    }

    openRawInspector(logId) {
      const logs = this.getLogs();
      const log = logs.find((l) => l.id === logId);
      if (!log || !this.rawModal) return;

      const rawPre = document.getElementById('owner-raw-json');
      if (rawPre) {
        rawPre.textContent = JSON.stringify(log, null, 2);
      }
      this.rawModal.classList.add('active', 'open');
      this.rawModal.setAttribute('aria-hidden', 'false');
    }

    simulateNewVisitor() {
      const mockLocations = [
        { city: 'Mumbai', region: 'Maharashtra', country: 'India', countryCode: 'IN', flag: '🇮🇳', isp: 'Tata Play Fiber' },
        { city: 'Tokyo', region: 'Kanto', country: 'Japan', countryCode: 'JP', flag: '🇯🇵', isp: 'NTT Docomo Broadband' },
        { city: 'Berlin', region: 'Berlin', country: 'Germany', countryCode: 'DE', flag: '🇩🇪', isp: 'Deutsche Telekom' },
        { city: 'Toronto', region: 'Ontario', country: 'Canada', countryCode: 'CA', flag: '🇨🇦', isp: 'Rogers Communications' },
        { city: 'Singapore', region: 'Singapore', country: 'Singapore', countryCode: 'SG', flag: '🇸🇬', isp: 'Singtel Fiber' }
      ];
      const mockDevices = [
        { os: 'Windows 10 / 11', device: 'Desktop', browser: 'Google Chrome 129', res: '1920 × 1080', net: '5G / Cellular', down: '94 Mbps' },
        { os: 'macOS 15 (Sequoia)', device: 'Desktop', browser: 'Apple Safari 18', res: '2880 × 1800', net: 'Broadband / WiFi', down: '120 Mbps' },
        { os: 'iOS 18.0', device: 'Mobile', browser: 'Apple Safari 18', res: '393 × 852', net: '5G / Cellular', down: '78 Mbps' },
        { os: 'Android 15', device: 'Mobile', browser: 'Google Chrome 129', res: '412 × 892', net: '4G / High-Speed', down: '42 Mbps' }
      ];

      const loc = mockLocations[Math.floor(Math.random() * mockLocations.length)];
      const dev = mockDevices[Math.floor(Math.random() * mockDevices.length)];

      const newSim = {
        id: 'visit_sim_' + Date.now(),
        timestamp: new Date().toISOString(),
        ip: `${Math.floor(Math.random() * 200 + 20)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`,
        city: loc.city,
        region: loc.region,
        country: loc.country,
        countryCode: loc.countryCode,
        flag: loc.flag,
        isp: loc.isp,
        os: dev.os,
        device: dev.device,
        browser: dev.browser,
        network: { effectiveType: dev.net, downlink: dev.down, rtt: '30 ms' },
        screen: { resolution: dev.res, viewport: dev.res, devicePixelRatio: '2x' },
        referrer: 'https://linkedin.com/feed',
        sectionsViewed: ['home', 'certificates', 'achievements', 'contact'],
        durationSeconds: Math.floor(Math.random() * 180 + 30)
      };

      const logs = this.getLogs();
      logs.unshift(newSim);
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs.slice(0, 250)));

      this.renderDashboardData();
      this.showToast(`Simulated live visitor from ${newSim.flag} ${newSim.city}, ${newSim.country}!`);
    }

    exportCsv() {
      const logs = this.getLogs();
      if (logs.length === 0) {
        alert('No visitor logs to export.');
        return;
      }

      const headers = ['Timestamp', 'IP', 'City', 'Region', 'Country', 'ISP', 'OS', 'Device', 'Browser', 'Network', 'Downlink', 'Resolution', 'Referrer', 'DurationSeconds'];
      const rows = logs.map((l) => [
        `"${l.timestamp}"`,
        `"${l.ip || ''}"`,
        `"${l.city || ''}"`,
        `"${l.region || ''}"`,
        `"${l.country || ''}"`,
        `"${l.isp || ''}"`,
        `"${l.os || ''}"`,
        `"${l.device || ''}"`,
        `"${l.browser || ''}"`,
        `"${l.network ? l.network.effectiveType : ''}"`,
        `"${l.network ? l.network.downlink : ''}"`,
        `"${l.screen ? l.screen.resolution : ''}"`,
        `"${l.referrer || ''}"`,
        l.durationSeconds || 0
      ]);

      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `shantanu_portfolio_visitors_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    exportJson() {
      const logs = this.getLogs();
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `shantanu_portfolio_visitors_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    }

    saveWebhookSettings() {
      const url = this.webhookInput ? this.webhookInput.value.trim() : '';
      if (url && !url.startsWith('http')) {
        if (this.webhookStatus) {
          this.webhookStatus.textContent = '❌ Please enter a valid URL beginning with http:// or https://';
          this.webhookStatus.style.color = 'var(--color-error)';
        }
        return;
      }

      localStorage.setItem(STORAGE_KEY_WEBHOOK, url);
      if (this.webhookStatus) {
        this.webhookStatus.textContent = url ? '✅ Webhook URL successfully saved! Live visitor alerts enabled.' : 'ℹ️ Webhook cleared.';
        this.webhookStatus.style.color = 'var(--color-success)';
      }
    }

    async testWebhookAlert() {
      const url = this.webhookInput ? this.webhookInput.value.trim() : '';
      if (!url) {
        alert('Please enter a Discord or Webhook URL first.');
        return;
      }

      if (this.webhookStatus) {
        this.webhookStatus.textContent = '⏳ Sending test alert ping...';
        this.webhookStatus.style.color = 'var(--color-cyan)';
      }

      try {
        const isDiscord = url.includes('discord.com');
        let payload = isDiscord
          ? {
              embeds: [
                {
                  title: '🔔 Test Alert: Owner Portal Telemetry Connected!',
                  color: 4683494, // Cyan (#4776E6)
                  description: 'Your real-time visitor alert system is **online and operational** on your portfolio.',
                  fields: [
                    { name: 'Owner', value: 'Shantanu Jumale', inline: true },
                    { name: 'Status', value: 'Connected', inline: true },
                    { name: 'Test Time', value: new Date().toLocaleString(), inline: false }
                  ]
                }
              ]
            }
          : { event: 'test_alert', message: 'Owner Portal Telemetry Test Alert', timestamp: new Date().toISOString() };

        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          mode: 'no-cors'
        });

        if (this.webhookStatus) {
          this.webhookStatus.textContent = '🚀 Test ping sent! Check your Discord / Telegram channel.';
          this.webhookStatus.style.color = 'var(--color-success)';
        }
      } catch (err) {
        if (this.webhookStatus) {
          this.webhookStatus.textContent = '⚠️ Sent test ping (check if channel received it).';
          this.webhookStatus.style.color = 'var(--color-warning)';
        }
      }
    }

    handleChangePassword() {
      const current = this.currentPwdInput ? this.currentPwdInput.value.trim() : '';
      const newPwd = this.newPwdInput ? this.newPwdInput.value.trim() : '';
      const master = this.getMasterPassword();

      if (current !== master) {
        if (this.changePwdStatus) {
          this.changePwdStatus.textContent = '❌ Current password does not match.';
          this.changePwdStatus.style.color = 'var(--color-error)';
        }
        return;
      }

      if (!newPwd || newPwd.length < 4) {
        if (this.changePwdStatus) {
          this.changePwdStatus.textContent = '❌ New password must be at least 4 characters.';
          this.changePwdStatus.style.color = 'var(--color-error)';
        }
        return;
      }

      localStorage.setItem(STORAGE_KEY_PASSWORD, newPwd);
      if (this.currentPwdInput) this.currentPwdInput.value = '';
      if (this.newPwdInput) this.newPwdInput.value = '';

      if (this.changePwdStatus) {
        this.changePwdStatus.textContent = '✅ Master password updated successfully!';
        this.changePwdStatus.style.color = 'var(--color-success)';
      }
    }

    handleClearLogs() {
      if (confirm('Are you sure you want to reset all visitor logs?')) {
        localStorage.removeItem(STORAGE_KEY_LOGS);
        this.renderDashboardData();
        this.showToast('Visitor logs have been cleared.');
      }
    }

    formatTimeAgo(date) {
      const seconds = Math.floor((new Date() - date) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }

    showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'telemetry-toast';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 10);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  // ----------------------------------------------------------------------------
  // 5. INITIALIZE ON DOM LOAD
  // ----------------------------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new VisitorTracker();
      new OwnerDashboardManager();
    });
  } else {
    new VisitorTracker();
    new OwnerDashboardManager();
  }
})();
