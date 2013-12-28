/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.1.3
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

		var version = '1.1.3',
			jquery = document.createElement('script'),
			cmjs = document.createElement('script'),
			cmcss = document.createElement('link'),
			sources = [
				'//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js',
				'//rawgithub.com/greenc/CookieMaster/master/build/cookiemaster.min.js?v=' + version,
				'//rawgithub.com/greenc/CookieMaster/master/build/cookiemaster.min.css?v=' + version
			];

		cmcss.rel  = 'stylesheet';
		cmcss.type = 'text/css';
		cmcss.href = sources[2];

		// Load cookiemaster script once jQuery is loaded
		jquery.onload = function() {
			document.body.appendChild(document.createElement('script')).setAttribute('src', sources[1]);
		};

		document.head.appendChild(cmcss);
		document.body.appendChild(jquery).setAttribute('src', sources[0]);

	})();

} else {

	Game.Popup('CookieMaster is already loaded!');

}
