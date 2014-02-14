/* ================================================

    CookieMaster - A Cookie Clicker plugin

    Version: 1.13.0
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
    'Santa\'s milk and cookies' : 0.05,
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
//////////////////////////////// HELPERS /////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Check if the user has won an achievement
 *
 * @param {String} checkedAchievement
 *
 * @return {Boolean}
 */
CME.hasAchievement = function(checkedAchievement) {
    var achievement = Game.Achievements[checkedAchievement];

    return achievement ? achievement.won : false;
};

/**
 * Check if the user hasn't won an achievement
 *
 * @param {string} checkedAchievement
 *
 * @return {Boolean}
 */
CME.hasntAchievement = function(checkedAchievement) {
    return !this.hasAchievement(checkedAchievement);
};

//////////////////////////////////////////////////////////////////////
//////////////////////////// BUILDING SCHEMAS ////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Check if a given building would unlock an amount-related achievement when bought
 *
 * @param {Object} building
 *
 * @return {Boolean}
 */
CME.buildingAmount = function(building) {

    var upgrades = {
        'Cursor': {
            0   : 'Click',
            1   : 'Double-click',
            49  : 'Mouse wheel',
            99  : 'Of Mice and Men',
            199 : 'The Digital',
        },
        'Grandma': {
            0   : 'Grandma\'s Cookies',
            49  : 'Sloppy kisses',
            99  : 'Retirement home',
            149 : 'Friend of the ancients',
            199 : 'Ruler of the ancients',
        },
        'Farm': {
            0  : 'My first farm',
            49 : 'Reap what you sow',
            99 : 'Farm ill',
        },
        'Factory': {
            0  : 'Production chain',
            49 : 'Industrial revolution',
            99 : 'Global warming',
        },
        'Mine': {
            0  : 'You know the drill',
            49 : 'Excavation site',
            99 : 'Hollow the planet',
        },
        'Shipment': {
            0  : 'Expedition',
            49 : 'Galactic highway',
            99 : 'Far far away',
        },
        'Alchemy lab': {
            0  : 'Transmutation',
            49 : 'Transmogrification',
            99 : 'Gold member',
        },
        'Portal': {
            0  : 'A whole new world',
            49 : 'Now you\'re thinking',
            99 : 'Dimensional shift',
        },
        'Time machine': {
            0  : 'Time warp',
            49 : 'Alternate timeline',
            99 : 'Rewriting history',
        },
        'Antimatter condenser': {
            0  : 'Antibatter',
            49 : 'Quirky quarks',
            99 : 'It does matter!',
        },
        'Prism': {
            0  : 'Lone photon',
            49 : 'Dazzling glimmer',
            99 : 'Blinding flash',
            149: 'Unending glow'
        }
    },
    achievement = upgrades[building.name][building.amount];

    // Get unlocked achievements by amount of that building
    if (achievement) {
        return this.hasntAchievement(achievement);
    }

    return false;
};

/**
 * Check if a given building would unlock Base 10 when bought
 *
 * @param {String} checkedBuilding
 *
 * @return {Boolean}
 */
CME.baseTen = function(checkedBuilding) {
    var names   = [],
        amounts = [],
        base,
        i;

    if (this.hasAchievement('Base 10')) {
        return false;
    }

    Game.ObjectsById.forEach(function (building) {
        names.push(building.name);
        amounts.push(building.amount);
    });
    names.forEach(function (names, key) {
        if (names === checkedBuilding) {
            amounts[key]++;
        }
    });

    base = amounts.length * 10;
    for (i = 0; i < amounts.length; i++) {
        if (amounts[i] < base || amounts[i] > base) {
            return false;
        }
        base -= 10;
    }

    return true;
};

/**
 * Check if a given building would unlock Mathematician when bought
 *
 * @param {String} checkedBuilding
 *
 * @return {Boolean}
 */
CME.mathematician = function(checkedBuilding) {
    var names   = [],
        amounts = [],
        base,
        i;

    if (this.hasAchievement('Mathematician')) {
        return false;
    }

    Game.ObjectsById.forEach(function (building) {
        names.push(building.name);
        amounts.push(building.amount);
    });
    names.forEach(function (name, key) {
        if (name === checkedBuilding) {
            amounts[key]++;
        }
    });

    base = 128;
    for (i = 0; i < amounts.length; i++) {
        if (i > 2) {
            base = base / 2;
        }
        if (amounts[i] < base) {
            return false;
        }
    }

    return true;
};

/**
 * Check if a given building would unlock OWE when bought
 *
 * @param {String} checkedBuilding
 *
 * @return {Boolean}
 */
