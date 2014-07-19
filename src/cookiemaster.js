/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version: 1.17.13
    License: MIT
    Website: http://cookiemaster.co.uk
    GitHub:  https://github.com/greenc/CookieMaster
    Author:  Chris Green
    Email:   c.robert.green@gmail.com

    This code was written to be used, abused,
    extended and improved upon. Feel free to do
    with it as you please, with or without
    permission from, nor credit given to the
    original author (me).

================================================ */

/*global CME:false,CMEO:false,google:false */

/**
 * We will expose all methods and properties of CookieMaster
 * through a single parent object, for easy extendability
 */
var CM = {};

/**
 * Configuration settings for CookieMaster, the loaded version of
 * Cookie Clicker and user-specific settings.
 *
 * @type {Object}
 */
CM.config = {

    ///////////////////////////////////////////////
    // General CookieMaster settings
    ///////////////////////////////////////////////

    version:              '1.17.13',                         // Current version of CookieMaster
    ccCompatibleVersions: ['1.0465'],                       // Known compatible versions of Cookie Clicker
    cmRefreshRate:        1000,                             // Refresh rate for main game loop
    cmFastRefreshRate:    200,                              // Refresh rate for title ticker and audio alerts
    cmCheckUpdateRate:    1800000,                          // How often to check for updates (default 30 minutes)
    cmGCAudioAlertURL:    '../cookiemaster/assets/gc.mp3',  // Default Golden Cookie audio soundbyte
    cmSPAudioAlertURL:    '../cookiemaster/assets/sp.mp3',  // Default Reindeer audio soundbyte
    cmVersionURL:         '../cookiemaster/package.json',   // URL to check for plugin updates
    cmChangelogURL:       'https://github.com/rashfael/CookieMaster/blob/selfhost/CHANGELOG.md',

    ///////////////////////////////////////////////
    // Internal settings used by the plugin
    ///////////////////////////////////////////////

    cmGCActualAlertURL:   null,  // Actual Golden Cookie audio soundbyte (default may be overridden by custom)
    cmSPActualAlertURL:   null,  // Actual Reindeer audio soundbyte (default may be overridden by custom)
    cmGCAudioObject:      null,  // Set when applying user settings
    cmSPAudioObject:      null,  // Set when applying user settings
    cmAudioGCNotified:    false, // Flag gets set to true when audio alert has played once per spawm
    cmAudioSPNotified:    false, // Flag gets set to true when audio alert has played once per spawm
    cmVisualGCNotified:   false, // Flag gets set to true when visual alert has played once per spawm
    cmVisualSPNotified:   false, // Flag gets set to true when visual alert has played once per spawm
    cmStatsLoggingReady:  false, // Becomes true when chart APIs are loaded
    cmStatsData:          null,  // Set when a new logging session starts
    cmStatsChart:         null,  // Set when a new logging session stats
    cmStatsLogStart:      null,  // Set when a new logging session starts
    cmStatsLogTimer:      null,  // Set when a new logging sessions starts
    cmVersionNotified:    null,  // Set to last notified version when update check runs

    ///////////////////////////////////////////////
    // Common Selectors
    ///////////////////////////////////////////////

    ccBody:          $('body'),
    ccWrapper:       $('#wrapper'),
    ccGame:          $('#game'),
    ccSectionLeft:   $('#sectionLeft'),
    ccSectionMiddle: $('#sectionMiddle'),
    ccSectionRight:  $('#sectionRight'),
    ccComments:      $('#comments'),
    ccGoldenCookie:  $('#goldenCookie'),
    ccSeasonPopup:   $('#seasonPopup'),
    ccTooltipAnchor: $('#tooltipAnchor'),
    ccTooltip:       $('#tooltip'),
    cmMessageBar:    null, // Set when bar is created
    cmTimerPanel:    null, // Set when panel is created
    cmSettingsPanel: null, // Set when panel is created
    cmStatsPanel:    null, // Set when panel is created
    cmStatsTable:    null, // Set when panel is created
    cmOverlay:       null, // Set when overlay is created
    cmGCOverlay:     null, // Set when GC overlay is created

    ///////////////////////////////////////////////
    // Long number formatting settings
    ///////////////////////////////////////////////

    cmNumFormatRanges: [
        {
            divider: 1e24,
            suffix: {
                math:       ' Sp',
                si:         ' Y',
                standard:   ' septillion',
                longscale:  ' quadrillion',
                e:          'e24',
                scientific: ' &times; 10&sup2;&#8308;',
                compact:    '*10&sup2;&#8308;'
            }
        },
        {
            divider: 1e21,
            suffix: {
                math:       ' Sx',
                si:         ' Z',
                standard:   ' sextillion',
                longscale:  ' trilliard',
                e:          'e21',
                scientific: ' &times; 10&sup2;&sup1;',
                compact:    '*10&sup2;&sup1;'
            }
        },
        {
            divider: 1e18,
            suffix: {
                math:       ' Qi',
                si:         ' E',
                standard:   ' quintillion',
                longscale:  ' trillion',
                e:          'e18',
                scientific: ' &times; 10&sup1;&#8312;',
                compact:    '*10&sup1;&#8312;'
            }
        }, {
            divider: 1e15,
            suffix: {
                math:       ' Qa',
                si:         ' P',
                standard:   ' quadrillion',
                longscale:  ' billiard',
                e:          'e15',
                scientific: ' &times; 10&sup1;&#8309;',
                compact:    '*10&sup1;&#8309;'
            }
        }, {
            divider: 1e12,
            suffix: {
                math:       ' T',
                si:         ' T',
                standard:   ' trillion',
                longscale:  ' billion',
                e:          'e12',
                scientific: ' &times; 10&sup1;&sup2;',
                compact:    '*10&sup1;&sup2;'
            }
        }, {
            divider: 1e9,
            suffix: {
                math:       ' B',
                si:         ' G',
                standard:   ' billion',
                longscale:  ' milliard',
                e:          'e9',
                scientific: ' &times; 10&#8313;',
                compact:    '*10&#8313;'
            }
        }, {
            divider: 1e6,
            suffix: {
                math:       ' M',
                si:         ' M',
                standard:   ' million',
                longscale:  ' million',
                e:          'e6',
                scientific: ' &times; 10&#8310;',
                compact:    '*10&#8310;'
            }
        }
    ],

    ///////////////////////////////////////////////
    // Timer bar settings
    ///////////////////////////////////////////////

    cmTimerSettings: {
        gc: {
            label: 'Next Cookie:'
        },
        sp: {
            label: 'Next Reindeer:'
        },
        frenzy: {
            label: 'Frenzy:',
            hide: ['clot', 'elderFrenzy']
        },
        elderFrenzy: {
            label: 'Elder Frenzy:',
            hide: ['clot', 'frenzy']
        },
        clickFrenzy: {
            label: 'Click Frenzy:'
        },
        clot: {
            label:'Clot:',
            hide: ['frenzy', 'elderFrenzy']
        },
        pledge: {
            label: 'Pledge:'
        },
        season: {
            label: function() {
                    switch (Game.season) {
                    case 'christmas':
                        return 'Christmas:';
                    case 'easter':
                        return 'Easter:';
                    case 'fools':
                        return 'Fools\' Day:';
                    case 'halloween':
                        return 'Halloween:';
                    case 'valentines':
                        return 'Valentine\'s Day:';
                    default:
                        return 'Season:';
                    }
                }
        },
        wrinklers: {
            label: 'Pop Wrinklers:'
        }
    },


    ///////////////////////////////////////////////
    // User settings panel options
    ///////////////////////////////////////////////

    settingsGroups: {
        ui:      {
            title: 'Interface',
            desc:  'These settings modify the game interface.'
        },
        numbers: {
            title: 'Numbers',
            desc:  'These settings modify how numbers are displayed throughout the game.'
        },
        alerts:  {
            title: 'Timers & Alerts',
            desc:  '<strong>Notice:</strong>If you want to use custom audio alerts, please be mindful to link to non-copyrighted audio files on sites that explicitly allow hotlinking to avoid http://orteil.dashnet.org getting blacklisted!<br />Links to soundjay.com files are blocked as per the main game code.'
        },
        helpers:  {
            title: 'Helpers',
            desc:  'If you enjoy watching the game play itself, these settings are for you.'
        },
        exp: {
            title: 'Experimental',
            desc:  '60% of the time, these work every time.'
        }
    },

    settings: {

        ///////////////////////////////////////////////
        // UI
        ///////////////////////////////////////////////

        cleanUI: {
            group:   'ui',
            type:    'checkbox',
            label:   'Clean Interface:',
            desc:    'Hide the top bar, and make other small graphical enhancements to the game interface.',
            current: 'on'
        },
        timerBarPosition: {
            group:   'ui',
            type:    'select',
            label:   'Timer Bar Position:',
            desc:    'Position the custom timer bar at the top or bottom of the screen.',
            options: [
                {
                    label: 'Top',
                    value: 'top'
                },
                {
                    label: 'Bottom',
                    value: 'bottom'
                }
            ],
            current: 'bottom'
        },
        hideNativeTimers: {
            group:   'ui',
            type:    'checkbox',
            label:   'Hide Native Timers:',
            desc:    'Hide the native game timer bars.',
            current: 'off'
        },
        showMissedGC: {
            group: 'ui',
            type:  'checkbox',
            label: 'Show Missed Golden Cookies:',
            desc:  'Whether or not to show the stat for missed Golden Cookies.',
            current: 'on'
        },
        showAllUpgrades: {
            group:   'ui',
            type:    'checkbox',
            label:   'Show All Upgrades:',
            desc:    'Always display all available upgrades in the store (no need to hover).',
            current: 'off'
        },
        hideBuildingInfo: {
            group:   'ui',
            type:    'checkbox',
            label:   'Hide Building Info Boxes:',
            desc:    'Hides the building information boxes that normally display when hovering each building section',
            current: 'off'
        },
        colorBlind: {
            group:   'ui',
            type:    'checkbox',
            label:   'Color Blind Mode:',
            desc:    'Alternate color scheme that is color-blind friendly.',
            current: 'off'
        },
        showEfficiencyKey: {
            group:   'ui',
            type:    'checkbox',
            label:   'Show Efficiency Key:',
            desc:    'Display building efficiency color key in the right panel.',
            current: 'on'
        },
        showDeficitStats: {
            group:   'ui',
            type:    'checkbox',
            label:   'Show Deficit Stats:',
            desc:    'Show labels on item tooltips warning about Lucky and Chain deficits',
            current: 'on'
        },
        changeFont: {
            group: 'ui',
            type:  'select',
            label: 'Game Font:',
            desc:  'Set the highlight font used throughout the game.',
            options: [
                {
                    label: 'Kavoon (default)',
                    value: 'default'
                },
                {
                    label: 'Serif',
                    value: 'serif'
                },
                {
                    label: 'Sans Serif',
                    value: 'sansserif'
                }
            ],
            current: 'default'
        },
        highVisibilityCookie: {
            group:   'ui',
            type:    'checkbox',
            label:   'High Visibility Cookies:',
            desc:    'Increase the contrast between Golden Cookies and the background.',
            current: 'off'
        },
        increaseClickArea: {
            group:   'ui',
            type:    'checkbox',
            label:   'Increase Cookie Hitbox:',
            desc:    'Make the clickable area larger for Golden Cookies. Helps accuracy during chains. Requires "Show Timers" to be on.',
            current: 'off'
        },

        ///////////////////////////////////////////////
        // Numbers
        ///////////////////////////////////////////////

        numFormat: {
            group: 'numbers',
            type:  'select',
            label: 'Number Formatting:',
            desc:  'Sets the desired decimal and thousands separator symbols for numbers.',
            options: [
                {
                    label: '1,234,567.890',
                    value: 'us'
                },
                {
                    label: '1.234.567,890',
                    value: 'eu'
                }
            ],
            current: 'us'
        },
        shortNums: {
            group:   'numbers',
            type:    'checkbox',
            label:   'Shorten Numbers:',
            desc:    'Shorten large numbers with suffixes.',
            current: 'on'
        },
        suffixFormat: {
            group: 'numbers',
            type:  'select',
            label: 'Suffix Type:',
            desc:  'Notation type to use for shortened number suffixes.',
            options: [
                {
                    label: 'Mathematical',
                    value: 'math'
                },
                {
                    label: 'SI Units',
                    value: 'si'
                },
                {
                    label: 'Standard (Short Scale)',
                    value: 'standard'
                },
                {
                    label: 'Long Scale',
                    value: 'longscale'
                },
                {
                    label: 'Scientific',
                    value: 'scientific'
                },
                {
                    label: 'Scientific (e-notation)',
                    value: 'e'
                },
                {
                    label: 'Scientific (compact)',
                    value: 'compact'
                }
            ],
            current: 'math'
        },
        precision: {
            group: 'numbers',
            type:  'select',
            label: 'Precision:',
            desc:  'How many decimal places to show for shortened numbers.',
            options: [
                {
                    label: '0',
                    value: '0'
                },
                {
                    label: '1',
                    value: '1'
                },
                {
                    label: '2',
                    value: '2'
                },
                {
                    label: '3',
                    value: '3'
                },
                {
                    label: '4',
                    value: '4'
                }
            ],
            current: '3'
        },

        ///////////////////////////////////////////////
        // Alerts
        ///////////////////////////////////////////////

        showGCTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Golden Cookie Timer:',
            desc:    'Display countdown timer for next Golden Cookie.',
            current: 'on'
        },
        showSPTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Reindeer Timer:',
            desc:    'Display countdown timer for next Reindeer.',
            current: 'on'
        },
        showFrenzyTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Frenzy Timer:',
            desc:    'Display time remaining for Frenzy buff when active.',
            current: 'on'
        },
        showElderFrenzyTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Elder Frenzy Timer:',
            desc:    'Display time remaining for Elder Frenzy buff when active.',
            current: 'on'
        },
        showClickFrenzyTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Click Frenzy Timer:',
            desc:    'Display time remaining for Click Frenzy buff when active.',
            current: 'on'
        },
        showClotTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Clot Timer:',
            desc:    'Display time remaining for Clot nerf when active.',
            current: 'on'
        },
        showPledgeTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Pledge Timer:',
            desc:    'Display time remaining for Elder Pledge when active.',
            current: 'on'
        },
        showSeasonTimer: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Season Timer:',
            desc:    'Display time remaining for the current season.',
            current: 'off'
        },
        showGCCountdown: {
            group:   'alerts',
            type:    'checkbox',
            label:   'Show Golden Cookie Countdown:',
            desc:    'Display a countdown timer on Golden Cookies showing how long you have left to click them',
            current: 'on'
        },
        visualAlerts: {
            group:   'alerts',
            type:    'select',
            label:   'Visual Alerts:',
            desc:    'Flash the screen when Golden Cookies and Reindeer spawn.',
            options: [
                {
                    label: 'Off',
                    value: 'off'
                },
                {
                    label: 'Golden Cookie',
                    value: 'gc'
                },
                {
                    label: 'Reindeer',
                    value: 'sp'
                },
                {
                    label: 'All',
                    value: 'all'
                }
            ],
            current: 'all'
        },
        audioAlerts: {
            group:   'alerts',
            type:    'select',
            label:   'Audio Alerts:',
            desc:    'Play an audio alert when Golden Cookies and Reindeer spawn.',
            options: [
                {
                    label: 'Off',
                    value: 'off'
                },
                {
                    label: 'Golden Cookie',
                    value: 'gc'
                },
                {
                    label: 'Reindeer',
                    value: 'sp'
                },
                {
                    label: 'All',
                    value: 'all'
                }
            ],
            current: 'all'
        },
        audioVolume: {
            group: 'alerts',
            type:  'range',
            label: 'Audio Alert Volume:',
            desc:  'Adjust the playback volume of the audio alerts.',
            options: {
                min: 0,
                max: 1,
                step: 0.1
            },
            current: 0.4
        },
        customGCAlert: {
            group:       'alerts',
            type:        'text',
            label:       'Custom Golden Cookie Alert URL:',
            desc:        'Specify your own audio alert for Golden Cookie notifications. URL should link to an MP3 file with a max play time of 2 seconds.',
            placeholder: 'http://example.com/file.mp3',
            current:     ''
        },
        customSPAlert: {
            group:       'alerts',
            type:        'text',
            label:       'Custom Reindeer Alert URL:',
            desc:        'Specify your own audio alert for Reindeer notifications. URL should link to an MP3 file with a max play time of 2 seconds.',
            placeholder: 'http://example.com/file.mp3',
            current:     ''
        },

        ///////////////////////////////////////////////
        // Helpers
        ///////////////////////////////////////////////

        autoPledge: {
            group: 'helpers',
            type:  'checkbox',
            label: 'Auto-Pledge:',
            desc:  'Automatically rebuy Elder Pledge upgrade to keep the Grandmapocalypse at bay.',
            current: 'off'
        },
        clickSanta: {
            group: 'helpers',
            type:  'checkbox',
            label: 'Auto-buy Santa Unlocks:',
            desc:  'Automatically buy the Santa unlocks when they become available.',
            current: 'off'
        },
        autoSeason: {
            group: 'helpers',
            type:  'select',
            label: 'Maintain Season',
            desc:  'Automatically buy the appropriate Season biscuit.',
            options: [
                  {
                      label: 'Off',
                      value: 'off'
                  },
                  {
                      label: 'Christmas',
                      value: 'christmas'
                  },
                  {
                      label: 'Easter',
                      value: 'easter'
                  },
                  {
                      label: 'Fools\' Day',
                      value: 'fools'
                  },
                  {
                      label: 'Halloween',
                      value: 'halloween'
                  },
                  {
                      label: 'Valentine\'s Day',
                      value: 'valentines'
                  }
              ],
            current: 'off'
        },
        popWrinklersAtInterval: {
            group: 'helpers',
            type:  'select',
            label: 'Automatically Pop Wrinklers:',
            desc:  'Set a timer to automatically pop all Wrinklers at the specified interval.',
            options: [
                {
                    label: 'Off',
                    value: 'off'
                },
                {
                    label: 'Every 10 minutes',
                    value: 600000
                },
                {
                    label: 'Every 30 minutes',
                    value: 1800000
                },
                {
                    label: 'Every hour',
                    value: 3600000
                },
                {
                    label: 'Every 4 hours',
                    value: 14400000
                },
                {
                    label: 'Every 8 hours',
                    value: 28800000
                }
            ],
            current: 'off'
        },
        trueNeverclick: {
            group: 'helpers',
            type:  'checkbox',
            label: 'True Neverclick Helper:',
            desc:  'Prevents clicks on the Big Cookie until you unlock the True Neverclick achievement. Make sure to disable auto-click if using this feature.',
            current: 'off'
        },
        autoClickPopups: {
            group:   'helpers',
            type:    'select',
            label:   'Auto-click Popups:',
            desc:    'Automatically click Golden Cookies and Reindeer when they spawn.',
            options: [
                {
                    label: 'Off',
                    value: 'off'
                },
                {
                    label: 'Golden Cookies',
                    value: 'gc'
                },
                {
                    label: 'Reindeer',
                    value: 'sp'
                },
                {
                    label: 'All',
                    value: 'all'
                }
            ],
            current: 'off'
        },
        autoClick: {
            group:   'helpers',
            type:    'select',
            label:   'Auto-click Big Cookie:',
            desc:    'Automatically click the big cookie. WARNING: High values may cause lag (and a guilty conscience).',
            options: [
                {
                    label: 'Off',
                    value: 'off'
                },
                {
                    label: 'Click Frenzies & Elder Frenzies',
                    value: 'clickFrenzies'
                },
                {
                    label: 'All Frenzies',
                    value: 'allFrenzies'
                },
                {
                    label: 'All the time',
                    value: 'on'
                }
            ],
            current: 'off'
        },
        autoClickSpeed: {
            group: 'helpers',
            type:  'range',
            label: 'Auto-click Speed:',
            desc:  'How many times per second to auto-click the big cookie. Note that most browsers throttle timers to 1 second intervals when the page is running in the background.',
            options: {
                min: 1,
                max: 250,
                step: 1
            },
            current: 10
        },

        ///////////////////////////////////////////////
        // Experimental
        ///////////////////////////////////////////////

        autoBuy: {
            group:   'exp',
            type:    'checkbox',
            label:   'Auto-buy:',
            desc:    'Automatically buy the most efficient buildings and upgrades',
            current: 'off'
        },
        maintainBank: {
            group:   'exp',
            type:    'select',
            label:   'Maintain Bank:',
            desc:    'Tells the auto-buyer when to respect the Lucky and Lucky+Frenzy bank requirements.' +
                '  "Sometimes" allows the auto-buyer to use its best judgement.',
            options: [
                      {
                          label: 'Never',
                          value: 'off'
                      },
                      {
                          label: 'Sometimes',
                          value: 'smart'
                      },
                      {
                          label: 'Always',
                          value: 'on'
                      }
                  ],
            current: 'off'
        },
        noPocalypse: {
            group:   'exp',
            type:    'checkbox',
            label:   'No-pocalypse:',
            desc:    'Do not let auto-buy purchase further research upgrades past Underworld ovens',
            current: 'off'
        },
        enableLogging: {
            group: 'exp',
            type:  'checkbox',
            label: 'Enable Logging:',
            desc:  'Enables the ability to log stats and view a log chart. Logging can be managed in the Stats panel when this setting is active.',
            current: 'off'
        },
        cpsMethod: {
            group:   'exp',
            type:    'select',
            label:   'CpS Calculation Method:',
            desc:    'Choose the Cookies Per Second calculation method to use in timers and other functions.  Base CpS ignores frenzies.  Current CpS is modified by frenzies.  True CpS is a rolling average of your actual cookie production.',
            options: [
                {
                    label: 'Base CpS',
                    value: 'base'
                },
                {
                    label: 'Current CpS',
                    value: 'current'
                },
                {
                    label: 'True CpS',
                    value: 'effective'
                }
            ],
            current: 'effective'
        },
        trueCpsAverage: {
            group: 'exp',
            type:  'range',
            label: 'True CpS Tracking Duration:',
            desc:  'CookieMaster tracks your true CpS on a rolling basis in order to improve efficiency algorithms. This setting allows you to adjust the rolling period in minutes. If you are building very quickly (e.g. have many HCs), you should set this to a lower value.',
            options: {
                min: 5,
                max: 240,
                step: 1
            },
            current: 60
        },
        clickingAverage: {
            group: 'exp',
            type:  'range',
            label: 'Click Tracking Duration:',
            desc:  'CookieMaster tracks your Big Cookie clicks on a rolling basis in order to improve efficiency algorithms. This setting allows you to adjust the rolling period in minutes.',
            options: {
                min: 5,
                max: 240,
                step: 1
            },
            current: 60
        }

    }

};

