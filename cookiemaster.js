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

/**
 * Check that CookieMaster is not already loaded
 */
if(typeof CM === 'object') {
	alert('Error: CookieMaster is already loaded!');
	CM.suicide();
}

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
	cmTimerResolution: 1000,

	ccURL: 'http://orteil.dashnet.org/cookieclicker/',
	ccVersion: '', // Set during integrity check
	ccCompatibleVersions: ['1.0402', '1.0403'],

	ccBody: $('body'),
	ccWrapper: $('#wrapper'),
	ccGame: $('#game'),
	ccSectionLeft: $('#sectionLeft'),
	ccSectionMiddle: $('#sectionMiddle'),
	ccSectionRight: $('#sectionRight'),

	// User configurable settings
	settings: {
		cleanUI: {
			label: 'Clean UI',
			desc: 'Hide the top bar, and make other small graphical enhancements to the game interface',
			options: 'toggle',
			current: 'on'
		},
		showTimers: {
			label: 'Show Timers',
			desc: 'Display countdown timers for game events',
			options: 'toggle',
			current: 'on'
		},
		numFormat: {
			label: 'Number Formatting',
			desc: 'Display numbers in US (123,456,789.0) or European (123.456.789,0) format',
			options: ['US', 'European'],
			current: 'US'
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
			options: ['Default', 'Serif', 'Sans Serif'],
			current: 'Default'
		}
	},

};

/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should be called from here in the order needed.
 */
