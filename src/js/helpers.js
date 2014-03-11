///////////////////////////////////////////////
// Generic helper methods
///////////////////////////////////////////////

CM.Helpers = (function() {

    /**
     * Returns index of version number in the array of known
     * compatible versions
     *
     * @param  {String}  version CC version
     * @return {Integer}
     */
    var compatibilityCheck = function(version) {

        var vArray = this.config.ccCompatibleVersions,
            i;

        for(i = 0; i < vArray.length; i++) {
            if(vArray[i].match(version)) {
                return i;
            }
        }

        return -1;

    };

    /**
     * Capitalize the first letter of each word
     *
     * @param  {String} str String to process
     * @return {String}
     */
    var toTitleCase = function(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    };

    /**
     * Compares 2 version numbers
     * @param  {String} v1      version number 1
     * @param  {String} v2      version number 2
     * @param  {Object} options optional params to control sorting and matching behaviour
     * @return {Integer}         -1|0|1
     */
    var versionCompare = function(v1, v2, options) {

        var lexicographical = options && options.lexicographical,
            zeroExtend = options && options.zeroExtend,
            v1parts = v1.split('.'),
            v2parts = v2.split('.'),
            i;

        function isValidPart(x) {
            return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
        }

        if(!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
            return NaN;
        }

        if(zeroExtend) {
            while(v1parts.length < v2parts.length) {
                v1parts.push('0');
            }
            while(v2parts.length < v1parts.length){
                v2parts.push('0');
            }
        }

        if(!lexicographical) {
            v1parts = v1parts.map(Number);
            v2parts = v2parts.map(Number);
        }

        for(i = 0; i < v1parts.length; ++i) {
            if(v2parts.length === i) {
                return 1;
            }
            if(v1parts[i] === v2parts[i]) {
                continue;
            }
            else if(v1parts[i] > v2parts[i]) {
                return 1;
            }
            else {
                return -1;
            }
        }

        if(v1parts.length !== v2parts.length) {
            return -1;
        }

        return 0;

    };

    /**
     * Format a time (s) to an human-readable format
     *
     * @param {Integer} time
     * @param {String}  compressed  Compressed output (minutes => m, etc.)
     *
     * @return {String}
     */
    var formatTime = function(t, compressed) {

        // Compute each units separately
        var time    = Math.round(t),
            days    = parseInt(time / 86400) % 999,
            hours   = parseInt(time / 3600) % 24,
            minutes = parseInt(time / 60) % 60,
            seconds = time % 60,
            units   = [' days, ', ' hours, ', ' minutes, ', ' seconds'],
            formatted;

        if (typeof compressed === 'undefined') {
            compressed = false;
        }

        // Take care of special cases
        if (!isFinite(time)) {
            return 'Never';
        } else if (time / 86400 > 1e3) {
            return '> 1,000 days';
        }

        if (!compressed) {
            if (days === 1) {
                units[0] = ' day, ';
            }
            if (hours === 1) {
                units[1] = ' hour, ';
            }
            if (minutes === 1) {
                units[2] = ' minute, ';
            }
            if (seconds === 1) {
                units[3] = ' second';
            }
        } else {
            units = ['d, ', 'h, ', 'm, ', 's'];
        }

        // Create final string
        formatted = '';
        if (days > 0) {
            formatted += days + units[0];
        }
        if (days > 0 || hours > 0) {
            formatted += hours + units[1];
        }
        if (days > 0 || hours > 0 || minutes > 0) {
            formatted += minutes + units[2];
        }
        if (days > 0 || hours > 0 || minutes > 0 || seconds > 0) {
            formatted += seconds + units[3];
        }

        return formatted;
    };

    var fixNewGameSpawns = function() {
        Game.goldenCookie.minTime = Game.goldenCookie.getMinTime();
        Game.goldenCookie.maxTime = Game.goldenCookie.getMaxTime();
        Game.seasonPopup.minTime  = Game.seasonPopup.getMinTime();
        Game.seasonPopup.maxTime  = Game.seasonPopup.getMaxTime();
        Game.goldenCookie.toDie   = 0;
        Game.seasonPopup.toDie    = 0;
    };

    return {
        compatibilityCheck: compatibilityCheck,
        toTitleCase:        toTitleCase,
        versionCompare:     versionCompare,
        formatTime:         formatTime,
        fixNewGameSpawns:   fixNewGameSpawns
    };

})();