/**
 * Object to hold any active timers
 * @type {Object}
 */
CM.timers = {};

/**
 * Object to hold the true cps instance
 * @type {Object}
 */
CM.trueCps = {};

/**
 * Object to hold the click tracker instance
 * @type {Object}
 */
CM.clickTracker = {};

/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should be called from here in the order needed.
 */
CM.init = function() {

    var self            = this,
        checkUpdateRate = this.config.cmCheckUpdateRate,
        ccVers          = Game.version.toString();

    // Attach the message bar before anything else
    this.config.cmMessageBar = $('<div id="CMMessageBar"><span id="CMMessageBarDismissAll">Dismiss all</span></div>');
    this.config.ccBody.append(this.config.cmMessageBar);

    this.loadUserSettings();      // Load current user settings from cookie
    this.attachSettingsPanel();   // Attach the settings panel to the DOM
    this.attachStatsPanel();      // Attach the stats panel to the DOM
    this.attachTimerPanel();      // Attach the timer panel to the DOM
    this.AddPopWrinklersButton(); // Attach the Pop Wrinklers button to the DOM
    this.setupTooltips();        // Configures the custom tooltips that overwrite the native ones
    this.setupDynamicTooltips();
    // this.preventClickBleed();     // Overrides native click handlers for Golden Cookies and Reindeer
    this.setEvents();             // Set up general event handlers

    // Attach the Auto-buy panel to the DOM
    // and initialize the auto-buyer class
    this.attachAutoBuyPanel();
    this.autoBuyer = new this.AutoBuy();

    /**
     * Performs more setup routines based on current user settings
     * This also gets called whenever user saves settings
     */
    this.applyUserSettings();

    // Refresh tooltips when drawn
    Game.tooltip.draw = this.appendToNative(Game.tooltip.draw, CM.updateTooltips);
    // Refresh tooltips on store rebuild
    Game.RefreshStore = this.appendToNative(Game.RefreshStore, CM.updateTooltips);
    
    // Cause Cookie Clicker to call our logic every frame
    Game.customLogic.push(self.gameLogicHook);

    // Check for plugin updates
    setInterval(function() {self.checkForUpdate();}, checkUpdateRate);

    // Warn user if this version of Cookie Clicker has not been tested with CookieMaster
    if(this.compatibilityCheck(ccVers) === -1) {
        this.message('<strong>Warning:</strong> CookieMaster has not been tested on this version of Cookie Clicker. Continue at your own peril!', 'warning');
    }

    // Silently fix new game spawns
    if(Game.seasonPopup.maxTime === 0 && Game.goldenCookie.maxTime === 0) {
        this.fixNewGameSpawns();
    }
    
    // Miscellaneous member variables
    this.lastRecalculatedDekasecond = 0; // For keeping simulations accurate with Century egg

    // All done :)
    this.popup('CookieMaster v.' + this.config.version + ' loaded successfully!', 'notice');

};

CM.gameLogicHook = function() {
    /**
     * The main game loop
     */
    if (Game.T % Math.round(Game.fps * (CM.config.cmRefreshRate / 1000)) == 0) {
        CM.mainLoop();
    }

    /**
     * Secondary, faster loop for the title bar ticker
     * and audio alert notifications
     */
    if (Game.T % Math.round(Game.fps * (CM.config.cmFastRefreshRate / 1000)) == 0) {
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
    } else 	if (Game.T%(Game.fps*2)==0) {
        // Make sure the native title update doesn't have a chance to display
        CM.updateTitleTicker();
    }

};

/**
 * Returns index of version number in the array of known
 * compatible versions
 *
 * @param  {String}  version CC version
 * @return {Integer}
 */
CM.compatibilityCheck = function(version) {

    var vArray = this.config.ccCompatibleVersions,
        i;

    for(i = 0; i < vArray.length; i++) {
        if(vArray[i].match(version)) {
            return i;
        }
    }

    return -1;

};

/**
 * Formats very large numbers with their appropriate suffix, also adds
 * thousands and decimal separators and performs correct rounding for
 * smaller numbers
 *
 * @param  {Integer} num    The number to be formatted
 * @param  {Integer} floats Amount of decimal places required
 * @return {String}
 */
CM.largeNumFormat = function(num, precision) {

    var useShortNums = this.config.settings.shortNums.current === 'on' ? true : false,
        notation     = this.config.settings.suffixFormat.current,
        largeFloats  = this.config.settings.precision.current,
        decSep = this.config.settings.numFormat.current === 'us' ? '.' : ',',
        ranges = this.config.cmNumFormatRanges,
        decimal = decSep === '.' ? '.' : ',',
        comma = decSep === '.' ? ',' : '.',
        floats = precision || 0,
        qualifier    = num < 0 ? '-' : '',
        parts,
        i;

    // We'd like our integers to be finite please :)
    if(!isFinite(num)) {
        return 'Infinity';
    }

    // Force positive int for working on it
    num = Math.abs(num);

    // Format the very large numbers
    if(useShortNums) {
        for(i = 0; i < ranges.length; i++) {
            if(num >= ranges[i].divider) {
                num = Math.floor((num / ranges[i].divider) * Math.pow(10, largeFloats)) / Math.pow(10, largeFloats);
                num = num.toFixed(largeFloats) + ranges[i].suffix[notation];
                return qualifier + num.replace('.', decimal);
            }
        }
    }

    // Apply rounding
    num = Math.round(num * Math.pow(10, floats)) / Math.pow(10, floats);

    // Localize
    parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, comma);

    return qualifier + parts.join(decimal);

};

/**
 * Class for managing individual timers, e.g. Golden Cookie, Frenzies, etc.
 *
 * @param {String} type  reindeer, goldenCookie, frenzy, clickFrenzy,
 *                       elderFrenzy, clot
 * @param {String} label Display label for the timer
 */
CM.Timer = function(type, label) {

    this.type      = type;
    this.labelFn   = null;
    this.label     = '';
    this.id        = 'CMTimer-' + this.type;
    this.container = {};
    this.barOuter  = {};
    this.barInner  = {};
    this.counter   = {};
    this.labelDiv  = {};
    this.limiter   = null; // Add only if needed

    if (typeof label === 'function') {
        this.labelFn = label;
        this.label = this.labelFn.call(this);
    } else {
        this.label = label;
    }
    
    /**
     * Create a new timer object
     * @return {Object} Timer HTML as jQuery object
     */
    this.create = function() {

        var timings    = this.getTimings(),
            $container = $('<div />').attr({'class': 'cmTimerContainer cf cmTimer-' + this.type, 'id': this.id}),
            $barOuter  = $('<div />').addClass('cmTimer'),
            $barInner  = $('<div />'),
            $label     = $('<div />').addClass('cmTimerLabel').text(this.label),
            $counter   = $('<div />').addClass('cmTimerCounter').text(Math.round(timings.minCurrent)),
            $limiter   = null, // Not always needed, so we create it further down
            width      = timings.minCurrent / timings.max * 100,
            hardMin;

        // Add a min time indicator if necessary
        if(timings.hasOwnProperty('min') && timings.min > 0) {

            hardMin = timings.min / timings.max * 100;

            // Emphasize the timer if it has reached its minimum spawn time
            if(width < 100 - hardMin) {
                $container.addClass('cmEmphasize');
            }

            $limiter = $('<span />').css('width', hardMin + '%');
            $barOuter.append($limiter);

        }

        $barInner.css('width', width + '%');

        $barOuter.append($barInner);
        $container.append($label, $barOuter, $counter);

        // Update the properties on the Timer object
        this.container = $container;
        this.barOuter  = $barOuter;
        this.barInner  = $barInner;
        this.counter   = $counter;
        this.labelDiv  = $label;
        this.limiter   = $limiter;

        return $container;

    };

    /**
     * Updates timing values of the timer
     *
     * @return {Object} this
     */
    this.update = function() {

        var $limiter  = this.limiter,
            $barOuter = this.barOuter,
            timings   = this.getTimings(),
            width     = timings.minCurrent / timings.max * 100,
            hardMin;

        if(timings.hasOwnProperty('min') && timings.min) {

            // Add the limiter bar if it doesn't already exist
            // (This could be the case if you import a save into a new, unsaved game)
            if(!this.limiter) {
                $limiter = $('<span />');
                $barOuter.append($limiter);
                this.limiter = $limiter;
            }

            hardMin = timings.min / timings.max * 100;
            this.limiter.css('width', hardMin + '%');

            if(width < 100 - hardMin) {
                this.limiter.fadeOut(500);
                this.container.addClass('cmEmphasize');
            } else {
                this.limiter.show();
                this.container.removeClass('cmEmphasize');
            }

        }

        this.barInner.css('width', width + '%');
        this.counter.text(Math.round(timings.minCurrent));
        if (this.labelFn != null) {
            this.label = this.labelFn.call(this);
            this.labelDiv.text(this.label);
        }

        return this;

    };

    /**
     * Retrieves the current timings from the game code
     *
     * @return {Object} timings
     */
    this.getTimings = function() {

        var timings   = {},
            lucky     = Game.Has("Get lucky"),
            maxPledge = Game.Has('Sacrificial rolling pins') ? 60 : 30,
            WrinklerT = CM.popWrinklersTimeRelative,
            time      = new Date().getTime();

        if(this.type === 'sp') {
            timings.min = Game.seasonPopup.minTime / Game.fps;
            timings.minCurrent = (Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps;
            timings.max = Game.seasonPopup.maxTime / Game.fps;
        } else if(this.type === 'gc') {
            timings.min = Game.goldenCookie.minTime / Game.fps;
            timings.minCurrent = (Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps;
            timings.max = Game.goldenCookie.maxTime / Game.fps;
        } else if(this.type === 'frenzy') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 77 + 77 * lucky;
        } else if(this.type === 'clickFrenzy') {
            timings.minCurrent = Game.clickFrenzy / Game.fps;
            timings.max = 13 + 13 * lucky;
        } else if(this.type === 'elderFrenzy') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 6 + 6 * lucky;
        } else if(this.type === 'clot') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 66 + 66 * lucky;
        } else if(this.type === 'pledge') {
            timings.minCurrent = Game.pledgeT / Game.fps;
            timings.max = 60 * maxPledge;
        } else if(this.type === 'season') {
            timings.minCurrent = Game.seasonT / Game.fps;
            timings.max = 60*60*24;
        } else if(this.type === 'wrinklers') {
            timings.minCurrent = (CM.popWrinklersTime - time) / 1000;
            timings.max = WrinklerT / 1000;
        }

        return timings;

    };

    /**
     * Shows timer if hidden
     *
     * @return {Object} this
     */
    this.show = function() {

        if(this.container.is(':hidden')) {

            var $content = this.container.children();

            $content.css('opacity', 0);
            this.container.slideDown(200, function() {
                $content.animate({'opacity': 1}, 200);
            });

        }

        return this;

    };

    /**
     * Hides timer if visible
     *
     * @return {Object} this
     */
    this.hide = function() {

        if(this.container.is(':visible')) {

            var $container = this.container;

            this.container.children().animate({'opacity': 0}, 200, function() {
                $container.slideUp(200);
            });

        }

        return this;

    };

};

/**
 * Get the number of Heavenly Chips from a number of cookies (all time)
 *
 * @param {integer} cookiesNumber
 * @return {integer}
 */
CM.cookiesToHeavenly = function(cookies) {

    return Math.floor(Math.sqrt(2.5 * 1e11 + 2 * cookies) / 1e6 - 0.5);

};

/**
 * Get the number of cookies required to have X chips
 *
 * @param {integer} chipsNumber
 * @return {integer}
 */
CM.heavenlyToCookies = function(chips) {

    return 5 * 1e11 * chips * (chips + 1);

};

/**
 * Get the number of cookies remaining to have X chips
 *
 * @param {integer} chipsNumber
 * @return {integer} Returns 0 if number is negative
 */
CM.heavenlyToCookiesRemaining = function(chips) {

    var remaining = this.heavenlyToCookies(chips) - (Game.cookiesReset + Game.cookiesEarned);

    return remaining > 0 ? remaining : 0;

};

/**
 * Returns array of stats for Heavenly Chips
 *
 * @return {Array} [currentHC, currentPercent, maxHC, maxPercent, cookiesToNextHC, totalCookiesToNextHC, timeToNextHC]
 */
CM.getHCStats = function() {

    var stats                = [],
        current              = Game.prestige['Heavenly chips'],
        currentPercent       = current * 2,
        max                  = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
        maxPercent           = max * 2,
        cookiesToNext        = this.heavenlyToCookiesRemaining(max + 1),
        totalCookiesToNext   = this.heavenlyToCookies(max + 1) - this.heavenlyToCookies(max),
        timeToNext           = Math.round(cookiesToNext / this.configuredCps()),
        i;

    stats = [
        current,
        currentPercent,
        max,
        maxPercent,
        cookiesToNext,
        totalCookiesToNext,
        this.formatTime(timeToNext)
    ];

    return stats;

};

CM.testResetFormula = function(M) {

    var earned     = Game.cookiesEarned / 1e12,
        now        = new Date().getTime(),
        started    = (now - Game.startDate) / 1000,
        cps        = CM.baseCps() / 1e12,
        maxHC      = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
        hcGained   = maxHC - Game.prestige['Heavenly chips'],
        multiplier = M || 1,

        X  = (multiplier * cps * started) - earned,
        Y = Math.pow(hcGained, 2) / 2;

    console.log('X: ', Beautify(X));
    console.log('Y: ', Beautify(Y));

};

/**
 * Returns the global CpS multiplier for n Heavenly Chips, or current amount if no
 * argument supplied
 *
 * @param  {Integer} chips        Heavenly Chips to calculate multiplier for
 * @param  {Boolean} fullHeavenly Assume player has all HC upgrades (100% heavenly multiplier)
 * @return {Integer}
 */
