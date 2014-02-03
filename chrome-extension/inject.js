chrome.extension.sendMessage({}, function(response) {

	var readyStateCheckInterval = setInterval(function() {

		if (document.readyState === "complete") {

			clearInterval(readyStateCheckInterval);

			// Create script elements
			var cmcss     = document.createElement('link'),
				uien      = document.createElement('link'),
				jquery    = document.createElement('script'),
				jsapi     = document.createElement('script'),
				cmex      = document.createElement('script'),
				cmjs      = document.createElement('script'),
				corechart = document.createElement('script');

			// Set CSS file attributes
			cmcss.rel  = 'stylesheet';
			cmcss.type = 'text/css';
			cmcss.href = chrome.extension.getURL('build/cookiemaster.css');

			uien.rel  = 'stylesheet';
			uien.type = 'text/css';
			uien.href = chrome.extension.getURL('lib/ui+en.css');

			// Set async on scripts
			jquery.async    = false;
			jsapi.async     = false;
			cmex.async      = false;
			cmjs.async      = false;
			corechart.async = false;

			// Set script sources
			jquery.src     = chrome.extension.getURL('lib/jquery-2.1.0.min.js');
			jsapi.src      = chrome.extension.getURL('lib/jsapi.js');
			cmex.src       = chrome.extension.getURL('build/external-methods.js');
			cmjs.src       = chrome.extension.getURL('build/cookiemaster.js');
			corechart.src  = chrome.extension.getURL('lib/corechart.js');

			// Append the scripts
			(document.head||document.documentElement).appendChild(cmcss);
			(document.head||document.documentElement).appendChild(uien);
			(document.body||document.documentElement).appendChild(jsapi);
			(document.body||document.documentElement).appendChild(corechart);
			(document.body||document.documentElement).appendChild(jquery);
			(document.body||document.documentElement).appendChild(cmex);
			(document.body||document.documentElement).appendChild(cmjs);

		}

	}, 10);

});