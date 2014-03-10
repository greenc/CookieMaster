/**
 * Configuration settings for CookieMaster
 *
 * @type {Object}
 */
CM.Config = (function() {

    var config = {

        ///////////////////////////////////////////////
        // General CookieMaster settings
        ///////////////////////////////////////////////

        version              : '1.17.1',                         // Current version of CookieMaster
        ccCompatibleVersions : ['1.0411'],                       // Known compatible versions of Cookie Clicker
        cmRefreshRate        : 1000,                             // Refresh rate for main game loop
        cmFastRefreshRate    : 200,                              // Refresh rate for title ticker and audio alerts
        cmCheckUpdateRate    : 1800000,                          // How often to check for updates (default 30 minutes)
        cmGCAudioAlertURL    : '../cookiemaster/assets/gc.mp3',  // Default Golden Cookie audio soundbyte
        cmSPAudioAlertURL    : '../cookiemaster/assets/sp.mp3',  // Default Reindeer audio soundbyte
        cmVersionURL         : '../cookiemaster/package.json',   // URL to check for plugin updates
        cmChangelogURL       : 'https://github.com/greenc/CookieMaster/blob/master/CHANGELOG.md',

        ///////////////////////////////////////////////
        // Internal settings used by the plugin
        ///////////////////////////////////////////////

        cmGCActualAlertURL  : null,  // Actual Golden Cookie audio soundbyte (default may be overridden by custom)
        cmSPActualAlertURL  : null,  // Actual Reindeer audio soundbyte (default may be overridden by custom)
        cmGCAudioObject     : null,  // Set when applying user settings
        cmSPAudioObject     : null,  // Set when applying user settings
        cmAudioGCNotified   : false, // Flag gets set to true when audio alert has played once per spawm
        cmAudioSPNotified   : false, // Flag gets set to true when audio alert has played once per spawm
        cmVisualGCNotified  : false, // Flag gets set to true when visual alert has played once per spawm
        cmVisualSPNotified  : false, // Flag gets set to true when visual alert has played once per spawm
        cmStatsLoggingReady : false, // Becomes true when chart APIs are loaded
        cmStatsData         : null,  // Set when a new logging session starts
        cmStatsChart        : null,  // Set when a new logging session stats
        cmStatsLogStart     : null,  // Set when a new logging session starts
        cmStatsLogTimer     : null,  // Set when a new logging sessions starts
        cmVersionNotified   : null,  // Set to last notified version when update check runs

        ///////////////////////////////////////////////
        // Common Selectors
        ///////////////////////////////////////////////

        ccBody          : $('body'),
        ccWrapper       : $('#wrapper'),
        ccGame          : $('#game'),
        ccSectionLeft   : $('#sectionLeft'),
        ccSectionMiddle : $('#sectionMiddle'),
        ccSectionRight  : $('#sectionRight'),
        ccComments      : $('#comments'),
        ccGoldenCookie  : $('#goldenCookie'),
        ccSeasonPopup   : $('#seasonPopup'),
        ccTooltipAnchor : $('#tooltipAnchor'),
        ccTooltip       : $('#tooltip'),
        cmMessageBar    : null, // Set when bar is created
        cmTimerPanel    : null, // Set when panel is created
        cmSettingsPanel : null, // Set when panel is created
        cmStatsPanel    : null, // Set when panel is created
        cmStatsTable    : null, // Set when panel is created
        cmOverlay       : null, // Set when overlay is created
        cmGCOverlay     : null  // Set when GC overlay is created

    };

    return config;

})();