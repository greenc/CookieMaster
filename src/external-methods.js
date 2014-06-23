/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version: 1.17.8
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

    The methods in this file are adapted from
    code used in the following repo:

    https://github.com/Anahkiasen/cookie-monster

    All credit for the functionality behind these
    methods goes to Maxime Fabre - ehtnam6@gmail.com

================================================ */

/*global CM:false */

/**
 * Create new global objects for these methods to work on
 * @type {Object}
 */
var CME  = {};
var CMEO = {};

CME.cacheStore = {};

CME.informations = {
    items    : [],
    bonus    : [],
    bci      : [],
    roi      : [],
    timeLeft : []
};

CME.milkPotentials = {
    'Kitten helpers'            : 0.05,
    'Kitten workers'            : 0.1,
    'Kitten engineers'          : 0.2,
    'Kitten overseers'          : 0.2,
    'Santa\'s milk and cookies' : 0.05
};

//////////////////////////////////////////////////////////////////////
/////////////////////////////// TRUE WORTH ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Compute how much buying an upgrade/building would earn in
 * additional achievements and bonus
 *
 * @param {Integer} unlocked
 * @param {Integer} upgradeKey
 * @param {Integer} originalIncome
 * @param {Nope}    customMultiplier
 *
 * @return {Integer}
 */
CME.getAchievementWorth = function(unlocked, upgradeKey, originalIncome, customMultiplier) {

    var income           = 0,
        futureMultiplier = 0,
        baseMultiplier   = this.getHeavenlyMultiplier(),
        milkProgress     = Game.milkProgress,
        multiplier,
        projectedIncome,
        newPotential;

    // Swap out heavenly multiplier
    if (typeof customMultiplier === 'undefined') {
        customMultiplier = 0;
    }
    if (customMultiplier !== 0) {
        baseMultiplier = customMultiplier;
    }

    // Loop over the available upgrades and compute the available
    // production multipliers, plus a potential new one unlocked
    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches('Cookie production multiplier <b>+')) {
            baseMultiplier += upgrade.getDescribedInteger();
        }
        if (upgrade.id === upgradeKey && upgrade && !upgrade.bought && upgrade.matches('Cookie production multiplier <b>+')) {
            futureMultiplier += upgrade.getDescribedInteger();
        }
    });

    // Compute a first project income, applying all multipliers to it
    multiplier = this.applyMilkPotential(baseMultiplier, milkProgress);
    projectedIncome = this.computeNewIncome(originalIncome, multiplier);

    // Then we check if the provided upgrade is an Heavenly Upgrade
    newPotential = Game.UpgradesById[upgradeKey].name;
    baseMultiplier    += futureMultiplier;

    // First we increment the milk with the newly unlocked achievements
    // Then we apply all potentials, plus new one, to the multiplier
    // And from there we redo an income projection
    milkProgress += unlocked * 0.04;
    multiplier   = this.applyMilkPotential(baseMultiplier, milkProgress, newPotential);
    income       = this.computeNewIncome(originalIncome, multiplier);

    // Now we check if this new projected income would unlock
    // any "Bake X cookies/s achievements"
    unlocked = this.getUnlockedIncomeAchievements(income);

    // If our new income would unlock achievements, compute their milk bonus
    // And redo the whole routine to do a THIRD projected income (yes)
    if (unlocked > 0) {
        milkProgress += unlocked * 0.04;
        multiplier   = this.applyMilkPotential(baseMultiplier, milkProgress, newPotential);
        income       = this.computeNewIncome(originalIncome, multiplier);
    }

    // Finally deduce our original prevision from the result
    if (customMultiplier === 0) {
        income -= projectedIncome;
    }

    // And apply the covenant deduction if necessary
    if (Game.Has('Elder Covenant')) {
        income *= 0.95;
    }

    return income;
};

/**
 * Apply a differential of multiplier to an income
 *
 * @param {Integer} income
 * @param {Integer} multiplier
 *
 * @return {Integer}
 */
CME.computeNewIncome = function(income, multiplier) {
    return (Game.cookiesPs + income) / Game.globalCpsMult * (multiplier / 100) * this.getFrenzyMultiplier();
};

/**
 * Returns how many cookies/s-related achievements would be unlocked for a given income
 *
 * @param {Integer} cookiesPs
 *
 * @return {Integer}
 */
