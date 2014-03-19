CM.Heavenly = (function() {

    /**
     * Get the number of Heavenly Chips from a number of cookies (all time)
     *
     * @param {integer} cookiesNumber
     * @return {integer}
     */
    var cookiesToHeavenly = function(cookies) {

        //cookies = parseInt(cookies, 10);
        return Math.floor(Math.sqrt(2.5 * 1e11 + 2 * cookies) / 1e6 - 0.5);

    };

    /**
     * Get the number of cookies required to have X chips
     *
     * @param {integer} chipsNumber
     * @return {integer}
     */
    var heavenlyToCookies = function(chips) {

        //chips = parseInt(chips, 10);
        return 5 * 1e11 * chips * (chips + 1);

    };

    /**
     * Get the number of cookies remaining to have X chips
     *
     * @param {integer} chipsNumber
     * @return {integer} Returns 0 if number is negative
     */
    var heavenlyToCookiesRemaining = function(chips) {

        //chips = parseInt(chips, 10);
        var remaining = this.heavenlyToCookies(chips) - (Game.cookiesReset + Game.cookiesEarned);

        return remaining > 0 ? remaining : 0;

    };

    /**
     * Returns array of stats for Heavenly Chips
     *
     * @return {Array} [currentHC, currentPercent, maxHC, maxPercent, cookiesToNextHC, totalCookiesToNextHC, timeToNextHC]
     */
    var getHCStats = function() {

        var stats                = [],
            current              = Game.prestige['Heavenly chips'],
            currentPercent       = current * 2,
            max                  = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
            maxPercent           = max * 2,
            cookiesToNext        = this.heavenlyToCookiesRemaining(max + 1),
            totalCookiesToNext   = this.heavenlyToCookies(max + 1) - this.heavenlyToCookies(max),
            timeToNext           = Math.round(cookiesToNext / this.effectiveCps()),
            i;

        stats = [
            current,
            currentPercent,
            max,
            maxPercent,
            cookiesToNext,
            totalCookiesToNext,
            this.formatTime(timeToNext)
        ];

        return stats;

    };

    return {
        cookiesToHeavenly:          cookiesToHeavenly,
        heavenlyToCookies:          heavenlyToCookies,
        heavenlyToCookiesRemaining: heavenlyToCookiesRemaining,
        getHCStats:                 getHCStats
    };

})();