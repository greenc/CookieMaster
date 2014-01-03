/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.4.2
    Date:         23/12/2013
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

	version:              '1.4.2',
	cmGCAudioAlertURL:    'http://www.freesound.org/data/previews/103/103236_829608-lq.mp3',
	cmSPAudioAlertURL:    'http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3',
	cmGCAudioObject:      null,
	cmSPAudioObject:      null,
	cmAudioGCNotified:    false,
	cmAudioSPNotified:    false,
	cmVisualGCNotified:   false,
	cmVisualSPNotified:   false,
	cmRefreshRate:        1000,
	cmFastRefreshRate:    200,
	ccURL:                'http://dev:8080/cookieclicker/',
	ccCompatibleVersions: ['1.0402', '1.0403'],

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
	cmTimerPanel:    null, // Set when panel is created
	cmSettingsPanel: null, // Set when panel is created
	cmStatsPanel:    null, // Set when panel is created
	cmStatsTable:    null, // Set when panel is created
	cmOverlay:       null, // Set when overlay is created
	cmGCOverlay:     null, // Set when GC overlay is created

	///////////////////////////////////////////////
	// Settings panel settings
	///////////////////////////////////////////////

	settings: {
		cleanUI: {
			type:    'checkbox',
			label:   'Clean Interface:',
			desc:    'Hide the top bar, and make other small graphical enhancements to the game interface.',
			current: 'on'
		},
		showTimers: {
			type:    'checkbox',
			label:   'Show Timers:',
			desc:    'Display countdown timers for game events and buffs.',
			current: 'on'
		},
		timerBarPosition: {
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
		audioAlerts: {
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
		visualAlerts: {
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
		numFormat: {
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
			type:    'checkbox',
			label:   'Shorten Numbers:',
			desc:    'Shorten large numbers with suffixes.',
			current: 'on'
		},
		suffixFormat: {
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
					label: 'Standard',
					value: 'standard'
				}
			],
			current: 'math'
		},
		precision: {
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
		changeFont: {
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
			type:    'checkbox',
			label:   'High Visibility Cookies:',
			desc:    'Increase the contrast between Golden Cookies and the background.',
			current: 'off'
		},
		increaseClickArea: {
			type:    'checkbox',
			label:   'Increase Cookie Hitbox:',
			desc:    'Make the clickable area larger for Golden Cookies. Helps accuracy during chains. Requires "Show Timers" to be on.',
			current: 'off'
		},
		autoClick: {
			type:    'checkbox',
			label:   'Auto-click Big Cookie:',
			desc:    'Automatically click the big cookie.',
			current: 'off'
		},
		autoClickSpeed: {
			type:  'range',
			label: 'Auto-click Speed:',
			desc:  'How many times per second to auto-click the big cookie.',
			options: {
				min: 1,
				max: 250,
				step: 1
			},
			current: 10
		}
	},

};

/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should be called from here in the order needed.
 */
CM.init = function() {

	var self = this,
		refreshRate = this.config.cmRefreshRate,
		fastRefreshRate = this.config.cmFastRefreshRate;

	// Cache the audio alert sound files
	this.config.cmGCAudioObject = new Audio(this.config.cmGCAudioAlertURL);
	this.config.cmSPAudioObject = new Audio(this.config.cmSPAudioAlertURL);

	// Ensure CM can run correctly
	if(this.integrityCheck()) {

		this.loadUserSettings();
		this.attachSettingsPanel();
		this.attachStatsPanel();
		this.AddPopWrinklersButton();
		this.setEvents();

		// This also attaches anything else we need
		this.applyUserSettings();

		// Start the main loop
		setInterval(function() {self.mainLoop();}, refreshRate);

		// Title updates and audio alerts get their own loop which updates faster
		setInterval(function() {

			self.updateTitleTicker();

			if(self.config.settings.audioAlerts.current !== 'off') {
				self.playAudioAlerts();
			}

		}, fastRefreshRate);


		// All done :)
		this.popup('CookieMaster v.' + this.config.version + ' loaded successfully!');

	} else {

		this.suicide();
		return false;

	}

};

/**
 * Returns true if CM can run correctly
 * Also, sets warning and error messages if appropriate
 *
 * @return {Boolean}
 */
CM.integrityCheck = function() {

	var ccVers = Game.version.toString(),
		message = false,
		error = false,
		i;

	if(document.location.href.indexOf(this.config.ccURL) === -1) {
		// Wrong URL
		this.alertMessage('Error: This isn\'t the Cookie Clicker URL!');
		error = true;
	} else if(!window.jQuery) {
		// jQuery isn't loaded
		this.alertMessage('Error: jQuery is not loaded!');
		error = true;
	} else if(!Game) {
		// Game class doesn't exist
		this.alertMessage('Error: Cookie Clicker does not appear to be initialized!');
		error = true;
	}

	// Warn user if this version of Cookie Clicker has not been tested with CookieMaster
	if(this.compatibilityCheck(ccVers) === -1) {
		this.alertMessage('Warning: CookieMaster has not been tested on this version of Cookie Clicker. Continue at your own peril!');
	}

	// Warn about Golden Cookie and Season Popup bug
	if(Game.seasonPopup.maxTime === 0 || Game.goldenCookie.maxTime === 0) {
		this.alertMessage("Warning: New or unsaved game detected.\n\nGolden cookies and reindeer will not spawn until you manually save and refresh Cookie Clicker.\n\nThis is a bug in the game, not CookieMaster ;)");
	}

	return error ? false : true;
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
		decimal = decSep === '.' ? '.' : ',',
		comma = decSep === '.' ? ',' : '.',
		floats = precision || 0,
		parts,
		i,
		ranges = [
			{divider: 1e24, suffix: {math: 'Sp', si: 'Y', standard: 'septillion'}},
			{divider: 1e21, suffix: {math: 'Sx', si: 'Z', standard: 'sextillion'}},
			{divider: 1e18, suffix: {math: 'Qi', si: 'E', standard: 'quintillion'}},
			{divider: 1e15, suffix: {math: 'Qa', si: 'P', standard: 'quadrillion'}},
			{divider: 1e12, suffix: {math: 'T',  si: 'T', standard: 'trillion'}},
			{divider: 1e9,  suffix: {math: 'B',  si: 'G', standard: 'billion'}},
			{divider: 1e6,  suffix: {math: 'M',  si: 'M', standard: 'million'}}
		];

	if(num === Number.POSITIVE_INFINITY || num === Number.NEGATIVE_INFINITY) {
		return 'Infinity';
	}

	if(useShortNums) {
		for(i = 0; i < ranges.length; i++) {
			if(num >= ranges[i].divider) {
				num = Math.floor((num / ranges[i].divider) * Math.pow(10, largeFloats)) / Math.pow(10, largeFloats) + ' ' + ranges[i].suffix[notation];
				return num.replace('.', decimal);
			}
		}
	}

	// Apply rounding
	num = Math.round(num * Math.pow(10, floats)) / Math.pow(10, floats);

	// Localize
	parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, comma);

	return parts.join(decimal);

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

		var timings = {},
			lucky = Game.Has("Get lucky");

		if(this.type === 'reindeer') {
			timings.min = Game.seasonPopup.minTime / Game.fps;
			timings.minCurrent = (Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps;
			timings.max = Game.seasonPopup.maxTime / Game.fps;
		} else if(this.type === 'goldenCookie') {
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
 * Returns array of stats for Heavenly Chips
 *
 * @return {Array} [currentHC, currentPercent, maxHC, maxPercent, cookiesToNextHC, timeToNextHC]
 */
CM.getHCStats = function() {

	function cookiesToHC(cookies) {
		return Math.floor(Math.sqrt(2.5 * Math.pow(10, 11) + 2 * cookies) / Math.pow(10, 6) - 0.5);
	}

	function hcToCookies(hc) {
		return 5 * Math.pow(10, 11) * hc * (hc + 1);
	}

	var stats          = [],
		current        = Game.prestige['Heavenly chips'],
		currentPercent = current * 2,
		max            = cookiesToHC(Game.cookiesReset + Game.cookiesEarned),
		maxPercent     = max * 2,
		cookiesToNext  = hcToCookies(max + 1) - (Game.cookiesReset + Game.cookiesEarned),
		timeToNext     = Math.round(cookiesToNext / Game.cookiesPs),
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
 * Returns maximum potential  Cookie Chain reward
 *
 * @return {Integer}
 */
CM.maxChainReward = function() {

	var bankLimit       = Game.cookies / 4,
		cpsLimit        = Game.cookiesPs * 60 * 60 * 6,
		wrath           = Game.elderWrath === 3 ? true : false,
		chainValue      = wrath ? 77777 : 66666; // Minimum guaranteed chain amount

	// Chains not possible until player has earned 100000+ cookies total
	if(Game.cookiesEarned < 100000) {
		return false;
	}

	while(chainValue < bankLimit && chainValue <= cpsLimit) {
		chainValue += wrath ? '7' : '6';
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
		digitString   = wrath ? '7' : '6',
		minChain      = wrath ? 77777 : 66666,
		minNextChain  = wrath ? 777777 : 666666,
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

	var stats = [],
		sucked = 0,
		rewardMultiplier = 1.1;

	$.each(Game.wrinklers, function() {
		sucked += this.sucked;
	});

	stats[0] = Beautify(sucked);
	stats[1] = Beautify(sucked * rewardMultiplier);

	return stats;

};

/**
 * Format a time in seconds to a more friendly format
 *
 * @param {Integer} time
 * @param {String}  compressed  Compressed output (minutes => m, etc.)
 * @return {String}
 */
// TO DO: Make this not suck
CM.formatTime = function(time) {

	var units     = [' day, ', ' hour, ', ' minute, ', ' second'],
		days      = parseInt(time / 86400) % 999,
		hours     = parseInt(time / 3600) % 24,
		minutes   = parseInt(time / 60) % 60,
		seconds   = time % 60,
		formatted = '';

	// Take care of special cases
	if(time === Infinity) {
		return 'Never';
	} else if(time === 0) {
		return 'Done!';
	} else if(time / 86400 > 1e3) {
		return '> 1,000 days';
	}


	// Pluralize units if necessary
	if(days > 1) {
		units[0] = ' days, ';
	}
	if(hours > 1) {
		units[1] = ' hours, ';
	}
	if(minutes > 1) {
		units[2] = ' minutes, ';
	}
	if(seconds > 1) {
		units[3] = ' seconds';
	}

	// Create final string
	if(seconds) {
		formatted = seconds + units[3];
	}
	if(minutes) {
		formatted = minutes + units[2] + formatted;
	}
	if(hours) {
		formatted = hours + units[1] + formatted;
	}
	if(days) {
		formatted = days + units[0] + formatted;
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
 * @param  {String}   message
 * @return {Function}
 */
CM.popup = function(message) {

	return Game.Popup('<span class="cmPopupText">' + message + '</span>');

};


/* ================================================
	NON-RETURNING METHODS

	These methods mostly update the DOM and don't
	actually return anything.
	Separating them out helps keep the init
	method nice and tidy :)
================================================ */

CM.mainLoop = function() {

	var settings = this.config.settings;

	// Update timers if active and attached
	if(settings.showTimers.current === 'on' && $('#CMTimerPanel').length) {
		this.updateTimers();
	}

	// Show visual alerts if active
	if(settings.visualAlerts.current !== 'off') {
		this.showVisualAlerts();
	}

	if(this.config.cmStatsPanel.is(':visible')) {
		this.updateStats();
	}

};

/**
 * Build and attach the settings panel to the DOM
 */
CM.attachSettingsPanel = function() {

	var self     = this,
		items    = [],
		options  = [],
		control  = [],
		current  = '',
		selected = '',
		html     = '',
		settings = this.config.settings,

		$ccSectionMiddle  = this.config.ccSectionMiddle,
		$ccComments       = this.config.ccComments,
		$cmSettingsPanel  = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsButton = $('<div />').attr({'id': 'CMSettingsPanelButton', 'class': 'button'}).text('Settings'),
		$cmSettingsTitle   = $('<h3 />').attr('class', 'title').html('CookieMaster Settings<span class="cmTitleSub">v.' + this.config.version + '</span>'),
		$cmSettingsTable   = $('<table />').attr({'id': 'CMSettingsTable', 'class': 'cmTable'}),
		$cmSettingsSave   = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button', 'class': 'cmFont'}).text('Apply Settings'),
		$cmSettingsPause  = $('<button />').attr({'id': 'CMSettingsPause', 'type': 'button', 'class': 'cmFont'}).text('Pause Game');

	// Build each setting item
	$.each(settings, function(key, value) {

		// Reset these for each loop
		options = [];
		current = this.current;

		if(this.type === 'select') { // Build a select box

			$.each(this.options, function() {

				selected = (current === this.value.toString()) ? ' selected="selected"' : '';
				options.push('<option value="' + this.value + '"' + selected + '>' + this.label + '</option>');

			});

			control =  '<select id="CMSetting-' + key + '">';
			control += options.join('');
			control += '</select>';

			// Add event handler for change event
			$cmSettingsTable.on('change', '.setting-' + key + ' select', function() {
				settings[key].current = $(this).find(":selected").val();
			});

		} else if(this.type === 'checkbox') { // Build a checkbox

			selected = (current === 'on') ? ' checked="checked"' : '';
			control  = '<input type="checkbox" id="CMSetting-' + key + '"' + selected + ' />';

			// Add event handler for change event
			$cmSettingsTable.on('change', '.setting-' + key + ' input', function() {
				settings[key].current = $(this).prop('checked') ? 'on' : 'off';
			});

		} else if(this.type === 'range') { // Build a range slider

			control  = '<span class="currentValue">' + this.current + '</span>';
			control += '<input type="range" value="'+ this.current + '" min="' + this.options.min + '" max="' + this.options.max + '" step="' + this.options.step + '" id="CMSetting-' + key + '" />';

			// Add event handler for change event
			$cmSettingsTable.on('change', '.setting-' + key + ' input', function() {
				$(this).siblings('.currentValue').text($(this).val());
				settings[key].current = $(this).val();
			});

		}

		// Build the table row
		html =  '<tr class="setting setting-' + key + '">';
		html +=     '<td>';
		html +=         '<label for="CMSetting-' + key + '">' + this.label + '</label>';
		html +=         '<small>' + this.desc + '</small>';
		html +=          '</td>';
		html +=     '<td class="cmValue">' + control + '</td>';
		html += '</tr>';

		items.push(html);

	});

	// Glue it together
	$cmSettingsTable.append(items.join(''));
	$cmSettingsPanel.append(
		$cmSettingsTitle,
		$cmSettingsTable,
		$cmSettingsSave,
		$cmSettingsPause
	);

	// Attach to DOM
	$ccSectionMiddle.append($cmSettingsPanel);
	$ccComments.prepend($cmSettingsButton);

	// Cache the selector
	this.config.cmSettingsPanel = $cmSettingsPanel;

	// Set event handlers
	$cmSettingsSave.click(function() {
		self.saveUserSettings();
		self.applyUserSettings();
	});
	$cmSettingsPause.click(function() {
		alert('Game paused. Click OK to resume.');
	});

};

CM.attachStatsPanel = function() {

	var $ccSectionMiddle   = this.config.ccSectionMiddle,
		$ccComments        = this.config.ccComments,
		$cmStatsPanel      = $('<div />').attr('id', 'CMStatsPanel'),
		$cmStatsTitle      = $('<h3 />').attr('class', 'title').attr('class', 'title').html('CookieMaster Statistics<span class="cmTitleSub">v.' + this.config.version + '</span>'),
		$cmStatsButton     = $('<div />').attr({'id': 'CMStatsPanelButton', 'class': 'button'}).text('Stats +'),
		$cmTable           = {},
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


	$cmStatsPanel.append($cmStatsTitle, $cmTable);

	// Attach to DOM
	$ccSectionMiddle.append($cmStatsPanel);
	$ccComments.prepend($cmStatsButton);

	// Cache selectors
	this.config.cmStatsPanel = $cmStatsPanel;
	this.config.cmStatsTable = $cmTable;

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
		lfbText           = Game.cookies >= this.luckyFrenzyBank() ? '<span class="cmHighlight">' + Beautify(this.luckyFrenzyBank()) + '</span>' : Beautify(this.luckyFrenzyBank()),
		chainReward       = this.maxChainReward(),
		chainRewardString = chainReward ? Beautify(chainReward) : 'Earn ' + Beautify(100000 - Math.round(Game.cookiesEarned)) + ' more cookies for cookie chains',
		nextChainBank     = this.requiredNextChainTier('bank', chainReward),
		nextChainCPS      = this.requiredNextChainTier('cps', chainReward),
		nextChainBankString,
		nextChainCPSString;

	if(nextChainBank !== false) {
		if(Game.cookies > nextChainBank) {
			nextChainBankString = '<span class="cmHighlight">' + Beautify(nextChainBank) + '</span>';
		} else {
			nextChainBankString = Beautify(nextChainBank);
		}
	}

	if(nextChainCPS !== false) {
		if(Game.cookiesPs > nextChainCPS) {
			nextChainCPSString = '<span class="cmHighlight">' + Beautify(nextChainCPS) + '</span>';
		} else {
			nextChainCPSString = Beautify(nextChainCPS);
		}
	}

	// Golden Cookie stats
	$('#CMStatsLuckyRequired').html(lbText);
	$('#CMStatsLuckyFrenzyRequired').html(lfbText);
	$('#CMStatsLuckyReward').html(Beautify(this.luckyReward()) + ' (max: ' + Beautify(this.maxLuckyReward()) + ')');
	$('#CMStatsLuckyFrenzyReward').html(Beautify(this.luckyFrenzyReward()) + ' (max: ' + Beautify(this.maxLuckyFrenzyReward()) + ')');
	$('#CMStatsMaxChainReward').html(chainRewardString);
	$('#CMStatsBankRequiredNextChainTier').html(nextChainBankString || '-');
	$('#CMStatsCPSRequiredNextChainTier').html(nextChainCPSString || '-');
	$('#CMStatsLastGC').html(lastGC);
	$('#CMStatsMissedGC').html(Beautify(Game.missedGoldenClicks));

	// Heavenly Chip stats
	$('#CMStatsHCCurrent').html(hcStats[0] + ' (' + hcStats[1] + ')');
	$('#CMStatsHCMax').html(hcStats[2] + ' (' + hcStats[3] + ')');
	$('#CMStatsHCCookiesToNext').html(hcStats[4]);
	$('#CMStatsHCTimeToNext').html(hcStats[5]);

	// Wrinkler stats
	$('#CMStatsWrinklersSucked').html(wrinklerStats[0]);
	$('#CMStatsWrinklersReward').html(wrinklerStats[1]);

	// Misc. stats
	$('#CMStatsBaseCPS').html(Beautify(this.baseCps()));
	$('#CMStatsFrenzyCPS').html(Beautify(this.baseCps() * 7));
	$('#CMStatsElderFrenzyCPS').html(Beautify(this.baseCps() * 666));
	$('#CMStatsBaseCPC').html(Beautify(this.baseCpc()));
	$('#CMStatsFrenzyCPC').html(Beautify(this.baseCpc() * 7));
	$('#CMStatsClickFrenzyCPC').html(Beautify(this.baseCpc() * 777));
	$('#CMStatsFrenzyClickFrenzyCPC').html(Beautify(this.baseCpc() * 777 * 7));

};

/**
 * Attach and populate the timer panel for showing game event timers
 */
CM.attachTimerPanel = function() {

	var $cmTimerPanel = $('<div />').attr({'id': 'CMTimerPanel', 'class': 'cmFont'}),
		$sectionLeft  = this.config.ccSectionLeft,
		timerRes      = this.config.cmTimerResolution;

	// Only attach it if it's not already in DOM
	if($('#CMTimerPanel').length === 0) {

		// Initialize timer objects
		// TO DO: Condense frenzy, elderFrenzy and clot into single timer instance
		//  since they are basically the same thing, and cannot stack together
		this.gcTimer          = new CM.Timer('goldenCookie', 'Next Cookie:');
		this.reindeerTimer    = new CM.Timer('reindeer',     'Next Reindeer:');
		this.frenzyTimer      = new CM.Timer('frenzy',       'Frenzy:');
		this.clickFrenzyTimer = new CM.Timer('clickFrenzy',  'Click Frenzy:');
		this.elderFrenzyTimer = new CM.Timer('elderFrenzy',  'Elder Frenzy:');
		this.clotTimer        = new CM.Timer('clot',         'Clot:');

		// Create the HTML and attach everyting to DOM
		$cmTimerPanel.append(
			this.gcTimer.create(),
			this.reindeerTimer.create(),
			this.frenzyTimer.create(),
			this.elderFrenzyTimer.create(),
			this.clotTimer.create(),
			this.clickFrenzyTimer.create()
		);
		$sectionLeft.append($cmTimerPanel);

		// Save selector to config for later use
		this.config.cmTimerPanel = $cmTimerPanel;

		// Attach golden cookie display timer
		this.displayGCTimer();

	}

};

/**
 * Destroy all timers and remove the timer panel
 */
CM.removeTimerPanel = function() {

	// Only remove it if it exists in DOM
	if($('#CMTimerPanel').length) {

		// Remove references to all timers
		this.gcTimer = null;
		this.reindeerTimer = null;
		this.frenzyTimer = null;
		this.clickFrenzyTimer = null;
		this.elderFrenzyTimer = null;
		this.clotTimer = null;

		// Remove golden cookie display timer
		this.config.cmGCOverlay.remove();

		// Remove the timer panel
		this.config.cmTimerPanel.remove();

	}

};

/**
 * Update all timers with new values
 */
// TO DO: DRY this up
CM.updateTimers = function() {

	// Golden cookie display timer
	this.displayGCTimer();

	// Golden Cookie timer
	if(Game.goldenCookie.life === 0) {
		this.gcTimer.update();
		this.gcTimer.show();
	} else {
		this.gcTimer.hide();
	}

	// Reindeer timer
	if(Game.seasonPopup.life === 0) {
		this.reindeerTimer.update();
		this.reindeerTimer.show();
	} else {
		this.reindeerTimer.hide();
	}

	// Frenzy timer
	if(Game.frenzy > 0 && Game.frenzyPower === 7) {
		this.frenzyTimer.update();
		this.frenzyTimer.show();
		this.elderFrenzyTimer.hide();
		this.clotTimer.hide();
	} else {
		this.frenzyTimer.hide();
	}

	// Click frenzy timer
	if(Game.clickFrenzy > 0) {
		this.clickFrenzyTimer.update();
		this.clickFrenzyTimer.show();
	} else {
		this.clickFrenzyTimer.hide();
	}

	// Elder frenzy timer
	if(Game.frenzy > 0 && Game.frenzyPower === 666) {
		this.elderFrenzyTimer.update();
		this.elderFrenzyTimer.show();
		this.frenzyTimer.hide();
		this.clotTimer.hide();
	} else {
		this.elderFrenzyTimer.hide();
	}

	// Clot timer
	if(Game.frenzy > 0 && Game.frenzyPower === 0.5) {
		this.clotTimer.update();
		this.clotTimer.show();
		this.frenzyTimer.hide();
		this.elderFrenzyTimer.hide();
	} else {
		this.clotTimer.hide();
	}

};

/**
 * Display a countdown on the golden cookie
 */
CM.displayGCTimer = function() {

	var $gc      = this.config.ccGoldenCookie,
		$overlay = this.config.cmGCOverlay || $('<div />').attr({'id': 'CMGCOverlay', 'class': 'cmFont'}),
		timeLeft = Math.round(Game.goldenCookie.life / Game.fps);

	// Reattach if it was removed at some point
	if($('#CMGCOverlay').length === 0) {
		this.config.ccBody.append($overlay);
		this.config.cmGCOverlay = $overlay;
	}

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
		setting    = this.config.settings.audioAlerts.current;

	// Play Golden cookie notification
	if(setting === 'gc' || setting === 'all') {

		if(Game.goldenCookie.life > 0) {

			if(!gcNotified) {
				gcAlert.volume = 0.5;
				gcAlert.play();
				this.config.cmAudioGCNotified = true;
			}

		} else {

			this.config.cmAudioGCNotified = false;

		}

	}

	// Play Reindeer notification
	if(setting === 'sp' || setting === 'all') {

		if(Game.seasonPopup.life > 0) {

			if(!spNotified) {

				spAlert.volume = 0.2;
				spAlert.play();
				this.config.cmAudioSPNotified = true;

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
		settings = this.config.settings;

	this.cleanUI(settings.cleanUI.current === 'on');
	this.changeFont(settings.changeFont.current);

	// Timers
	if(settings.showTimers.current === 'on') {
		this.attachTimerPanel();
	} else {
		this.removeTimerPanel();
	}
	if(settings.timerBarPosition.current === 'top') {
		config.ccBody.addClass('cmTimerTop');
	} else {
		config.ccBody.removeClass('cmTimerTop');
	}

	// Remove Visual alert overlay if not required
	// (It will automatically reattach itself when activated)
	if(settings.visualAlerts.current === 'off') {
		this.removeVisualAlerts();
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

	// Start/stop the auto-clicker
	if (settings.autoClick.current === 'on') {
		if(this.autoClicker) {
			clearInterval(this.autoClicker);
		}
		this.autoClicker = setInterval(
			function() {
				Game.ClickCookie();
			}, 1000 / CM.config.settings.autoClickSpeed.current
		);
	} else {
		if(this.autoClicker) {
			clearInterval(this.autoClicker);
		}
	}


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
	serializedSettings = $.param(settingsStates)
		.replace(/=/g, ':')  // Replace = with :
		.replace(/&/g, '|'); // Replace & with |

	// Create and set cookie, good for 5 years :)
	cookieDate.setFullYear(cookieDate.getFullYear() + 5);
	document.cookie = 'CMSettings=' + serializedSettings + ';expires=' + cookieDate.toGMTString( ) + ';';

	// Verify we saved it correctly
	if (document.cookie.indexOf('CMSettings') === -1) {
		this.popup('Error: Could not save settings!');
	} else {
		this.popup('Settings saved successfully!');
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
				settings[keyVals[0]].current = keyVals[1];
			}

		});

	}

};

/**
 * Set event handlers for non-setting specific actions
 * (Setting-specific actions should have their event handlers
 * set and destroyed in their respective creation/removal methods)
 */
CM.setEvents = function() {

	// TO DO: Cache selectors and clean this up
	var self           = this,
		$game          = this.config.ccGame,
		$statsPanel    = this.config.cmStatsPanel,
		$settingsPanel = this.config.cmSettingsPanel,
		$sectionLeft   = this.config.ccSectionLeft;

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

};

/**
 * Remove all traces of CookieMaster
 */
CM.suicide = function() {

	// TO DO: Implement this functionality
	alert('This kills the CookieMaster.');

};

/**
 * Alert user to messages (expand later)
 *
 * @param  {String} msg The message
 */
CM.alertMessage = function(msg) {

	alert(msg);

};

/* ================================================
	END NON-RETURNING METHODS
================================================ */

/* ================================================
	COOKIE CLICKER FUNCTION OVERRIDES
================================================ */

/**
 * Hijacks the original Beautify method to use
 * our own formatting function
 *
 * @param {Integer} what   Number to beautify
 * @param {Integer} floats Desired precision
 *
 * @return {String}    Formatted number
 */
function Beautify(what, floats) {

	var precision = floats || 0;

	return CM.largeNumFormat(what, precision);

}

/**
 * Remove the title tag update functionality from the main
 * game as we will use our own, faster update function
 */
Game.Logic = new Function(
	'',
	Game.Logic.toString()
	.replace('if (Game.T%(Game.fps*2)==0) document.title=Beautify(Game.cookies)+\' \'+(Game.cookies==1?\'cookie\':\'cookies\')+\' - Cookie Clicker\';', '')
	.replace(/^function[^{]+{/i, '')
	.replace(/}[^}]*$/i, '')
);

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
Audio = function(src) {
	if(src.indexOf('soundjay') !== -1) {
		Game.Popup('Sorry, no sounds hotlinked from soundjay.com.');
		this.play = function() {};
	} else {
		return new realAudio(src);
	}
};
/*jshint +W020 */

/* ================================================
	END COOKIE CLICKER FUNCTION OVERRIDES
================================================ */

// Start it up!
CM.init();