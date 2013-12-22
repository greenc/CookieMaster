CookieMaster = {};

/**
 * Configuration settings for CookieMaster
 * @type {Object}
 */
CookieMaster.config = {

	// CookieMaster specific settings
	version: '0.1',
	CCTargetVersion: '1.0402',

	// CookieMaster user settings
	settings: {},

	// Cookie Clicker settings
	CCVersion = ''

};

CookieMaster.init = function() {
	var el = document.createElement('h1');
	el.textContent = 'SUCCESS!!!!';
	document.body.appendChild(el);
}

// Start it up!
CookieMaster.init();