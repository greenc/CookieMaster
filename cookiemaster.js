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
	cmIsLoaded: false,
	cmCSS: 'https://rawgithub.com/greenc/CookieMaster/master/styles.css',

	ccURL: 'http://orteil.dashnet.org/cookieclicker/',
	ccVersion: '',
	ccCompatibleVersions: ['1.0402', '1.0403'],

	ccBody: $('body'),
	ccWrapper: $('#wrapper'),
	ccGame: $('#game'),

	// User configurable settings
	settings: {
		cleanUI: {
			label: 'Clean UI',
			desc: 'Hide the top bar, and make other small graphical enhancements to the game interface',
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
		this.config.cmIsLoaded = true;
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

	if(this.config.cmIsLoaded) {
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
 * Build and attach the settings panel to the DOM
 */
CM.attachSettingsPanel = function() {

	var self = this,
		items = [],
		options = [],
		control = [],
		current = '',
		selected = '',
		settings = this.config.settings,
		$wrapper = this.config.ccWrapper,
		$cmSettingsPanel = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsTitle = $('<h2 />').attr('id', 'CMSettingsTitle').text('Settings:'),
		$cmSettingsList = $('<ul />').attr('id', 'CMSettingsList'),
		$cmSettingsSaveButon = $('<button />').attr({'id': 'CMSettingsSave', 'type': 'button'}).text('Save');

		// Build each setting item
		$.each(settings, function(key, value) {

			// Reset these for each loop
			options = [];
			control = [];
			current = this.current;

			if(typeof this.options === 'object') {

				// Build a select box if a setting has multiple options
				$.each(this.options, function() {
					selected = (current === this.toString()) ? ' selected="selected"' : '';
					options.push('<option value="' + this + '"' + selected + '>' + this + '</option>');
				});
				control = '<select>';
				control += options.join('');
				control += '</select>';

			} else if(this.options === 'toggle') {

				// Build a checkbox if it's a simple toggle
				selected = (current === 'on') ? ' checked="checked"' : '';
				control = '<input type="checkbox"' + selected + ' />'

			}

			// Build the list of items
			items.push('<li class="cf setting setting-' + key + '" title="' + this.desc + '"">' + this.label + control + '</li>');

		});

		// Glue it together
		$cmSettingsList.append(items.join(''));
		$cmSettingsPanel.append($cmSettingsTitle);
		$cmSettingsPanel.append($cmSettingsList);
		$cmSettingsPanel.append($cmSettingsSaveButon);

		// Attach to DOM
		$wrapper.append($cmSettingsPanel);

		/**
		 *	Set event listeners
		 */

		// cleanUI toggle
		$cmSettingsList.find('.setting-cleanUI input').change(function() {
			settings.cleanUI.current = $(this).prop('checked') ? 'on' : 'off';
		});

		//  numFormat change
		$cmSettingsList.find('.setting-numFormat select').change(function() {
			settings.numFormat.current = $(this).find(":selected").val();
		});

		//  shortNums toggle
		$cmSettingsList.find('.setting-shortNums input').change(function() {
			settings.shortNums.current = $(this).prop('checked') ? 'on' : 'off';
		});

		// Save button
		$cmSettingsSaveButon.click(function() {
			self.saveUserSettings();
		});

};

/**
 * Attach an external stylesheet to the DOM
 *
 * @param  {string} url The URL of the stylesheet to load
 * @param  {string} id  an ID to give the stylesheet
 */
CM.attachStyleSheet = function(url, id) {

	var $stylesheet = $('<link>'),
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
