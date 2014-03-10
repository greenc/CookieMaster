/**
 * We expose all methods and properties of CookieMaster
 * through a single parent object, for easy extendability
 */
var CM = {};

CM.Config       = {}; // Holds the CookieMaster configuration settings
CM.Settings     = {}; // Holds the user configurable options
CM.Timers       = {}; // Holds any active timers
CM.TrueCps      = {}; // Holds the true CpS instance
CM.ClickTracker = {}; // Holds the click tracker instance