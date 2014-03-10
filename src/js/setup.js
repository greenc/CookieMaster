/**
 * We expose all methods and properties of CookieMaster
 * through a single parent object, for easy extendability
 */
var CM = {};

CM.config       = {}; // Holds the CookieMaster configuration settings
CM.settings     = {}; // Holds the user configurable options
CM.timers       = {}; // Holds any active timers
CM.trueCps      = {}; // Holds the true CpS instance
CM.clickTracker = {}; // Holds the click tracker instance