CME.getUnlockedIncomeAchievements = function(cookiesPs) {
    var unlocked = 0;

    // Cancel if we're during a frenzy
    if (Game.frenzyPower) {
        return 0;
    }

    // Gather the number of achievements that would be unlocked
    Game.AchievementsById.forEach(function (achievement) {
        if (!achievement.won && achievement.matches(' per second.')) {
            if (cookiesPs >= achievement.getDescribedInteger()) {
                unlocked++;
            }
        }
    });

    return unlocked;
};

/**
 * Apply milk potential to a multiplier, optionally specifying
 * a future potential to be unlocked
 *
 * @param {Integer} multiplier
 * @param {Integer} milkProgress
 * @param {String}  futurePotential
 *
 * @return {Integer}
 */
CME.applyMilkPotential = function(multiplier, milkProgress, futurePotential) {
    var milkUpgrades = [],
        potential,
        hasPotential;

    if (typeof milkProgress === 'undefined') {
        milkProgress = Game.milkProgress;
    }

    // Compute current potentials
    for (potential in this.milkPotentials) {
        hasPotential = Game.Has(potential) || potential === futurePotential;
        milkUpgrades.push(hasPotential * this.milkPotentials[potential]);
    }

    // Apply potentials
    multiplier += 100;
    milkUpgrades.forEach(function(modifier) {
        multiplier = multiplier * (1 + modifier * milkProgress);
    });

    return multiplier;
};

//////////////////////////////////////////////////////////////////////
///////////////////////////// INFORMATIONS ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get an array with the min/max CPI/timeLeft
 *
 * @param {String} minOrMax
 *
 * @return {Array}
 */
CME.getBestValue = function(minOrMax) {
    return [
        Math[minOrMax].apply(Math, this.informations.bci),
        Math[minOrMax].apply(Math, this.informations.timeLeft),
        Math[minOrMax].apply(Math, this.informations.roi)
    ];
};

/**
 * Update the stored information about a building
 *
 * @param {Integer} building
 * @param {Array}   information
 */
CME.setBuildingInformations = function (building, informations) {

    this.informations.items[building]    = informations.items;
    this.informations.bonus[building]    = informations.bonus;
    this.informations.bci[building]      = informations.bci;
    this.informations.roi[building]      = informations.roi;
    this.informations.timeLeft[building] = informations.timeLeft;

};

/**
 * Update all of the buildings' information in memory
 *
 * @return {void}
 */
CME.updateBuildingsInformations = function() {
    Game.ObjectsById.forEach(function (building, key) {
        var count = '(<span class="text-blue">' +building.amount+ '</span>)';

        // Save building informations
        CME.setBuildingInformations(key, {
            items    : building.name.split(' ')[0] + ' ' + count,
            bonus    : building.getWorth(true),
            bci      : building.getBaseCostPerIncome(true),
            roi      : building.getReturnInvestment(),
            timeLeft : building.getTimeLeft()
        });
    });
};

//////////////////////////////////////////////////////////////////////
/////////////////////////////// TRUE WORTH ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get how much buying one of a building would earn
 *
 * @param {Object} building
 *
 * @return {Integer}
 */
CME.getBuildingWorth = function(building) {
    return this.simulateBuy(building, 'cookiesPs');
};

/**
 * Get how much buying an upgrade would earn
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CME.getUpgradeWorth = function(upgrade) {
    return this.simulateBuy(upgrade, 'cookiesPs');
};

/**
 * Get the current frenzy multiplier
 *
 * @return {integer}
 */
CME.getFrenzyMultiplier = function() {
    return (Game.frenzy > 0) ? Game.frenzyPower : 1;
};

//////////////////////////////////////////////////////////////////////
///////////////////////////// LUCKY COOKIES //////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get how much a Lucky cookie would yield for a particular context
 * Doesn't take into account current cookies, just the "max" you
 * could get
 *
 * Formula is cookiesPs * 60 * 20 + 13 (for some reason)
 *
 * @param {String} context
 *
 * @return {Integer}
 */
CME.getLuckyTreshold = function(context, income) {
    var reward = (income || Game.cookiesPs);

    // Here we remove the effects of the current multiplier
    // to get the real Cookies/s
    reward /= this.getFrenzyMultiplier();

    // If we want we simulate a frenzy
    if (context === 'frenzy') {
        reward *= 7;
    }

    return Math.round((reward * 60 * 20 + 13) * 10);
};

/**
 * Get the current heavenly multiplier
 *
 * @return {integer}
 */
