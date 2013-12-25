/**
 * We will expose all methods and properties of CookieMaster
 * through the parent object, for easy extendability
 *
 * @type {Object}
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

	ccURL: 'http://orteil.dashnet.org/cookieclicker/',
	ccVersion: '',
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

	//Perform a quick check to make sure CM can run correctly
	if(this.integrityCheck()) {

		this.loadUserSettings();
		this.attachStyleSheet(cmCSS, cssID);
		this.attachSettingsPanel();

		// Apply the current user settings after we've done everything else
		this.applyUserSettings();



		// All done :)
		cmIsLoaded = true; // Implicitly create this as global so we can test against multiple inits
		Game.Popup('CookieMaster v.' + this.config.cmVersion + ' loaded successfully!');

	} else {

		this.suicide();
		return false;

	}

};

/**
 * Checks that CookieMaster can run correctly and informs the
 * user if anything is wrong
 *
 * @return {boolean}
 */
CM.integrityCheck = function() {

	var ccVersion = Game.version.toString() || '',
		message = false,
		error = false,
		i;

	if(window.cmIsLoaded) {
		// Already loaded
		message = 'Error: CookieMaster is already running!';
		error = true;
	} else if(document.location.href.indexOf(this.config.ccURL) === -1) {
		// Wrong URL
		message = 'Error: This isn\'t the Cookie Clicker URL';
		error = true;
	} else if(!window.jQuery) {
		// jQuery isn't loaded
		message = 'Error: jQuery is not loaded';
		error = true;
	} else if(!Game) {
		// Game class doesn't exist
		message = 'Error: Cookie Clicker does not appear to be initialized';
		error = true;
	}

	// Warn against potential incompatibility
	if(this.compatibilityCheck(ccVersion) === -1) {
		message = 'Warning: This version of Cookie Clicker may not be fully supported!';
	}

	// Alert user to any issues
	if(message) {
		this.alertMessage(message);
	}

	if(error) {

		return false;

	} else {

		// Set some useful config options for later use
		this.config.ccVersion = ccVersion;
		this.config.ccGame = $('#game');

		return true;
	}

};

/**
 * Checks the loaded version of CC against a list of
 * known compatible versions
 *
 * @param  {string} version The version of CC we are running on
 *
 * @return {integer}         Return index of matched version
 */
CM.compatibilityCheck = function(version) {

	var compVersions = this.config.ccCompatibleVersions,
		ccVersion = version || '',
		i;

	for(i = 0; i < compVersions.length; i++) {
		if(compVersions[i].match(ccVersion)) {
			return i;
		}
	}

	return -1;

}

/**
 * Clean up the game interface a little.
 *
 * @param  {boolean} state Turn on or off
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

	// We need to delay this in case the UI styles have not yet been parsed :(
	setTimeout(recalculateCanvasDimensions, 1000);

};

/**
 * Change the font of highlight and title text
 *
 * @param  {string} fontSetting The selected font setting
 */
CM.changeFont = function(fontSetting) {

	var $body = this.config.ccBody;

	$body.removeClass('serif sansserif');

	if(fontSetting === 'Serif') {
		$body.addClass('serif');
	} else if(fontSetting === 'Sans Serif') {
		$body.addClass('sansserif');
	}

};

/**
 * Formats very large numbers with their appropriate suffix, also adds
 * thousands and decimal separators and performs correct rounding for
 * smaller numbers
 *
 * @param  {integer} num The number to be formatted
 * @param  {integer} floats Amount of decimal places required
 *
 * @return {string}     Formatted number (as string) with suffix
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

	// Apply rounding, if any
	num = Math.round(num * Math.pow(10, floats)) / Math.pow(10, floats);

	// Prettify and localize the remaining "smaller" numbers
	parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, comma);

	return parts.join(decimal);

};

/**
 * Class for dealing with game event timers
 */
