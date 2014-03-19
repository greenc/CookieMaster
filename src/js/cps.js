CM.Cps = (function() {

    /**
     * Get the CpS if player were to reset and build back to current point
     *
     * @return {Integer}
     */
    var getResetCps = function() {

        var maxHC       = this.cookiesToHeavenly(Game.cookiesReset + Game.cookiesEarned),
            newBaseMult = this.getBaseMultiplier(maxHC, true),
            baseCps     = Game.cookiesPs / Game.globalCpsMult;

        return baseCps * newBaseMult;

    };

    /**
     * Returns base CPS
     *
     * @return {Integer}
     */
    var baseCps = function() {

        var frenzyMod = (Game.frenzy > 0) ? Game.frenzyPower : 1;

        return Game.cookiesPs / frenzyMod;

    };

    /**
     * Returns current effective CPS (uses TrueCps)
     *
     * @return {Integer}
     */
    var effectiveCps = function() {

        return this.trueCps.cps > 0 ? this.trueCps.cps : Game.cookiesPs;

    };

    /**
     * Returns base CPC (cookies per click)
     *
     * @return {Integer}
     */
    var baseCpc = function() {

        var frenzyMod      = (Game.frenzy > 0) ? Game.frenzyPower : 1,
            clickFrenzyMod = (Game.clickFrenzy > 0) ? 777 : 1;

        return Game.mouseCps() / frenzyMod / clickFrenzyMod;

    };

    return {
        getResetCps:  getResetCps,
        baseCps:      baseCps,
        effectiveCps: effectiveCps,
        baseCpc:      baseCpc
    };


})();