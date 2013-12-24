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
	cmDecimalSeparator: '.',
	cmCSS: 'https://raw.github.com/greenc/CookieMaster/master/styles.css',

	ccURL: 'http://orteil.dashnet.org/cookieclicker/',
	ccVersion: '',
	ccCompatibleVersions: ['1.0402', '1.0403'],

	ccGame: $('#game'),

	// TO DO: Make these actually do something :)
	settings: {
		cleanUI: {
			label: 'Clean UI',
			desc: 'Hide the top bar, and make other small graphical enhancements to the game interface',
			options: true
		},
		numFormat: {
			label: 'Decimal Separator',
			desc: 'Display numbers in US or European format',
			options: ['us', 'eu']
		},
		shortNums: {
			label: 'Short Numbers',
			desc: 'Shorten large numbers with suffixes',
			options: true
		}
	},

};

/**
 * Initialization method. This is the first thing that gets called
 * when the script runs, and all methods that need to be invoked on
 * startup should get called from here in the order needed.
 */
CM.init = function() {

	var self = this;

	/**
	 * Perform a quick check to make sure CM can run correctly
	 */
	if(this.integrityCheck()) {

		this.attachStyleSheet(this.config.cmCSS);
		this.attachSettingsPanel();
		this.cleanUI();

		// All done :)
		this.config.cmIsLoaded = true;
		Game.Popup('CookieMaster version ' + this.config.cmVersion + ' loaded successfully!');

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
 * Clean up the game interface a little. Most of these are borrowed
 * from Cookie Monster :)
 */
CM.cleanUI = function() {

	var $game = this.config.ccGame,
		gameFixes =
		'-webkit-touch-callout: none;' +
		'-webkit-user-select: none;' +
		'-khtml-user-select: none;' +
		'-moz-user-select: none;' +
		'-ms-user-select: none;' +
		'-o-user-select: none;' +
		'user-select: none;' +
		'top: 0;';

	$('#topBar').css('display', 'none');
	$game.css('cssText', gameFixes);
	$game.find('#cookies').css({
		'background': 'rgba(0,0,0,0.75)',
		'border-top': '1px solid black',
		'border-bottom': '1px solid black'
	});
	$game.find('#tooltip').css({
		'margin-top': '32px',
		'pointer-events': 'none'
	});

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
CM.largeNumFormat = function(num, floats, decSep) {

	var decSep = decSep || this.config.cmDecimalSeparator,
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

	for(var i = 0; i < ranges.length; i++) {

		if(num >= ranges[i].divider) {
			num = (num / ranges[i].divider).toFixed(3) + ' ' + ranges[i].suffix;
			// Apply localization if necessary
			if(decSep === ',') {
				return num.replace('.', ',');
			} else {
				return num;
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

	var settings = this.config.settings,
		items = [],
		$wrapper = $('#wrapper'),
		$cmSettingsPanel = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsTitle = $('<h2 />').attr('id', 'CMSettingsTitle').text('CookieMaster Settings'),
		$cmSettingsList = $('<ul />').attr('id', 'CMSettingsList');

		// Build each setting item
		$.each(settings, function() {
			items.push('<li class="setting">' + this.label + '</li>');

		});

		// Glue it together
		$cmSettingsList.append(items.join(''));
		$cmSettingsPanel.append($cmSettingsTitle);
		$cmSettingsPanel.append($cmSettingsList);

		// Attach to DOM
		$wrapper.append($cmSettingsPanel);

};

/**
 * Dynamically attach a stylesheet to the DOM
 */
CM.attachStyleSheet = function(url) {

	var $styleSheet = $('<link>'),
		$insertedSheet;

	$('head').append($styleSheet);
	$insertedSheet = $("head").children(":last");
	$insertedSheet.attr({
		'type': 'text/css',
		'rel': 'sylesheet',
		'href': url,
		'id': 'CMStyles'
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

	return CM.largeNumFormat(what, floats, CM.config.cmDecimalSeparator);

}
/* ===========================================
	END COOKIE CLICKER FUNCTION OVERRIDES
=========================================== */