CME.oneWithEverything = function(checkedBuilding) {
    if (this.hasAchievement('One with everything')) {
        return false;
    }

    return this.checkBuildingUnifiesAmounts(0, checkedBuilding);
};

/**
 * Check if a given building would unlock Centennial when bought
 *
 * @param {String} checkedBuilding
 *
 * @return {Boolean}
 */
CME.centennial = function(checkedBuilding) {
    if (this.hasAchievement('Centennial')) {
        return false;
    }

    return this.checkBuildingUnifiesAmounts(99, checkedBuilding);
};

/**
 * Checks whether buying a certain building would
 * bring all amounts to the same level
 *
 * @param {Integer} amount
 * @param {String}  checkedBuilding
 *
 * @return {Boolean}
 */
CME.checkBuildingUnifiesAmounts = function(amount, checkedBuilding) {
    var todo = [];

    Game.ObjectsById.forEach(function (building) {
        if (building.amount === amount) {
            todo.push(building.name);
        }
    });

    if (todo.length === 1 && todo[0] === checkedBuilding) {
        return true;
    }

    return false;
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
            timeLeft : building.getTimeLeft(),
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

    var multiplier = Game.globalCpsMult,
        income     = building.storedCps * multiplier,
        unlocked   = 0;

    // Get unlocked achievements by amount of buildings (50, 100, ...)
    unlocked += this.buildingAmount(building);

    // Get unlocked achievements by global number of buildings
    if (Game.BuildingsOwned === 99) {
        unlocked += this.hasntAchievement('Builder');
    }
    if (Game.BuildingsOwned === 399) {
        unlocked += this.hasntAchievement('Architect');
    }
    if (Game.BuildingsOwned === 799) {
        unlocked += this.hasntAchievement('Engineer');
    }

    // Get unlocked achievements by building schemas
    if (this.oneWithEverything(building.name)) {
        unlocked++;
    }
    if (this.mathematician(building.name)) {
        unlocked++;
    }
    if (this.baseTen(building.name)) {
        unlocked++;
    }
    if (this.centennial(building.name)) {
        unlocked++;
    }

    // Add cursor modifiers
    switch (building.name) {
        case 'Grandma':
        case 'Farm':
        case 'Factory':
        case 'Mine':
        case 'Shipment':
        case 'Alchemy lab':
        case 'Portal':
        case 'Time machine':
        case 'Antimatter condenser':
        case 'Prism':
        case 'Grandma':
            income += this.getTotalCursorModifiers() * multiplier;
            break;
        case 'Grandma':
            income += this.getTotalGrandmaModifiers(building.amount) * multiplier;
            break;
        case 'Portal':
            income += this.getTotalPortalModifiers() * multiplier;
            break;
    }

    return income + this.callCached('getAchievementWorth', [unlocked, 0, income]);
};

//////////////////////////////////////////////////////////////////////
/////////////////////////////// MODIFIERS ////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the cursor modifiers
 *
 * @return {Integer}
 */
CME.getTotalCursorModifiers = function() {
    var modifier = 0;

    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches('The mouse and cursors gain')) {
            var r = 31;
            if (upgrade.matches(' another ')) {
                r += 8;
            }
            modifier += upgrade.desc.substr(r, upgrade.desc.indexOf('<', r) - r) * 1;
        }
    });

    return modifier * Game.ObjectsById[0].amount;
};

/**
 * Get the various Grandma modifiers
 *
 * @param {Integer} currentNumber
 *
 * @return {Integer}
 */
CME.getTotalGrandmaModifiers = function(currentNumber) {
    var cookiesPs = 0.5,
        amount    = 0,
        modifiers = 1;

    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.name === 'Forwards from grandma') {
            cookiesPs += 0.3;
        }
        else if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b>.')) {
            modifiers *= 2;
        }
        else if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b> as efficient.')) {
            modifiers *= 4;
        }
        else if (upgrade.bought && upgrade.matches('for every 50 grandmas')) {
            amount += (currentNumber + 1) * 0.02 * (currentNumber + 1) - currentNumber * 0.02 * currentNumber;
        }
        else if (upgrade.bought && upgrade.matches('for every 20 portals')) {
            amount += Game.ObjectsById[7].amount * 0.05;
        }
    });

    return cookiesPs * modifiers + amount * modifiers;
};

/**
 * Get the portal modifiers
 *
 * @return {Integer}
 */
CME.getTotalPortalModifiers = function() {
    var amount    = 0,
        modifiers = 1;

    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b> as efficient.')) {
            modifiers *= 2;
        }
        else if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b> as efficient.')) {
            modifiers *= 4;
        }
        else if (upgrade.bought && upgrade.matches('for every 20 portals')) {
            amount += Game.ObjectsById[1].amount * 0.05;
        }
    });

    return amount * modifiers;
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
            'Heavenly key'           : 0.25,
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


