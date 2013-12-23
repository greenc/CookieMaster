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

	version: '0.1',										// CookieMaster version
	ccTargetVersion: '1.0402',							// Cookie Clicker supported version
	ccURL: 'http://orteil.dashnet.org/cookieclicker/',	// Cookie Clicker URL
	ccVersion: '',										// Cookie Clicker reported verison
	ccGame: {},											// Cookie Clicker game wrapper
	settings: {}										// User config settings

};

/**
 * Initialization method
 */
CM.init = function() {

	var self = this;

	if(this.integrityCheck()) {

		this.cleanUI();
		Game.Popup('CookieMaster version ' + this.config.version + ' loaded successfully!');

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

	if(document.location.href.indexOf(this.config.ccURL) !== -1 && Game) {


		// Set the CC version and game wrapper in our global config
		this.config.ccVersion = Game.version.toString();
		this.config.ccGame = $('#game');

		if(this.config.ccVersion !== this.config.ccTargetVersion) {

			this.alertError("Error: This version of Cookie Clicker is not supported.\n\nExpecting version " + this.config.ccTargetVersion);
			return false;

		}

	} else {

		this.alertError('Error: You appear to be trying to load CookieMaster outside of Cookie Clicker');
		return false;

	}

	return true;

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