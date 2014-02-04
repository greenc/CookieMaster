// ==UserScript==
// @name        CookieMaster
// @namespace   http://cookiemaster.co.uk
// @description A feature-rich plugin for Cookie Clicker
// @version     1.0.0
// @include     http://orteil.dashnet.org/cookieclicker/
// @exclude     http://orteil.dashnet.org/cookieclicker/beta/
// @downloadURL http://cookiemaster.co.uk/userscript/cookiemaster.user.js
// @updateURL   http://cookiemaster.co.uk/userscript/cookiemaster.user.js
// @icon        http://cookiemaster.co.uk/site/icons/cookiemaster.icon.user.png
// ==/UserScript==

(function(d){
	d.head
		.appendChild(d.createElement('script'))
		.setAttribute('src','//cookiemaster.co.uk/build/cm-bootstrap.min.js?cb='+new Date().getTime());
})(document);