//////////////////////////////////////////////////////////////////////
// Pledges
//////////////////////////////////////////////////////////////////////

/**
 * Compute the cost of pledges for a given time
 *
 * @param {Integer} lapse (mn)
 *
 * @return {Integer}
 */
CME.estimatePledgeCost = function(lapse) {

    var pledge   = Game.Upgrades['Elder Pledge'],
        duration = Game.Has('Sacrificial rolling pins') ? 60 : 30,
        required = lapse / duration,
        price    = pledge.getPrice(),
        cost = 0,
        i;

    for (i = 0; i < required; i++) {
        cost += price;

        // Recompute pledge price
        price = Math.pow(8, Math.min(Game.pledges + 2, 14));
        price *= Game.Has('Toy workshop') ? 0.95 : 1;
        price *= Game.Has('Santa\'s dominion') ? 1 : 0.98;
    }

    return CM.largeNumFormat(cost);
};

/**
 * Compute the cost of the covenant for a given time
 *
 * @param {Integer} lapse (mn)
 *
 * @return {Integer}
 */
CME.estimateCovenantCost = function(lapse) {
    var income = Game.cookiesPs * (lapse * 60);

    return CM.largeNumFormat(income - (income * 0.95));
};

/**
 * Get how much buying an upgrade would earn
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CME.getUpgradeWorth = function(upgrade) {

    var income           = 0,
        unlocked         = 0,
        multiplier       = Game.globalCpsMult,
        buildingUpgrades = [
            'Cursors',
            'Grandmas',
            'Farms',
            'Factories',
            'Mines',
            'Shipments',
            'Alchemy labs',
            'Portals',
            'Time machines',
            'Antimatter condensers',
            'Prisms'
        ],
        gainsUpgrades;

    buildingUpgrades.forEach(function(building, key) {
        if (upgrade.matches(building + ' are <b>')) {
            income = CME.getBuildingUpgradeOutcome(key);
        }
    });

    // CPS building upgrades
    gainsUpgrades = [
        {building: 'Cursors',               modifier: 0.1},
        {building: 'Grandmas',              modifier: 0.3},
        {building: 'Farms',                 modifier: 0.5},
        {building: 'Factories',             modifier: 4},
        {building: 'Mines',                 modifier: 10},
        {building: 'Shipments',             modifier: 30},
        {building: 'Alchemy labs',          modifier: 100},
        {building: 'Portals',               modifier: 1666},
        {building: 'Time machines',         modifier: 9876},
        {building: 'Antimatter condensers', modifier: 99999},
        {building: 'Prisms',                modifier: 1000000}
    ];
    gainsUpgrades.forEach(function(gainUpgrade, key) {
        if (upgrade.matches(gainUpgrade.building + ' gain <b>')) {
            income = CME.getMultiplierOutcome(gainUpgrade.building, gainUpgrade.modifier, key);
        }
    });

    if (upgrade.matches('Grandmas are <b>twice</b>')) {
        unlocked += this.lgt(upgrade);
    }

    else if (upgrade.matches('for each non-cursor object')) {
        income = this.getNonObjectsGainOutcome(upgrade);
    }

    // Grandmas per grandmas
    else if (upgrade.matches('for every 50 grandmas')) {
        income = this.getGrandmasPerGrandmaOutcome();
    }

    // Grandmas per portals
    else if (upgrade.matches('for every 20 portals')) {
        income = this.getGrandmasPerPortalOutcome();
    }

    // Heavenly upgrades
    else if (upgrade.matches('potential of your heavenly')) {
        income = this.getHeavenlyUpgradeOutcome(unlocked, upgrade) / multiplier;
        if (upgrade.name === 'Heavenly key') {
            unlocked += this.hasntAchievement('Wholesome');
        }
    }

    // Elder pacts
    if (upgrade.name === 'Elder Covenant') {
        return Game.cookiesPs * -0.05;
    } else if (upgrade.name === 'Revoke Elder Covenant') {
        return (Game.cookiesPs / multiplier) * (multiplier * 1.05) - Game.cookiesPs;
    }

    // Building counts
    if (Game.UpgradesOwned === 19) {
        unlocked += this.hasntAchievement('Enhancer');
    }
    if (Game.UpgradesOwned === 49) {
        unlocked += this.hasntAchievement('Augmenter');
    }
    if (Game.UpgradesOwned === 99) {
        unlocked += this.hasntAchievement('Upgrader');
    }

    return (income * multiplier) + this.callCached('getAchievementWorth', [unlocked, upgrade.id, income]);
};

//////////////////////////////////////////////////////////////////////
///////////////////////////// UPGRADES WORTH /////////////////////////
//////////////////////////////////////////////////////////////////////

// Classic situations
//////////////////////////////////////////////////////////////////////

/**
 * Get the outcome of a building upgrade
 *
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CME.getBuildingUpgradeOutcome = function(buildingKey) {
    return Game.ObjectsById[buildingKey].storedTotalCps;
};

/**
 * Get how much a given multiplier would impact the current CPS for a type of building
 *
 * @param {String}  building
 * @param {Integer} baseMultiplier
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CME.getMultiplierOutcome = function(building, baseMultiplier, buildingKey) {
    var multiplier = 1;

    // Gather current multipliers
    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches(building + ' are <b>twice</b>')) {
            multiplier = multiplier * 2;
        }
        if (upgrade.bought && upgrade.matches(building + ' are <b>4 times</b>')) {
            multiplier = multiplier * 4;
        }
    });

    return Game.ObjectsById[buildingKey].amount * multiplier * baseMultiplier;
};

/**
 * Get the output of an Heavenly Chips upgrade
 *
 * @param {Integer} unlocked
 * @param {Object}  upgrade
 *
 * @return {Integer}
 */