CME.getHeavenlyMultiplier = function() {
    var chips     = Game.prestige['Heavenly chips'] * 2,
        potential = 0,
        upgrades = {
            'Heavenly chip secret'   : 0.05,
            'Heavenly cookie stand'  : 0.2,
            'Heavenly bakery'        : 0.25,
            'Heavenly confectionery' : 0.25,
            'Heavenly key'           : 0.25
        },
        upgrade;

    // Apply the various potentials
    for (upgrade in upgrades) {
        if (Game.Has(upgrade)) {
            potential += upgrades[upgrade];
        }
    }

    return chips * potential;
};

/**
 * Cache the results of a Closure and return it
 *
 * @param {Array}    salts
 * @param {Function} callback
 * @param {Array}    args
 *
 * @return {Mixed}
 */
CME.cache = function(salts, callback, args) {

    var state = [Game.UpgradesOwned, Game.BuildingsOwned, Game.globalCpsMult].join('-'),
        result;

    // Create entry for current state
    if (typeof this.cacheStore[state] === 'undefined') {
        this.refreshCache();
        this.cacheStore[state] = {};
    }

    // Compute salts
    args  = args || [];
    salts = this.computeSalts(salts, args);

    // If we have a cached result, return it
    if (typeof this.cacheStore[state][salts] !== 'undefined') {
        return this.cacheStore[state][salts];
    }

    // Else compute results and cache it
    result = callback.apply(this, args);
    this.cacheStore[state][salts] = result;

    return result;
};

/**
 * Call a CookieMaster method and cache it
 *
 * @param {String} method
 * @param {Array} args
 * @param {Array} salts
 *
 * @return {Mixed}
 */
CME.callCached = function(method, args, salts) {
    salts = salts || [];
    salts.push(method);

    return this.cache(salts, this[method], args);
};

/**
 * Refresh the cache
 *
 * @return {void}
 */
