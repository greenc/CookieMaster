/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.5.0
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
 * This file acts as a bootstrap to load the CookieMaster dependencies and scripts.
 * It enables us to request the latest version of all files without users having
 * to update their bookmarks :)
 */
if(typeof CM === 'undefined') {

	(function() {

		var version = '1.5.0',
			jquery = document.createElement('script'),
			cmex = document.createElement('script'),
			cmjs = document.createElement('script'),
			cmcss = document.createElement('link'),
			sources = [
				'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
				'../cookiemaster/src/external-methods.js?v=' + version,
				'../cookiemaster/src/cookiemaster.js?v=' + version,
				'../cookiemaster/src/cookiemaster.css?v=' + version
			];

		cmcss.rel  = 'stylesheet';
		cmcss.type = 'text/css';
		cmcss.href = sources[3];

		// Load external script once jQuery is loaded
		jquery.onload = function() {
			document.body.appendChild(cmex).setAttribute('src', sources[1]);
		};

		// Load cookiemaster script once external script is loaded
		cmex.onload = function() {
			document.body.appendChild(cmjs).setAttribute('src', sources[2]);
		};

		document.head.appendChild(cmcss);
		document.body.appendChild(jquery).setAttribute('src', sources[0]);

	})();

} else {

	Game.Popup('CookieMaster is already loaded!');

}