/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      0.1
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
 * @param {integer} what   Number to beautify
 * @param {integer} floats Desired precision
 *
 * @return {string}    Formatted number
 */
function Beautify(what, floats) {

	var floats = floats || 0;

	return CM.largeNumFormat(what, floats);

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
 * soundjay.com (soundjay files are still blocked, but the Audio api now
 * works correctly again).
 *
 * @param {string} src source file
 *
 * @return {object}    new Audio object
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

	cmVersion: '0.1',
	cmCSS: 'https://rawgithub.com/greenc/CookieMaster/master/styles.css',
	cmGCAudioAlert: new Audio('http://www.freesound.org/data/previews/103/103236_829608-lq.mp3'),
	cmSPAudioAlert: new Audio('http://www.freesound.org/data/previews/121/121099_2193266-lq.mp3'),
	cmAudioGCNotified: false,
	cmAudioSPNotified: false,
	cmRefreshRate: 1000,
	cmFastRefreshRate: 200,
	cmGCOverlay: null, // Set only when needed

	ccURL: 'http://orteil.dashnet.org/cookieclicker/',
	ccVersion: null, // Set during integrity check
	ccCompatibleVersions: ['1.0402', '1.0403'],

	ccBody: $('body'),
	ccWrapper: $('#wrapper'),
	ccGame: $('#game'),
	ccSectionLeft: $('#sectionLeft'),
	ccSectionMiddle: $('#sectionMiddle'),
	ccSectionRight: $('#sectionRight'),
	ccGoldenCookie: $('#goldenCookie'),
	ccSeasonPopup: $('#seasonPopup'),

	// User settings (settings pane)
	settings: {
		cleanUI: {
			label: 'Clean UI',
			desc: 'Hide the top bar, and make other small graphical enhancements to the game interface',
			options: 'toggle',
			current: 'on'
		},
		showTimers: {
			label: 'Show Timers',
			desc: 'Display countdown timers for game events and buffs',
			options: 'toggle',
			current: 'on'
		},
		audioAlerts: {
			label: 'Audio Alerts',
			desc: 'Play an audio alert and flash the screen when Golden Cookies and Reindeer spawn',
			options: 'toggle',
			current: 'on'
		},
		numFormat: {
			label: 'Number Formatting',
			desc: 'Sets the desired decimal and thousands separator symbols for numbers',
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
			label: 'Short Numbers',
			desc: 'Shorten large numbers with suffixes',
			options: 'toggle',
			current: 'on'
		},
		changeFont: {
			label: 'Font',
			desc: 'Set the highlight font',
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
		fastRefreshRate = this.config.cmFastRefreshRate,
		cmCSS = this.config.cmCSS,
		cssID = this.config.cmStyleID,
		updateLoop;

	// Ensure CM can run correctly
	if(this.integrityCheck()) {

		this.loadUserSettings();
		this.attachStyleSheet(cmCSS, cssID);
		this.attachSettingsPanel();

		// Apply user settings last
		this.applyUserSettings();

		// Our continually updating methods go in here
		setInterval(function() {self.mainLoop();}, refreshRate);

		// Title updates and audio alerts get their own loop which updates faster
		setInterval(function() {
			self.updateTitleTicker();
			if(self.config.settings.audioAlerts.current === 'on') {
				self.audioAlerts();
			}
		}, fastRefreshRate);

		// All done :)
		Game.Popup('CookieMaster v.' + this.config.cmVersion + ' loaded successfully!');

	} else {

		this.suicide();
		return false;

	}

};

/**
 * Returns true if CM can run correctly
 * Also, sets warning and error messages if appropriate
 *
 * @return {boolean}
 */
CM.integrityCheck = function() {

	var message = false,
		error = false,
		i;

	this.config.ccVersion = Game.version.toString() || '';

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

	if(this.compatibilityCheck(this.config.ccVersion) === -1) {
		message = 'Warning: This version of Cookie Clicker may not be fully supported!';
	}

	// Warn about golden cookie and season popup bug
	if(Game.seasonPopup.maxTime === 0 || Game.goldenCookie.maxTime === 0) {
		message = "Warning: New/unsaved game detected.\n\nGolden cookies and reindeer will not spawn until you manually save and refresh Cookie Clicker.\n\nThis is a bug in the game, not CookieMaster ;)";
	}

	if(message) { this.alertMessage(message); }

	return error ? false : true;
};

/**
 * Returns index index of version number in the array of known
 * compatible versions
 *
 * @param  {string}  version CC version
 * @return {integer}
 */
CM.compatibilityCheck = function(version) {

	var vArray = this.config.ccCompatibleVersions,
		ccVersion = version || '',
		i;

	for(i = 0; i < vArray.length; i++) {
		if(vArray[i].match(ccVersion)) {
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
 * @param  {integer} num    The number to be formatted
 * @param  {integer} floats Amount of decimal places required
 * @return {string}
 */
CM.largeNumFormat = function(num, floats) {

	var useShortNums = this.config.settings.shortNums.current === 'on' ? true : false,
		decSep = this.config.settings.numFormat.current === 'us' ? '.' : ',',
		decimal = decSep === '.' ? '.' : ',',
		comma = decSep === '.' ? ',' : '.',
		floats = floats || 0,
		parts,
		ranges = [
			{divider: 1e33, suffix: 'Dc'},
			{divider: 1e30, suffix: 'No'},
			{divider: 1e27, suffix: 'Oc'},
			{divider: 1e24, suffix: 'Sp'},
			{divider: 1e21, suffix: 'Sx'},
			{divider: 1e18, suffix: 'Qi'},
			{divider: 1e15, suffix: 'Qa'},
			{divider: 1e12, suffix: 'T'},
			{divider: 1e9, suffix: 'B'},
			{divider: 1e6, suffix: 'M'}
		];

	if(useShortNums) {
		for(var i = 0; i < ranges.length; i++) {
			if(num >= ranges[i].divider) {
				num = (num / ranges[i].divider).toFixed(3) + ' ' + ranges[i].suffix;
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
 * @param {string} type  reindeer, goldenCookie, frenzy, clickFrenzy,
 *                       elderFrenzy, clot
 * @param {string} label Display label for the timer
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
	 * @return {object} Timer HTML as jQuery object
	 */
	this.create = function() {

		var timings = this.getTimings(),
			$container = $('<div />').attr({'class': 'cmTimerContainer cf cmTimer-' + this.type, 'id': this.id}),
			$barOuter = $('<div />').addClass('cmTimer'),
			$barInner = $('<div />'),
			$label = $('<div />').addClass('cmTimerLabel').text(this.label),
			$counter = $('<div />').addClass('cmTimerCounter').text(Math.round(timings.minCurrent) + 's'),
			$limiter = {}, // Not always needed, so we create it further down
			width = timings.minCurrent / timings.max * 100,
			hardMin;

		// Add a min time indicator if necessary
		if(timings.hasOwnProperty('min') && timings.min > 0) {
			hardMin = timings.min / timings.max * 100;
			if(width < 100 - hardMin) {
				$container.addClass('cmEmphasize');
			}
			$limiter = $('<span />').css('width', hardMin + '%');
			$barOuter.append($limiter);
		}

		$barInner.css('width', width + '%');

		$barOuter.append($barInner);
		$container.append($label, $barOuter, $counter);

		// Set parent object properties for easier retrieval later
		this.container = $container;
		this.barOuter = $barOuter;
		this.barInner = $barInner;
		this.limiter = $limiter;
		this.counter = $counter;

		return $container;

	};

	/**
	 * Updates timing values of the timer
	 * @return {object} this
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
				if(!this.container.hasClass('cmEmphasize')) {
					this.container.addClass('cmEmphasize');
				}
			} else {
				this.limiter.show();
				this.container.removeClass('cmEmphasize');
			}

		}

		this.barInner.css('width', width + '%');
		this.counter.text(Math.round(timings.minCurrent) + 's');

		return this;

	};

	/**
	 * Retrieves the current timings from the game code
	 * @return {object} timings
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
	 * @return {object} this
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
	 * @return {object} this
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

/* ================================================
	NON-RETURNING METHODS

	These methods mostly update the DOM and don't
	actually return anything.
	Separating them out helps keep the init
	method nice and tidy :)
================================================ */

CM.mainLoop = function() {

	var timerPanelAttached = $('#CMTimerPanel').length === 1;

	if(timerPanelAttached) {
		this.updateTimers();
	}

};

/**
 * Build and attach the settings panel to the DOM
 */
CM.attachSettingsPanel = function() {

	var self = this,
		items = [],
		options = [],
		control = [],
		current = '',
		selected = '',
		html = '',
		settings = this.config.settings,
		$wrapper = this.config.ccWrapper,
		$cmSettingsPanel = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsHandle = $('<div />').attr('id', 'CMSettingsPanelHandle').text('CookieMaster Settings'),
		$cmSettingsList = $('<ul />').attr('id', 'CMSettingsList'),
		$cmSettingsSaveButon = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button'}).text('Apply');

		// Build each setting item
		$.each(settings, function(key, value) {

			// Reset these for each loop
			options = [];
			current = this.current;

			if(typeof this.options === 'object') {

				// Build a select box if a setting has multiple options
				$.each(this.options, function() {
					selected = (current === this.toString()) ? ' selected="selected"' : '';
					options.push('<option value="' + this.value + '"' + selected + '>' + this.label + '</option>');
				});
				control =  '<select id="CMsetting-' + key + '">';
				control += options.join('');
				control += '</select>';

				// Add event listener for change event
				$cmSettingsList.on('change', '.setting-' + key + ' select', function() {
					settings[key].current = $(this).find(":selected").val();
				});

			} else if(this.options === 'toggle') {

				// Build a checkbox if it's a simple toggle
				selected = (current === 'on') ? ' checked="checked"' : '';
				control = '<input type="checkbox" id="CMsetting' + key + '"' + selected + ' />';

				// Add event listener for change event
				$cmSettingsList.on('change', '.setting-' + key + ' input', function() {
					settings[key].current = $(this).prop('checked') ? 'on' : 'off';
				});

			}

			// Build the list of items
			html =  '<li class="cf setting setting-' + key + '" title="' + this.desc + '"">';
			html +=     '<label for="CMsetting' + key + '">'  + this.label + control + '</label>';
			html += '</li>';

			items.push(html);

		});

		// Glue it together
		$cmSettingsList.append(items.join(''));
		$cmSettingsPanel.append(
			$cmSettingsHandle,
			$cmSettingsList,
			$cmSettingsSaveButon
		);

		// Attach to DOM
		$wrapper.append($cmSettingsPanel);

		// Set event handlers
		$cmSettingsHandle.click(function() {
			if($(this).hasClass('cmOpen')) {
				$cmSettingsPanel.animate({'margin-bottom': '-231px'}, function() {
					$cmSettingsHandle.removeClass('cmOpen').text('CookieMaster Settings');
				});
			} else {
				$cmSettingsPanel.animate({'margin-bottom': '0'}, function() {
					$cmSettingsHandle.addClass('cmOpen').text('Close Settings');
				});
			}
		});
		$cmSettingsSaveButon.click(function() {
			self.saveUserSettings();
			self.applyUserSettings();
		});

};

CM.attachStatsPanel = function() {

	var $wrapper = this.config.ccWrapper,
	$cmStatsPanel = $('<div />').attr('id', 'CMStatsPanel'),
	$cmStatsHandle = $('<div />').attr('id', 'CMStatsPanelHandle').text('CookieMaster Stats');

	$cmStatsPanel.append($cmStatsHandle);

	// Attach to DOM
	$wrapper.append($cmStatsPanel);

	// Set event handlers
	$cmStatsHandle.click(function() {
		if($(this).hasClass('cmOpen')) {
			$cmStatsPanel.animate({'margin-top': '-421px'}, function() {
				$cmStatsHandle.removeClass('cmOpen').text('CookieMaster Stats');
			});
		} else {
			$cmStatsPanel.animate({'margin-top': '0'}, function() {
				$cmStatsHandle.addClass('cmOpen').text('Close Stats');
			});
		}
	});

};

/**
 * Configure & populate the panel for showing game timers
 * @param  {boolean} state Active or inactive
 */
CM.timerPanel = function(state) {

	var $cmTimerPanel = $('<div />').attr('id', 'CMTimerPanel'),
		timerRes = this.config.cmTimerResolution,
		$sectionLeft = this.config.ccSectionLeft;

	if(state) {

		if($('#CMTimerPanel').length === 0) {

			// Initialize timer objects
			this.gcTimer = new CM.Timer('goldenCookie', 'Next Cookie:');
			this.reindeerTimer = new CM.Timer('reindeer', 'Next Reindeer:');
			this.frenzyTimer = new CM.Timer('frenzy', 'Frenzy:');
			this.clickFrenzyTimer = new CM.Timer('clickFrenzy', 'Click Frenzy:');
			this.elderFrenzyTimer = new CM.Timer('elderFrenzy', 'Elder Frenzy:');
			this.clotTimer = new CM.Timer('clot', 'Clot:');

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

			// Attach golden cookie display timer and handler
			this.displayGCTimer();
			this.config.cmGCOverlay.click(function() {
				Game.goldenCookie.click();
				$('#CMGCOverlay').hide();
			});

		}

	} else {

		if($('#CMTimerPanel').length !== 0) {

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
			$('#CMTimerPanel').remove();
		}

	}

};

// TO DO: DRY this up
// Update all timers with new values
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

	var $gc = this.config.ccGoldenCookie,
		$overlay = this.config.cmGCOverlay || $('<div />').attr('id', 'CMGCOverlay').appendTo(this.config.ccGame),
		timeLeft = Math.round(Game.goldenCookie.life / Game.fps);

	this.config.cmGCOverlay = $overlay;

	if($gc.is(':visible')) {

		// Reattach if it was removed at some point
		if($('#CMGCOverlay').length === 0) {
			$overlay.appendTo(this.config.ccGame);
		}

		$overlay.css({
			'top': $gc.css('top'),
			'left': $gc.css('left'),
			'opacity': $gc.css('opacity')
		}).text(timeLeft).show();

	} else {

		$overlay.hide();

	}

};

CM.audioAlerts = function() {

	var $gc = this.config.ccGoldenCookie,
		$sp = this.config.ccSeasonPopup,
		gcAlert = this.config.cmGCAudioAlert,
		spAlert = this.config.cmSPAudioAlert,
		gcNotified = this.config.cmAudioGCNotified,
		spNotified = this.config.cmAudioSPNotified;

	// Attach flash overlay if not already in DOM
	if($('#CMOverlay').length === 0) {
		$('body').append($('<div />').attr('id', 'CMOverlay'));
	}

	// Play Golden cookie notification
	if($gc.is(':visible')) {
		if(!gcNotified) {
			gcAlert.volume = 1;
			gcAlert.play();
			$("#CMOverlay").show().fadeOut(500);
			this.config.cmAudioGCNotified = true;
		}
	} else {
		this.config.cmAudioGCNotified = false;
	}

	// Play Reindeer notification
	if($sp.is(':visible')) {
		if(!spNotified) {
			spAlert.volume = 1;
			spAlert.play();
			$("#CMOverlay").show().fadeOut(500);
			this.config.cmAudioSPNotified = true;
		}
	} else {
		this.config.cmAudioSPNotified = false;
	}

};

/**
 * Updates the title tag with timer statuses and cookie count
 */
CM.updateTitleTicker = function() {

	var spI = (Game.seasonPopup.life > 0) ? 'R' : Math.round((Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps),
		gcI = (Game.goldenCookie.life > 0) ? 'G' : Math.round((Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps),
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
 * @param {string} font The selected font setting
 */
CM.changeFont = function(font) {

	var $body = this.config.ccBody;

	$body.removeClass('serif sansserif');
	if(font !== 'default') {
		$body.addClass(font);
	}

};

/**
 * Attach an external stylesheet to the DOM
 *
 * @param  {string} url The URL of the stylesheet to load
 * @param  {string} id  an ID to give the stylesheet
 */
CM.attachStyleSheet = function(url, id) {

	var $stylesheet = $('<link />');

	$stylesheet.attr({
		'type': 'text/css',
		'rel': 'stylesheet',
		'href': url,
		'id': id
	});

	$('head').append($stylesheet);

};

/**
 * Apply the current user settings to the game
 */
CM.applyUserSettings = function() {

	var settings = this.config.settings;

	this.cleanUI(settings.cleanUI.current === 'on');
	this.changeFont(settings.changeFont.current);
	this.timerPanel(settings.showTimers.current === 'on');
	Game.RebuildStore();

};

/**
 * Save all user settings (cookie-based)
 */
CM.saveUserSettings = function() {

	var settings = this.config.settings,
		settingsStates = {},
		serializedSettings = '',
		cookieDate = new Date();

	// Grab the current value of each user setting
	$.each(settings, function(key, value) {
		settingsStates[key] =  this.current;
	});

	// Serialize the data
	serializedSettings = $.param(settingsStates).replace(/=/g, ':').replace(/&/g, '|');

	// Create and set cookie
	cookieDate.setFullYear(cookieDate.getFullYear() + 1);
	document.cookie = 'CMSettings=' + serializedSettings + ';expires=' + cookieDate.toGMTString( ) + ';';

	// All good?
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

	var settings = this.config.settings,
		cookie = document.cookie.replace(/(?:(?:^|.*;\s*)CMSettings\s*\=\s*([^;]*).*$)|^.*$/, "$1"),
		settingsPairs = [],
		keyVals = [],
		self = this;

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
 * @param  {string} msg The message
 */
CM.alertMessage = function(msg) {

	alert(msg);

};

/* ================================================
	END NON-RETURNING METHODS
================================================ */


// Start it up!
CM.init();