CME.refreshCache = function() {
    this.cacheStore = {};
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////// HELPERS /////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Compute salts from arguments an salts
 *
 * @param {Array} salts
 * @param {Array} args
 *
 * @return {String}
 */
CME.computeSalts = function(salts, args) {
    salts = salts.concat(args);

    // Get the objects identifiers as salt
    for (var i = 0; i < salts.length; i++) {
        if (typeof salts[i].identifier !== 'undefined') {
            salts[i] = salts[i].identifier();
        }
    }

    return salts.join('-');
};

/**
 * Round a number to the nearest decimal
 *
 * @param {Integer} number
 *
 * @return {Integer}
 */
CME.roundDecimal = function(number) {
    return Math.round(number * 100) / 100;
};

/**
 * Computes the time (s) required to buy a building/upgrade
 *
 * @param {Object} object
 *
 * @return {Integer}
 */
CME.secondsLeft = function(object) {
    // Get the price of the object we want and how much we need
    var realPrice = Game.cookies - object.getPrice();

    // If we're not making any cookies, or have
    // enough already, return 0
    if (Game.cookiesPs === 0 || realPrice > 0) {
        return 0;
    }

    return Math.round(Math.abs(realPrice) / CM.effectiveCps());
};

/**
 * Compute the time left before a deficit is filled
 *
 * @param {Integer} deficit
 *
 * @return {String}
 */
CME.getTimeToCookies = function(cookies) {
    return CM.formatTime(cookies / CM.effectiveCps(), true);
};

//////////////////////////////////////////////////////////////////////
//////////////////////////////// HELPERS /////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the identifier of an object
 *
 * @return {Integer}
 */
CMEO.identifier = function() {
    return 'cookie-master__'+this.getType()+'--'+this.id;
};

/**
 * Check if an object matches against a piece of text
 *
 * @param {String} matcher
 *
 * @return {Boolean}
 */
CMEO.matches = function(matcher) {
    if (!this.desc) {
        return false;
    }

    return this.desc.toLowerCase().indexOf(matcher.toLowerCase()) !== -1;
};

/**
 * Get the integer mentionned in a description
 *
 * @return {Integer}
 */
CMEO.getDescribedInteger = function() {
    if (!this.matches('<b>')) {
        return;
    }

    return this.desc.match(/<b>\+?([\.0-9]+)%?/)[1].replace(/[%,]/g, '') * 1;
};

//////////////////////////////////////////////////////////////////////
////////////////////////////// REFLECTIONS ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the type of an object
 *
 * @return {String}
 */
CMEO.getTypeOf = function() {
    return this instanceof Game.Upgrade ? 'upgrade' : 'object';
};

/*jshint -W014*/

//////////////////////////////////////////////////////////////////////
///////////////////////////// INFORMATIONS ///////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the true worth of an object
 *
 * @param {Boolean} rounded
 *
 * @return {Integer}
 */
CMEO.getWorthOf = function(rounded) {
    var worth = this.getType() === 'upgrade'
        ? CME.callCached('getUpgradeWorth', [this])
        : CME.callCached('getBuildingWorth', [this]);

    return rounded ? CME.roundDecimal(worth) : worth;
};

/**
 * Get the Best Cost per Income
 *
 * @param {Boolean} rounded
 *
 * @return {Integer}
 */
CMEO.getBaseCostPerIncome = function(rounded) {
    var worth         = this.getWorth(),
        bci;

    // If this upgrade increases CpC, add clicking gains to BCI
    if(this.getType() === 'upgrade' && this.isClickingRelated()) {
        worth = worth + (this.getClickingWorth() * CM.clickTracker.clicksPs);
    }

    bci = CME.roundDecimal(this.getPrice() / worth);

    if (worth < 0) {
        return Infinity;
    }

    return rounded ? CME.roundDecimal(bci) : bci;
};

/**
 * Get the Return On Investment
 *
 * @return {Integer}
 */
CMEO.getReturnInvestment = function() {
    var worth = this.getWorth();

    return this.price * (worth + Game.cookiesPs) / worth;
};

/**
 * Get the time left for this Object
 *
 * @return {String}
 */
CMEO.getTimeLeft = function() {
    return CME.secondsLeft(this);
};

/**
 * Get the core statistics for comparaisons
 *
 * @return {Array}
 */
CMEO.getComparativeInfos = function() {
    return [
        this.getBaseCostPerIncome(),
        this.getTimeLeft(),
        this.getReturnInvestment(),
    ];
};

/**
 * Get the colors assigned to this object
 *
 * @return {Array}
 */
CMEO.getColors = function() {
    return CME.computeColorCoding(this.getComparativeInfos());
};

/**
 * Get the lucky alerts for a price
 *
 * @param {Object} object
 *
 * @return {Array}
 */
CME.getThresholdAlerts = function(object) {
    var price     = object.getPrice(),
        newIncome = Game.cookiesPs + object.getWorth(),
        reqChain  = CM.requiredChainTier('bank', 'this', CM.maxChainReward()),
        deficits  = [0, 0, 0],
        rewards   = [
            this.getLuckyTreshold(false),
            this.getLuckyTreshold('frenzy'),
            reqChain
        ];

    // Check Lucky alert
    if (Game.cookies - price < rewards[0]) {
        deficits[0] = rewards[0] - (Game.cookies - price);
    }

    // Check Lucky Frenzy alert
    if (Game.cookies - price < rewards[1]) {
        deficits[1] = rewards[1] - (Game.cookies - price);
    }

    // Check Chain alert
    if (reqChain !== false && Game.cookies - price < rewards[2]) {
        deficits[2] = rewards[2] - (Game.cookies - price);
    }

    return deficits;
};

/**
 * Get the color coding for a set of informations
 *
 * @param {Array} informations
 *
 * @return {Array}
 */
CME.computeColorCoding = function(informations) {
    var colors    = ['yellow', 'yellow', 'yellow'],
        maxValues = this.getBestValue('max'),
        minValues = this.getBestValue('min'),
        i;

    // Compute color
    for (i = 0; i < informations.length; i++) {
        if (informations[i] === Infinity) {
            colors[i] = 'greyLight';
        } else if (informations[i] < minValues[i]) {
            colors[i] = 'blue';
        } else if (informations[i] === minValues[i]) {
            colors[i] = 'green';
        } else if (informations[i] === maxValues[i]) {
            colors[i] = 'red';
        } else if (informations[i] > maxValues[i]) {
            colors[i] = 'purple';
        } else if (maxValues[i] - informations[i] < informations[i] - minValues[i]) {
            colors[i] = 'orange';
        }
    }

    // As ROI only has one color, use that one
    if (informations[2] === minValues[2]) {
        colors[2] = 'cyan';
    }

    return colors;
};

/**
 * Check if an upgrade is in store
 *
 * @param {Array} upgrade
 *
 * @return {Boolean}
 */
CMEO.isInStore = function() {
    return Game.UpgradesInStore.indexOf(this) !== -1;
};

/**
 * Simulate buying an object and return change in a statistic
 *
 * @param {Object} object
 * @param {String} statistic The statistic to watch
 *
 * @return {Integer}
 */
CME.simulateBuy = function(object, statistic) {

    // Store initial state
    ////////////////////////////////////////////////////////////////////

    // Don't simulate if this is an upgrade that has been bought already
    if(object.getType() === 'upgrade' && object.bought > 0) {
        return 0;
    }
    // Don't simulate seasonal upgrades, Elder pledge/Covenant or Santa's hat
    var doNotSimulate = [74, 84, 85, 152, 181, 182, 183, 184, 185, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229];
    if(doNotSimulate.indexOf(object.id) !== -1) {
        return 0;
    }

    // Disable some native methods
    var swapped = {
            SetResearch : Game.SetResearch,
            Popup       : Game.Popup,
            Win         : Game.Win,
            Unlock      : Game.Unlock,
            Collect     : Game.CollectWrinklers
        },
        stored = {
            seasonUses       : Game.seasonUses,
            cpsSucked        : Game.cpsSucked,
            globalCpsMult    : Game.globalCpsMult,
            cookiesPs        : Game.cookiesPs,
            computedMouseCps : Game.computedMouseCps,
            pledges          : Game.pledges,
            elderWrath       : Game.elderWrath
        },
        income;

    Game.SetResearch      = function() {};
    Game.Popup            = function() {};
    Game.Win              = function() {};
    Game.Unlock           = function() {};
    Game.CollectWrinklers = function() {};

    // Simulate buy and store result
    ////////////////////////////////////////////////////////////////////

    // Simulate buy and store statistic
    object.simulateToggle(true);
    Game.CalculateGains();
    income = Game[statistic];

    // Restore initial state
    ////////////////////////////////////////////////////////////////////

    // Reverse buy
    object.simulateToggle(false);
    Game.seasonUses       = stored.seasonUses;
    Game.cpsSucked        = stored.cpsSucked;
    Game.globalCpsMult    = stored.globalCpsMult;
    Game.cookiesPs        = stored.cookiesPs;
    Game.computedMouseCps = stored.computedMouseCps;
    Game.pledges          = stored.pledges;
    Game.elderWrath       = stored.elderWrath;

    // Restore native methods
    Game.SetResearch      = swapped.SetResearch;
    Game.Popup            = swapped.Popup;
    Game.Win              = swapped.Win;
    Game.Unlock           = swapped.Unlock;
    Game.CollectWrinklers = swapped.Collect;

    return income - Game[statistic];
};

//////////////////////////////////////////////////////////////////////
/////////////////////////////// BUILDINGS ////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Toggle bought state of a building
 *
 * @param {Boolean} buyOrReverse Buy or reverse
 *
 * @return {void}
 */
CMEO.simulateBuildingToggle = function(buyOrReverse) {
    if (buyOrReverse) {
        this.amount++;
        this.bought++;
        if (this.buyFunction) {
            this.buyFunction();
        }
    } else {
        this.amount--;
        this.bought--;
        if (this.sellFunction) {
            this.sellFunction();
        }
    }
};

//////////////////////////////////////////////////////////////////////
////////////////////////////// UPGRADES //////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Toggle bought state of an upgrade
 *
 * @param {Boolean} buyOrReverse Buy or reverse
 *
 * @return {void}
 */
CMEO.simulateUpgradeToggle = function(buyOrReverse) {
    if (buyOrReverse) {
        this.bought = 1;
        if (this.buyFunction) {
            this.buyFunction();
        }
        if (this.hide !== 3) {
            Game.UpgradesOwned++;
        }
    } else {
        this.bought = 0;
        if (this.hide !== 3) {
            Game.UpgradesOwned--;
        }
    }
};

/**
 * Checks if an upgrade is clicking related or not
 *
 * @return {Boolean}
 */
CMEO.isClickingRelated = function() {
    return this.matches('Clicking') || this.matches('The mouse');
};

/**
 * Get the true worth of a clicking upgrade
 *
 * @return {Integer}
 */
CMEO.getClickingWorth = function() {
    return CME.callCached('getClickingUpgradeWorth', [this]);
};

/**
 * Get how much buying an upgrade would boost clicking CPS
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CME.getClickingUpgradeWorth = function(upgrade) {
    return this.simulateBuy(upgrade, 'computedMouseCps');
};

/**
 * Try to make tooltip stay on the screen
 *
 * @return {void}
 */
CME.controlTooltipPosition = function() {

    var yMax     = Game.mouseY,
        $tooltip = CM.config.ccTooltip,
        $anchor  = CM.config.ccTooltipAnchor;

    if (this.tooltipLastObjectId) {
        yMax = $(window).height() - $tooltip.outerHeight();
        yMax -= 40; // distance beetwen tooltip and anchor
        yMax = yMax < -40 ? -40 : yMax;
        yMax = Game.mouseY < yMax ? Game.mouseY : yMax;
    }

    $anchor.offset({
        top: yMax,
        left: Game.mouseX
    });

};