CME.getHeavenlyUpgradeOutcome = function(unlocked, upgrade) {
    var multiplier = Game.prestige['Heavenly chips'] * 2 * (upgrade.getDescribedInteger() / 100);

    return this.callCached('getAchievementWorth', [unlocked, upgrade.id, 0, multiplier]) - Game.cookiesPs;
};

// Special cases
//////////////////////////////////////////////////////////////////////

/**
 * Compute the production of Grandmas per 20 portals
 *
 * @return {Integer}
 */
CME.getGrandmasPerPortalOutcome = function() {
    var multiplier = 1;

    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b>.')) {
            multiplier = multiplier * 2;
        }
        if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b>')) {
            multiplier = multiplier * 4;
        }
    });

    return Game.ObjectsById[7].amount * 0.05 * multiplier * Game.ObjectsById[1].amount;
};

/**
 * Computes the production of Grandmas per 50 grandmas
 *
 * @return {Integer}
 */
CME.getGrandmasPerGrandmaOutcome = function() {
    var multiplier = 1;

    Game.UpgradesById.forEach(function (upgrade) {
        if (upgrade.bought && upgrade.matches('Grandmas are <b>twice</b>')) {
            multiplier = multiplier * 2;
        }
        if (upgrade.bought && upgrade.matches('Grandmas are <b>4 times</b>')) {
            multiplier = multiplier * 4;
        }
    });

    return Game.ObjectsById[1].amount * 0.02 * multiplier * Game.ObjectsById[1].amount;
};

CME.lgt = function(upgrade) {
    var todo = [];

    if (this.hasAchievement('Elder Pact') || upgrade.name.indexOf(' grandmas') === -1) {
        return false;
    }

    Game.UpgradesById.forEach(function (upgrade, key) {
        if (!upgrade.bought && upgrade.name.indexOf(' grandmas ') !== -1) {
            todo.push(key);
        }
    });

    return (todo.length === 1 && todo[0] === upgrade.id);
};

/**
 * Computes the production of cursors per non-cursor objects
 *
 * @param {Object} upgrade
 *
 * @return {Integer}
 */
CME.getNonObjectsGainOutcome = function(upgrade) {
    return upgrade.getDescribedInteger() * (Game.BuildingsOwned - Game.ObjectsById[0].amount) * Game.ObjectsById[0].amount;
};

/**
 * Compute the production of a building once 4 times as efficient
 *
 * @param {Integer} buildingKey
 *
 * @return {Integer}
 */
CME.getFourTimesEfficientOutcome = function(buildingKey) {
    return Game.ObjectsById[buildingKey].storedTotalCps * 3;
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
    var worth = this.getWorth(),
        bci   = CME.roundDecimal(this.getPrice() / worth);

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

//////////////////////////////////////////////////////////////////////
//////////////////////////////// HELPERS /////////////////////////////
//////////////////////////////////////////////////////////////////////

/**
 * Get the lucky alerts for a price
 *
 * @param {Object} object
 *
 * @return {Array}
 */
CME.getThresholdAlerts = function(object) {
    var price      = object.getPrice(),
        newIncome  = Game.cookiesPs + object.getWorth(),
        deficits   = [0, 0, 0],
        rewards   = [
            this.getLuckyTreshold(false, newIncome),
            this.getLuckyTreshold('frenzy', newIncome),
            CM.requiredChainTier('bank', 'this', CM.maxChainReward())
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
    if (Game.cookies - price < rewards[2]) {
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
CME.isInStore = function(upgrade) {
    return Game.UpgradesInStore.indexOf(upgrade) !== -1;
};