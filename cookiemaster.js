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

	ccTargetVersion: '1.0402',							// CC supported version
	ccURL: 'http://orteil.dashnet.org/cookieclicker/',	// CC URL
	ccVersion: '',										// CC reported verison
	ccGame: {},											// CC game wrapper

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

		this.cleanUI();
		Game.Popup('CookieMaster version ' + this.config.cmVersion + ' loaded successfully!');

	} else {

		this.suicide();
		return false;

	}

}

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
	} else if(this.config.ccVersion !== this.config.ccTargetVersion) {
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

}

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

}

/**
 * format very large numbers with their appropriate suffix
 * @param  {integer} num The number to be formatted
 * @return {string}     Formatted number with suffix
 */
CM.largeNumFormat = function(num) {
	if (num >= 1000000000000000000000) {
	return (num / 1000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'Sx';
	}
	if (num >= 1000000000000000000) {
	return (num / 1000000000000000000).toFixed(1).replace(/\.0$/, '') + 'Qi';
	}
	if (num >= 1000000000000000) {
	return (num / 1000000000000000).toFixed(1).replace(/\.0$/, '') + 'Qa';
	}
	if (num >= 1000000000000) {
	return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
	}
	if (num >= 1000000000) {
	return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
	}
	if (num >= 1000000) {
	return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
	}
	return num;
}

/**
 * Remove all traces of CookieMaster
 */
CM.suicide = function() {
	// ToDo: Implement this
	alert('This kills the CookieMaster.');
}

/**
 * Alert user to errors (expand later)
 * @param  {string} msg The error message
 */
CM.alertError = function(msg) {
	alert(msg);
}

// Start it up!
CM.init();


/*  ===========================================
		COOKIE CLICKER FUNCTION OVERRIDES
	=========================================== */

/**
 * Override for default CC number formatting
 * @param {integer} what   The number to beautify
 * @param {integer} floats Not actually sure :/
 */
function Beautify(what, floats) {

	return CM.largeNumFormat(what);

}
/*  ===========================================
		END COOKIE CLICKER FUNCTION OVERRIDES
	=========================================== */
