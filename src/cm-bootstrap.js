/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version:      1.10.3
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

/*global CM:false,google:false*/

/**
 * This file acts as a bootstrap to load the CookieMaster dependencies and scripts.
 * It enables us to request the latest version of all files without users having
 * to update their bookmarks :)
 */
if(typeof CM === 'undefined') {

	(function() {

		var version = '1.10.3',
			cmcss   = document.createElement('link'),
			jquery  = document.createElement('script'),
			jsapi   = document.createElement('script'),
			cmex    = document.createElement('script'),
			cmjs    = document.createElement('script');

		// Set CSS file attributes
		cmcss.rel  = 'stylesheet';
		cmcss.type = 'text/css';
		cmcss.href = '../cookiemaster/src/cookiemaster.css?v=' + version;

		// Set async on scripts
		jquery.async = false;
		jsapi.async  = false;
		cmex.async   = false;
		cmjs.async   = false;

		// Set script sources
		jquery.src = '//ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.0.min.js';
		jsapi.src  = '//www.google.com/jsapi';
		cmex.src   = '../cookiemaster/src/external-methods.js?v=' + version;
		cmjs.src   = '../cookiemaster/src/cookiemaster.js?v='     + version;

		// Add to DOM
		document.head.appendChild(cmcss);
		document.body.appendChild(jquery);
		document.body.appendChild(jsapi);
		document.body.appendChild(cmex);
		document.body.appendChild(cmjs);

	})();

} else {

	CM.message('<strong>Error:</strong> CookieMaster is already loaded!', 'error');

}