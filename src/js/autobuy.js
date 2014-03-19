/**
 * Automates buying functionality
 */
CM.AutoBuy = function() {

    // Golden Cookie upgrades
    this.gcUpgrades = [52, 53, 86];
    // Elder Covenant
    this.elderCovenant = [74, 84, 85];
    // These upgrades can't have BCI calculated, but should always be bought
    this.alwaysBuy = [87, 141, 152, 157, 158, 159, 160, 161, 163, 164, 168];
    // Grandmapocalypse upgrades
    this.grandmapocalypse = [69, 70, 71, 72, 73];
    // Season switching upgrades
    this.seasonal = [181, 182, 183, 184];

    // setInterval to autobuy
    this.automate = null;
    // Threshold
    this.threshold = 'none';
    // Max time remaining until next purchase
    this.nextMaxTime = 0;

    /**
     * Returns a blacklist of upgrades that should not be auto-bought
     * @return {Array} Array of upgrade IDs
     */
    this.blackList = function() {

        var blacklist = [];

        blacklist.push.apply(blacklist, this.seasonal);
        blacklist.push.apply(blacklist, this.elderCovenant);

        if(CM.config.settings.noPocalypse.current === 'on') {
            blacklist.push.apply(blacklist, this.grandmapocalypse);
        }

        return blacklist;

    };

    /**
     * Returns a whitelist of upgrades that should be bought when possible
     * @return {Array} Array of upgrade IDs
     */
    this.whiteList = function() {

        var whitelist = [];

        whitelist.push.apply(whitelist, this.gcUpgrades);
        whitelist.push.apply(whitelist, this.alwaysBuy);

        return whitelist;

    };

    /**
     * Returns an array with the cheapest item and its price from a supplied list
     * @param  {Integer} whiteList Upgrade ID
     * @return {Array}
     */
    this.getCheapest = function(items) {

        var cheapestPrice = Number.POSITIVE_INFINITY,
            cheapestItem,
            item,
            price;

        items.forEach(function(id) {
            item = Game.UpgradesById[id];
            if(item.isInStore()) {
                price = Game.UpgradesById[id].getPrice();
                if(price < cheapestPrice) {
                    cheapestPrice = price;
                    cheapestItem = item;
                }
            }
        });

        return cheapestItem ? [cheapestItem, cheapestPrice] : false;

    };

    /**
     * Sets threshold according to GC upgrades purchased
     */
    this.setThreshold = function() {

        var maintainBank = CM.config.settings.maintainBank.current === 'on';

        this.threshold = Game.Has('Get lucky') && maintainBank ? 'frenzy' : 'none';

    };

    /**
     * Returns array with best building object and its BCI
     * @return {Array} [Object, bci]
     */
    this.getBestBuilding = function() {

        var buildings    = CME.informations.bci,
            bestBCI      = Number.POSITIVE_INFINITY,
            bestBuilding = false,
            available    = false,
            object,
            i;

        for(i = 0; i < buildings.length; i++) {
            object = Game.ObjectsById[i];
            available = object.getPrice() <= Game.cookiesEarned ? true : false;
            if(buildings[i] < bestBCI && available) {
                bestBCI = buildings[i];
                bestBuilding = object;
            }
        }

        return [bestBuilding, bestBCI];

    };

    /**
     * Returns array with best upgrade and its BCI
     * @return {Array} [Upgrade, bci]
     */
    this.getBestUpgrade = function() {

        var upgrades    = [],
            blackList   = this.blackList(),
            whiteList   = this.whiteList(),
            cheapestW   = this.getCheapest(whiteList),
            bestBCI     = Number.POSITIVE_INFINITY,
            bestUpgrade = false,
            itemBCI,
            item,
            i;

        for(i in Game.Upgrades) {
            item = Game.Upgrades[i];
            if(blackList.indexOf(item.id) === -1) {
                if(item.isInStore()) {
                    itemBCI = item.getBaseCostPerIncome();
                    if(itemBCI < bestBCI) {
                        bestUpgrade = item;
                        bestBCI     = itemBCI;
                    }
                }
            }
        }

        // If whitelist upgrades are available and cheapest is cheaper than the calculated one, choose it
        if(cheapestW && bestUpgrade && cheapestW[1] < bestUpgrade.getPrice()) {
            return [cheapestW[0], 0];
        }

        // Else just return the best one calculated
        return bestUpgrade !== false ? [bestUpgrade, bestBCI] : false;

    };

    /**
     * Returns the item with best BCI
     * @return {String or Integer} String indicates an upgrade, integer indicates building
     */
    this.getBestItem = function() {

        var bestBuilding = this.getBestBuilding(),
            bestUpgrade  = this.getBestUpgrade();

        if(bestBuilding && bestUpgrade) {
            return bestUpgrade[1] < bestBuilding[1] ? bestUpgrade[0] : bestBuilding[0];
        } else {
            return bestBuilding[0] || bestUpgrade[0] || false;
        }

    };

    /**
     * Returns the maximum budget for a purchase
     * @param  {Integer} bank      Current bank
     * @param  {String}  threshold none | lucky | frenzy
     * @return {Integer}
     */
    this.budget = function(bank, threshold) {

        var amount = 0;

        if(threshold === 'frenzy') {
            amount = CME.getLuckyTreshold('frenzy');
        } else if(threshold === 'lucky') {
            amount = CME.getLuckyTreshold(false);
        }

        return bank - amount;

    };

    /**
     * Invades a small eastern European country and plants
     * hundreds of turnip fields
     *
     * @return {[type]} [description]
     */
    this.buyBest = function() {

        // Set the correct threshold
        this.setThreshold();

        var self     = this,
            bestItem = this.getBestItem(),
            budget   = this.budget(Game.cookies, this.threshold),
            canBuy   = false,
            timeLeft,
            price,
            width,
            time;

        if(!bestItem) {
            $('#CMAutoBuyNextPurchaseValue').text('Nothing to buy :(');
            $('#CMAutoBuyTimeLeft .cmTimerContainer').fadeOut(300);
            time = 1000;
        } else {
            timeLeft = bestItem.getTimeLeft();
            price    = bestItem.getPrice();
            canBuy   = price <= budget ? true : false;
            if(canBuy) {
                this.nextMaxTime = 0;
                bestItem.buy();
                time = 50;
            } else {
                this.nextMaxTime = this.nextMaxTime === 0 ? timeLeft : this.nextMaxTime;
                //width = timeLeft / this.nextMaxTime * 100;
                width = Math.min(timeLeft / this.nextMaxTime * 100, 100);
                time = 200;
            }
            // Update the information bar
            $('#CMAutoBuyNextPurchaseValue').text(bestItem.name);
            $('#CMAutoBuyTimeLeft .cmTimer div').css('width', width + '%');
            $('#CMAutoBuyTimeLeft .cmTimerCounter').text(timeLeft);
            if($('#CMAutoBuyTimeLeft .cmTimerContainer').is(':hidden')) {
                $('#CMAutoBuyTimeLeft .cmTimerContainer').fadeIn(300);
            }
        }

        this.automate = setTimeout(function() {
            self.buyBest();
        }, time);

    };

    this.init = function() {
        this.buyBest();
    };

    this.stop = function() {
        clearTimeout(this.automate);
    };

    return this;

};
