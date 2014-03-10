/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should be called from here in the order needed.
 */

/*global CM:false*/

CM.Init = (function() {

    var refreshRate     = CM.Config.cmRefreshRate,
        fastRefreshRate = CM.Config.cmFastRefreshRate,
        checkUpdateRate = CM.Config.cmCheckUpdateRate,
        ccVers          = Game.version.toString();

    // Attach the message bar before anything else
    CM.Config.cmMessageBar = $('<div id="CMMessageBar"><span id="CMMessageBarDismissAll">Dismiss all</span></div>');
    CM.Config.ccBody.append(CM.Config.cmMessageBar);

    CM.loadUserSettings();      // Load current user settings from cookie
    CM.attachSettingsPanel();   // Attach the settings panel to the DOM
    CM.attachStatsPanel();      // Attach the stats panel to the DOM
    CM.attachTimerPanel();      // Attach the timer panel to the DOM
    CM.AddPopWrinklersButton(); // Attach the Pop Wrinklers button to the DOM
    CM.setupTooltips();         // Configures the custom tooltips that overwrite the native ones
    CM.preventClickBleed();     // Overrides native click handlers for Golden Cookies and Reindeer
    CM.setEvents();             // Set up general event handlers

    // Attach the Auto-buy panel to the DOM
    // and initialize the auto-buyer class
    CM.attachAutoBuyPanel();
    CM.autoBuyer = new CM.AutoBuy();

    /**
     * Performs more setup routines based on current user settings
     * This also gets called whenever user saves settings
     */
    CM.applyUserSettings();

    // Refresh tooltips when drawn
    Game.tooltip.draw = CM.appendToNative(Game.tooltip.draw, CM.updateTooltips);
    // Refresh tooltips on store rebuild
    Game.RebuildStore = CM.appendToNative(Game.RebuildStore, CM.updateTooltips);

    /**
     * Initialize the main game loop
     */
    setInterval(function() {CM.mainLoop();}, refreshRate);

    /**
     * Initialize secondary, faster loop for the title bar ticker
     * and audio alert notifications
     */
    setInterval(function() {

        // Update the title tab ticker
        CM.updateTitleTicker();

        // Audio alerts
        if(CM.config.settings.audioAlerts.current !== 'off') {
            CM.playAudioAlerts();
        }

        // Auto click popups if set
        if(CM.config.settings.autoClickPopups.current !== 'off') {
            CM.autoClickPopups();
        }

    }, fastRefreshRate);

    // Check for plugin updates
    setInterval(function() {CM.checkForUpdate();}, checkUpdateRate);

    // Warn user if this version of Cookie Clicker has not been tested with CookieMaster
    if(CM.compatibilityCheck(ccVers) === -1) {
        CM.message('<strong>Warning:</strong> CookieMaster has not been tested on this version of Cookie Clicker. Continue at your own peril!', 'warning');
    }

    // Silently fix new game spawns
    if(Game.seasonPopup.maxTime === 0 && Game.goldenCookie.maxTime === 0) {
        CM.fixNewGameSpawns();
    }

    // All done :)
    CM.popup('CookieMaster v.' + CM.config.version + ' loaded successfully!', 'notice');

})();