CM.getBaseMultiplier = function(chips, fullHeavenly) {

    var hc           = chips || parseFloat(Game.prestige['Heavenly chips']),
        mult         = 1,
        heavenlyMult = 0,
        milkMult     = Game.Has('Santa\'s milk and cookies') ? 1.05 : 1,
        upgrade,
        i;

    // Add cookie upgrade multipliers
    for(i in Game.Upgrades) {
        upgrade = Game.Upgrades[i];
        if(upgrade.bought > 0) {
            if (upgrade.type === 'cookie' && Game.Has(upgrade.name)) {
                mult += upgrade.power * 0.01;
            }
        }
    }

    // Add other upgrade multipliers
    mult += Game.Has('Specialized chocolate chips') * 0.01;
    mult += Game.Has('Designer cocoa beans')        * 0.02;
    mult += Game.Has('Underworld ovens')            * 0.03;
    mult += Game.Has('Exotic nuts')                 * 0.04;
    mult += Game.Has('Arcane sugar')                * 0.05;
    mult += Game.Has('Increased merriness')         * 0.15;
    mult += Game.Has('Improved jolliness')          * 0.15;
    mult += Game.Has('A lump of coal')              * 0.01;
    mult += Game.Has('An itchy sweater')            * 0.01;
    mult += Game.Has('Santa\'s dominion')           * 0.50;

    // Add Santa upgrade multipliers
    if(Game.Has('Santa\'s legacy')) {
        mult += (Game.santaLevel + 1) * 0.1;
    }

    // Calculate heavenly multiplier
    if(fullHeavenly) {
        heavenlyMult = 1;
    } else {
        heavenlyMult += Game.Has('Heavenly chip secret')   * 0.05;
        heavenlyMult += Game.Has('Heavenly cookie stand')  * 0.20;
        heavenlyMult += Game.Has('Heavenly bakery')        * 0.25;
        heavenlyMult += Game.Has('Heavenly confectionery') * 0.25;
        heavenlyMult += Game.Has('Heavenly key')           * 0.25;
    }

    // Add heavenly multiplier
    mult += hc * 0.02 * heavenlyMult;

	for (var i in Game.customCps) {mult+=Game.customCps[i]();}
	
    // Add Milk multipliers
    if(Game.Has('Kitten helpers')) {
        mult *= (1 + Game.milkProgress * 0.05 * milkMult);
    }
    if(Game.Has('Kitten workers')) {
        mult *= (1 + Game.milkProgress * 0.1 * milkMult);
    }
    if(Game.Has('Kitten engineers')) {
        mult *= (1 + Game.milkProgress * 0.2 * milkMult);
    }
    if(Game.Has('Kitten overseers')) {
        mult *= (1 + Game.milkProgress * 0.2 * milkMult);
    }
    if(Game.Has('Kitten managers')) {
        mult *= (1 + Game.milkProgress * 0.2 * milkMult);
    }

    // Easter season egg upgrades
	var eggMult=0;
	if (Game.Has('Chicken egg')) eggMult++;
	if (Game.Has('Duck egg')) eggMult++;
	if (Game.Has('Turkey egg')) eggMult++;
	if (Game.Has('Quail egg')) eggMult++;
	if (Game.Has('Robin egg')) eggMult++;
	if (Game.Has('Ostrich egg')) eggMult++;
	if (Game.Has('Cassowary egg')) eggMult++;
	if (Game.Has('Salmon roe')) eggMult++;
	if (Game.Has('Frogspawn')) eggMult++;
	if (Game.Has('Shark egg')) eggMult++;
	if (Game.Has('Turtle egg')) eggMult++;
	if (Game.Has('Ant larva')) eggMult++;
	if (Game.Has('Century egg'))
	{
		//the boost increases a little every day, with diminishing returns up to +10% on the 100th day
		var day=Math.floor((new Date().getTime()-Game.startDate)/1000/10)*10/60/60/24;
		day=Math.min(day,100);
		eggMult+=(1-Math.pow(1-day/100,3))*10;
	}
	mult*=(1+0.01*eggMult);
	
    // Add Elder Covenant multiplier
    if(Game.Has('Elder Covenant')) {
        mult *= 0.95;
    }
	if (Game.Has('Golden switch')) mult*=1.25;
	
	for (var i in Game.customCpsMult) {mult*=Game.customCpsMult[i]();}
	

    return mult;

};

/**
 * Get the CpS if player were to reset and build back to current point
 *
 * @return {Integer}
 */
CM.getResetCps = function() {

    var maxHC       = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
        newBaseMult = this.getBaseMultiplier(maxHC, true),
        baseCps     = Game.cookiesPs / Game.globalCpsMult;

    return baseCps * newBaseMult;

};

/**
 * Returns base CPS
 *
 * @return {Integer}
 */
CM.baseCps = function() {

    var frenzyMod = (Game.frenzy > 0) ? Game.frenzyPower : 1;

    return Game.cookiesPs / frenzyMod;

};

/**
 * Returns current effective CPS (uses TrueCps)
 *
 * @return {Integer}
 */
CM.effectiveCps = function() {

    return this.trueCps.cps > 0 ? this.trueCps.cps : Game.cookiesPs;

};

/**
 * Returns the current CPS using the configured calculation method
 * 
 * @return {Integer}
 */
CM.configuredCps = function() {
	if (this.config.settings.cpsMethod.current === 'base') {
		return this.baseCps();
	} else if (this.config.settings.cpsMethod.current === 'current') {
		return Game.cookiesPs;
	} else /*if (this.config.settings.cpsMethod.current === 'effective')*/ {
		return this.effectiveCps();
	}
};

/**
 * Normalizes the given value (assumed to be based on current CPS)
 * according to the configured CPS calculation method.
 */
CM.normalize = function(value) {
    var factor;
    if (this.config.settings.cpsMethod.current === 'base') {
        factor = (Game.frenzy > 0) ? 1 / Game.frenzyPower : 1;
    } else if (this.config.settings.cpsMethod.current === 'current') {
        factor = 1;
    } else /*if (this.config.settings.cpsMethod.current === 'effective')*/ {
        factor = this.effectiveCps() / Game.cookiesPs;
    }
    return value * factor;
};

/**
 * Returns base CPC (cookies per click)
 *
 * @return {Integer}
 */
CM.baseCpc = function() {

    var frenzyMod      = (Game.frenzy > 0) ? Game.frenzyPower : 1,
        clickFrenzyMod = (Game.clickFrenzy > 0) ? 777 : 1;

    return Game.mouseCps() / frenzyMod / clickFrenzyMod;

};

/**
 * Returns bank required for max Lucky reward
 *
 * @return {Integer}
 */
CM.luckyBank = function() {

    return this.baseCps() * 1200 * 10 + 13;

};

/**
 * Returns bank required for max Lucky + Frenzy reward
 *
 * @return {Integer}
 */
CM.luckyFrenzyBank = function() {

    return this.baseCps() * 1200 * 10 * 7 + 13;

};

/**
 * Returns maximum Lucky reward
 *
 * @return {Integer}
 */
CM.maxLuckyReward = function() {

    return this.baseCps() * 1200 + 13;

};

/**
 * Returns maximum Lucky + Frenzy reward
 *
 * @return {Integer}
 */
CM.maxLuckyFrenzyReward = function() {

    return this.baseCps() * 1200 * 7 + 13;

};

/**
 * Returns current Lucky reward
 *
 * @return {Integer}
 */
CM.luckyReward = function() {

    return Math.min(Game.cookies / 10 + 13, this.baseCps() * 1200 + 13);

};

/**
 * Returns current Lucky + Frenzy reward
 *
 * @return {Integer}
 */
CM.luckyFrenzyReward = function() {

    return Math.min(Game.cookies / 10 + 13, this.baseCps() * 1200 * 7 + 13);

};

/**
 * Returns maximum potential Cookie Chain reward
 *
 * @return {Integer}
 */
CM.maxChainReward = function() {

    var bankLimit       = Game.cookies / 4,
        cpsLimit        = Game.cookiesPs * 60 * 60 * 3,
        wrath           = Game.elderWrath === 3 ? true : false,
        chainValue      = wrath ? 66666 : 77777; // Minimum guaranteed chain amount

    // Chains not possible until player has earned 100000+ cookies total
    if(Game.cookiesEarned < 100000) {
        return false;
    }
    while(chainValue < bankLimit && chainValue <= cpsLimit) {
        chainValue *= 10;
        chainValue += wrath ? 6 : 7;
    }

    return chainValue / 10;

};

/**
 * Returns bank or CpS required for next chain tier
 *
 * @param  {String}  type      bank, cps
 * @param  {String}  which     this, next
 * @param  {Integer} maxReward Maximum current chain reward
 * @return {Integer}
 */
CM.requiredChainTier = function(type, which, maxReward) {

    var wrath         = Game.elderWrath === 3 ? true : false,
        digit         = wrath ? 6 : 7,
        minChain      = wrath ? 66666 : 77777,
        minNextChain  = wrath ? 666666 : 777777,
        thisChainTier = (maxReward < minChain) ? minChain     : maxReward,
        nextChainTier = (maxReward < minChain) ? minNextChain : maxReward * 10 + digit,
        chainAmount;

    // Chains not possible until player has earned 100000+ cookies total
    if(Game.cookiesEarned < 100000) {
        return false;
    }

    chainAmount = which === 'this' ? thisChainTier : nextChainTier;

    return type === 'bank' ? chainAmount * 4 : chainAmount / 3 / 60 / 60;

};

/**
 * Returns array of Wrinkler stats
 *
 * @return {Array} [cookiesSucked, totalReward]
 */
CM.getWrinklerStats = function() {

    var sucked = 0,
        rewardMultiplier = 1.1;

    $.each(Game.wrinklers, function() {
        sucked += this.sucked;
    });

    return [sucked, sucked * rewardMultiplier];

};

/**
 * Get the reward for clicking on a Reindeer
 *
 * 1 min of production or 25 cookies
 *
 * @return {Integer}
 */
CM.getReindeerReward = function() {

    var multiplier = Game.Has('Ho ho ho-flavored frosting') ? 2 : 1;

    return Math.max(25, Game.cookiesPs * 60) * multiplier;

};

CM.fixNewGameSpawns = function() {
    Game.goldenCookie.minTime = Game.goldenCookie.getMinTime();
    Game.goldenCookie.maxTime = Game.goldenCookie.getMaxTime();
    Game.seasonPopup.minTime  = Game.seasonPopup.getMinTime();
    Game.seasonPopup.maxTime  = Game.seasonPopup.getMaxTime();
    Game.goldenCookie.toDie   = 0;
    Game.seasonPopup.toDie    = 0;
};

/**
 * Format a time (s) to an human-readable format
 *
 * @param {Integer} time
 * @param {String}  compressed  Compressed output (minutes => m, etc.)
 *
 * @return {String}
 */
CM.formatTime = function(t, compressed) {

    // Compute each units separately
    var time    = Math.round(t),
        days    = parseInt(time / 86400) % 999,
        hours   = parseInt(time / 3600) % 24,
        minutes = parseInt(time / 60) % 60,
        seconds = time % 60,
        units = [' days, ', ' hours, ', ' minutes, ', ' seconds'],
        formatted;

    if (typeof compressed === 'undefined') {
        compressed = false;
    }

    // Take care of special cases
    if (!isFinite(time)) {
        return 'Never';
    } else if (time / 86400 > 1e3) {
        return '> 1,000 days';
    }

    if (!compressed) {
        if (days === 1) {
            units[0] = ' day, ';
        }
        if (hours === 1) {
            units[1] = ' hour, ';
        }
        if (minutes === 1) {
            units[2] = ' minute, ';
        }
        if (seconds === 1) {
            units[3] = ' second';
        }
    } else {
        units = ['d, ', 'h, ', 'm, ', 's'];
    }

    // Create final string
    formatted = '';
    if (days > 0) {
        formatted += days + units[0];
    }
    if (days > 0 || hours > 0) {
        formatted += hours + units[1];
    }
    if (days > 0 || hours > 0 || minutes > 0) {
        formatted += minutes + units[2];
    }
    if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
        formatted += seconds + units[3];
    }

    return formatted;
};

/**
 * Checks if any Wrinklers are on screen
 *
 * @return {[Boolean]}
 */
CM.wrinklersExist = function() {

    var i;

    for(i = 0; i < Game.wrinklers.length; i++) {
        if(Game.wrinklers[i].phase > 0) {
            return true;
        }
    }

    return false;

};

/**
 * Returns array of missing upgrades
 *
 * @return {Array}
 */
CM.getMissingUpgrades = function() {

    var missing = [],
        hasSS   = Game.Has('Season switcher'),
        a;

    for(a in Game.Upgrades) {
        if(Game.Upgrades[a].debug !== 1 && Game.Upgrades[a].unlocked === 0) {
            // If Season switcher is unlocked, don't add the switching upgrades to the list
            if(hasSS) {
                if(
                    Game.Upgrades[a].name !== 'Ghostly biscuit' &&
                    Game.Upgrades[a].name !== 'Lovesick biscuit' &&
                    Game.Upgrades[a].name !== 'Festive biscuit'
                ) {
                    missing.push(a);
                }
            } else {
                missing.push(a);
            }
        }
    }

    return missing;

};

/**
 * Returns array of missing achievements
 *
 * @param  {Boolean} shadow Returns shadow achievements if true
 * @return {Array}
 */
CM.getMissingAchievements = function(shadow) {

    var missing = [],
        a;

    for(a in Game.Achievements) {
        if(Game.Achievements[a].category === 'none' && Game.Achievements[a].won === 0) {
            if(shadow) {
                if(Game.Achievements[a].hide === 3) {
                    missing.push(a);
                }
            } else {
                if(Game.Achievements[a].hide !== 3) {
                    missing.push(a);
                }
            }
        }
    }

    return missing;

};

/**
 * Capitalize the first letter of each word
 *
 * @param  {String} str String to process
 * @return {String}
 */
CM.toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/**
 * Styles CookieMaster popups differently while still using the native Game.Popup method
 *
 * @param  {String}   message
 * @param  {String}   type    optional [notice|success|warning|error]
 * @return {Function}
 */
CM.popup = function(message, type) {

    var typeClass = this.toTitleCase(type) || 'Notice';

    return Game.Popup('<span class="cmPopupText cmPopup' + typeClass + '">' + message + '</span>');

};

/**
 * Append a piece of code to native code
 *
 * @param {String}  native
 * @param {Closure} append
 *
 * @return {Void}
 */
CM.appendToNative = function(native, append) {
    return function() {
        native.apply(this, arguments);
        append.apply(CM);
    };
};

/**
 * Execute replacements on a method's code
 *
 * @param {String}  code
 * @param {Closure} replaces
 *
 * @return {String}
 */
CM.replaceCode = function(code, replaces) {

    var replace;

    code = code.toString();

    // Apply the various replaces
    for(replace in replaces) {
        code = code.replace(replace, replaces[replace]);
    }

    return code
        .replace(/^function[^{]+{/i, "")
        .replace(/}[^}]*$/i, "");
};

/**
 * Replace a native CookieClicker function with another
 *
 * @param {String}  native
 * @param {Closure} replaces
 *
 * @return {void}
 */
CM.replaceNative = function(native, replaces, args) {

    var newCode = Game[native];

    if (typeof args === 'undefined') {
        args = '';
    }

    Game[native] = new Function(args, this.replaceCode(newCode, replaces));

};

/**
 * Compares 2 version numbers
 * @param  {String} v1      version number 1
 * @param  {String} v2      version number 2
 * @param  {Object} options optional params to control sorting and matching behaviour
 * @return {Integer}         -1|0|1
 */
