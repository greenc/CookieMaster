/**
 * Configuration settings for CookieMaster
 *
 * @type {Object}
 */
CM.config = (function() {

    ///////////////////////////////////////////////
    // General CookieMaster settings
    ///////////////////////////////////////////////

    this.version              = '1.17.1';                         // Current version of CookieMaster
    this.ccCompatibleVersions = ['1.0411'];                       // Known compatible versions of Cookie Clicker
    this.cmRefreshRate        = 1000;                             // Refresh rate for main game loop
    this.cmFastRefreshRate    = 200;                              // Refresh rate for title ticker and audio alerts
    this.cmCheckUpdateRate    = 1800000;                          // How often to check for updates (default 30 minutes)
    this.cmGCAudioAlertURL    = '../cookiemaster/assets/gc.mp3';  // Default Golden Cookie audio soundbyte
    this.cmSPAudioAlertURL    = '../cookiemaster/assets/sp.mp3';  // Default Reindeer audio soundbyte
    this.cmVersionURL         = '../cookiemaster/package.json';   // URL to check for plugin updates
    this.cmChangelogURL       = 'https://github.com/greenc/CookieMaster/blob/master/CHANGELOG.md';

    ///////////////////////////////////////////////
    // Internal settings used by the plugin
    ///////////////////////////////////////////////

    this.cmGCActualAlertURL  = null;  // Actual Golden Cookie audio soundbyte (default may be overridden by custom)
    this.cmSPActualAlertURL  = null;  // Actual Reindeer audio soundbyte (default may be overridden by custom)
    this.cmGCAudioObject     = null;  // Set when applying user settings
    this.cmSPAudioObject     = null;  // Set when applying user settings
    this.cmAudioGCNotified   = false; // Flag gets set to true when audio alert has played once per spawm
    this.cmAudioSPNotified   = false; // Flag gets set to true when audio alert has played once per spawm
    this.cmVisualGCNotified  = false; // Flag gets set to true when visual alert has played once per spawm
    this.cmVisualSPNotified  = false; // Flag gets set to true when visual alert has played once per spawm
    this.cmStatsLoggingReady = false; // Becomes true when chart APIs are loaded
    this.cmStatsData         = null;  // Set when a new logging session starts
    this.cmStatsChart        = null;  // Set when a new logging session stats
    this.cmStatsLogStart     = null;  // Set when a new logging session starts
    this.cmStatsLogTimer     = null;  // Set when a new logging sessions starts
    this.cmVersionNotified   = null;  // Set to last notified version when update check runs

    ///////////////////////////////////////////////
    // Common Selectors
    ///////////////////////////////////////////////

    this.ccBody          = $('body');
    this.ccWrapper       = $('#wrapper');
    this.ccGame          = $('#game');
    this.ccSectionLeft   = $('#sectionLeft');
    this.ccSectionMiddle = $('#sectionMiddle');
    this.ccSectionRight  = $('#sectionRight');
    this.ccComments      = $('#comments');
    this.ccGoldenCookie  = $('#goldenCookie');
    this.ccSeasonPopup   = $('#seasonPopup');
    this.ccTooltipAnchor = $('#tooltipAnchor');
    this.ccTooltip       = $('#tooltip');
    this.cmMessageBar    = null; // Set when bar is created
    this.cmTimerPanel    = null; // Set when panel is created
    this.cmSettingsPanel = null; // Set when panel is created
    this.cmStatsPanel    = null; // Set when panel is created
    this.cmStatsTable    = null; // Set when panel is created
    this.cmOverlay       = null; // Set when overlay is created
    this.cmGCOverlay     = null; // Set when GC overlay is created

})();