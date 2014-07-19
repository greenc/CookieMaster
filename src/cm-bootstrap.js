/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version: 1.17.13
    License: MIT
    Website: http://cookiemaster.co.uk
    GitHub:  https://github.com/greenc/CookieMaster
    Author:  Chris Green
    Email:   c.robert.green@gmail.com

    This code was written to be used, abused,
    extended and improved upon. Feel free to do
    with it as you please, with or without
    permission from, nor credit given to the
    original author (me).

================================================ */

/*global CM:false*/

/**
 * This file acts as a bootstrap to load the CookieMaster dependencies and scripts.
 * It enables us to request the latest version of all files without users having
 * to update their bookmarks :)
 */
if(typeof CM === 'undefined') {

    (function() {

        var version = '1.17.13',
            docFrag = document.createDocumentFragment(),
            deps    = [
                {
                    // CookieMaster CSS
                    type:    'link',
                    url:     '../cookiemaster/build/cookiemaster.css',
                    async:   true,
                    nocache: true
                },
                {
                    // jQuery
                    type:    'script',
                    url:     'http://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.1.0.min.js',
                    async:   false,
                    nocache: false
                },
                {
                    // Google Charts API
                    type:    'script',
                    url:     'http://www.google.com/jsapi',
                    async:   false,
                    nocache: false
                },
                {
                    // CookieMaster Script
                    type:    'script',
                    url:     '../cookiemaster/build/cookiemaster.js',
                    async:   false,
                    nocache: true
                },
            ],
            dep, el, qp, i;

        /**
         * Create an element for each dependency and
         * append to a document fragment
         */
        for(i = 0; i < deps.length; i++) {

            dep = deps[i];                            // Dependency
            el  = document.createElement(dep.type);   // Create element
            qp  = dep.nocache ? '?v=' + version : ''; // Append cache buster

            if(dep.type === 'link') {
                el.rel  = 'stylesheet';
                el.href = dep.url + qp;
            } else if(dep.type === 'script') {
                el.src = dep.url + qp;
            }

            el.async = dep.async;    // Set async for ordered parsing
            docFrag.appendChild(el); // Append to document fragment

        }

        /**
         * Append fragment to DOM
         */
        document.head.appendChild(docFrag);

    })();

} else {

    CM.message('<strong>Error:</strong> CookieMaster is already loaded!', 'error');

}