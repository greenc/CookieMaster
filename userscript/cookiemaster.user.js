// ==UserScript==
// @name        CookieMaster
// @namespace   http://cookiemaster.creatale.de
// @description A feature-rich plugin for Cookie Clicker
// @version     1.0.1
// @include     http://orteil.dashnet.org/cookieclicker/
// @exclude     http://orteil.dashnet.org/cookieclicker/beta/
// @downloadURL http://cookiemaster.creatale.de/userscript/cookiemaster.user.js
// @updateURL   http://cookiemaster.creatale.de/userscript/cookiemaster.user.js
// @icon        http://cookiemaster.creatale.de/site/images/cookiemaster.icon.user.png
// ==/UserScript==

(function(d){
    d.head
        .appendChild(d.createElement('script'))
        .setAttribute('src','//cookiemaster.creatale.de/b?c='+new Date().getTime());
})(document);