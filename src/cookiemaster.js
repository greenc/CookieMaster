/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.2.1
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
Audio = function(src) {
	if(src.indexOf('soundjay') !== -1) {
		Game.Popup('Sorry, no sounds hotlinked from soundjay.com.');
		this.play = function() {};
	}
	else return new realAudio(src);
};

/* ================================================
	END COOKIE CLICKER FUNCTION OVERRIDES
================================================ */

/**
 * We will expose all methods and properties of CookieMaster
 * through the parent object, for easy extendability
 */
CM = {};

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

	version:              '1.2.1',
	cmGCAudioAlert:       new Audio('http://www.freesound.org/data/previews/103/103236_829608-lq.mp3'),
	cmSPAudioAlert:       new Audio('http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3'),
	cmAudioGCNotified:    false,
	cmAudioSPNotified:    false,
	cmVisualGCNotified:   false,
	cmVisualSPNotified:   false,
	cmRefreshRate:        1000,
	cmFastRefreshRate:    200,
	ccURL:                'http://orteil.dashnet.org/cookieclicker/',
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
	ccGoldenCookie:  $('#goldenCookie'),
	ccSeasonPopup:   $('#seasonPopup'),
	cmTimerPanel:    null, // Set when panel is created
	cmStatsTable:    null, // Set when panel is created
	cmOverlay:       null, // Set when overlay is created
	cmGCOverlay:     null, // Set when GC overlay is created

	///////////////////////////////////////////////
	// Settings panel settings
	///////////////////////////////////////////////

	settings: {
		cleanUI: {
			label:   'Clean Interface',
			desc:    'Hide the top bar, and make other small graphical enhancements to the game interface',
			options: 'toggle',
			current: 'on'
		},
		showTimers: {
			label:   'Show Timers',
			desc:    'Display countdown timers for game events and buffs',
			options: 'toggle',
			current: 'on'
		},
		audioAlerts: {
			label:   'Audio Alerts',
			desc:    'Play an audio alert when Golden Cookies and Reindeer spawn',
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
			label:   'Visual Alerts',
			desc:    'Flash the screen when Golden Cookies and Reindeer spawn',
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
			label: 'Number Formatting',
			desc:  'Sets the desired decimal and thousands separator symbols for numbers',
			options: [
				{
					label: '1,234.56',
					value: 'us'
				},
				{
					label: '1.234,56',
					value: 'eu'
				}
			],
			current: 'us'
		},
		shortNums: {
			label:   'Short Numbers',
			desc:    'Shorten large numbers with suffixes',
			options: 'toggle',
			current: 'on'
		},
		suffixFormat: {
			label: 'Suffix Type',
			desc:  'Set the number suffixes to desired type',
			options: [
				{
					label: 'Mathematical',
					value: 'math'
				},
				{
					label: 'SI',
					value: 'si'
				},
				{
					label: 'Standard',
					value: 'standard'
				}
			],
			current: 'math'
		},
		changeFont: {
			label: 'Font',
			desc:  'Set the highlight font',
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

	// Ensure CM can run correctly
	if(this.integrityCheck()) {

		this.loadUserSettings();
		this.attachSettingsPanel();
		this.attachStatsPanel();

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
		Game.Popup('CookieMaster v.' + this.config.version + ' loaded successfully!');

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
		message = 'Error: This isn\'t the Cookie Clicker URL!';
		error = true;
	} else if(!window.jQuery) {
		// jQuery isn't loaded
		message = 'Error: jQuery is not loaded!';
		error = true;
	} else if(!Game) {
		// Game class doesn't exist
		message = 'Error: Cookie Clicker does not appear to be initialized!';
		error = true;
	}

	// Warn user if this version of Cookie Clicker has not been tested with CookieMaster
	if(this.compatibilityCheck(ccVers) === -1) {
		message = 'Warning: CookieMaster has not been tested on this version of Cookie Clicker. Continue at your own peril!';
	}

	// Warn about Golden Cookie and Season Popup bug
	if(Game.seasonPopup.maxTime === 0 || Game.goldenCookie.maxTime === 0) {
		message = "Warning: New or unsaved game detected.\n\nGolden cookies and reindeer will not spawn until you manually save and refresh Cookie Clicker.\n\nThis is a bug in the game, not CookieMaster ;)";
	}

	if(message) { this.alertMessage(message); }

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
		notation = this.config.settings.suffixFormat.current,
		decSep = this.config.settings.numFormat.current === 'us' ? '.' : ',',
		decimal = decSep === '.' ? '.' : ',',
		comma = decSep === '.' ? ',' : '.',
		floats = precision || 0,
		parts,
		ranges = [
			{divider: 1e24, suffix: {math: 'Sp', si: 'Y', standard: 'septillion'}},
			{divider: 1e21, suffix: {math: 'Sx', si: 'Z', standard: 'sextillion'}},
			{divider: 1e18, suffix: {math: 'Qi', si: 'E', standard: 'quintillion'}},
			{divider: 1e15, suffix: {math: 'Qa', si: 'P', standard: 'quadrillion'}},
			{divider: 1e12, suffix: {math: 'T',  si: 'T', standard: 'trillion'}},
			{divider: 1e9,  suffix: {math: 'B',  si: 'G', standard: 'billion'}},
			{divider: 1e6,  suffix: {math: 'M',  si: 'M', standard: 'million'}}
		];

	if(num == Number.POSITIVE_INFINITY || num == Number.NEGATIVE_INFINITY) {
		return 'Infinity';
	}

	if(useShortNums) {
		for(var i = 0; i < ranges.length; i++) {
			if(num >= ranges[i].divider) {
				num = Math.floor((num / ranges[i].divider) * 1000) / 1000 + ' ' + ranges[i].suffix[notation];
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

	this.type = type;
	this.label = label;
	this.id = 'CMTimer-' + this.type;
	this.container = {};
	this.barOuter = {};
	this.barInner = {};
	this.limiter = {};
	this.counter = {};

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
			$limiter   = {}, // Not always needed, so we create it further down
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
		this.limiter   = $limiter;
		this.counter   = $counter;

		return $container;

	};

	/**
	 * Updates timing values of the timer
	 *
	 * @return {Object} this
	 */
	this.update = function() {

		var timings = this.getTimings(),
			width = timings.minCurrent / timings.max * 100,
			hardMin;

		if(timings.hasOwnProperty('min') && timings.min > 0) {

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

	var stats          = [],
		current        = Game.prestige['Heavenly chips'],
		currentPercent = current * 2,
		max            = cookiesToHC(Game.cookiesReset + Game.cookiesEarned),
		maxPercent     = max * 2,
		cookiesToNext  = hcToCookies(max + 1) - (Game.cookiesReset + Game.cookiesEarned),
		timeToNext     = Math.round(cookiesToNext / Game.cookiesPs),
		i;

	function cookiesToHC(cookies) {
		return Math.floor(Math.sqrt(2.5 * Math.pow(10, 11) + 2 * cookies) / Math.pow(10, 6) - 0.5);
	}

	function hcToCookies(hc) {
		return 5 * Math.pow(10, 11) * hc * (hc + 1);
	}

	stats = [
		Beautify(current),
		Beautify(currentPercent) + '%',
		Beautify(max),
		Beautify(maxPercent) + '%',
		Beautify(cookiesToNext),
		this.secondsToTime(timeToNext)
	];

	return stats;

};

/**
 * Returns array of stats for "Lucky" rewards
 *
 * @return {Array} [
 *             requiredLucky,
 *             requiredFrenzyLucky,
 *             maxRewardLucky,
 *             maxRewardFrenzyLucky,
 *             currentRewardFrenzyLucky
 *         ]
 */
// TO DO: Clean this up
CM.getLuckyStats = function() {

	var stats = [],
		i;

	function lucky(type) {

		var required,
			cps = Game.cookiesPs;

		if(Game.frenzy > 0) {
			cps = cps / Game.frenzyPower;
		}

		if(type === 'luckyFrenzy') {
			cps = cps * 7;
		}

		required = Math.round((cps * 1200 + 13) / 0.1);

		return (required <= Game.cookies) ? '<span class="cmHighlight">' + Beautify(required) + '</span>' : Beautify(required);

	}

	function luckyReward(type) {

		var cps = Game.cookiesPs;

		if(Game.frenzy > 0 && type != 'cur') {
			cps = cps / Game.frenzyPower;
		}

		if(type == 'maxFrenzy') {
			cps = cps * 7;
		}

		var n = [
			Math.round(cps * 1200 + 13),
			Math.round(Game.cookies * 0.1 + 13)
		];

		if(type == 'max' || type == 'maxFrenzy') {

			if(Math.round((cps * 1200 + 13) / 0.1) > Game.cookies) {
				return Beautify(n[0]);
			}

		}

		return Beautify(Math.min.apply(Math, n));

	}

	stats[0] = lucky('lucky');
	stats[1] = lucky('luckyFrenzy');
	stats[2] = luckyReward('max');
	stats[3] = luckyReward('maxFrenzy');
	stats[4] = luckyReward('cur');

	return stats;

};

/**
 * Returns array of Wrinkler stats
 *
 * @return {Array} [cookiesSucked, toralReward]
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
 * Converts seconds to a more readable format
 *
 * @param  {Integer} seconds Number to convert
 * @return {String}          Formatted time
 */
// TO DO Make this smarter, add days and years
CM.secondsToTime = function(s) {

	var time = '', m, h, d;

	// Nobody needs to wait more than a year
	// for anything in Cookie Clicker!
	if(s >= 3.15569e7) {
		return '> 1 year';
	}

	d  = Math.floor(s / (60 * 60 * 24));
	s -= d * (60 * 60 * 24);
	h  = Math.floor(s / (60 * 60));
	s -= h * (60 * 60);
	m  = Math.floor(s / 60);
	s -= m * 60;

	time += d > 0 ? d + ' days, '    : '';
	time += h > 0 ? h + ' hours, '   : '';
	time += m > 0 ? m + ' minutes, ' : '';
	time += s > 0 ? s + ' seconds'   : '';

	return time;

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

	this.updateStats();

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

		$wrapper          = this.config.ccWrapper,
		$cmSettingsPanel  = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsHandle = $('<div />').attr('id', 'CMSettingsPanelHandle').text('CookieMaster Settings'),
		$cmSettingsList   = $('<ul />').attr('id', 'CMSettingsList'),
		$cmSettingsSave   = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button'}).text('Apply Settings'),
		$cmSettingsPause  = $('<button />').attr({'id': 'CMSettingsPause', 'type': 'button'}).text('Pause Game');

	// Build each setting item
	$.each(settings, function(key, value) {

		// Reset these for each loop
		options = [];
		current = this.current;

		if(typeof this.options === 'object') {

			// Build a select box if a setting has multiple options
			$.each(this.options, function() {

				selected = (current === this.value.toString()) ? ' selected="selected"' : '';
				options.push('<option value="' + this.value + '"' + selected + '>' + this.label + '</option>');

			});

			control =  '<select id="CMSetting-' + key + '">';
			control += options.join('');
			control += '</select>';

			// Add event handler for change event
			$cmSettingsList.on('change', '.setting-' + key + ' select', function() {
				settings[key].current = $(this).find(":selected").val();
			});

		} else if(this.options === 'toggle') {

			// Build a checkbox if it's a simple toggle
			selected = (current === 'on') ? ' checked="checked"' : '';
			control  = '<input type="checkbox" id="CMSetting-' + key + '"' + selected + ' />';

			// Add event handler for change event
			$cmSettingsList.on('change', '.setting-' + key + ' input', function() {
				settings[key].current = $(this).prop('checked') ? 'on' : 'off';
			});

		}

		// Build the list of items
		html =  '<li class="cf setting setting-' + key + '" title="' + this.desc + '"">';
		html +=     '<label for="CMSetting-' + key + '">'  + this.label + control + '</label>';
		html += '</li>';

		items.push(html);

	});

	// Glue it together
	$cmSettingsList.append(items.join(''));
	$cmSettingsPanel.append(
		$cmSettingsHandle,
		$cmSettingsList,
		$cmSettingsSave,
		$cmSettingsPause
	);

	// Attach to DOM
	$wrapper.append($cmSettingsPanel);

	// Set event handlers
	$cmSettingsHandle.click(function() {
		if($(this).hasClass('cmOpen')) {
			$cmSettingsPanel.animate({
				'margin-bottom': '-' + $cmSettingsPanel.outerHeight() + 'px'
			}, 300, function() {
				$cmSettingsHandle.removeClass('cmOpen').text('CookieMaster Settings');
			});
		} else {
			$cmSettingsPanel.animate({'margin-bottom': '0'}, 300, function() {
				$cmSettingsHandle.addClass('cmOpen').text('Close Settings');
			});
		}
	});
	$cmSettingsSave.click(function() {
		self.saveUserSettings();
		self.applyUserSettings();
	});
	$cmSettingsPause.click(function() {
		alert('Game paused. Click OK to resume.');
	});

};

CM.attachStatsPanel = function() {

	var $wrapper           = this.config.ccWrapper,
		$cmStatsPanel      = $('<div />').attr('id', 'CMStatsPanel'),
		$cmStatsHandle     = $('<div />').attr('id', 'CMStatsPanelHandle').text('CookieMaster Stats'),
		$cmStatsPanelTable = {},
		tableHTML          = '';

	tableHTML += '<table id="CMStatsPanelTable">';
	tableHTML +=     '<tr class="cmStatsHeader cmStatsHeaderFirst">';
	tableHTML +=         '<th colspan="2">Lucky and Frenzy Rewards</th>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Max Lucky required:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsLuckyRequired"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Max Lucky + Frenzy required:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsLuckyFrenzyRequired"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Max Lucky reward:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsMaxLuckyReward"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Max Lucky + Frenzy reward:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsMaxLuckyFrenzyReward"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Current Lucky reward:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsCurrentLuckyReward"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr class="cmStatsHeader">';
	tableHTML +=         '<th colspan="2">Heavenly Chips</th>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Current Heavenly Chips:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsHCCurrent"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Heavenly Chips after reset:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsHCMax"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Cookies to next HC:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsHCCookiesToNext"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Time to next HC:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsHCTimeToNext"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr class="cmStatsHeader">';
	tableHTML +=         '<th colspan="2">Wrinklers<button id="CMPopWrinklers" type="button">Pop all Wrinklers</button></th>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Cookies sucked by Wrinklers:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsWrinklersSucked"></td>';
	tableHTML +=     '</tr>';
	tableHTML +=     '<tr>';
	tableHTML +=         '<td>Reward for popping Wrinklers:</td>';
	tableHTML +=         '<td class="cmStatsValue" id="CMStatsWrinklersReward"></td>';
	tableHTML +=     '</tr>';
	tableHTML += '</table>';

	$cmStatsPanelTable = $(tableHTML);


	$cmStatsPanel.append($cmStatsHandle, $cmStatsPanelTable);

	// Attach to DOM
	$wrapper.append($cmStatsPanel);

	// Save selectors to config for later use
	this.config.cmStatsPanel = $cmStatsPanel;
	this.config.cmStatsTable = $cmStatsPanelTable;

	// Set event handlers
	$('#CMPopWrinklers').click(function() {
		Game.CollectWrinklers();
	});

	$cmStatsHandle.click(function() {

		if($(this).hasClass('cmOpen')) {

			// Close panel
			$cmStatsPanel.animate({
				'margin-bottom': '-' + $cmStatsPanel.outerHeight() + 'px'
			}, 250, function() {
				$cmStatsHandle.removeClass('cmOpen').text('CookieMaster Stats');
			});

		} else {

			// Open panel
			$cmStatsPanel.animate({'margin-bottom': '0'}, 250, function() {
				$cmStatsHandle.addClass('cmOpen').text('Close Stats');
			});

		}

	});

};

/**
 * Populates the stats panel with the latest game stats
 */
// TO DO: Possibly cache these selectors for performance :/
CM.updateStats = function() {

	var hcStats       = this.getHCStats(),
		luckyStats    = this.getLuckyStats(),
		wrinklerStats = this.getWrinklerStats();

	// Lucky stats
	$('#CMStatsLuckyRequired').html(luckyStats[0]);
	$('#CMStatsLuckyFrenzyRequired').html(luckyStats[1]);
	$('#CMStatsMaxLuckyReward').html(luckyStats[2]);
	$('#CMStatsMaxLuckyFrenzyReward').html(luckyStats[3]);
	$('#CMStatsCurrentLuckyReward').html(luckyStats[4]);

	// Heavenly Chip stats
	$('#CMStatsHCCurrent').html(hcStats[0] + ' (' + hcStats[1] + ')');
	$('#CMStatsHCMax').html(hcStats[2] + ' (' + hcStats[3] + ')');
	$('#CMStatsHCCookiesToNext').html(hcStats[4]);
	$('#CMStatsHCTimeToNext').html(hcStats[5]);

	// Wrinkler stats
	$('#CMStatsWrinklersSucked').html(wrinklerStats[0]);
	$('#CMStatsWrinklersReward').html(wrinklerStats[1]);

};

/**
 * Attach and populate the timer panel for showing game event timers
 */
CM.attachTimerPanel = function() {

	var $cmTimerPanel = $('<div />').attr('id', 'CMTimerPanel'),
		$sectionLeft  = this.config.ccSectionLeft,
		timerRes      = this.config.cmTimerResolution;

	// Only attach it if it's not already in DOM
	if($('#CMTimerPanel').length === 0) {

		// Initialize timer objects
		// TO DO: Condense frenzy, elderFrenzy and clot into single timer instance
		//  since they are basically the same thing, and cannot stack together
		this.gcTimer          = new CM.Timer('goldenCookie', 'Next Cookie:');
		this.reindeerTimer    = new CM.Timer('reindeer', 'Next Reindeer:');
		this.frenzyTimer      = new CM.Timer('frenzy', 'Frenzy:');
		this.clickFrenzyTimer = new CM.Timer('clickFrenzy', 'Click Frenzy:');
		this.elderFrenzyTimer = new CM.Timer('elderFrenzy', 'Elder Frenzy:');
		this.clotTimer        = new CM.Timer('clot', 'Clot:');

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

		// Click handler for golden cookie display timer
		this.config.cmGCOverlay.click(function() {
			Game.goldenCookie.click();
			$('#CMGCOverlay').hide();
		});

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
	if($('#goldenCookie').is(':hidden')) {
		this.gcTimer.update();
		this.gcTimer.show();
	} else {
		this.gcTimer.hide();
	}

	// Reindeer timer
	if($('#seasonPopup').is(':hidden')) {
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
		$overlay = this.config.cmGCOverlay || $('<div />').attr('id', 'CMGCOverlay'),
		timeLeft = Math.round(Game.goldenCookie.life / Game.fps);

	// Reattach if it was removed at some point
	if($('#CMGCOverlay').length === 0) {
		this.config.ccGame.append($overlay);
		this.config.cmGCOverlay = $overlay;
	}

	if($gc.is(':visible')) {

		$overlay.css({
			'top': $gc.css('top'),
			'left': $gc.css('left'),
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

		if($gc.is(':visible')) {

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

		if($sp.is(':visible')) {

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
		gcAlert    = this.config.cmGCAudioAlert,
		spAlert    = this.config.cmSPAudioAlert,
		gcNotified = this.config.cmAudioGCNotified,
		spNotified = this.config.cmAudioSPNotified,
		setting    = this.config.settings.audioAlerts.current;

	// Play Golden cookie notification
	if(setting === 'gc' || setting === 'all') {

		if($gc.is(':visible')) {

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

		if($sp.is(':visible')) {

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
 * Updates the title tag with timer statuses and cookie count
 */
CM.updateTitleTicker = function() {

	var gcTime  = Math.round((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps,
		spTime  = Math.round((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps,
		gcI     = (Game.goldenCookie.life > 0) ? 'G' : gcTime),
		spI     = (Game.seasonPopup.life > 0) ? 'R' : spTime),
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

	var settings = this.config.settings;

	this.cleanUI(settings.cleanUI.current === 'on');
	this.changeFont(settings.changeFont.current);

	// Timers
	if(settings.showTimers.current === 'on') {
		this.attachTimerPanel();
	} else {
		this.removeTimerPanel();
	}

	// Remove Visual alert overlay if not required
	// (It will automatically reattach itself when activated)
	if(settings.visualAlerts.current === 'off') {
		this.removeVisualAlerts();
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
		Game.Popup('Error: Could not save settings!');
	} else {
		Game.Popup('Settings saved successfully!');
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

// Start it up!
CM.init();