CM.Timer = function(type, label) {

	this.type = type;
	this.label = label;
	this.container = $('<div />');
	this.id = 'CMTimer-' + this.type;

	this.create = function() {

		this.container.attr({'class': 'cmTimerContainer cf', 'id': this.id});

		var timings = this.getTimings(),
			$barOuter = $('<div />').addClass('cmTimer ' + type),
			$barInner = $('<div />'),
			$label = $('<div />').addClass('cmTimerLabel').text(this.label),
			$counter = $('<div />').addClass('cmTimerCounter').text(Math.round(timings.minCurrent)),
			width = timings.minCurrent / timings.max * 100,
			hardMin;

		// Add a min time indicator if necessary
		if(timings.hasOwnProperty('min') && timings.min > 0) {
			hardMin = timings.min / timings.max * 100;
			var $limiter = $('<span />').css('left', hardMin + '%');
			$barOuter.append($limiter);
		}

		$barInner.css('width', width + '%');

		$barOuter.append($barInner);
		this.container.append($label);
		this.container.append($barOuter);
		this.container.append($counter);

		return this.container;

	},

	this.hide = function() {

		this.container.fadeOut(500);

	},

	this.show = function() {

		this.container.fadeIn(200);

	},

	this.remove = function() {

		return true;

	},

	this.update = function() {

		var $limiter = this.container.find('span'),
			$counter = this.container.find('.cmTimerLabel'),
			$barInner = this.container.find('.cmTimer div'),
			timings = this.getTimings(this.type),
			width = timings.minCurrent / timings.max * 100,
			hardMin;

		$barInner.css('width', width + '%');
		$counter.text(Math.round(timings.minCurrent));

	},

	this.getTimings = function() {

		var timings = {};

		if(this.type === 'nextReindeer') {
			timings.min = Game.seasonPopup.minTime / Game.fps;
			timings.minCurrent = (Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps;
			timings.max = Game.seasonPopup.maxTime / Game.fps;
		} else if(this.type === 'goldenCookie') {
			timings.min = Game.goldenCookie.minTime / Game.fps;
			timings.minCurrent = (Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps;
			timings.max = Game.goldenCookie.maxTime / Game.fps;
		} else if(this.type === 'frenzy') {
			timings.minCurrent = Game.frenzy / Game.fps;
			timings.max = 77 + 77 * Game.Has('Get lucky');
		} else if(this.type === 'clickFrenzy') {
			timings.minCurrent = Game.clickFrenzy / Game.fps;
			timings.max = 13 + 13 * Game.Has('Get lucky');
		} else if(this.type === 'bloodFrenzy') {
			timings.minCurrent = Game.clickFrenzy / Game.fps;
			timings.max = 6 + 6 * Game.Has('Get lucky');;
		}

		return timings;

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
				control = '<input type="checkbox" id="CMsetting' + key + '"' + selected + ' />'

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
		$cmSettingsSaveButon.click(function() { self.saveUserSettings() });
		$cmSettingsClose.click(function() { $cmSettingsPanel.fadeOut(200) });

};

/**
 * Configure the panel for showing game timers and populate
 */
CM.timerPanel = function(state) {

	var $sectionLeft = this.config.ccSectionLeft,
		gcTimer,
		reindeerTimer;

	if(state) {

		var $cmTimerPanel = $('<div />').attr('id', 'CMTimerPanel');

		$sectionLeft.append($cmTimerPanel);

		// Initialize all timers
		gcTimer = new CM.Timer('goldenCookie', 'Next cookie:');
		reindeerTimer = new CM.Timer('reindeer', 'Next reindeer:');

		// Attach them
		$cmTimerPanel.prepend(gcTimer.create());
		$cmTimerPanel.prepend(reindeerTimer.create());


		// Set an execution loop for active timers
		function manageTimers() {

			// Golden Cookie timer
			if($("#goldenCookie:hidden")) {
				gcTimer.update();
				gcTimer.show();
			} else {
				gcTimer.hide();
			}

			// Reindeer timer
			if($("#seasonPopup:hidden")) {
				reindeerTimer.update();
				reindeerTimer.show();
			} else {
				reindeerTimer.hide();
			}

			// Frenzy timer
			if(Game.frenzy > 0 && $cmTimerPanel.find('#CMTimer-frenzy').length === 0) {
				//var frenzyTimer = new CM.Timer('frenzy', 'Frenzy');
			}

		}
		timerLoop = setInterval(manageTimers, 1000);

	} else {

		if($('#CMTimerPanel').length !== 0) {
			// Stop the execution loop
			clearInterval(timerLoop);

			// Remove references to all timers
			gcTimer = null;
			reindeerTimer = null;

			// Remove the timer panel
			$cmTimerPanel.remove();
		}

	}

};

/**
 * Attach an external stylesheet to the DOM
 *
 * @param  {string} url The URL of the stylesheet to load
 * @param  {string} id  an ID to give the stylesheet
 */
CM.attachStyleSheet = function(url, id) {

	var $stylesheet = $('<link />'),
		id = id || '',
		url = url || '';

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

	settings.cleanUI.current === 'on' ? this.cleanUI(true) : this.cleanUI(false);
	settings.showTimers.current === 'on' ? this.timerPanel(true) : this.timerPanel(false);
	this.changeFont(settings.changeFont.current);
	Game.RebuildStore();

};

/**
 * Save all user settings to the settings cookie
 */
CM.saveUserSettings = function() {

	var settings = this.config.settings,
		settingsStates = {}
		serializedSettings = '',
		cookieDate = new Date();

	// Grab the current value of each user setting
	$.each(settings, function(key, value) {
		settingsStates[key] =  this.current;
	});

	// Serialize the settings for cookie use
	serializedSettings = $.param(settingsStates).replace(/=/g, ':').replace(/&/g, '|');

	// Create and set the settings cookie
	cookieDate.setFullYear(cookieDate.getFullYear() + 1);
	document.cookie = 'CMSettings=' + serializedSettings + ';expires=' + cookieDate.toGMTString( ) + ';';

	// Did we save the cookie successfully?
	if (document.cookie.indexOf('CMSettings') === -1) {
		Game.Popup('Error: Could not save settings!');
	} else {
		Game.Popup('Settings saved successfully!');
	}

	this.applyUserSettings();
};

/**
 * Attempt to load user settings from the settings cookie
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

	this.applyUserSettings();

};

/**
 * Generate a 4 character alphanumeric hash
 * @return {string} The generated hash
 */
CM.makeRandomShortHash = function() {
	return ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).substr(-4);
}

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

// Start it up!
CM.init();


/* ===========================================
	COOKIE CLICKER FUNCTION OVERRIDES
=========================================== */

/**
 * Hijacks the original Beautify method to use our own formatting function
 *
 * @param {integer} what   The number to beautify
 * @param {integer} floats Number of decimal places desired :/
 *
 * @return {string}    Nicely formatted number as a string
 */
function Beautify(what, floats) {

	var floats = floats || 0;

	return CM.largeNumFormat(what, floats);

}
/* ===========================================
	END COOKIE CLICKER FUNCTION OVERRIDES
=========================================== */