CM.init = function() {

	var cmCSS = this.config.cmCSS,
		cssID = this.config.cmStyleID;

	// Ensure CM can run correctly
	if(this.integrityCheck()) {

		this.loadUserSettings();
		this.attachStyleSheet(cmCSS, cssID);
		this.attachSettingsPanel();

		// Apply user settings last
		this.applyUserSettings();

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
		decSep = this.config.settings.numFormat.current === 'US' ? '.' : ',',
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
 * Class for handling game event timers, e.g. Golden Cookie, Frenzies, etc.
 *
 * @param {string} type  reindeer, goldenCookie, frenzy, clickFrenzy,
 *                       bloodFrenzy, clot
 * @param {string} label Display label for the timer
 */
CM.Timer = function(type, label) {

	this.type = type;
	this.label = label;
	this.container = $('<div />');
	this.barOuter = {};
	this.barInner = {};
	this.limiter = {};
	this.counter = {};
	this.id = 'CMTimer-' + this.type;

	/**
	 * Create a new timer object
	 * @return {object} Timer HTML as jQuery object
	 */
	this.create = function() {

		this.container.attr({'class': 'cmTimerContainer cf cmTimer-' + this.type, 'id': this.id});

		var timings = this.getTimings(),
			$barOuter = $('<div />').addClass('cmTimer'),
			$barInner = $('<div />'),
			$label = $('<div />').addClass('cmTimerLabel').text(this.label),
			$counter = $('<div />').addClass('cmTimerCounter').text(Math.round(timings.minCurrent) + 's'),
			$limiter = {},
			width = timings.minCurrent / timings.max * 100,
			hardMin;

		// Add a min time indicator if necessary
		if(timings.hasOwnProperty('min') && timings.min > 0) {
			hardMin = timings.min / timings.max * 100;
			if(width < 100 - hardMin) {
				this.container.addClass('cmEmphasize');
			}
			$limiter = $('<span />').css('width', hardMin + '%');
			$barOuter.append($limiter);
		}

		$barInner.css('width', width + '%');

		// Set selector references for faster access on update
		this.barOuter = $barOuter;
		this.barInner = $barInner;
		this.limiter = $limiter;
		this.counter = $counter;

		$barOuter.append($barInner);
		this.container.append($label);
		this.container.append($barOuter);
		this.container.append($counter);

		return this.container;

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
		} else if(this.type === 'bloodFrenzy') {
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

		this.container.fadeIn(200);
		return this;

	};

	/**
	 * Hides timer is visible
	 * @return {object} this
	 */
	this.hide = function() {

		this.container.fadeOut(200);
		return this;

	};

	/**
	 * Removes timer from DOM
	 * @return {boolean} true
	 */
	this.remove = function() {

		return true;

	};

};

/* ================================================
	NON-RETURNING METHODS

	These methods mostly update the DOM and don't
	actually return anything.
	Separating them out helps keep the init
	method nice and tidy :)
================================================ */

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
		$cmSettingsClose = $('<div />').attr('id', 'CMSettingsPanelClose').text('X'),
		$cmSettingsTitle = $('<h2 />').attr('id', 'CMSettingsTitle').text('Settings:'),
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
					options.push('<option value="' + this + '"' + selected + '>' + this + '</option>');
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
		$cmSettingsPanel.append($cmSettingsClose);
		$cmSettingsPanel.append($cmSettingsTitle);
		$cmSettingsPanel.append($cmSettingsList);
		$cmSettingsPanel.append($cmSettingsSaveButon);

		// Attach to DOM
		$wrapper.append($cmSettingsPanel);

		// Set event listeners
		$cmSettingsClose.click(function() { $cmSettingsPanel.fadeOut(200); });
		$cmSettingsSaveButon.click(function() {
			self.saveUserSettings();
			this.applyUserSettings();
		});

};

/**
 * Configure & populate the panel for showing game timers
 * @param  {boolean} state Active or inactive
 */
CM.timerPanel = function(state) {

	var timerRes = this.config.cmTimerResolution,
		$sectionLeft = this.config.ccSectionLeft,
		gcTimer,
		reindeerTimer,
		frenzyTimer,
		clickFrenzyTimer,
		bloodFrenzyTimer,
		clotTimer;

	// Set up an execution loop for active timers
	function manageTimers() {

		// Golden Cookie timer
		if($('#goldenCookie').is(':hidden')) {
			gcTimer.update();
			gcTimer.show();
		} else {
			gcTimer.hide();
		}

		// Reindeer timer
		if($('#seasonPopup').is(':hidden')) {
			reindeerTimer.update();
			reindeerTimer.show();
		} else {
			reindeerTimer.hide();
		}

		// Frenzy timer
		if(Game.frenzy > 0 && Game.frenzyPower === 7) {
			frenzyTimer.update();
			frenzyTimer.show();
			bloodFrenzyTimer.hide();
			clotTimer.hide();
		} else {
			frenzyTimer.hide();
		}

		// Click frenzy timer
		if(Game.clickFrenzy > 0) {
			clickFrenzyTimer.update();
			clickFrenzyTimer.show();
		} else {
			clickFrenzyTimer.hide();
		}

		// Blood frenzy timer
		if(Game.frenzy > 0 && Game.frenzyPower === 666) {
			bloodFrenzyTimer.update();
			bloodFrenzyTimer.show();
			clickFrenzyTimer.hide();
			clotTimer.hide();
		} else {
			bloodFrenzyTimer.hide();
		}

		// Clot timer
		if(Game.frenzy > 0 && Game.frenzyPower === 0.5) {
			clotTimer.update();
			clotTimer.show();
			clickFrenzyTimer.hide();
			bloodFrenzyTimer.hide();
		} else {
			clotTimer.hide();
		}

	}

	if(state) {

		var $cmTimerPanel = $('<div />').attr('id', 'CMTimerPanel');

		$sectionLeft.append($cmTimerPanel);

		// Initialize all timers
		gcTimer = new CM.Timer('goldenCookie', 'Next Cookie:');
		reindeerTimer = new CM.Timer('reindeer', 'Next Reindeer:');
		frenzyTimer = new CM.Timer('frenzy', 'Frenzy:');
		clickFrenzyTimer = new CM.Timer('clickFrenzy', 'Click Frenzy:');
		bloodFrenzyTimer = new CM.Timer('bloodFrenzy', 'Blood Frenzy:');
		clotTimer = new CM.Timer('clot', 'Clot:');

		// Attach them
		$cmTimerPanel.append(gcTimer.create());
		$cmTimerPanel.append(reindeerTimer.create());
		$cmTimerPanel.append(frenzyTimer.create());
		$cmTimerPanel.append(bloodFrenzyTimer.create());
		$cmTimerPanel.append(clotTimer.create());
		$cmTimerPanel.append(clickFrenzyTimer.create());

		timerLoop = setInterval(manageTimers, timerRes);

	} else {

		if($('#CMTimerPanel').length !== 0) {
			// Stop the execution loop
			clearInterval(timerLoop);

			// Remove references to all timers
			gcTimer = null;
			reindeerTimer = null;
			frenzyTimer = null;
			clickFrenzyTimer = null;
			bloodFrenzyTimer = null;
			clotTimer = null;

			// Remove the timer panel
			$('#CMTimerPanel').remove();
		}

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

	// TO DO: Make this an array and asign class with single statement
	if(font === 'Serif') {
		$body.addClass('serif');
	} else if(font === 'Sans Serif') {
		$body.addClass('sansserif');
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
	this.timerPanel(settings.showTimers.current === 'on');
	this.changeFont(settings.changeFont.current);
	Game.RebuildStore();

};

/**
 * Save all user settings to the settings cookie
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
 * Load user settings from the settings cookie
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
CM.Message = function(msg) {

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
 * @param {integer} what   Number to beautify
 * @param {integer} floats Desired precision
 *
 * @return {string}    Formatted number
 */
function Beautify(what, floats) {

	var floats = floats || 0;

	return CM.largeNumFormat(what, floats);

}

/* ================================================
	END COOKIE CLICKER FUNCTION OVERRIDES
================================================ */


// Start it up!
CM.init();