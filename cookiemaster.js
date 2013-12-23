/**
 * We will expose all methods and properties of CookieMaster
 * through the parent object
 * @type {Object}
 */
CM = {};

/**
 * Configuration settings
 * @type {Object}
 */
CM.config = {

	cmVersion: '0.1',									// CM version
	cmIsLoaded: false,									// CM loaded flag
	cmDecimalSeparator: '.',							// CM . or , separator

	ccTargetVersion: '1.0402',							// CC supported version
	ccURL: 'http://orteil.dashnet.org/cookieclicker/',	// CC URL
	ccVersion: '',										// CC reported verison
	ccGame: {},											// CC game wrapper

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
 * Initialization method
 */
CM.init = function() {

	var self = this;

	if(this.integrityCheck()) {

		this.attachStyleSheet();
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
 * Check that CookieMaster can run correctly
 * @return {boolean}
 */
CM.integrityCheck = function() {

	var error = null;

	if(this.config.cmIsLoaded) {
		// Already loaded
		error = 'CookieMaster is already running!';
	} else if(document.location.href.indexOf(this.config.ccURL) === -1) {
		// Wrong URL
		error = 'This isn\'t the Cookie Clicker URL';
	} else if(!window.jQuery) {
		// jQuery isn't loaded
		error = 'jQuery is not loaded';
	} else if(!Game) {
		// Game class doesn't exist
		error = 'Cookie Clicker Game() does not appear to be initialized';
	} else if(Game.version.toString() !== this.config.ccTargetVersion) {
		// Wrong version
		error = 'This version of Cookie Clicker is not supported. Expecting version ' + this.config.ccTargetVersion;
	}

	if(error) {

		// Alert user to the error and quit
		this.alertError('Error: ' + error);
		return false;

	} else {

		// Set the CC version and game wrapper in our global config
		this.config.ccVersion = Game.version.toString();
		this.config.ccGame = $('#game');

		return true;
	}

};

/**
 * Clean up the game interface a little
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
 * format very large numbers with their appropriate suffix
 * @param  {integer} num The number to be formatted
 * @param  {integer} floats Amount of decimal places required
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

CM.attachSettingsPanel = function() {

	var settings = this.config.settings,
		items = [],
		$wrapper = $('#wrapper'),
		$cmSettingsPanel = $('<div />').attr('id', 'CMSettingsPanel'),
		$cmSettingsTitle = $('<h2 />').attr('id', 'CMSettingsTitle').text('CookieMaster Settings');
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

CM.attachStyleSheet = function() {

	var ss = document.createElement("link");
	ss.type = "text/css";
	ss.rel = "stylesheet";
	ss.href = "//raw.github.com/greenc/CookieMaster/master/styles.css";
	document.getElementsByTagName("head")[0].appendChild(ss);

}

/**
 * Remove all traces of CookieMaster
 */
CM.suicide = function() {
	// TO DO: Implement this functionality
	alert('This kills the CookieMaster.');
};

/**
 * Alert user to errors (expand later)
 * @param  {string} msg The error message
 */
CM.alertError = function(msg) {
	alert(msg);
};

// Start it up!
CM.init();


/*  ===========================================
		COOKIE CLICKER FUNCTION OVERRIDES
	=========================================== */

/**
 * Override for default CC number formatting
 * @param {integer} what   The number to beautify
 * @param {integer} floats Number of decimal places desired :/
 */
function Beautify(what, floats) {

	var floats = floats || 0;

	return CM.largeNumFormat(what, floats, CM.config.cmDecimalSeparator);

}
/*  ===========================================
		END COOKIE CLICKER FUNCTION OVERRIDES
	=========================================== */
