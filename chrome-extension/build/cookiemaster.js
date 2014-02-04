/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.11.2
    Date:         23/12/2013
    Website:      http://cookiemaster.co.uk
    GitHub:       https://github.com/greenc/CookieMaster
    Dependencies: Cookie Clicker, jQuery
    Author:       Chris Green
                  c.robert.green@gmail.com

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

	version:              '1.11.2',                         // Current version of CookieMaster
	ccCompatibleVersions: ['1.0402', '1.0403'],             // Known compatible versions of Cookie Clicker
	cmRefreshRate:        1000,                             // Refresh rate for main game loop
	cmFastRefreshRate:    200,                              // Refresh rate for title ticker and audio alerts
	cmCheckUpdateRate:    1800000,                          // How often to check for updates (default 30 minutes)
	cmGCAudioAlertURL:    'http://cookiemaster.co.uk/assets/gc.mp3',  // Default Golden Cookie audio soundbyte
	cmSPAudioAlertURL:    'http://cookiemaster.co.uk/assets/sp.mp3',  // Default Reindeer audio soundbyte
	cmVersionURL:         'http://cookiemaster.co.uk/package.json',   // URL to check for plugin updates
	cmChangelogURL:       'https://github.com/greenc/CookieMaster/blob/master/CHANGELOG.md',

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
				scientific: ' &times; 10&sup2;sup1;',
				compact:    '*10&sup2;sup1;'
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
		}
	},


	///////////////////////////////////////////////
	// User settings panel options
	///////////////////////////////////////////////

	settingsGroups: {
		general: {
			title: 'General',
			desc:  ''
		},
		numbers: {
			title: 'Numbers',
			desc:  ''
		},
		alerts:  {
			title: 'Timers & Alerts',
			desc:  '<p class="cmNotice"><strong>Notice:</strong>If you want to use custom audio alerts, please be mindful to link to non-copyrighted audio files on sites that explicitly allow hotlinking to avoid http://orteil.dashnet.org getting blacklisted!<br />Links to soundjay.com files are blocked as per the main game code.</p>'
		},
		ui:      {
			title: 'Interface',
			desc:  ''
		},
		cheats:  {
			title: 'I\'m a dirty rotten cheater',
			desc:  ''
		}
	},

	settings: {
		cleanUI: {
			group:   'ui',
			type:    'checkbox',
			label:   'Clean Interface:',
			desc:    'Hide the top bar, and make other small graphical enhancements to the game interface.',
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
		showGCCountdown: {
			group:   'alerts',
			type:    'checkbox',
			label:   'Show Golden Cookie Countdown:',
			desc:    'Display a countdown timer on Golden Cookies showing how long you have left to click them',
			current: 'on'
		},
		timerBarPosition: {
			group:   'alerts',
			type:    'select',
			label:   'Timer Bar Position:',
			desc:    'Position the timer bar at the top or bottom of the screen.',
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
		showEfficiencyKey: {
			group:   'ui',
			type:    'checkbox',
			label:   'Show Efficiency Key:',
			desc:    'Display building efficiency color key in the right panel.',
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
		autoClickPopups: {
			group:   'cheats',
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
			group:   'cheats',
			type:    'select',
			label:   'Auto-click Big Cookie:',
			desc:    'Automatically click the big cookie.',
			options: [
				{
					label: 'Off',
					value: 'off'
				},
				{
					label: 'During Click Frenzies',
					value: 'clickFrenzies'
				},
				{
					label: 'During All Frenzies',
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
			group: 'cheats',
			type:  'range',
			label: 'Auto-click Speed:',
			desc:  'How many times per second to auto-click the big cookie.',
			options: {
				min: 1,
				max: 250,
				step: 1
			},
			current: 10
		},
		showMissedGC: {
			group: 'general',
			type:  'checkbox',
			label: 'Show Missed Golden Cookies:',
			desc:  'Whether or not to show the stat for missed Golden Cookies.',
			current: 'on'
		},
		enableLogging: {
			group: 'general',
			type:  'checkbox',
			label: 'Enable Logging (BETA):',
			desc:  'Enables the ability to log stats and view a log chart. Logging can be managed in the Stats panel when this setting is active.',
			current: 'off'
		},
		popWrinklersAtInterval: {
			group: 'general',
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
			group: 'general',
			type:  'checkbox',
			label: 'True Neverclick Helper:',
			desc:  'Prevents clicks on the Big Cookie until you unlock the True Neverclick achievement. Make sure to disable auto-click if using this feature.',
			current: 'off'
		},
		colorBlind: {
			group:   'ui',
			type:    'checkbox',
			label:   'Color Blind Mode:',
			desc:    'Alternate color scheme that is color-blind friendly.',
			current: 'off'
		}
	}

};

/**
 * Object to hold any active timers
 * @type {Object}
 */
CM.timers = {};

/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should be called from here in the order needed.
 */
CM.init = function() {

	var self            = this,
		refreshRate     = this.config.cmRefreshRate,
		fastRefreshRate = this.config.cmFastRefreshRate,
		checkUpdateRate = this.config.cmCheckUpdateRate,
		ccVers          = Game.version.toString();

	// Attach the message bar before anything else
	this.config.cmMessageBar = $('<div />').attr('id', 'CMMessageBar');
	this.config.ccBody.append(this.config.cmMessageBar);

	this.loadUserSettings();      // Load current user settings from cookie
	this.attachSettingsPanel();   // Attach the settings panel to the DOM
	this.attachStatsPanel();      // Attach the stats panel to the DOM
	this.attachTimerPanel();      // Attach the timer panel to the DOM
	this.AddPopWrinklersButton(); // Attach the Pop Wrinklers button to the DOM
	this.setupTooltips();         // Configures the custom tooltips that overwrite the native ones
	this.preventClickBleed();     // Overrides native click handlers for Golden Cookies and Reindeer
	this.setEvents();             // Set up general event handlers

	/**
	 * Performs more setup routines based on current user settings
	 * This also gets called whenever user saves settings
	 */
	this.applyUserSettings();

	// Refresh tooltips when drawn
	Game.tooltip.draw = this.appendToNative(Game.tooltip.draw, CM.updateTooltips);
	// Refresh tooltips on store rebuild
	Game.RebuildStore = this.appendToNative(Game.RebuildStore, CM.updateTooltips);

	/**
	 * Initialize the main game loop
	 */
	setInterval(function() {self.mainLoop();}, refreshRate);

	/**
	 * Initialize secondary, faster loop for the title bar ticker
	 * and audio alert notifications
	 */
	setInterval(function() {

		self.updateTitleTicker();

		if(self.config.settings.audioAlerts.current !== 'off') {
			self.playAudioAlerts();
		}

	}, fastRefreshRate);

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

	// All done :)
	this.popup('CookieMaster v.' + this.config.version + ' loaded successfully!', 'info');

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
	this.label     = label;
	this.id        = 'CMTimer-' + this.type;
	this.container = {};
	this.barOuter  = {};
	this.barInner  = {};
	this.counter   = {};
	this.limiter   = null; // Add only if needed

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
			maxPledge = Game.Has('Sacrificial rolling pins') ? 60 : 30;

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
 * Returns array of stats for Heavenly Chips
 *
 * @return {Array} [currentHC, currentPercent, maxHC, maxPercent, cookiesToNextHC, timeToNextHC]
 */
CM.getHCStats = function() {

	var stats          = [],
		current        = Game.prestige['Heavenly chips'],
		currentPercent = current * 2,
		max            = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
		maxPercent     = max * 2,
		cookiesToNext  = this.heavenlyToCookies(max + 1) - (Game.cookiesReset + Game.cookiesEarned),
		timeToNext     = Math.round(cookiesToNext / this.effectiveCps()),
		i;

	stats = [
		Beautify(current),
		Beautify(currentPercent) + '%',
		Beautify(max),
		Beautify(maxPercent) + '%',
		Beautify(cookiesToNext),
		this.formatTime(timeToNext)
	];

	return stats;

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
 * Returns current effective CPS (factors in auto clicking if enabled)
 *
 * @return {Integer}
 */
CM.effectiveCps = function() {

	var settings = this.config.settings,
		clickModifier = settings.autoClick.current === 'on' ? settings.autoClickSpeed.current * Game.mouseCps() : 0;

	return clickModifier + Game.cookiesPs;

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
		cpsLimit        = Game.cookiesPs * 60 * 60 * 6,
		wrath           = Game.elderWrath === 3 ? true : false,
		chainValue      = wrath ? 66666 : 77777; // Minimum guaranteed chain amount

	// Chains not possible until player has earned 100000+ cookies total
	if(Game.cookiesEarned < 100000) {
		return false;
	}

	while(chainValue < bankLimit && chainValue <= cpsLimit) {
		chainValue += wrath ? '6' : '7';
		chainValue = parseInt(chainValue, 10);
	}

	return chainValue.toString().slice(0, -1);

};

/**
 * Returns bank or CpS required for next chain tier
 *
 * @param  {Integer} maxReward Maximum current chain reward
 * @param  {String}  type      bank, cps
 * @return {Integer}
 */
CM.requiredNextChainTier = function(type, maxReward) {

	var wrath         = Game.elderWrath === 3 ? true : false,
		digitString   = wrath ? '6' : '7',
		minChain      = wrath ? 66666 : 77777,
		minNextChain  = wrath ? 666666 : 777777,
		nextChainTier = (maxReward < minChain) ? minNextChain : parseInt(maxReward + digitString, 10);

	// Chains not possible until player has earned 100000+ cookies total
	if(Game.cookiesEarned < 100000) {
		return false;
	}

	return type === 'bank' ? nextChainTier * 4 : nextChainTier / 6 / 60 / 60;

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
	var time =Math.round(t),
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
 * Checks if any Wrinkers are on screen
 *
 * @return {[Boolean]}
 */
CM.wrinklersExist = function() {

	var i;

	for(i in Game.wrinklers) {
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
		a;

	for(a in Game.Upgrades) {
		if(Game.Upgrades[a].debug !== 1 && Game.Upgrades[a].unlocked === 0) {
			missing.push(a);
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
 * @param  {String}   type    optional [info|warning|error]
 * @return {Function}
 */
CM.popup = function(message, type) {

	var typeClass = this.toTitleCase(type) || 'Info';

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
		native.apply(null, arguments);
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
			v1parts.push("0");
		}
		while(v2parts.length < v1parts.length){
			v2parts.push("0");
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

	// Auto click popups if set
	if(settings.autoClickPopups.current !== 'off') {
		this.autoClickPopups();
	}

	// Handle auto-clickers
	this.manageAutoClicker();

	if(this.config.cmStatsPanel.is(':visible')) {
		this.updateStats();
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
		$cmSettingsTitle  = $('<h3 />').attr('class', 'title').html('CookieMaster Settings<span class="cmTitleSub">v.' + this.config.version + '</span>'),
		$cmSettingsTables = $('<div />').attr('id', 'CMSettingsTables'),
		$cmSettingsSave   = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button', 'class': 'cmFont'}).text('Apply Settings'),
		$cmSettingsPause  = $('<button />').attr({'id': 'CMSettingsPause', 'type': 'button', 'class': 'cmFont'}).text('Pause Game');


	// Loop over each settings group
	for(group in groups) {

		// Create a table for each group
		html += '<table class="cmTable">';
		html +=     '<tr class="cmHeader">';
		html +=        '<th colspan="2" class="cmFont">' + groups[group].title + '</th>';
		html +=     '</tr>';

		// Show group description
		if(groups[group].desc) {

			html +=     '<tr class="cmDesc">';
			html +=        '<td colspan="2">' + groups[group].desc + '</td>';
			html +=     '</tr>';

		}

		// Then loop over each setting
		for(setting in settings) {

			thisSetting = settings[setting];

			// Build the setting if it's part of the group we are currently in
			if(thisSetting.group === group) {

				// Reset these for each loop
				options = [];
				option  = {};
				current = thisSetting.current;

				if(thisSetting.type === 'select') {

					/**
					 * Build a select box
					 */

					for(option in thisSetting.options) {

						thisOption = thisSetting.options[option];

						selected = (current === thisOption.value.toString()) ? ' selected="selected"' : '';
						options.push('<option value="' + thisOption.value + '"' + selected + '>' + thisOption.label + '</option>');

					}

					control =  '<select name="' + setting + '">';
					control += options.join('');
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
				html +=     '<td>';
				html +=         '<label for="CMSetting-' + setting + '">' + thisSetting.label + '</label>';
				html +=         '<small>' + thisSetting.desc + '</small>';
				html +=          '</td>';
				html +=     '<td class="cmValue">' + control + '</td>';
				html += '</tr>';

			}

		}

		html += '</table>';

	}

	// Glue it together
	$cmSettingsTables.append(html);
	$cmSettingsPanel.append(
		$cmSettingsTitle,
		$cmSettingsTables,
		$cmSettingsSave,
		$cmSettingsPause
	);

	// Attach to DOM
	$ccSectionMiddle.append($cmSettingsPanel);
	$ccComments.prepend($cmSettingsButton);

	// Cache the selector
	this.config.cmSettingsPanel = $cmSettingsPanel;

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
	tableHTML +=         '<td>Cookies to next HC:</td>';
	tableHTML +=         '<td class="cmValue" id="CMStatsHCCookiesToNext"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Time to next HC:</td>';
	tableHTML +=         '<td class="cmValue" id="CMStatsHCTimeToNext"></td>';
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

/**
 * Populates the stats panel with the latest game stats
 */
// TO DO: Possibly cache these selectors for performance :/
CM.updateStats = function() {

	var hcStats           = this.getHCStats(),
		wrinklerStats     = this.getWrinklerStats(),
		lastGC            = this.toTitleCase(Game.goldenCookie.last) || '-',
		lbText            = Game.cookies >= this.luckyBank() ? '<span class="cmHighlight">' + Beautify(this.luckyBank()) + '</span>' : Beautify(this.luckyBank()),
		lbtr              = Game.cookies < this.luckyBank() ? ' (' + this.formatTime((this.luckyBank() - Game.cookies) / this.effectiveCps()) + ')' : '',
		lfbText           = Game.cookies >= this.luckyFrenzyBank() ? '<span class="cmHighlight">' + Beautify(this.luckyFrenzyBank()) + '</span>' : Beautify(this.luckyFrenzyBank()),
		lfbtr             = Game.cookies < this.luckyFrenzyBank() ? ' (' + this.formatTime((this.luckyFrenzyBank() - Game.cookies) / this.effectiveCps()) + ')' : '',
		missedGC          = this.config.settings.showMissedGC.current === 'on' ? Beautify(Game.missedGoldenClicks) : 'I\'m a wimp and don\'t want to know',
		chainReward       = this.maxChainReward(),
		chainRewardString = chainReward ? Beautify(chainReward) : 'Earn ' + Beautify(100000 - Math.round(Game.cookiesEarned)) + ' more cookies for cookie chains',
		nextChainBank     = this.requiredNextChainTier('bank', chainReward),
		nextChainCPS      = this.requiredNextChainTier('cps', chainReward),
		missingU          = this.getMissingUpgrades(),
		missingA          = this.getMissingAchievements(),
		missingS          = this.getMissingAchievements(true),
		upgHTML           = '',
		aHTML             = '',
		sHTML             = '',
		nextChainBankString,
		nextChainCPSString,
		i,
		j;

	if(nextChainBank !== false) {
		if(Game.cookies > nextChainBank) {
			nextChainBankString = '<span class="cmHighlight">' + Beautify(nextChainBank) + '</span>';
		} else {
			nextChainBankString = Beautify(nextChainBank);
		}
	}

	if(nextChainCPS !== false) {
		if(Game.cookiesPs > nextChainCPS) {
			nextChainCPSString = '<span class="cmHighlight">' + Beautify(nextChainCPS, 1) + '</span>';
		} else {
			nextChainCPSString = Beautify(nextChainCPS, 1);
		}
	}

	// Golden Cookie stats
	$('#CMStatsLuckyRequired').html(lbText + lbtr);
	$('#CMStatsLuckyFrenzyRequired').html(lfbText + lfbtr);
	$('#CMStatsLuckyReward').html(Beautify(this.luckyReward()) + ' (max: ' + Beautify(this.maxLuckyReward()) + ')');
	$('#CMStatsLuckyFrenzyReward').html(Beautify(this.luckyFrenzyReward()) + ' (max: ' + Beautify(this.maxLuckyFrenzyReward()) + ')');
	$('#CMStatsReindeerReward').html(Beautify(this.getReindeerReward()));
	$('#CMStatsMaxChainReward').html(chainRewardString);
	$('#CMStatsBankRequiredNextChainTier').html(nextChainBankString || '-');
	$('#CMStatsCPSRequiredNextChainTier').html(nextChainCPSString || '-');
	$('#CMStatsLastGC').html(lastGC);
	$('#CMStatsMissedGC').html(missedGC);

	// Heavenly Chip stats
	$('#CMStatsHCCurrent').html(hcStats[0] + ' (' + hcStats[1] + ')');
	$('#CMStatsHCMax').html(hcStats[2] + ' (' + hcStats[3] + ')');
	$('#CMStatsHCCookiesToNext').html(hcStats[4]);
	$('#CMStatsHCTimeToNext').html(hcStats[5]);

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
			upgHTML += '<tr><td colspan ="2">' + missingU[i] + '</td></tr>';
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
			sp:          Game.seasonPopup.life === 0,
			frenzy:      Game.frenzy > 0 && Game.frenzyPower === 7,
			clickFrenzy: Game.clickFrenzy > 0,
			elderFrenzy: Game.frenzy > 0 && Game.frenzyPower === 666,
			clot:        Game.frenzy > 0 && Game.frenzyPower === 0.5,
			pledge:      Game.pledgeT > 0
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
				setTimeout(function() {gcAlert.load();}, 1500);
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
	}

	if(time) {
		CM.popWrinklerTimer = setTimeout(function popWrinklers() {
			var reward = CM.getWrinklerStats()[1];
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
		gcI     = (Game.goldenCookie.life > 0) ? 'G' : gcTime,
		spI     = (Game.seasonPopup.life > 0) ? 'R' : spTime,
		cookies = Beautify(Game.cookies);

	document.title = gcI + ' | ' + spI + ' - ' + cookies + ' cookies';

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
		frenzy      = Game.frenzy > 0 && Game.frenzyPower > 1;

	if(when === 'allFrenzies') {

		if(frenzy || clickFrenzy) {
			this.startAutoClicker();
		} else {
			this.clearAutoClicker();
		}

	} else if(when === 'clickFrenzies') {

		if(clickFrenzy) {
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
	CM.popup('Logging data!', 'info');

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

		this.popup('Stopped logging data!', 'info');
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

	this.popup('Log cleared!', 'info');

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
	if (settings.colorBlind.current === 'on') {
		config.ccBody.addClass('cmCB');
	} else {
		config.ccBody.removeClass('cmCB');
	}

	// True Neverclick
	this.setTrueNeverclick();

	// Refresh the game panels
	Game.RebuildStore();
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
		this.popup('Settings saved successfully!', 'info');
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
		$cmSettingsTables = $('#CMSettingsTables');

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

	// Click handler to dismiss the message gracefully
	$dismiss.click(function() {
		$(this).parent().fadeTo(200, 0, function() {
			$(this).slideUp(200, function() {
				$(this).remove();
			});
		});
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
	var identifier = object.identifier();

	object.desc += '' +
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
		'</div>';

	// Update store
	Game.RebuildUpgrades();
};

/**
 * Update a Building/Upgrade tooltip
 *
 * @param {Object} object
 * @param {Array}  colors
 *
 * @return {void}
 */
CM.updateTooltip = function(object, colors) {

	var informations = [object.getWorth(true), object.getBaseCostPerIncome(), object.getTimeLeft()],
	deficits     = CME.getLuckyAlerts(object),
	identifier   = '#' + object.identifier(),
	$object      = $(identifier);

	// Create tooltip if it doesn't exist
	if (!object.matches(object.identifier())) {
		this.makeTooltip(object);
	}

	// Cancel if we're not in this particular tooltip at the moment
	if ($object.length !== 1 || $object.css('display') === 'none') {
		return;
	}

	// Update informations
	$object
	.attr('class', 'cm-tooltip__contents border-'+colors[0])
	.html(
		'<table class="cmTable">' +
			'<tr>' +
				'<td>Bonus Income:</td>' +
				'<td class="cmValue">' + Beautify(informations[0], 1) + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>BCI:</td>' +
				'<td class="cmValue text-' +colors[0] + '">' + Beautify(informations[1], 1) + '</td>' +
			'</tr>' +
			'<tr>' +
				'<td>Time Left:</td>' +
				'<td class="cmValue text-' + colors[1] + '">' + CM.formatTime(informations[2], true) + '</td>' +
			'</tr>' +
		'</table>'
	);

	$(identifier+'warning_amount').html(Beautify(deficits[0]) + ' (' +CME.getTimeToCookies(deficits[0]) + ')');
	$(identifier+'caution_amount').html(Beautify(deficits[1]) + ' (' +CME.getTimeToCookies(deficits[1]) + ')');

	$(identifier+'note_div_warning').toggle(deficits[0] > 0);
	$(identifier+'note_div_caution').toggle(deficits[1] > 0);

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
	Game.RebuildStore();
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

	// Buildings
	if (which === 'all' || which === 'objects') {
		Game.ObjectsById.forEach(function (building) {
			CM.manageBuildingTooltip(building);
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

	var colors   = upgrade.getColors();

	// Cancel if the upgrade isn't in the store
	if (!CME.isInStore(upgrade)) {
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
CM.manageBuildingTooltip = function(building) {
	var colors = building.getColors(),
		//color = this.config.settings.efficiencyCalc.current === 'roi' ? colors[2] : colors[0];
		color = colors[0];

	// Colorize building price
	$('.price', '#product' + building.id).attr('class', 'price text-' + color);

	return this.updateTooltip(building, colors);
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
				'<em>Chrome extension users:</em> Click "Update Extensions Now" from the Extensions menu and refresh.<br />' +
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
	FOLLOWING CODE MODIFIES GAME STATE
	WE MUST ENSURE GAME IS READY BEFORE EXECUTING
================================================ */

var gameReadyStateCheckInterval = setInterval(function() {

	if (Game.ready) {

		clearInterval(gameReadyStateCheckInterval);

		/* ================================================
			COOKIE CLICKER FUNCTION OVERRIDES
		================================================ */

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

		Game.Upgrade.prototype.getBaseCostPerIncome = CMEO.getBaseCostPerIncome;
		Game.Upgrade.prototype.getColors            = CMEO.getColors;
		Game.Upgrade.prototype.getComparativeInfos  = CMEO.getComparativeInfos;
		Game.Upgrade.prototype.getDescribedInteger  = CMEO.getDescribedInteger;
		Game.Upgrade.prototype.getReturnInvestment  = CMEO.getReturnInvestment;
		Game.Upgrade.prototype.getTimeLeft          = CMEO.getTimeLeft;
		Game.Upgrade.prototype.getType              = CMEO.getTypeOf;
		Game.Upgrade.prototype.getWorth             = CMEO.getWorthOf;
		Game.Upgrade.prototype.identifier           = CMEO.identifier;
		Game.Upgrade.prototype.matches              = CMEO.matches;

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
			'if (Game.T%(Game.fps*2)==0) document.title=Beautify(Game.cookies)+\' \'+(Game.cookies==1?\'cookie\':\'cookies\')+\' - Cookie Clicker\';': '',
		});

		/**
		 * Pause the auto-clicker during reset to prevent cookies
		 * being given to a reset game
		 */
		CM.replaceNative('Reset', {
			'if (bypass': 'CM.clearAutoClicker();if (bypass',
			'Game.Popup(\'Game reset\');': 'if(CM.config.settings.autoClick.current === \'on\') {setTimeout(function(){CM.startAutoClicker();}, 1000);}Game.Popup(\'Game reset\');'
		}, 'bypass');

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

}, 10);