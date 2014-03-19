/**
 * Class for managing individual timers, e.g. Golden Cookie, Frenzies, etc.
 *
 * @param {String} type  reindeer, goldenCookie, frenzy, clickFrenzy,
 *                       elderFrenzy, clot
 * @param {String} label Display label for the timer
 */
CM.Timer = function(type, label) {

    this.type      = type;
    this.label     = label;
    this.id        = 'CMTimer-' + this.type;
    this.container = {};
    this.barOuter  = {};
    this.barInner  = {};
    this.counter   = {};
    this.limiter   = null; // Add only if needed

    /**
     * Create a new timer object
     * @return {Object} Timer HTML as jQuery object
     */
    this.create = function() {

        var timings    = this.getTimings(),
            $container = $('<div />').attr({'class': 'cmTimerContainer cf cmTimer-' + this.type, 'id': this.id}),
            $barOuter  = $('<div />').addClass('cmTimer'),
            $barInner  = $('<div />'),
            $label     = $('<div />').addClass('cmTimerLabel').text(this.label),
            $counter   = $('<div />').addClass('cmTimerCounter').text(Math.round(timings.minCurrent)),
            $limiter   = null, // Not always needed, so we create it further down
            width      = timings.minCurrent / timings.max * 100,
            hardMin;

        // Add a min time indicator if necessary
        if(timings.hasOwnProperty('min') && timings.min > 0) {

            hardMin = timings.min / timings.max * 100;

            // Emphasize the timer if it has reached its minimum spawn time
            if(width < 100 - hardMin) {
                $container.addClass('cmEmphasize');
            }

            $limiter = $('<span />').css('width', hardMin + '%');
            $barOuter.append($limiter);

        }

        $barInner.css('width', width + '%');

        $barOuter.append($barInner);
        $container.append($label, $barOuter, $counter);

        // Update the properties on the Timer object
        this.container = $container;
        this.barOuter  = $barOuter;
        this.barInner  = $barInner;
        this.counter   = $counter;
        this.limiter   = $limiter;

        return $container;

    };

    /**
     * Updates timing values of the timer
     *
     * @return {Object} this
     */
    this.update = function() {

        var $limiter  = this.limiter,
            $barOuter = this.barOuter,
            timings   = this.getTimings(),
            width     = timings.minCurrent / timings.max * 100,
            hardMin;

        if(timings.hasOwnProperty('min') && timings.min) {

            // Add the limiter bar if it doesn't already exist
            // (This could be the case if you import a save into a new, unsaved game)
            if(!this.limiter) {
                $limiter = $('<span />');
                $barOuter.append($limiter);
                this.limiter = $limiter;
            }

            hardMin = timings.min / timings.max * 100;
            this.limiter.css('width', hardMin + '%');

            if(width < 100 - hardMin) {
                this.limiter.fadeOut(500);
                this.container.addClass('cmEmphasize');
            } else {
                this.limiter.show();
                this.container.removeClass('cmEmphasize');
            }

        }

        this.barInner.css('width', width + '%');
        this.counter.text(Math.round(timings.minCurrent));

        return this;

    };

    /**
     * Retrieves the current timings from the game code
     *
     * @return {Object} timings
     */
    this.getTimings = function() {

        var timings   = {},
            lucky     = Game.Has("Get lucky"),
            maxPledge = Game.Has('Sacrificial rolling pins') ? 60 : 30,
            WrinklerT = CM.popWrinklersTimeRelative,
            time      = new Date().getTime();

        if(this.type === 'sp') {
            timings.min = Game.seasonPopup.minTime / Game.fps;
            timings.minCurrent = (Game.seasonPopup.maxTime - Game.seasonPopup.time) / Game.fps;
            timings.max = Game.seasonPopup.maxTime / Game.fps;
        } else if(this.type === 'gc') {
            timings.min = Game.goldenCookie.minTime / Game.fps;
            timings.minCurrent = (Game.goldenCookie.maxTime - Game.goldenCookie.time) / Game.fps;
            timings.max = Game.goldenCookie.maxTime / Game.fps;
        } else if(this.type === 'frenzy') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 77 + 77 * lucky;
        } else if(this.type === 'clickFrenzy') {
            timings.minCurrent = Game.clickFrenzy / Game.fps;
            timings.max = 13 + 13 * lucky;
        } else if(this.type === 'elderFrenzy') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 6 + 6 * lucky;
        } else if(this.type === 'clot') {
            timings.minCurrent = Game.frenzy / Game.fps;
            timings.max = 66 + 66 * lucky;
        } else if(this.type === 'pledge') {
            timings.minCurrent = Game.pledgeT / Game.fps;
            timings.max = 60 * maxPledge;
        } else if(this.type === 'wrinklers') {
            timings.minCurrent = (CM.popWrinklersTime - time) / 1000;
            timings.max = WrinklerT / 1000;
        }

        return timings;

    };

    /**
     * Shows timer if hidden
     *
     * @return {Object} this
     */
    this.show = function() {

        if(this.container.is(':hidden')) {

            var $content = this.container.children();

            $content.css('opacity', 0);
            this.container.slideDown(200, function() {
                $content.animate({'opacity': 1}, 200);
            });

        }

        return this;

    };

    /**
     * Hides timer if visible
     *
     * @return {Object} this
     */
    this.hide = function() {

        if(this.container.is(':visible')) {

            var $container = this.container;

            this.container.children().animate({'opacity': 0}, 200, function() {
                $container.slideUp(200);
            });

        }

        return this;

    };

};