CM.versionCompare = function(v1, v2, options) {

    var lexicographical = options && options.lexicographical,
        zeroExtend = options && options.zeroExtend,
        v1parts = v1.split('.'),
        v2parts = v2.split('.'),
        i;

    function isValidPart(x) {
        return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if(!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
        return NaN;
    }

    if(zeroExtend) {
        while(v1parts.length < v2parts.length) {
            v1parts.push('0');
        }
        while(v2parts.length < v1parts.length){
            v2parts.push('0');
        }
    }

    if(!lexicographical) {
        v1parts = v1parts.map(Number);
        v2parts = v2parts.map(Number);
    }

    for(i = 0; i < v1parts.length; ++i) {
        if(v2parts.length === i) {
            return 1;
        }
        if(v1parts[i] === v2parts[i]) {
            continue;
        }
        else if(v1parts[i] > v2parts[i]) {
            return 1;
        }
        else {
            return -1;
        }
    }

    if(v1parts.length !== v2parts.length) {
        return -1;
    }

    return 0;

};

/**
 * Returns true if audio object has loaded a valid resource
 * @param  {Boolean} obj loaded audio object
 * @return {Boolean}
 */
CM.testAudioObject = function(obj) {

    return obj.networkState === 1 ? true : false;

};

/**
 * Automates buying functionality
 */
CM.AutoBuy = function() {

    // Golden Cookie upgrades
    this.gcUpgrades = [52, 53, 86];
    // Elder Covenant
    this.elderCovenant = [74, 84, 85];
    // These upgrades can't have BCI calculated, but should always be bought
    this.alwaysBuy = [87, 141, 152, 157, 158, 159, 160, 161, 163, 164, 168];
    // Grandmapocalypse upgrades
    this.grandmapocalypse = [69, 70, 71, 72, 73];
    // Season switching upgrades
    this.seasonal = [181, 182, 183, 184, 185];

    // setInterval to autobuy
    this.automate = null;
    // alive flag
    this.running = false;
    // Threshold
    this.threshold = 'none';
    // Max time remaining until next purchase
    this.nextMaxTime = 0;
    // Next item to buy
    this.nextItem = null;

    /**
     * Returns a blacklist of upgrades that should not be auto-bought
     * @return {Array} Array of upgrade IDs
     */
    this.blackList = function() {

        var blacklist = [];

        blacklist.push.apply(blacklist, this.seasonal);
        blacklist.push.apply(blacklist, this.elderCovenant);

        if(CM.config.settings.noPocalypse.current === 'on') {
            blacklist.push.apply(blacklist, this.grandmapocalypse);
        }

        return blacklist;

    };

    /**
     * Returns a whitelist of upgrades that should be bought when possible
     * @return {Array} Array of upgrade IDs
     */
    this.whiteList = function() {

        var whitelist = [];

        whitelist.push.apply(whitelist, this.gcUpgrades);
        whitelist.push.apply(whitelist, this.alwaysBuy);

        return whitelist;

    };

    /**
     * Returns an array with the cheapest item and its price from a supplied list
     * @param  {Integer} whiteList Upgrade ID
     * @return {Array}
     */
    this.getCheapest = function(items) {

        var cheapestPrice = Number.POSITIVE_INFINITY,
            cheapestItem,
            item,
            price;

        items.forEach(function(id) {
            item = Game.UpgradesById[id];
            if(item.isInStore()) {
                price = Game.UpgradesById[id].getPrice();
                if(price < cheapestPrice) {
                    cheapestPrice = price;
                    cheapestItem = item;
                }
            }
        });

        return cheapestItem ? [cheapestItem, cheapestPrice] : false;

    };

    /**
     * Sets threshold according to GC upgrades purchased
     */
    this.setThreshold = function() {

        var maintainBank = CM.config.settings.maintainBank.current === 'on';

        if (maintainBank) {
            this.threshold = Game.Has('Get lucky') && Game.elderWrath < 3 ? 'frenzy' : 'lucky';
        } else {
            this.threshold = 'none';
        }

    };

    /**
     * Returns array with best building object and its BCI
     * @return {Array} [Object, bci]
     */
    this.getBestBuilding = function(budget) {

        var buildings         = CME.informations.bci,
            bestBCI           = Number.POSITIVE_INFINITY,
            bestBuilding      = false,
            bestAvailBCI      = Number.POSITIVE_INFINITY,
            bestAvailBuilding = false,
            bestBuildingTTB   = 0,
            ttb,              // Time to buy
            object,
            i;
        
        budget = budget || Game.cookies;
        for(i = 0; i < buildings.length; i++) {
            object = Game.ObjectsById[i];
            if (object.getPrice() > Game.cookiesEarned) continue;
            // How long until we can afford it?
            ttb = object.getTimeLeft(budget);
            if(buildings[i] < bestBCI) {
                // Best building overall
                bestBCI = buildings[i];
                bestBuilding = object;
                bestBuildingTTB = ttb;
            }
            if (ttb == 0 && buildings[i] < bestAvailBCI) {
                // Best building we can buy immediately
                bestAvailBuilding = object;
                bestAvailBCI = buildings[i];
            }
        }
        // If a lesser building will pay for itself before we'd be able
        // to buy the best one, buy the lesser one now
        if (bestAvailBCI < bestBuildingTTB) {
            bestBuilding = bestAvailBuilding;
            bestBCI = bestAvailBCI;
            bestBuildingTTB = 0;
        }

        return bestBuilding ? [bestBuilding, bestBCI, bestBuildingTTB, bestBuilding.getWorth()] : false;

    };

    /**
     * Returns array with best upgrade and its BCI
     * @return {Array} [Upgrade, bci]
     */
    this.getBestUpgrade = function(budget) {

        var upgrades         = [],
            blackList        = this.blackList(),
            whiteList        = this.whiteList(),
            cheapestW        = this.getCheapest(whiteList),
            bestBCI          = Number.POSITIVE_INFINITY,
            bestUpgrade      = false,
            bestAvailBCI     = Number.POSITIVE_INFINITY,
            bestAvailUpgrade = false,
            bestUpgradeTTB   = 0,
            ttb,             // Time to buy
            itemBCI,
            item,
            i;
        
        budget = budget || Game.cookies;
        for(i in Game.Upgrades) {
            item = Game.Upgrades[i];
            if(blackList.indexOf(item.id) === -1) {
                if(item.isInStore()) {
                    // How long until we can afford it?
                    ttb = item.getTimeLeft(budget);
                    itemBCI = item.getBaseCostPerIncome();
                    if(itemBCI < bestBCI) {
                        // Best upgrade overall
                        bestUpgrade    = item;
                        bestBCI        = itemBCI;
                        bestUpgradeTTB = ttb;
                    }
                    if (ttb == 0 && itemBCI < bestAvailBCI) {
                        // Best upgrade we can buy immediately
                        bestAvailUpgrade = item;
                        bestAvailBCI     = itemBCI;
                    }
                }
            }
        }
        // If a lesser upgrade will pay for itself before we'd be able
        // to buy the best one, buy the lesser one now
        if (bestAvailBCI < bestUpgradeTTB) {
            bestUpgrade = bestAvailUpgrade;
            bestBCI = bestAvailBCI;
            bestUpgradeTTB = 0;
        }

        // If whitelist upgrades are available and cheapest is cheaper than the calculated one, choose it
        if(cheapestW && (!bestUpgrade || cheapestW[1] < bestUpgrade.getPrice())) {
            return [cheapestW[0], 0, cheapestW[0].getTimeLeft(budget), Number.POSITIVE_INFINITY];
        }

        // Else just return the best one calculated
        return bestUpgrade !== false ? [bestUpgrade, bestBCI, bestUpgradeTTB, bestUpgrade.getWorth()] : false;

    };

    /**
     * Returns the item with best BCI
     * @return {Array} [item, bci]
     */
    this.getBestItem = function() {

        var bestBuilding = this.getBestBuilding(),
            bestUpgrade  = this.getBestUpgrade();

        if(bestBuilding && bestUpgrade) {
            if (bestUpgrade[1] < bestBuilding[1]) {
                // Upgrade is better...
                if ((bestBuilding[1] + bestBuilding[2]) < bestUpgrade[2]) {
                    // ...but building will pay for itself before we can buy the upgrade.
                    return bestBuilding;
                } else {
                    // ...so buy it.
                    return bestUpgrade;
                }
            } else {
                // Building is better...
                if ((bestUpgrade[1] + bestUpgrade[2]) < bestBuilding[2]) {
                    // ...but upgrade will pay for itself before we can buy the building.
                    return bestUpgrade;
                } else {
                    // ...so buy it.
                    return bestBuilding;
                }
            }
        } else {
            return bestBuilding || bestUpgrade || false;
        }

    };

    /**
     * Returns the maximum budget for a purchase
     * @param  {Integer} bank      Current bank
     * @param  {String}  threshold none | lucky | frenzy
     * @return {Integer}
     */
    this.budget = function(bank, threshold) {

        var amount = 0;

        if(threshold === 'frenzy') {
            amount = CME.getLuckyTreshold('frenzy');
        } else if(threshold === 'lucky') {
            amount = CME.getLuckyTreshold(false);
        } else if(threshold === 'clot') {
            amount = CME.getLuckyTreshold('clot');
        }

        return bank - amount;

    };

    /**
     * Invades a small eastern European country and plants
     * hundreds of turnip fields
     *
     * @return {[type]} [description]
     */
    this.buyBest = function() {

        // Set the correct threshold
        this.setThreshold();

        var self         = this,
            budget       = this.budget(Game.cookies, this.threshold),
            canBuy       = false,
            bestItem,
            bci,
            timeLeft,
            worth,
            price,
            deficitStats,
            width,
            time;
        var bestItemInfo = this.getBestItem();

        if(!bestItemInfo || bestItemInfo.length < 3) {
            $('#CMAutoBuyNextPurchaseValue').text('Nothing to buy :(');
            $('#CMAutoBuyTimeLeft .cmTimerContainer').fadeOut(300);
            time = 1000;
        } else {
            bestItem = bestItemInfo[0];
            bci      = bestItemInfo[1];
            timeLeft = bestItem.getTimeLeft(budget);
            worth    = CM.normalize(bestItemInfo[3]);
            price    = bestItem.getPrice();
            if (CM.config.settings.maintainBank.current === 'smart') {
                canBuy = price <= Game.cookies;
                // Check the value of banked cookies
                deficitStats = CME.getBankDeficitStats(price);
                for (var threshold in deficitStats) {
                    if (deficitStats.hasOwnProperty(threshold)) {
                        if (deficitStats[threshold] > worth) {
                            // Cookies in the bank are worth more than the item; don't buy
                            canBuy = false;
                            var timeToThreshold = bestItem.getTimeLeft(this.budget(Game.cookies, threshold));
                            if (timeToThreshold > timeLeft) {
                                timeLeft = timeToThreshold;
                            }
                        }
                    }
                }
            } else {
                canBuy = price <= budget;
            }
            if(canBuy) {
                this.nextMaxTime = 0;
                bestItem.buy(true);
                time = 50;
                // Quick and dirty upkeep of the BCI data to prevent buying too many
                Game.ObjectsById.forEach(function (building, key) {
                    if (building == bestItem) {
                        CME.informations.bci[key] *= Game.priceIncrease;
                    }
                });
            } else {
                if (this.nextMaxTime === 0 
                        || this.nextItem != bestItem 
                        || timeLeft > this.nextMaxTime) {
                    this.nextMaxTime = timeLeft;
                    this.nextItem = bestItem;
                }
                width = Math.min(timeLeft / this.nextMaxTime * 100, 100);
                time = 200;
            }
            // Update the information bar
            $('#CMAutoBuyNextPurchaseValue').text(bestItem.name);
            $('#CMAutoBuyTimeLeft .cmTimer div').css('width', width + '%');
            $('#CMAutoBuyTimeLeft .cmTimerCounter').text(timeLeft);
            if($('#CMAutoBuyTimeLeft .cmTimerContainer').is(':hidden')) {
                $('#CMAutoBuyTimeLeft .cmTimerContainer').fadeIn(300);
            }
        }

        if (this.running) {
            this.automate = setTimeout(function() {
                self.buyBest();
            }, time);
        }

    };

    this.init = function() {
        if (!this.running) {
            this.running = true;
            this.buyBest();
        }
    };

    this.stop = function() {
        this.running = false;
        clearTimeout(this.automate);
    };

    return this;

};

/**
 * Class to track your true CpS over time
 */
CM.TrueCps = function(interval, maxTime) {

    this.ready    = false;              // Set to true when at least one data point has been taken
    this.last     = Game.cookiesEarned; // Total clicks last measured
    this.tracked  = [];                 // Cookies made at each interval
    this.interval = interval || 60;     // Interval in seconds between measurements
    this.maxTime  = maxTime  || 3600;   // Maximum time frame to calculate in seconds
    this.timer    = null;               // Object to attach the tracking timer to
    this.cps      = 0;                  // Last average that can be referenced from elsewhere

    /**
     * Returns the average CpS measured in the maximum time period
     *
     * @param  {Array}   t Tracked CpS values per time interval as tracked
     * @return {Integer}   Average CpS
     */
    this.getAverage = function(t) {

        var tracked = t || this.tracked,
            len     = tracked.length,
            sum     = 0,
            avg,
            i;

        // Return 0 if we have no tracked data
        if(len === 0) {
            return 0;
        }

        // Add up values
        for(i = 0; i < len; i++) {
            sum += tracked[i];
        }

        // Get the mean average
        avg = sum / len / this.interval;
        // Cache the result
        this.cps = avg;

        return avg;

    };

    /**
     * Makes a record of cookies made in last interval
     *
     * @param  {Integer} last Total cookies last measured
     * @param  {Integer} now  Total cookies as of now
     * @return {Object}       Returns this instance
     */
    this.takeRecord = function(last, now) {
        var earned    = now - last,
            maxLength = Math.round(this.maxTime / this.interval);
        
        if (earned < 0) {
            // Must have reset
            this.tracked = [];
            this.last = now;
            this.getAverage();
            return;
        }

        // If array is full, remove first element
        while (this.tracked.length >= maxLength) {
            this.tracked.shift();
        }
        // Append latest record
        this.tracked.push(earned);

        // Update last with new value
        this.last = now;

        // Update the average
        this.getAverage();

        // Set ready flag as we now have data
        this.ready = true;

        return this;

    };

    /**
     * Returns the current tracked time
     * @return {Integer} Tracked time in seconds
     */
    this.timeTracked = function() {
        return this.tracked.length * this.interval;
    };

    /**
     * Starts tracking
     * @return {Object} Returns this instance
     */
    this.start = function() {

        var self = this;

        this.stop();
        this.last    = Game.cookiesEarned;
        this.tracked = [];
        this.timer   = setInterval(function() {
            self.takeRecord(self.last, Game.cookiesEarned);
        }, self.interval * 1000);

        return this;

    };

    /**
     * Stops tracking
     * @return {Object} Returns this instance
     */
    this.stop = function() {

        clearInterval(this.timer);

        return this;

    };
    
    this.setWindow = function(newMaxTime) {
        this.maxTime = newMaxTime;
    };
    
    return this;

};

/**
 * Class to track your cookie clicks over time
 */
CM.ClickTracker = function(interval, maxTime) {

    this.ready    = false;              // Set to true when at least one data point has been taken
    this.last     = Game.cookieClicks;  // Total clicks last measured
    this.tracked  = [];                 // Cookies made at each interval
    this.interval = interval || 60;     // Interval in seconds between measurements
    this.maxTime  = maxTime  || 3600;   // Maximum time frame to calculate in seconds
    this.timer    = null;               // Object to attach the tracking timer to
    this.clicksPs = 0;                  // Last average that can be referenced from elsewhere

    /**
     * Returns the average clicks measured in the maximum time period
     *
     * @param  {Array}   t Tracked clicks per time interval as tracked
     * @return {Integer}   Average clicks
     */
    this.getAverage = function(t) {

        var tracked = t || this.tracked,
            len     = tracked.length,
            sum     = 0,
            avg,
            i;

        // Return 0 if we have no tracked data
        if(len === 0) {
            return 0;
        }

        // Add up values
        for(i = 0; i < len; i++) {
            sum += tracked[i];
        }

        // Get the mean average
        avg = sum / len / this.interval;
        // Cache the result
        this.clicksPs = avg;

        return avg;

    };

    /**
     * Makes a record of cookies clicked in last interval
     *
     * @param  {Integer} last Total clicks last measured
     * @param  {Integer} now  Total clicks as of now
     * @return {Object}       Returns this instance
     */
    this.takeRecord = function(last, now) {
        var earned    = now - last,
            maxLength = Math.round(this.maxTime / this.interval);

        if (earned < 0) {
            // Must have reset
            this.tracked = [];
            this.last = now;
            return;
        }

        // If array is full, remove first element
        while (this.tracked.length >= maxLength) {
            this.tracked.shift();
        }
        // Append latest record
        this.tracked.push(earned);

        // Update last with new value
        this.last = now;

        // Update the average
        this.getAverage();

        // Set ready flag as we now have data
        this.ready = true;

        return this;

    };

    /**
     * Returns the current tracked time
     * @return {Integer} Tracked time in seconds
     */
    this.timeTracked = function() {
        return this.tracked.length * this.interval;
    };

    /**
     * Starts tracking
     * @return {Object} Returns this instance
     */
    this.start = function() {

        var self = this;

        this.stop();
        this.last    = Game.cookieClicks;
        this.tracked = [];
        this.timer   = setInterval(function() {
            self.takeRecord(self.last, Game.cookieClicks);
        }, self.interval * 1000);

        return this;

    };

    /**
     * Stops tracking
     * @return {Object} Returns this instance
     */
    this.stop = function() {

        clearInterval(this.timer);

        return this;

    };

    this.setWindow = function(newMaxTime) {
        this.maxTime = newMaxTime;
    };
    
    return this;

};

/* ================================================
    NON-RETURNING METHODS

    These methods mostly update the DOM and don't
    actually return anything.
    Separating them out helps keep the init
    method nice and tidy :)
================================================ */

/**
 * Main game loop for most continuously updating methods
 */
CM.mainLoop = function() {

    var settings = this.config.settings;

    // Update timers
    this.updateTimers();

    // Update GC Display timer
    if(settings.showGCCountdown.current === 'on') {
        // Golden cookie display timer
        this.updateDisplayGCTimer();
    }

    // Show visual alerts if active
    if(settings.visualAlerts.current !== 'off') {
        this.showVisualAlerts();
    }

    // Handle auto-clickers
    this.manageAutoClicker();

    if(this.config.cmStatsPanel.is(':visible')) {
        this.updateStats();
    }

    // Auto-Pledge
    if(settings.autoPledge.current === 'on') {
        this.autoBuyPledge();
    }

    // Auto-Season
    if(settings.autoSeason.current !== 'off') {
        this.autoBuySeason();
    }

    // Click santa if it exists and we haven't reached max level
    if(settings.clickSanta.current === 'on' && Game.Has('A festive hat') && Game.santaLevel < 14) {
        this.clickSanta();
    }

    // Update building efficiency info
    CME.updateBuildingsInformations();
    this.updateTooltips();

};

/**
 * Build and attach the settings panel to the DOM
 */
CM.attachSettingsPanel = function() {

    var self     = this,
        options  = [],
        control  = [],
        current  = '',
        selected = '',
        html     = '',
        htmlTabs = '',
        groups   = this.config.settingsGroups,
        settings = this.config.settings,
        group,
        setting,
        thisSetting,
        thisOption,
        option,

        $ccSectionMiddle  = this.config.ccSectionMiddle,
        $ccComments       = this.config.ccComments,
        $cmSettingsPanel  = $('<div />').attr('id', 'CMSettingsPanel'),
        $cmSettingsButton = $('<div />').attr({'id': 'CMSettingsPanelButton', 'class': 'button'}).text('Settings'),
        $cmSettingsTitle  = $('<h3 />').attr('class', 'title').html('CookieMaster Settings'),
        $cmSettingsTabs   = $('<ul />').attr({'id': 'CMSettingsTabs', 'class': 'cf cmFont'}),
        $cmSettingsTables = $('<div />').attr('id', 'CMSettingsTables'),
        $cmSettingsSave   = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button', 'class': 'cmFont'}).text('Save Settings');


    // Loop over each settings group
    for(group in groups) {

        // Populate the tabs
        htmlTabs += '<li><a data-id="CMSettings-' + group + '">' + groups[group].title + '</a></li>';

        // Create a table for each group
        html += '<div id="CMSettings-' + group + '" class="cmTableGroup">';
        html +=     '<table class="cmTable">';

        // Show group description
        if(groups[group].desc) {

            html +=     '<tr class="cmDesc">';
            html +=        '<td colspan="2"><p class="cmNotice">' + groups[group].desc + '</p></td>';
            html +=     '</tr>';

        }

        // Then loop over each setting
        for(setting in settings) {

            thisSetting = settings[setting];

            // Build the setting if it's part of the group we are currently in
            if(thisSetting.group === group) {

                // Reset these for each loop
                options = '';
                option  = {};
                current = thisSetting.current;

                if(thisSetting.type === 'select') {

                    /**
                     * Build a select box
                     */

                    for(option in thisSetting.options) {

                        thisOption = thisSetting.options[option];

                        selected = current === thisOption.value.toString() ? ' selected="selected"' : '';
                        options += '<option value="' + thisOption.value + '"' + selected + '>' + thisOption.label + '</option>';

                    }

                    control =  '<select name="' + setting + '">';
                    control += options;
                    control += '</select>';

                } else if(thisSetting.type === 'checkbox') {

                    /**
                     * Build a checkbox
                     */

                    selected = (current === 'on') ? ' checked="checked"' : '';
                    control  = '<input type="checkbox" name="' + setting + '"' + selected + ' />';

                } else if(thisSetting.type === 'range') {

                    /**
                     * Build a range slider
                     */

                    control  = '<span class="currentValue">' + thisSetting.current + '</span>';
                    control += '<input ' +
                                    'type="range" ' +
                                    'name="'        + setting                  + '" ' +
                                    'value="'       + thisSetting.current      + '" ' +
                                    'min="'         + thisSetting.options.min  + '" ' +
                                    'max="'         + thisSetting.options.max  + '" ' +
                                    'step="'        + thisSetting.options.step + '" ' +
                                '/>';

                } else if(thisSetting.type === 'text') {

                    /**
                     * Build a text field
                     */

                    control = '<input ' +
                                    'type="text" ' +
                                    'name="'       + setting                 + '" ' +
                                    'value="'      + thisSetting.current     + '" ' +
                                    'placeholder="'+ thisSetting.placeholder + '" ' +
                                '/>';

                }

                // Build the table row
                html += '<tr class="setting setting-' + setting + '">';
                html +=     '<td class="cmLabel">';
                html +=         '<label for="CMSetting-' + setting + '">' + thisSetting.label + '</label>';
                html +=         '<small>' + thisSetting.desc + '</small>';
                html +=          '</td>';
                html +=     '<td class="cmValue">' + control + '</td>';
                html += '</tr>';

            }

        }

        html +=     '</table>';
        html += '</div>';

    }

    // Glue it together
    $cmSettingsTabs.append(htmlTabs);
    $cmSettingsTables.append(html);
    $cmSettingsPanel.append(
        $cmSettingsSave,
        $cmSettingsTitle,
        $cmSettingsTabs,
        $cmSettingsTables
    );

    // Attach to DOM
    $ccSectionMiddle.append($cmSettingsPanel);
    $ccComments.prepend($cmSettingsButton);

    // Cache the selector
    this.config.cmSettingsPanel = $cmSettingsPanel;

    // Behaviours
    $('#CMSettings-ui').addClass('show'); // Show the UI tab by default
    $('#CMSettingsTabs li:first-child a').addClass('active');
    $('#CMSettingsTabs a').click(function() {
        var id = $(this).data('id');
        $('.cmTableGroup').removeClass('show');
        $('#' + id).addClass('show');
        $('#CMSettingsTabs a').removeClass('active');
        $(this).addClass('active');
    });

};

/**
 * Build and attach the settings panel to the DOM
 */
CM.attachStatsPanel = function() {

    var $ccSectionMiddle   = this.config.ccSectionMiddle,
        $ccComments        = this.config.ccComments,
        $cmStatsPanel      = $('<div />').attr('id', 'CMStatsPanel'),
        $cmStatsTitle      = $('<h3 />').attr('class', 'title').html('CookieMaster Statistics<span class="cmTitleSub">v.' + this.config.version + '</span>'),
        $cmStatsButton     = $('<div />').attr({'id': 'CMStatsPanelButton', 'class': 'button'}).text('Stats +'),
        $cmTable           = {},
        $cmUpgTitle        = $('<h3 />').attr('class', 'cmFont cmSubTitle').html('Missing Upgrades<span class="cmFloatRight cmShowAsLink" id="CMToggleUpg">Show/Hide</span>'),
        $cmAchTitle        = $('<h3 />').attr('class', 'cmFont cmSubTitle').html('Missing Achievements<span class="cmFloatRight cmShowAsLink" id="CMToggleAch">Show/Hide</span>'),
        $cmShaTitle        = $('<h3 />').attr('class', 'cmFont cmSubTitle').html('Missing Shadow Achievements<span class="cmFloatRight cmShowAsLink" id="CMToggleSha">Show/Hide</span>'),
        $cmUpgCont         = $('<div />').attr('id', 'CMUpgCont'),
        $cmAchCont         = $('<div />').attr('id', 'CMAchCont'),
        $cmShaCont         = $('<div />').attr('id', 'CMShaCont'),
        $cmStatsChartCont  = $('<div />').attr('id', 'CMChartCont'),
        $cmStatsChartTitle = $('<h3 />').attr('class', 'title').html('Stat Logging'),
        $cmStatsChartIntro = $('<p />').html('This feature currently allows you to log and track your base and effective CpS stats over time. Stats are logged at 30 second intervals as long as logging is on, and logs are persistent though page refreshes, game resets and save imports unless cleared manually.<br />Please note that this feature is still in beta, and may behave unexpectedly!<br />Download as CSV is currently only supported in recent versions of Chrome and Firefox.'),
        $cmStatsChart      = $('<div />').attr('id', 'CMChart'),
        $cmStatsChartBtnY  = $('<button />').attr({'id': 'CMChartY', 'type': 'button', 'class': 'cmFont'}).text('Start logging'),
        $cmStatsChartBtnN  = $('<button />').attr({'id': 'CMChartN', 'type': 'button', 'class': 'cmFont'}).text('Stop logging'),
        $cmStatsChartBtnC  = $('<button />').attr({'id': 'CMChartC', 'type': 'button', 'class': 'cmFont'}).text('Clear log'),
        $cmStatsChartBtnD  = $('<button />').attr({'id': 'CMChartD', 'type': 'button', 'class': 'cmFont'}).text('Download CSV'),
        hcSelect           = '<input id="CMXHC" value="" />',
        tableHTML          = '';

    tableHTML += '<table class="cmTable">';
    tableHTML +=     '<tr class="cmHeader">';
    tableHTML +=         '<th colspan="2" class="cmFont"><span class="icon cmIcon cmIconLucky"></span>Golden Cookies</th>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Lucky bank required:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsLuckyRequired"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Lucky + Frenzy bank required:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsLuckyFrenzyRequired"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Lucky reward:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsLuckyReward"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Lucky + Frenzy reward:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsLuckyFrenzyReward"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Reindeer Reward:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsReindeerReward"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Maximum Cookie Chain reward:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsMaxChainReward"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Bank required for next Chain tier:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsBankRequiredNextChainTier"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>CpS required for next Chain tier:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsCPSRequiredNextChainTier"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Last Golden Cookie effect:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsLastGC"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Average clicks per second:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsAvgClicksPerSecond"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Golden Cookies Missed:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsMissedGC"></td>';
    tableHTML +=     '</tr>';
    tableHTML += '</table>';

    tableHTML += '<table class="cmTable">';
    tableHTML +=     '<tr class="cmHeader">';
    tableHTML +=         '<th colspan="2" class="cmFont"><span class="icon cmIcon cmIconHC"></span>Prestige</th>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Current Heavenly Chips:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsHCCurrent"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Heavenly Chips after reset:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsHCMax"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Base CpS after reset*:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsCPSReset"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Cookies to next HC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsHCCookiesToNext"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Time to next HC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsHCTimeToNext"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Cookies to ' + hcSelect + ' Heavenly Chips:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsHCCookiesToX"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td colspan="2"><small>* Based on current purchases. Assumes all Heavenly Upgrades bought.</small></td>';
    tableHTML +=     '</tr>';
    tableHTML += '</table>';

    tableHTML += '<table class="cmTable">';
    tableHTML +=     '<tr class="cmHeader">';
    tableHTML +=         '<th colspan="2" class="cmFont"><span class="icon cmIcon cmIconWrinkler"></span>Wrinklers</th>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Cookies sucked by Wrinklers:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsWrinklersSucked"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Reward for popping Wrinklers:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsWrinklersReward"></td>';
    tableHTML +=     '</tr>';
    tableHTML += '</table>';

    tableHTML += '<table class="cmTable">';
    tableHTML +=     '<tr class="cmHeader">';
    tableHTML +=         '<th colspan="2" class="cmFont"><span class="icon cmIcon cmIconMisc"></span>Miscellaneous Stats</th>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Base CpS:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsBaseCPS"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Effective CpS:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsEffectiveCPS"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Frenzy CpS:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsFrenzyCPS"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Elder Frenzy CpS:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsElderFrenzyCPS"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Base CpC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsBaseCPC"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Frenzy CpC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsFrenzyCPC"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Click Frenzy CpC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsClickFrenzyCPC"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td>Frenzy + Click Frenzy CpC:</td>';
    tableHTML +=         '<td class="cmValue" id="CMStatsFrenzyClickFrenzyCPC"></td>';
    tableHTML +=     '</tr>';
    tableHTML +=     '<tr>';
    tableHTML +=         '<td colspan="2"><small>CpS = Cookies per Second, CpC = Cookies per Click</small></td>';
    tableHTML +=     '</tr>';
    tableHTML += '</table>';

    $cmTable = $(tableHTML);

    $cmStatsChartCont.append(
        $cmStatsChartTitle,
        $cmStatsChartIntro,
        $cmStatsChartBtnY,
        $cmStatsChartBtnN,
        $cmStatsChartBtnC,
        $cmStatsChartBtnD,
        $cmStatsChart
    );

    $cmStatsPanel.append(
        $cmStatsTitle,
        $cmTable,
        $cmUpgTitle,
        $cmUpgCont,
        $cmAchTitle,
        $cmAchCont,
        $cmShaTitle,
        $cmShaCont,
        $cmStatsChartCont
    );

    // Attach to DOM
    $ccSectionMiddle.append($cmStatsPanel);
    $ccComments.prepend($cmStatsButton);

    // Cache selectors
    this.config.cmStatsPanel = $cmStatsPanel;
    this.config.cmStatsTable = $cmTable;

};

/**
 * Attach a key to show color coding meanings
 */
CM.attachEfficiencyKey = function() {

    var $cmEfficiencyKey = $('<table />').attr({'id': 'CMEfficiencyTable', 'class': 'cmTable'}),
        tableHTML;

    // Only attach it if it's not already in DOM
    if($('#CMEfficiencyTable').length === 0) {

        tableHTML +=     '<tr class="cmHeader">';
        tableHTML +=         '<th colspan="2" class="cmFont">Efficiency Key:</th>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td colspan="2">BCI = Base Cost per Income (Item cost divided by CpS increase)</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-cyan"></span></td>';
        tableHTML +=         '<td class="cmValue">(Upgrades) This item has a better BCI than any building</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-purple"></span></td>';
        tableHTML +=         '<td class="cmValue">(Upgrades) This item has a worse BCI than any building</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-greyLight"></span></td>';
        tableHTML +=         '<td class="cmValue">(Upgrades) This item has not been calculated and/or cannot be calculated due to no definitive worth.</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-green"></span></td>';
        tableHTML +=         '<td class="cmValue">This item has the best BCI</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-yellow"></span></td>';
        tableHTML +=         '<td class="cmValue">This item is not the best, but it is closer to best than it is to worst</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-orange"></span></td>';
        tableHTML +=         '<td class="cmValue">This item is not the worst, but it is closer to worst than it is to best</td>';
        tableHTML +=     '</tr>';
        tableHTML +=     '<tr>';
        tableHTML +=         '<td><span class="cmSample background-red"></span></td>';
        tableHTML +=         '<td class="cmValue">This item has the worst BCI</td>';
        tableHTML +=     '</tr>';

        $cmEfficiencyKey.html(tableHTML);
        $('#store').after($cmEfficiencyKey);

    }

};

/**
 * Remove Efficiency Key panel
 */
CM.removeEfficiencyKey = function() {

    // Only remove it if it exists in DOM
    if($('#CMEfficiencyTable').length) {

        $('#CMEfficiencyTable').remove();

    }

};

CM.attachAutoBuyPanel = function() {

    var $cmAutoBuyPanel      = $('<div />').attr({'id': 'CMAutoBuyPanel', 'class': 'cmFont'}),
        $cmNextPurchase      = $('<div />').attr({'id': 'CMAutoBuyNextPurchase', 'class': 'cf'}),
        $cmNextPurchaseLabel = $('<div />').attr('id', 'CMAutoBuyNextPurchaseLabel').text('Next purchase:'),
        $cmNextPurchaseValue = $('<div />').attr('id', 'CMAutoBuyNextPurchaseValue'),
        $cmTimeLeft          = $('<div />').attr('id', 'CMAutoBuyTimeLeft'),
        $cmTimerBar          = $('<div class="cmTimerContainer cf"><div class="cmTimer"><div></div></div><div class="cmTimerCounter"></div></div>');

    $cmNextPurchase.append($cmNextPurchaseLabel, $cmNextPurchaseValue);
    $cmTimeLeft.append($cmTimerBar);
    $cmAutoBuyPanel.append($cmNextPurchase, $cmTimeLeft);
    $('#store').prepend($cmAutoBuyPanel);

};

/**
 * Populates the stats panel with the latest game stats
 */
// TO DO: Possibly cache these selectors for performance :/
CM.updateStats = function() {

    var precision            = this.config.settings.precision.current,
        hcStats              = this.getHCStats(),
        cookiesToXHC         = Number($('#CMXHC').val()) || Number(hcStats[2] + 1),
        wrinklerStats        = this.getWrinklerStats(),
        lastGC               = this.toTitleCase(Game.goldenCookie.last) || '-',
        lbText               = Game.cookies >= this.luckyBank() ? '<span class="cmHighlight">' + Beautify(this.luckyBank()) + '</span>' : Beautify(this.luckyBank()),
        lbtr                 = Game.cookies < this.luckyBank() ? ' (' + this.formatTime((this.luckyBank() - Game.cookies) / this.configuredCps()) + ')' : '',
        lfbText              = Game.cookies >= this.luckyFrenzyBank() ? '<span class="cmHighlight">' + Beautify(this.luckyFrenzyBank()) + '</span>' : Beautify(this.luckyFrenzyBank()),
        lfbtr                = Game.cookies < this.luckyFrenzyBank() ? ' (' + this.formatTime((this.luckyFrenzyBank() - Game.cookies) / this.configuredCps()) + ')' : '',
        missedGC             = this.config.settings.showMissedGC.current === 'on' ? Beautify(Game.missedGoldenClicks) : 'I\'m a wimp and don\'t want to know',
        chainReward          = this.maxChainReward(),
        chainRewardString    = chainReward ? Beautify(chainReward) : 'Earn ' + Beautify(100000 - Math.round(Game.cookiesEarned)) + ' more cookies for cookie chains',
        nextChainBank        = this.requiredChainTier('bank', 'next', chainReward),
        nextChainCPS         = this.requiredChainTier('cps', 'next', chainReward),
        missingU             = this.getMissingUpgrades(),
        missingA             = this.getMissingAchievements(),
        missingS             = this.getMissingAchievements(true),
        upgHTML              = '',
        aHTML                = '',
        sHTML                = '',
        luckyReward          = this.luckyReward(),
        maxLuckyReward       = this.maxLuckyReward(),
        luckyFrenzyReward    = this.luckyFrenzyReward(),
        maxLuckyFrenzyReward = this.maxLuckyFrenzyReward(),
        resetPercentIncrease = (this.getResetCps() - this.baseCps()) / this.baseCps() * 100,
        avgClicksPerSecond   = this.clickTracker.ready ? Math.round(this.clickTracker.clicksPs * 100) / 100 : 'Gathering data...',
        luckyRewardStr,
        luckyFrenzyRewardStr,
        cmxhcr,
        nextChainBankString,
        nextChainCPSString,
        i,
        j;

    if(luckyReward >= maxLuckyReward) {
        luckyRewardStr = '<span class="cmHighlight">' + Beautify(luckyReward) + ' / ' + Beautify(maxLuckyReward) + '</span>';
    } else {
        luckyRewardStr = Beautify(luckyReward) + ' / ' + Beautify(maxLuckyReward);
    }

    if(luckyFrenzyReward >= maxLuckyFrenzyReward) {
        luckyFrenzyRewardStr = '<span class="cmHighlight">' + Beautify(luckyFrenzyReward) + ' / ' + Beautify(maxLuckyFrenzyReward) + '</span>';
    } else {
        luckyFrenzyRewardStr = Beautify(luckyFrenzyReward) + ' / ' + Beautify(maxLuckyFrenzyReward);
    }

    if(nextChainBank !== false) {
        if(Game.cookies > nextChainBank) {
            nextChainBankString = '<span class="cmHighlight">' + Beautify(nextChainBank) + '</span>';
        } else {

            nextChainBankString = Beautify(nextChainBank) + ' (' + CM.formatTime((nextChainBank - Game.cookies) / Game.cookiesPs, true) + ')';
        }
    }

    if(nextChainCPS !== false) {
        if(Game.cookiesPs > nextChainCPS) {
            nextChainCPSString = '<span class="cmHighlight">' + Beautify(nextChainCPS, 1) + '</span>';
        } else {
            nextChainCPSString = Beautify(nextChainCPS, 1);
        }
    }

    // Cookies to X HC
    if(this.heavenlyToCookiesRemaining(cookiesToXHC) === 0) {
        cmxhcr = '<span class="cmHighlight">Done! (total: ' + Beautify(this.heavenlyToCookies(cookiesToXHC)) + ')</span>';
    } else {
        cmxhcr = Beautify(this.heavenlyToCookiesRemaining(cookiesToXHC)) +
            ' (' + this.formatTime(Math.round(this.heavenlyToCookiesRemaining(cookiesToXHC) / this.configuredCps()), true) + ')';
    }

    // Golden Cookie stats
    $('#CMStatsLuckyRequired').html(lbText + lbtr);
    $('#CMStatsLuckyFrenzyRequired').html(lfbText + lfbtr);
    $('#CMStatsLuckyReward').html(luckyRewardStr);
    $('#CMStatsLuckyFrenzyReward').html(luckyFrenzyRewardStr);
    $('#CMStatsReindeerReward').html(Beautify(this.getReindeerReward()));
    $('#CMStatsMaxChainReward').html(chainRewardString);
    $('#CMStatsBankRequiredNextChainTier').html(nextChainBankString || '-');
    $('#CMStatsCPSRequiredNextChainTier').html(nextChainCPSString || '-');
    $('#CMStatsLastGC').html(lastGC);
    $('#CMStatsAvgClicksPerSecond').html(avgClicksPerSecond);
    $('#CMStatsMissedGC').html(missedGC);

    // Heavenly Chip stats
    $('#CMStatsHCCurrent').html(Beautify(hcStats[0]) + ' (' + Beautify(hcStats[1]) + '%)');
    $('#CMStatsHCMax').html(Beautify(hcStats[2]) + ' (' + Beautify(hcStats[3]) + '%)');
    $('#CMStatsCPSReset').html(Beautify(this.getResetCps()) + ' (' + Beautify(resetPercentIncrease, precision) + '% increase)');
    $('#CMStatsHCCookiesToNext').html(Beautify(hcStats[4]) + ' / ' + Beautify(hcStats[5]));
    $('#CMStatsHCTimeToNext').html(hcStats[6]);
    $('#CMStatsHCCookiesToX').html(cmxhcr);

    // Wrinkler stats
    $('#CMStatsWrinklersSucked').html(Beautify(wrinklerStats[0]));
    $('#CMStatsWrinklersReward').html(Beautify(wrinklerStats[1]));

    // Misc. stats
    $('#CMStatsBaseCPS').html(Beautify(this.baseCps(), 1));
    $('#CMStatsEffectiveCPS').html(Beautify(this.effectiveCps(), 1));
    $('#CMStatsFrenzyCPS').html(Beautify(this.baseCps() * 7, 1));
    $('#CMStatsElderFrenzyCPS').html(Beautify(this.baseCps() * 666, 1));
    $('#CMStatsBaseCPC').html(Beautify(this.baseCpc()));
    $('#CMStatsFrenzyCPC').html(Beautify(this.baseCpc() * 7));
    $('#CMStatsClickFrenzyCPC').html(Beautify(this.baseCpc() * 777));
    $('#CMStatsFrenzyClickFrenzyCPC').html(Beautify(this.baseCpc() * 777 * 7));

    // Missing upgrades
    upgHTML += '<table class="cmTable">';
    if(missingU.length) {
        for(i = 0; i < missingU.length; i++) {
            upgHTML += '<tr><td>' + missingU[i] + '</td><td class="cmValue">' + Game.Upgrades[missingU[i]].desc + '</td></tr>';
        }
    } else {
        upgHTML += '<tr><td colspan="2">All upgrades purchased. Well done!</td></tr>';
    }
    upgHTML += '</table>';

    // Missing achievements
    aHTML += '<table class="cmTable">';
    if(missingA.length) {
        for(i = 0; i < missingA.length; i++) {
            aHTML += '<tr><td>' + missingA[i] + '</td><td class="cmValue">' + Game.Achievements[missingA[i]].desc + '</td></tr>';
        }
    } else {
        aHTML += '<tr><td colspan="2">All achievements unlocked. Go you!</td></tr>';
    }
    aHTML += '</table>';

    // Missing shadow achievements
    sHTML += '<table class="cmTable">';
    if(missingS.length) {
        for(j = 0; j < missingS.length; j++) {
            sHTML += '<tr><td>' + missingS[j] + '</td><td class="cmValue">' + Game.Achievements[missingS[j]].desc + '</td></tr>';
        }
    } else {
        sHTML += '<tr><td colspan="2">All shadow achievements unlocked. Go outside!</td></tr>';
    }
    sHTML += '</table>';

    // Insert into tables
    $('#CMUpgCont').html(upgHTML);
    $('#CMAchCont').html(aHTML);
    $('#CMShaCont').html(sHTML);

};

/**
 * Attach the timer panel for showing game event timers
 */
CM.attachTimerPanel = function() {

    var $cmTimerPanel = $('<div />').attr({'id': 'CMTimerPanel', 'class': 'cmFont'}),
        $sectionLeft  = this.config.ccSectionLeft,
        timerRes      = this.config.cmTimerResolution;

    // Only attach it if it's not already in DOM
    if($('#CMTimerPanel').length === 0) {

        $sectionLeft.append($cmTimerPanel);

        // Save selector to config for later use
        this.config.cmTimerPanel = $cmTimerPanel;

    }

};

/**
 * Populate the timer panel with timers
 */
CM.populateTimerPanel = function() {

    var activeTimers    = {},
        settings        = this.config.settings,
        timerSettings   = this.config.cmTimerSettings,
        key,
        timer;

    // Empty the timer panel
    this.config.cmTimerPanel.empty();

    // Destroy all timers
    this.timers = {};

    // Get on/off status of each timer
    activeTimers.gc          = settings.showGCTimer.current;
    activeTimers.sp          = settings.showSPTimer.current;
    activeTimers.frenzy      = settings.showFrenzyTimer.current;
    activeTimers.elderFrenzy = settings.showElderFrenzyTimer.current;
    activeTimers.clickFrenzy = settings.showClickFrenzyTimer.current;
    activeTimers.clot        = settings.showClotTimer.current;
    activeTimers.pledge      = settings.showPledgeTimer.current;
    activeTimers.season      = settings.showSeasonTimer.current;

    // Create timer for Wrinkler auto-pop feature
    if(settings.popWrinklersAtInterval.current !== 'off') {
        activeTimers.wrinklers = 'on';
    }

    // Create a timer object for each one that is "on"
    for(key in activeTimers) {
        if(activeTimers[key] === 'on') {
            CM.timers[key] = new CM.Timer(key, timerSettings[key].label);
        }
    }

    // Call create method and attach each created timer to the timer panel
    for(timer in this.timers) {
        CM.config.cmTimerPanel.append(CM.timers[timer].create());
    }

};

/**
 * Update all timers with new values
 */
CM.updateTimers = function() {

    // Expressions that evaluate to true when each timer should be displayed
    var conditions = {
            gc:          Game.goldenCookie.life === 0,
            sp:          Game.seasonPopup.life === 0 && Game.season === 'christmas',
            frenzy:      Game.frenzy > 0 && Game.frenzyPower === 7,
            clickFrenzy: Game.clickFrenzy > 0,
            elderFrenzy: Game.frenzy > 0 && Game.frenzyPower === 666,
            clot:        Game.frenzy > 0 && Game.frenzyPower === 0.5,
            pledge:      Game.pledgeT > 0,
            season:      Game.seasonT > 0 && Game.season != Game.baseSeason,
            wrinklers:   CM.popWrinklersTimeRelative > 0
        },
        key;

    // Update each timer
    for(key in conditions) {
        if(this.timers.hasOwnProperty(key)) {
            if(conditions[key]) {
                this.timers[key].update().show();
                this.hideOtherTimers(key);
            } else {
                this.timers[key].hide();
            }
        }
    }

};

/**
 * Hides other timers when current is active
 * @param  {[type]} timer current timer
 */
CM.hideOtherTimers = function(timer) {

    var settings = this.config.cmTimerSettings[timer],
        hide     = settings.hasOwnProperty('hide') ? settings.hide : null;

    if(hide && hide.length > 0) {
        hide.forEach(function(timer) {
            if(CM.timers.hasOwnProperty(timer)) {
                CM.timers[timer].hide();
            }
        });
    }

};

/**
 * Attach a countdown timer to the golden cookie
 */
CM.attachDisplayGCTimer = function() {

    var $gc      = this.config.ccGoldenCookie,
        $overlay = this.config.cmGCOverlay || $('<div />').attr({'id': 'CMGCOverlay', 'class': 'cmFont'});

    // Attach to DOM if not already there
    if($('#CMGCOverlay').length === 0) {
        this.config.ccBody.append($overlay);
        this.config.cmGCOverlay = $overlay;
    }

};

/**
 * Update the countdown timer to the golden cookie
 */
CM.updateDisplayGCTimer = function() {

    var $gc      = this.config.ccGoldenCookie,
        $overlay = this.config.cmGCOverlay,
        timeLeft = Math.round(Game.goldenCookie.life / Game.fps);

    if(Game.goldenCookie.life > 0) {

        $overlay.css({
            'top':     $gc.css('top'),
            'left':    $gc.css('left'),
            'opacity': $gc.css('opacity')
        }).text(timeLeft).show();

    } else {

        $overlay.hide();

    }

};

/**
 * Automatically click popups as soon as they spawn
 */
CM.autoClickPopups = function() {

    var setting = this.config.settings.autoClickPopups.current;

    // Auto click Golden Cookie
    if(setting === 'gc' || setting === 'all') {

        if(Game.goldenCookie.life > 0) {
            Game.goldenCookie.click();
        }

    }

    // Auto click Reindeer
    if(setting === 'sp' || setting === 'all') {

        if(Game.seasonPopup.life > 0) {
            Game.seasonPopup.click();
        }

    }

};

/**
 * Flash the screen when Golden Cookies and Reindeer spawn
 */
CM.showVisualAlerts = function() {

    var $overlay   = this.config.cmOverlay || $('<div />').attr('id', 'CMOverlay'),
        $body      = this.config.ccBody,
        $gc        = this.config.ccGoldenCookie,
        $sp        = this.config.ccSeasonPopup,
        gcNotified = this.config.cmVisualGCNotified,
        spNotified = this.config.cmVisualSPNotified,
        setting    = this.config.settings.visualAlerts.current;

    // Reattach overlay if it was removed at some point
    if($('#CMOverlay').length === 0) {
        $body.append($overlay);
        this.config.cmOverlay = $overlay;
    }

    // Flash on Golden cookie notification
    if(setting === 'gc' || setting === 'all') {

        if(Game.goldenCookie.life > 0) {

            if(!gcNotified) {
                $overlay.show().fadeOut(500);
                this.config.cmVisualGCNotified = true;
            }

        } else {

            this.config.cmVisualGCNotified = false;

        }

    }

    // Flash on Reindeer notification
    if(setting === 'sp' || setting === 'all') {

        if(Game.seasonPopup.life > 0) {

            if(!spNotified) {

                $overlay.show().fadeOut(500);
                this.config.cmVisualSPNotified = true;

            }

        } else {

            this.config.cmVisualSPNotified = false;

        }

    }

};

/**
 * Remove the visual alerts overlay div
 */
CM.removeVisualAlerts = function() {

    // Reset notification flags
    this.config.cmVisualGCNotified = false;
    this.config.cmVisualSPNotified = false;

    $('#CMOverlay').remove();

};

/**
 * Play an audio alert and flash the screen on golden cookie and reindeer spawns
 */
CM.playAudioAlerts = function() {

    var $body      = this.config.ccBody,
        $gc        = this.config.ccGoldenCookie,
        $sp        = this.config.ccSeasonPopup,
        gcAlert    = this.config.cmGCAudioObject,
        spAlert    = this.config.cmSPAudioObject,
        gcNotified = this.config.cmAudioGCNotified,
        spNotified = this.config.cmAudioSPNotified,
        setting    = this.config.settings.audioAlerts.current,
        volume     = this.config.settings.audioVolume.current;

    // Play Golden cookie notification
    if(setting === 'gc' || setting === 'all') {

        if(Game.goldenCookie.life > 0) {

            if(!gcNotified) {

                gcAlert.volume = volume;
                gcAlert.play();
                setTimeout(function() {gcAlert.load();}, 2500);
                this.config.cmAudioGCNotified = true;

                // Display error message if audio file could not be loaded
                if(!this.testAudioObject(this.config.cmGCAudioObject)) {
                    this.message('<strong>Error:</strong> Could not load Golden Cookie audio alert. If you are using a custom alert, please make sure you have specified a valid URL.', 'error');
                }


            }

        } else {

            this.config.cmAudioGCNotified = false;

        }

    }

    // Play Reindeer notification
    if(setting === 'sp' || setting === 'all') {

        if(Game.seasonPopup.life > 0) {

            if(!spNotified) {

                spAlert.volume = volume;
                spAlert.play();
                setTimeout(function() {spAlert.load();}, 2500);
                this.config.cmAudioSPNotified = true;

                // Display error message if audio file could not be loaded
                if(!this.testAudioObject(this.config.cmSPAudioObject)) {
                    this.message('<strong>Error:</strong> Could not load Reindeer audio alert. If you are using a custom alert, please make sure you have specified a valid URL.', 'error');
                }

            }

        } else {

            this.config.cmAudioSPNotified = false;

        }

    }

};

/**
 * Automatically buys Elder Pledge if available
 */
CM.autoBuyPledge = function() {

    var pledge  = Game.Upgrades['Elder Pledge'],
        inStore = pledge.isInStore(),
        price   = pledge.getPrice(),
        bank    = Game.cookies;

    if(inStore && price < bank) {
        pledge.buy();
        this.popup('Bought Elder Pledge!', 'notice');
    }

};

CM.autoBuySeason = function() {
    var trigger = Game.Upgrades[Game.seasons[this.config.settings.autoSeason.current].trigger],
    switcher    = Game.Upgrades['Season switcher'],
    inStore     = trigger.isInStore();
    price       = trigger.getPrice(),
    bank        = Game.cookies;

    if (switcher.isInStore() && switcher.getPrice() < bank) {
        switcher.buy();
        bank = Game.cookies;
    }
    if(inStore && price < bank && Game.season != this.config.settings.autoSeason.current) {
        trigger.buy();
    }
}

/**
 * Adds a button to pop all existing wrinklers
 */
CM.AddPopWrinklersButton = function() {

    var $button = $('<button />').attr({
            'id': 'CMPopWrinklers',
            'type': 'button'
        }).text('Pop all Wrinklers');

    $('#cookieAnchor').append($button);

};

/**
 * Pops all active Wrinklers after a specified time
 */
CM.popWrinklersAfterXTime = function() {

    var setting = this.config.settings.popWrinklersAtInterval.current,
        time = setting !== 'off' ? setting : null;

    // Clear any existing timer
    if(CM.popWrinklerTimer) {
        clearTimeout(CM.popWrinklerTimer);
        CM.popWrinklersTime         = null;
        CM.popWrinklersTimeRelative = null;
    }

    if(time) {
        CM.popWrinklersTimeRelative = Number(time);
        CM.popWrinklersTime         = new Date().getTime() + Number(time);
        CM.popWrinklerTimer         = setTimeout(function popWrinklers() {
            var reward = CM.getWrinklerStats()[1];
            CM.popWrinklersTimeRelative = Number(time);
            CM.popWrinklersTime = new Date().getTime() + Number(time);
            if(CM.wrinklersExist() && reward) {
                Game.CollectWrinklers();
                CM.message('<strong>Popped all Wrinklers.</strong> Rewarded ' + Beautify(reward) + ' cookies.', 'notice');
            }
            CM.popWrinklerTimer = setTimeout(popWrinklers, time);
        }, time);
    }

};

/**
 * Updates the title tag with timer statuses and cookie count
 */
CM.updateTitleTicker = function() {

    var gcTime  = Math.round((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps),
        spTime  = Math.round((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps),
        gcI     = (Game.goldenCookie.life > 0) ? 'G (' + Math.round(Game.goldenCookie.life / Game.fps) + ')' : gcTime,
        spI     = (Game.seasonPopup.life > 0) ? 'R' : spTime,
        cookies = Beautify(Game.cookies),
        spPart  = Game.season === 'christmas' ? ' | ' + spI : ' ';



    document.title = gcI + spPart + ' - ' + cookies + ' cookies';

};

/**
 * Prevent Big Cookie clicks when going for True Neverclick
 */
CM.setTrueNeverclick = function() {

    if(this.config.settings.trueNeverclick.current === 'on') {

        // Only set if achievement isn't already unlocked
        if(!Game.HasAchiev('True Neverclick')) {

            // Warn if Big Cookie has already been clicked
            if(Game.cookieClicks > 0) {
                this.message('<strong>Warning:</strong> True Neverclick not possible as Big Cookie has already been clicked ' + Game.cookieClicks + ' times this session.', 'warning');
            }

            // Unbind and remove all click handlers
            $('#bigCookie')[0].removeEventListener('click', Game.ClickCookie);
            $('#bigCookie').unbind('click');

            // Reattach our own
            $('#bigCookie').click(function(event) {
                if(!Game.HasAchiev('True Neverclick')) {
                    CM.popup('Click prevented!', 'warning');
                } else {
                    Game.ClickCookie();
                }
            });

        } else {
            this.message('<strong>Warning:</strong> True Neverclick is already unlocked. Big Cookie will remain clickable.', 'warning');
        }

    } else {

        // Unbind and remove all click handlers
        $('#bigCookie')[0].removeEventListener('click', Game.ClickCookie);
        $('#bigCookie').unbind('click');

        // Reattach original handler
        AddEvent(l('bigCookie'), 'click', Game.ClickCookie);
    }

};

/**
 * Starts an auto-clicker using click speed in settings
 */
CM.startAutoClicker = function() {

    this.clearAutoClicker();
    this.autoClicker = setInterval(
        function() {
            Game.ClickCookie();
        }, 1000 / CM.config.settings.autoClickSpeed.current
    );

};

/**
 * Clears active auto-clicker
 */
CM.clearAutoClicker = function() {

    if(this.autoClicker) {
        clearInterval(this.autoClicker);
    }

};

/**
 * Sets and clears the auto-clicker during frenzies
 */
CM.manageAutoClicker = function() {

    var when        = this.config.settings.autoClick.current,
        clickFrenzy = Game.clickFrenzy > 0,
        elderFrenzy = Game.frenzy > 0 && Game.frenzyPower === 666,
        frenzy      = Game.frenzy > 0 && Game.frenzyPower > 1;

    if(when === 'allFrenzies') {

        if(frenzy || clickFrenzy) {
            this.startAutoClicker();
        } else {
            this.clearAutoClicker();
        }

    } else if(when === 'clickFrenzies') {

        if(clickFrenzy || elderFrenzy) {
            this.startAutoClicker();
        } else {
            this.clearAutoClicker();
        }

    }

};

/**
 * Prevents Golden Cookie and Reindeer clicks from clicking Wrinklers
 */
CM.preventClickBleed = function() {

    // Unbind the original onclick handlers
    $('#goldenCookie')[0].onclick = null;
    $('#seasonPopup')[0].onclick = null;

    // Rebind with stopPropagation()
    // This prevents the event bubbling up to document
    // where Game.Click gets set to 1, which causes
    // Wrinklers to take damage
    $('#goldenCookie').click(function(event) {
        event.stopPropagation();
        Game.goldenCookie.click();
    });

    $('#seasonPopup').click(function(event) {
        event.stopPropagation();
        Game.seasonPopup.click();
    });

};

CM.clickSanta = function() {

    var cost = Math.pow(Game.santaLevel + 1, Game.santaLevel + 1),
        drops = [],
        drop,
        i;

    if(Game.cookies > cost && Game.santaLevel < 14) {
        Game.Spend(cost);
        Game.santaLevel = (Game.santaLevel + 1) % 15;
        if(Game.santaLevel === 14) {
            Game.Unlock('Santa\'s dominion');
            Game.Popup('You are granted<br>Santa\'s dominion.');
        }
        Game.santaTransition = 1;
        for(i in Game.santaDrops) {
            if(!Game.HasUnlocked(Game.santaDrops[i])){
                drops.push(Game.santaDrops[i]);
            }
        }
        drop = choose(drops);
        if(drop) {
            Game.Unlock(drop);
            Game.Popup('You find a present which contains...<br>' + drop + '!');
        }
        if(Game.santaLevel >= 6){
            Game.Win('Coming to town');
        }
        if(Game.santaLevel >= 14){
            Game.Win('All hail Santa');
        }
    }

};

/**
 * Starts logging stats at a predetermined interval
 */
CM.startLogging = function() {

    var self = this,
        startTime = CM.config.cmStatsLogStart || localStorage.getItem('CMStatsStartTime');

    // Set a new start time if none exists already
    if(!startTime) {
        startTime = new Date().getTime();
    }
    localStorage.setItem('CMStatsStartTime', startTime);
    CM.config.cmStatsLogStart = startTime;

    // Log stats every 30 seconds
    CM.logData();
    CM.config.cmStatsLogTimer = setInterval(function() {CM.logData();}, 30000);
    localStorage.setItem('CMStatsLoggingActive', 'true');
    CM.popup('Logging data!', 'notice');

    $('#CMChartY').hide();
    $('#CMChartN').show();

};

/**
 * Stops logging stats
 */
CM.stopLogging = function() {

    // Stop logging stats
    if(this.config.cmStatsLogTimer) {
        clearInterval(this.config.cmStatsLogTimer);
        localStorage.setItem('CMStatsLoggingActive', 'false');

        this.popup('Stopped logging data!', 'notice');
    }

    $('#CMChartN').hide();
    $('#CMChartY').show();

};

/**
 * Clears the current stats log
 */
CM.clearLogSesion = function() {

    // Clear current stored and cached logs
    this.config.cmStatsData = null;
    localStorage.removeItem('CMStatsData');

    // Reset log start time
    this.config.cmStatsLogStart = new Date().getTime();
    localStorage.setItem('CMStatsStartTime', this.config.cmStatsLogStart);

    // Clear the chart
    this.config.cmStatsChart.clearChart();

    this.popup('Log cleared!', 'notice');

};

/**
 * Logs base CpS and effective CpS against a timestamp
 */
CM.logData = function() {

    var startTime    = this.config.cmStatsLogStart, // ms
        currentTime  = new Date().getTime(), // ms
        relativetime = this.formatTime(Math.round((currentTime - startTime) / 1000), true), // s
        currentData  = this.config.cmStatsData,
        newData      = [
            Math.round(this.baseCps() * 10) / 10,
            Math.round(this.effectiveCps() * 10) / 10
        ];

    // Retrieve session data from local storage if not already set
    if(!currentData) {
        currentData = JSON.parse(localStorage.getItem('CMStatsData')) || {};
    }

    // Add the new data to the set
    currentData[relativetime] = newData;

    // Save the new set to local storage
    localStorage.setItem('CMStatsData', JSON.stringify(currentData));

    // Cache the new data set in the config
    this.config.cmStatsData = currentData;

    // Redraw chart if visible
    if(this.config.cmStatsPanel.is(':visible')) {
        this.drawChart();
    }

};

/**
 * Draws the chart for logged stats
 */
CM.drawChart = function() {

    var data = CM.config.cmStatsData || JSON.parse(localStorage.getItem('CMStatsData')),
        chartData = [['Time', 'CpS', 'Effective CpS']],
        formattedData,
        options = {
            chartArea: {
                width: '100%',
                height: '100%'
            },
            legend: {
                position: 'in',
                textStyle: {
                    color: '#FFF'
                }
            },
            axisTitlesPosition: 'in',
            hAxis: {
                textPosition: 'none',
                textStyle: {
                    color: '#DDD'
                }
            },
            vAxis: {
                logScale: true,
                baseline: 0,
                gridlines: {
                    color: '#444'
                },
                textPosition: 'in',
                textStyle: {
                    color: '#DDD'
                }
            },
            backgroundColor: 'transparent',
            fontSize: '12'
        };

    if(data) {

        // Format our data to Google's liking
        $.each(data, function(key, value) {
            chartData.push([key, value[0], value[1]]);
        });
        formattedData = google.visualization.arrayToDataTable(chartData);

        // Create the chart is it doesn't exist
        if(!CM.config.cmStatsChart) {
            CM.config.cmStatsChart = new google.visualization.LineChart(document.getElementById('CMChart'));
        }
        // Draw it
        CM.config.cmStatsChart.draw(formattedData, options);

    }

};

/**
 * Creates and downloads logged stats as a CSV
 */
CM.downloadCSV = function() {

    var data = this.config.cmStatsData || JSON.parse(localStorage.getItem('CMStatsData')),
        output = [['Time', 'CpS', 'Effective  CpS']],
        csvRows = [],
        csvString,
        key,
        a,
        i,
        l;

    if(data) {

        for(key in data) {
            output.push([key.replace(new RegExp(',', 'g'), ';'), data[key][0], data[key][1]]);
        }

        for(i = 0, l = output.length; i < l; ++i) {
            csvRows.push(output[i].join(','));
        }

        csvString  = csvRows.join("%0A");
        a          = document.createElement('a');
        a.href     = 'data:attachment/csv,' + csvString;
        a.target   = '_blank';
        a.download = 'stats.csv';

        document.body.appendChild(a);
        a.click();

    } else {

        CM.message('<strong>Error:</strong> No logged data available to download!', 'error');

    }

};

/**
 * Clean up the game interface a little.
 *
 * @param {boolean} state active/inactive
 */
CM.cleanUI = function(state) {

    var cssClass = 'cleanUI',
        $body = this.config.ccBody;

    // All the UI cleaning stuff is done via CSS, which we accomplish by adding or
    // removing a CSS class to the body
    if(state) {
        $body.addClass(cssClass);
    } else {
        $body.removeClass(cssClass);
    }

    // Recalculate the background canvas heights
    function recalculateCanvasDimensions() {
        Game.Background.canvas.width = Game.Background.canvas.parentNode.offsetWidth;
        Game.Background.canvas.height = Game.Background.canvas.parentNode.offsetHeight;
        Game.LeftBackground.canvas.width = Game.LeftBackground.canvas.parentNode.offsetWidth;
        Game.LeftBackground.canvas.height = Game.LeftBackground.canvas.parentNode.offsetHeight;
    }

    // We need to delay this in case our CSS has not yet been parsed :(
    setTimeout(recalculateCanvasDimensions, 1000);

};

/**
 * Change the font of highlight and title text
 *
 * @param {String} font The selected font setting
 */
CM.changeFont = function(font) {

    var $body = this.config.ccBody;

    $body.removeClass('serif sansserif');
    if(font !== 'default') {
        $body.addClass(font);
    }

};

/**
 * Apply the current user settings to the game
 */
CM.applyUserSettings = function() {

    var config = this.config,
        settings = this.config.settings,
        loggingActive = localStorage.getItem('CMStatsLoggingActive'),
        loggingCallback;

    this.cleanUI(settings.cleanUI.current === 'on');
    this.changeFont(settings.changeFont.current);

    // Show all upgrades
    if(settings.showAllUpgrades.current === 'on') {
        config.ccBody.addClass('cmShowAllUpgrades');
    } else {
        config.ccBody.removeClass('cmShowAllUpgrades');
    }

    // Hide native game timers
    if(settings.hideNativeTimers.current === 'on') {
        config.ccBody.addClass('cmHideNativeTimers');
    } else {
        config.ccBody.removeClass('cmHideNativeTimers');
    }

    // Hide building info
    if(settings.hideBuildingInfo.current === 'on') {
        config.ccBody.addClass('cmHideBuildingInfo');
    } else {
        config.ccBody.removeClass('cmHideBuildingInfo');
    }

    // Timers
    this.populateTimerPanel();
    if(settings.timerBarPosition.current === 'top') {
        config.ccBody.addClass('cmTimerTop');
    } else {
        config.ccBody.removeClass('cmTimerTop');
    }

    // Auto-pop Wrinkler timer
    if(settings.popWrinklersAtInterval.current !== 'off') {
        this.popWrinklersAfterXTime();
    } else {
        clearTimeout(CM.popWrinklerTimer);
    }

    // Golden cookie display timer
    if(settings.showGCCountdown.current === 'on') {
        this.attachDisplayGCTimer();
    } else {
        $('#CMGCOverlay').remove();
    }

    // Remove Visual alert overlay if not required
    // (It will automatically reattach itself when activated)
    if(settings.visualAlerts.current === 'off') {
        this.removeVisualAlerts();
    }

    // Apply custom audio alerts if set
    if(settings.customGCAlert.current !== '') {
        this.config.cmGCActualAlertURL = settings.customGCAlert.current;
    } else {
        this.config.cmGCActualAlertURL = this.config.cmGCAudioAlertURL;
    }
    if(settings.customSPAlert.current !== '') {
        this.config.cmSPActualAlertURL = settings.customSPAlert.current;
    } else {
        this.config.cmSPActualAlertURL = this.config.cmSPAudioAlertURL;
    }

    // Cache the audio alert sound files
    if(settings.audioAlerts.current !== 'off') {
        this.config.cmGCAudioObject = new Audio(this.config.cmGCActualAlertURL);
        this.config.cmSPAudioObject = new Audio(this.config.cmSPActualAlertURL);
    }

    // Efficiency Key
    if(settings.showEfficiencyKey.current === 'on') {
        this.attachEfficiencyKey();
    } else {
        this.removeEfficiencyKey();
    }

    // High visibility cookie
    if(settings.highVisibilityCookie.current === 'on') {
        config.ccBody.addClass('cmHighVisCookie');
    } else {
        config.ccBody.removeClass('cmHighVisCookie');
    }

    // Increase click area
    if(settings.increaseClickArea.current === 'on') {
        config.ccBody.addClass('cmLargeClickArea');
    } else {
        config.ccBody.removeClass('cmLargeClickArea');
    }

    // Set the auto-clicker
    if(settings.autoClick.current === 'on') {
        this.startAutoClicker();
    } else {
        this.clearAutoClicker();
    }

    // Logging logic (arghh!)
    if(settings.enableLogging.current === 'on') {

        // Not currently logging
        if(!config.cmStatsLogTimer) {

            // API isn't loaded
            if(typeof google.visualization === 'undefined') {

                // Should be logging
                if(loggingActive === 'true') {

                    // Load the chart APIs and begin logging when done
                    google.load('visualization', '1', {'callback': CM.startLogging, 'packages':['corechart']});

                } else {

                    // Load the chart APIs and draw chart once when done
                    google.load('visualization', '1', {'callback': CM.drawChart, 'packages':['corechart']});
                    $('#CMChartN').hide();
                    $('#CMChartY').show();

                }

            } else {

                // API is loaded
                if(loggingActive === 'true') {

                    // Start logging directly
                    this.startLogging();

                } else {

                    // Just update the static chart
                    this.drawChart();
                    $('#CMChartN').hide();
                    $('#CMChartY').show();

                }

            }

        } else {

            // Is currently logging, hide the start button
            $('#CMChartY').hide();
            $('#CMChartN').show();

        }

        // Make sure the chart pane is visible
        $('#CMChartCont').show();

    } else {

        // Stop any current logging, clear the chart and hide the panel
        this.stopLogging();
        config.cmStatsData = null;
        localStorage.setItem('CMStatsLoggingActive', 'false');
        $('#CMChartCont').hide();

    }

    // Color blind mode
    if(settings.colorBlind.current === 'on') {
        config.ccBody.addClass('cmCB');
    } else {
        config.ccBody.removeClass('cmCB');
    }

    // True Neverclick
    this.setTrueNeverclick();

    // Initialize True CpS Tracker
    if (typeof this.trueCps.timer === 'undefined') {
        this.trueCps = new this.TrueCps(30, this.config.settings.trueCpsAverage.current * 60);
        this.trueCps.start();
    } else {
        this.trueCps.setWindow(this.config.settings.trueCpsAverage.current * 60);
    }

    // Initialize Click Tracker
    if (typeof this.clickTracker.timer === 'undefined') {
        this.clickTracker = new this.ClickTracker(60, this.config.settings.clickingAverage.current * 60);
        this.clickTracker.start();
    } else {
        this.clickTracker.setWindow(this.config.settings.clickingAverage.current * 60);
    }

    // Auto-buy
    if(settings.autoBuy.current === 'on') {
        this.autoBuyer.init();
        $('#CMAutoBuyPanel').fadeIn(200);
    } else {
        this.autoBuyer.stop();
        $('#CMAutoBuyPanel').fadeOut(200);
    }

    // Refresh the game panels
    Game.RefreshStore();
    Game.RebuildUpgrades();

};

/**
 * Save all user settings (cookie-based)
 */
CM.saveUserSettings = function() {

    var settings           = this.config.settings,
        cookieDate         = new Date(),
        settingsStates     = {},
        serializedSettings = '';

    // Grab the current value of each user setting
    $.each(settings, function(key, value) {
        settingsStates[key] =  this.current;
    });

    // Serialize the data
    // This will automatically encode any URL strings as well
    serializedSettings = $.param(settingsStates)
        .replace(/=/g, ':')  // Replace = with :
        .replace(/&/g, '|'); // Replace & with |

    // Create and set cookie, good for 5 years :)
    cookieDate.setFullYear(cookieDate.getFullYear() + 5);
    document.cookie = 'CMSettings=' + serializedSettings + ';expires=' + cookieDate.toGMTString( ) + ';';

    // Verify we saved it correctly
    if(document.cookie.indexOf('CMSettings') === -1) {
        this.popup('Error: Could not save settings!', 'error');
    } else {
        this.popup('Settings saved successfully!', 'notice');
    }

};

/**
 * Load user settings (cookie-based)
 */
CM.loadUserSettings = function() {

    var settings      = this.config.settings,
        match         = /(?:(?:^|.*;\s*)CMSettings\s*\=\s*([^;]*).*$)|^.*$/,
        cookie        = document.cookie.replace(match, '$1'),
        settingsPairs = [],
        keyVals       = [],
        self          = this;

    if(cookie) {

        // Split apart and update each setting's current value
        settingsPairs = cookie.split('|');
        $.each(settingsPairs, function(key, value) {

            keyVals = this.split(':');
            // If we can't find a setting, skip it
            if(settings.hasOwnProperty(keyVals[0])) {

                // Decode any URL fields
                if(keyVals[0] === 'customGCAlert' || keyVals[0] === 'customSPAlert') {
                    keyVals[1] = decodeURIComponent(keyVals[1]);
                }

                settings[keyVals[0]].current = keyVals[1];
            }

        });

    }

};

/**
 * Set event handlers for non-feature specific actions
 * (Feature-specific actions should have their event handlers
 * set and destroyed in their respective creation/removal methods)
 */
CM.setEvents = function() {

    // TO DO: Cache selectors and clean this up
    var self              = this,
        $game             = this.config.ccGame,
        $statsPanel       = this.config.cmStatsPanel,
        $settingsPanel    = this.config.cmSettingsPanel,
        $sectionLeft      = this.config.ccSectionLeft,
        $cmSettingsTables = $('#CMSettingsTables'),
        nextHC            = this.getHCStats()[2] + 1,
        cookiesToXHC      = this.heavenlyToCookiesRemaining(nextHC);

    // Handlers for the settings panel
    $cmSettingsTables.on('change', 'input, select', function() {

        var setting = $(this).attr('name'),
            value;

        // Grab the field value
        if($(this).is('select')) {
            value = $(this).find(":selected").val();
        } else if($(this).is('[type="checkbox"]')) {
            value = $(this).prop('checked') ? 'on' : 'off';
        } else if($(this).is('[type="range"]') || $(this).is('[type="text"]')) {
            value = $(this).val();
        }

        // Update range display value
        if($(this).is('[type="range"]')) {
            $(this).siblings('.currentValue').text($(this).val());
        }

        self.config.settings[setting].current = value;

    });
    $('#CMSettingsSave').click(function() {
        self.saveUserSettings();
        self.applyUserSettings();
    });
    $('#CMSettingsPause').click(function() {
        alert('Game paused. Click OK to resume.');
    });

    // Set some click handlers for the menu buttons
    $('#statsButton, #prefsButton, #logButton').click(function() {
        $('#rows').show();
        $('#CMStatsPanel, #CMSettingsPanel').hide();
    });
    $('#CMStatsPanelButton').click(function() {
        if($statsPanel.is(':hidden')) {
            self.updateStats();
            $statsPanel.show();
            $settingsPanel.hide();
            $('#rows').hide();
            $game.addClass('onCMMenu');
            // Redraw chart if it's enabled
            if(self.config.settings.enableLogging.current === 'on') {
                self.drawChart();
            }
        } else {
            $statsPanel.hide();
            $settingsPanel.hide();
            $('#rows').show();
            $game.removeClass('onCMMenu');
        }
        $('#menu').empty();
        $game.removeClass('onMenu');
        Game.onMenu = '';
    });
    $('#CMSettingsPanelButton').click(function() {
        if($settingsPanel.is(':hidden')) {
            $settingsPanel.show();
            $statsPanel.hide();
            $('#rows').hide();
            $game.addClass('onCMMenu');
        } else {
            $settingsPanel.hide();
            $statsPanel.hide();
            $('#rows').show();
            $game.removeClass('onCMMenu');
        }
        $('#menu').empty();
        $game.removeClass('onMenu');
        Game.onMenu = '';
    });

    // Pop Wrinklers button
    $sectionLeft.hover(
        function() {
            if(self.wrinklersExist()) {
                $('#CMPopWrinklers').fadeIn(200);
            }
        },
        function() {
            $('#CMPopWrinklers').fadeOut(200);
        }
    );
    $('#CMPopWrinklers').click(function() {
        Game.CollectWrinklers();
        CM.popWrinklersAfterXTime();
        $('#CMPopWrinklers').hide();
    });

    // GC Overlay click handler
    this.config.ccBody.on('mousedown', '#CMGCOverlay', function() {
        Game.goldenCookie.click();
        $('#CMGCOverlay').hide();
    });

    // Stat logging actions
    $('#CMChartY').click(function() {
        self.startLogging();
        $(this).hide();
        $('#CMChartN').show();
    });
    $('#CMChartN').click(function() {
        self.stopLogging();
        $(this).hide();
        $('#CMChartY').show();
    });
    $('#CMChartC').click(function() {
        self.clearLogSesion();
    });
    $('#CMChartD').click(function() {
        self.downloadCSV();
    });

    // Show/hide missing upgrades and achievements tables
    $('#CMToggleUpg').click(function(){
        $('#CMUpgCont').toggle();
    });
    $('#CMToggleAch').click(function(){
        $('#CMAchCont').toggle();
    });
    $('#CMToggleSha').click(function(){
        $('#CMShaCont').toggle();
    });

    // HC estimation box
    $('#CMXHC').val(nextHC);
    $('#CMStatsHCCookiesToX').html(Beautify(cookiesToXHC));
    $('#CMXHC').keyup(function() {
        var value     = Number($(this).val()),
            remaining = Beautify(CM.heavenlyToCookiesRemaining(value)),
            total     = Beautify(CM.heavenlyToCookies(value));
        $('#CMStatsHCCookiesToX').html(remaining + ' (total: ' + total + ')');
    });

    // Message bar
    $('#CMMessageBar').hover(function(){
        if($(this).children().length > 3) {
            $('#CMMessageBarDismissAll').fadeIn(200);
        }
    }, function(){
        $('#CMMessageBarDismissAll').fadeOut(200);
    });

    $('#CMMessageBar').on('click', '.cmContainer', function() {
        $(this).fadeTo(100, 0, function() {
            $(this).slideUp(100, function() {
                $(this).remove();
            });
        });
    });

    $('#CMMessageBarDismissAll').click(function() {
        $('.cmContainer').fadeTo(100, 0, function() {
            $(this).remove();
        });
        $(this).fadeOut(200);
    });

};

/**
 * Remove all traces of CookieMaster
 */
CM.suicide = function() {

    // TO DO: Implement this functionality
    alert('This kills the CookieMaster.');

};

/**
 * Alert user to messages via the message bar
 *
 * @param  {String} msg  message text
 * @param  {String} type [notice|warning|success|error]
 */
CM.message = function(msg, type) {

    var typeClass  = type ? 'cm' + this.toTitleCase(type) : 'cmNotice',
        $container = $('<div />').attr('class', 'cmContainer'),
        $message   = $('<div />').attr({'class': 'cmMessage ' + typeClass}),
        $dismiss   = $('<div />').attr('class', 'cmDismiss').text('x');

    $message.html(msg);
    $container.append($message, $dismiss);
    this.config.cmMessageBar.prepend($container);

    // Nicely fade in the message
    $container.slideDown(300, function() {
        $(this).find('.cmMessage').fadeTo(300, 1);
    });

};

/**
 * Create a tooltip for a type of object
 *
 * @param {Object} object
 *
 * @return {Void}
 */
CM.makeTooltip = function(object) {
    object.desc += CM.makeTooltipHtml(object);
    // hack for fools day
    Game.foolDescs[object.name] += cmTooltip;
    // Update store
    // Update store
    Game.RebuildUpgrades();
};

CM.makeTooltipHtml = function(object) {
    var identifier = object.identifier();

    cmTooltip = '' +
        '<div class="cm-tooltip__contents" id="' + identifier + '"></div>' +
        '<div class="cm-tooltip__warnings" id="' + identifier + 'note_div">'+
            '<div id="' + identifier + 'note_div_warning" class="cmTooltipWarningLucky">' +
                '<strong>Lucky deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'warning_amount"></span>' +
            '</div>' +
            '<div id="' + identifier + 'note_div_caution" class="cmTooltipWarningLuckyFrenzy">' +
                '<strong>Lucky+Frenzy deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'caution_amount"></span>' +
            '</div>' +
            '<div id="' + identifier + 'note_div_chain" class="cmTooltipWarningChain">' +
                '<strong>Current Chain tier deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'chain_amount"></span>' +
            '</div>' +
        '</div>';

    return cmTooltip;
};

/**
 * Update a Building/Upgrade tooltip
 * 
 * Only used for Upgrades now.  Buildings are handled in updateObjectDescription.
 *
 * @param {Object} object
 * @param {Array}  colors
 *
 * @return {void}
 */
CM.updateTooltip = function(object, colors) {

    var informations = [object.getWorth(true), object.getBaseCostPerIncome(), object.getTimeLeft()],
        deficits     = CME.getThresholdAlerts(object),
        identifier   = '#' + object.identifier(),
        $object      = $(identifier),
        timeLeft     = informations[2] > 0 ? CM.formatTime(informations[2], true) : '<span class="cmHighlight">Done!</span>',
        html;

    // Create tooltip if it doesn't exist
    if (!object.matches(object.identifier())) {
        this.makeTooltip(object);
    }
    // Cancel if we're not in this particular tooltip at the moment
    if ($object.length !== 1 || $object.css('display') === 'none') {
        return;
    }

    // Update informations
    html =  '<table class="cmTable">';

    // Add clicking bonus informations
    if(object.getType() === 'upgrade' && object.isClickingRelated()) {
        html += '<tr>' +
                    '<td>Bonus CpC:</td>' +
                    '<td class="cmValue text-' + colors[1] + '">' + Beautify(object.getClickingWorth(), 1) + '</td>' +
                '</tr>';
    }
    html +=     '<tr>' +
                    '<td>Bonus Income:</td>' +
                    '<td class="cmValue">' + Beautify(informations[0], 1) + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>BCI:</td>' +
                    '<td class="cmValue text-' + colors[0] + '">' + Beautify(informations[1], 1) + '</td>' +
                '</tr>' +
                '<tr>' +
                    '<td>Time Left:</td>' +
                    '<td class="cmValue text-' + colors[1] + '">' + timeLeft + '</td>' +
                '</tr>' +
             '</table>';

    $object.attr('class', 'cm-tooltip__contents border-' + colors[0]).html(html);

    $(identifier + 'warning_amount').html(Beautify(deficits[0]) + ' (' + CME.getTimeToCookies(deficits[0]) + ')');
    $(identifier + 'caution_amount').html(Beautify(deficits[1]) + ' (' + CME.getTimeToCookies(deficits[1]) + ')');
    $(identifier +   'chain_amount').html(Beautify(deficits[2]) + ' (' + CME.getTimeToCookies(deficits[2]) + ')');

    if(this.config.settings.showDeficitStats.current === 'on') {
        $(identifier + 'note_div_warning').toggle(deficits[0] > 0);
        $(identifier + 'note_div_caution').toggle(deficits[1] > 0);
        $(identifier +   'note_div_chain').toggle(deficits[2] > 0);
    } else {
        $(identifier + 'note_div_warning').hide();
        $(identifier + 'note_div_caution').hide();
        $(identifier +   'note_div_chain').hide();
    }
    this.tooltipLastObjectId = identifier;
};

/**
 * Update an object's description with our tooltip info, 
 * so that our info is included in CC's native tooltip.
 * 
 * For now this is used only for buildings.  If Orteil 
 * starts updating Upgrade tooltips the same way he's 
 * now doing Building tooltips, this can handle both.
 * Until then, any changes to tooltips may need to be
 * made in both places.
 */
CM.updateObjectDescription=function(object) {
	
    var colors = object.getColors();

    var informations = [object.getWorth(true), object.getBaseCostPerIncome(), object.getTimeLeft()],
    deficits     = CME.getThresholdAlerts(object),
    identifier   = '#' + object.identifier(),
    $object      = $(identifier),
    timeLeft     = informations[2] > 0 ? CM.formatTime(informations[2], true) : '<span class="cmHighlight">Done!</span>',
    html;

    var identifier = object.identifier();

    var cmTooltip = '' +
        '<div class="cm-tooltip__contents border-' + colors[0] + '" id="' + identifier + '">';
	// Update informations
	cmTooltip +=  '<table class="cmTable">';
	// Add clicking bonus informations
	if(object.getType() === 'upgrade' && object.isClickingRelated()) {
		cmTooltip += '<tr>' +
	                '<td>Bonus CpC:</td>' +
	                '<td class="cmValue text-' + colors[1] + '">' + Beautify(object.getClickingWorth(), 1) + '</td>' +
	            '</tr>';
	}
	cmTooltip +=     '<tr>' +
	                '<td>Bonus Income:</td>' +
	                '<td class="cmValue">' + Beautify(informations[0], 1) + '</td>' +
	            '</tr>' +
	            '<tr>' +
	                '<td>BCI:</td>' +
	                '<td class="cmValue text-' + colors[0] + '">' + Beautify(informations[1], 1) + '</td>' +
	            '</tr>' +
	            '<tr>' +
	                '<td>Time Left:</td>' +
	                '<td class="cmValue text-' + colors[1] + '">' + timeLeft + '</td>' +
	            '</tr>' +
	         '</table>';
	
    cmTooltip += '</div>';
	var showDef = this.config.settings.showDeficitStats.current === 'on';
    cmTooltip +=
        '<div class="cm-tooltip__warnings" id="' + identifier + 'note_div">'+
            '<div id="' + identifier + 'note_div_warning" class="cmTooltipWarningLucky"' 
            		+ (showDef && deficits[0]>0 ? '':' style="display:none;"')+ '>' +
                '<strong>Lucky deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'warning_amount">' + 
                	Beautify(deficits[0]) + ' (' + CME.getTimeToCookies(deficits[0]) + ')' + 
            	'</span>' +
            '</div>';
    cmTooltip +=
    		'<div id="' + identifier + 'note_div_caution" class="cmTooltipWarningLuckyFrenzy"' 
    				+ (showDef && deficits[1]>0 ? '':' style="display:none;"')+ '>' +
                '<strong>Lucky+Frenzy deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'caution_amount">' + 
                	Beautify(deficits[1]) + ' (' + CME.getTimeToCookies(deficits[1]) + ')' + 
            	'</span>' +
            '</div>';
    cmTooltip +=
	    	'<div id="' + identifier + 'note_div_chain" class="cmTooltipWarningChain"' 
	    			+ (showDef && deficits[2]>0 ? '':' style="display:none;"')+ '>' +
                '<strong>Current Chain tier deficit if purchased:</strong><br />' +
                '<span id="' + identifier + 'chain_amount">' + 
                	Beautify(deficits[2]) + ' (' + CME.getTimeToCookies(deficits[2]) + ')' + 
            	'</span>' +
            '</div>' +
        '</div>';
	
    // We need to keep track of the original description
	if (typeof(object.originalDescCM) === 'undefined') {
		object.originalDescCM = object.desc;
	}
    object.desc = object.originalDescCM + cmTooltip;
    
    // hack for fools day
	if (typeof(object.originalFoolDescCM) === 'undefined') {
		object.originalFoolDescCM = Game.foolDescs[object.name];
	}
    Game.foolDescs[object.name] = object.originalFoolDescCM + cmTooltip;

	this.tooltipLastObjectId = identifier;

};

/**
 * Create the DOM for all tooltips
 *
 * @return {void}
 */
CM.setupTooltips = function() {
    this.updateTooltips();

    // Rebuild game elements
    Game.RebuildUpgrades();
};

 CM.setupDynamicTooltips = function() {
    Game.ObjectsById.forEach(function (object) {
        _tooltip = object.tooltip;
        object.tooltip = function(){
        	/* There are a couple of alternative ways this could be implemented.
        	 * 1) The current way: insert our tooltip markup into object.desc, 
        	 * 	  which CC's native tooltip function will use.  Pros: Robust; 
        	 *    as long as CC includes object.desc in the tooltip, our info 
        	 *    will be there.  Cons: Restrictive; we can't change the other
        	 *    parts of the tooltip.
        	 * 2) Copy CC's native tooltip logic and markup, inserting our own.  
        	 *    Pros: Flexible; we could alter the tooltip as much as we want.  
        	 *    Cons: Any change to CC's tooltips in the future would not be 
        	 *    seen by CM users until we updated ours.
        	 */
        	CM.updateObjectDescription(object);
            return _tooltip.apply(object);
        };
    });
};

/**
 * Update one or more types of tooltips
 *
 * @param {string} which [upgrades,objects,all]
 *
 * @return {void}
 */
CM.updateTooltips = function(which) {
    if (typeof which === 'undefined') {
        which = 'all';
    }

    // Upgrades
    if (which === 'all' || which === 'upgrades') {
        Game.UpgradesById.forEach(function (upgrade) {
            CM.manageUpgradeTooltips(upgrade);
        });
    }

    //Buildings
    if (which === 'all' || which === 'objects') {
        Game.ObjectsById.forEach(function (building) {
            // Building tooltips are handled in updateObjectDescription
        	// We still need to update the price color based on efficiency, though
            CM.updateBuildingDisplay(building);
        });
    }
};

/**
 * Handles the creation/update of an upgrade's tooltip
 *
 * @param {Object} upgrade
 *
 * @return {void}
 */
CM.manageUpgradeTooltips = function(upgrade) {

    var colors   = upgrade.getColors(),
        identifier   = '#' + upgrade.identifier();


    // Cancel if the upgrade isn't in the store
    if (!upgrade.isInStore()) {
        // Make sure tooltip deficits are hidden for purchased upgrades
        $(identifier + 'note_div_warning').hide();
        $(identifier + 'note_div_caution').hide();
        $(identifier +   'note_div_chain').hide();
        return;
    }

    // Colorize upgrade icon
    $('#upgrade' + Game.UpgradesInStore.indexOf(upgrade)).html('<div class="cmUpgrade background-' + colors[0] + '"></div>');

    return this.updateTooltip(upgrade, colors);
};

/**
 * Handles the creation/update of a building's tooltip
 *
 * @param {Object} building
 *
 * @return {void}
 */
CM.updateBuildingDisplay = function(building) {
    var colors = building.getColors(),
        //color = this.config.settings.efficiencyCalc.current === 'roi' ? colors[2] : colors[0];
        color = colors[0];

    // Colorize building price
    $('.price', '#product' + building.id).attr('class', 'price text-' + color);

};

/**
 * Checks for plugin updates via an AJAX request
 */
CM.checkForUpdate = function() {

    var vers = this.config.version,
        notifiedVers = this.config.cmVersionNotified,
        changelog = this.config.cmChangelogURL,
        url = this.config.cmVersionURL;

    $.ajax({
        url: url,
        cache: false,
        dataType: 'json'
    }).done(function(data) {

        var latestVers = data.version;

        // Display a notice message if latest version is higher than the current one
        // and we haven't already notified the user
        if(CM.versionCompare(vers, latestVers) === -1 && notifiedVers !== latestVers) {
            CM.message(
                '<strong>New version of CookieMaster available! (v.' + latestVers + ')</strong><br />' +
                '<em>Bookmark users:</em> Save and refresh to update.<br />' +
                '<em>Chrome extension users:</em> Chrome auto-updates your plugins periodically, but if you really want the new version right now, check the "Developer mode" box in your Extensions page, then click "Update Extensions Now".<br />' +
                '<a href="' + changelog + '" target="_blank">See what\'s new</a> (opens in new tab).',
                'notice'
            );
            // Set the notified version flag
            CM.config.cmVersionNotified = latestVers;
        }

    }).error(function() {
        CM.message('<strong>Error:</strong> Could not check for update :(', 'error');
    });

};

/* ================================================
    END NON-RETURNING METHODS
================================================ */

/* ================================================
    THE FOLLOWING CODE MODIFIES GAME STATE
    WE MUST ENSURE GAME IS READY BEFORE EXECUTING
================================================ */

var gameReadyStateCheckInterval = setInterval(function() {

    if(typeof Game === 'object') {

        if (Game.ready) {

            clearInterval(gameReadyStateCheckInterval);

            /* ================================================
                COOKIE CLICKER FUNCTION OVERRIDES
            ================================================ */

            //////////////////////////////////////////////////////////////////////
            // Hook CMEO into the game's own objects
            //////////////////////////////////////////////////////////////////////

            Game.Achievement.prototype.getDescribedInteger = CMEO.getDescribedInteger;
            Game.Achievement.prototype.matches             = CMEO.matches;

            Game.Object.prototype.getBaseCostPerIncome  = CMEO.getBaseCostPerIncome;
            Game.Object.prototype.getColors             = CMEO.getColors;
            Game.Object.prototype.getComparativeInfos   = CMEO.getComparativeInfos;
            Game.Object.prototype.getReturnInvestment   = CMEO.getReturnInvestment;
            Game.Object.prototype.getTimeLeft           = CMEO.getTimeLeft;
            Game.Object.prototype.getType               = CMEO.getTypeOf;
            Game.Object.prototype.getWorth              = CMEO.getWorthOf;
            Game.Object.prototype.identifier            = CMEO.identifier;
            Game.Object.prototype.matches               = CMEO.matches;
            Game.Object.prototype.simulateToggle        = CMEO.simulateBuildingToggle;

            Game.Upgrade.prototype.getBaseCostPerIncome = CMEO.getBaseCostPerIncome;
            Game.Upgrade.prototype.getColors            = CMEO.getColors;
            Game.Upgrade.prototype.getComparativeInfos  = CMEO.getComparativeInfos;
            Game.Upgrade.prototype.getDescribedInteger  = CMEO.getDescribedInteger;
            Game.Upgrade.prototype.getReturnInvestment  = CMEO.getReturnInvestment;
            Game.Upgrade.prototype.getTimeLeft          = CMEO.getTimeLeft;
            Game.Upgrade.prototype.getType              = CMEO.getTypeOf;
            Game.Upgrade.prototype.getWorth             = CMEO.getWorthOf;
            Game.Upgrade.prototype.getClickingWorth     = CMEO.getClickingWorth;
            Game.Upgrade.prototype.identifier           = CMEO.identifier;
            Game.Upgrade.prototype.matches              = CMEO.matches;
            Game.Upgrade.prototype.simulateToggle       = CMEO.simulateUpgradeToggle;
            Game.Upgrade.prototype.isInStore            = CMEO.isInStore;
            Game.Upgrade.prototype.isClickingRelated    = CMEO.isClickingRelated;

            /**
             * Hijacks the original Beautify method to use
             * our own formatting function
             *
             * @param {Integer} what   Number to beautify
             * @param {Integer} floats Desired precision
             *
             * @return {String}    Formatted number
             */
            window.Beautify = function(what, floats) {

                var precision = floats || 0;

                return CM.largeNumFormat(what, precision);

            };

            /**
             * Remove the title tag update functionality from the main
             * game as we will use our own, faster update function
             */
            CM.replaceNative('Logic', {
                'if (Game.T%(Game.fps*2)==0) document.title=Beautify(Game.cookies)+\' \'+(Game.cookies==1?\'cookie\':\'cookies\')+\' - Cookie Clicker\';': ''
            });

            /**
             * Pause the auto-clicker during reset to prevent cookies
             * being given to a reset game
             */
            CM.replaceNative('Reset', {
                'if (!bypass': 'CM.clearAutoClicker();if (!bypass',
                'var cookiesForfeited': 'if(CM.config.settings.autoClick.current === \'on\') {setTimeout(function(){CM.startAutoClicker();}, 1000);} var cookiesForfeited'
            }, 'bypass, hard');

            /**
             * Attempt to keep tooltips visible
             */
            Game.tooltip.update = CM.appendToNative(Game.tooltip.update, CME.controlTooltipPosition);

            /**
             * Fixes the game's mangled attempt at blocking hotlinked audio files from
             * soundjay.com (soundjay files are still blocked, but the Audio API now
             * works correctly again).
             *
             * @param {String} src source file
             *
             * @return {Object}    new Audio object
             */
            /*jshint -W020 */
            window.Audio = function(src) {

                if(src) {
                    if(src.indexOf('soundjay') !== -1) {
                        CM.message('<strong>Error:</strong> Sorry, no sounds hotlinked from soundjay.com.', 'error');
                        return false;
                    }
                }

                return new realAudio(src);

            };
            /*jshint +W020 */

            /* ================================================
                END COOKIE CLICKER FUNCTION OVERRIDES
            ================================================ */

            // Start it up!
            CM.init();

        }

    }

}, 10);
