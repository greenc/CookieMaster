///////////////////////////////////////////////
// Helpers
///////////////////////////////////////////////

CM.Settings.helpers = (function() {

    var helpers = {

        title : 'Helpers',
        desc  : 'If you enjoy watching the game play itself, these settings are for you.',
        items : {

            autoPledge: {
                type:  'checkbox',
                label: 'Auto-Pledge:',
                desc:  'Automatically rebuy Elder Pledge upgrade to keep the Grandmapocalypse at bay.',
                current: 'off'
            },

            clickSanta: {
                type:  'checkbox',
                label: 'Auto-buy Santa Unlocks:',
                desc:  'Automatically buy the Santa unlocks when they become available.',
                current: 'off'
            },

            popWrinklersAtInterval: {
                type:  'select',
                label: 'Automatically Pop Wrinklers:',
                desc:  'Set a timer to automatically pop all Wrinklers at the specified interval.',
                options: [
                    {
                        label: 'Off',
                        value: 'off'
                    },
                    {
                        label: 'Every 10 minutes',
                        value: 600000
                    },
                    {
                        label: 'Every 30 minutes',
                        value: 1800000
                    },
                    {
                        label: 'Every hour',
                        value: 3600000
                    },
                    {
                        label: 'Every 4 hours',
                        value: 14400000
                    },
                    {
                        label: 'Every 8 hours',
                        value: 28800000
                    }
                ],
                current: 'off'
            },

            trueNeverclick: {
                type:  'checkbox',
                label: 'True Neverclick Helper:',
                desc:  'Prevents clicks on the Big Cookie until you unlock the True Neverclick achievement. Make sure to disable auto-click if using this feature.',
                current: 'off'
            },

            autoClickPopups: {
                type:    'select',
                label:   'Auto-click Popups:',
                desc:    'Automatically click Golden Cookies and Reindeer when they spawn.',
                options: [
                    {
                        label: 'Off',
                        value: 'off'
                    },
                    {
                        label: 'Golden Cookies',
                        value: 'gc'
                    },
                    {
                        label: 'Reindeer',
                        value: 'sp'
                    },
                    {
                        label: 'All',
                        value: 'all'
                    }
                ],
                current: 'off'
            },

            autoClick: {
                type:    'select',
                label:   'Auto-click Big Cookie:',
                desc:    'Automatically click the big cookie. WARNING: High values may cause lag (and a guilty conscience).',
                options: [
                    {
                        label: 'Off',
                        value: 'off'
                    },
                    {
                        label: 'Click Frenzies & Elder Frenzies',
                        value: 'clickFrenzies'
                    },
                    {
                        label: 'All Frenzies',
                        value: 'allFrenzies'
                    },
                    {
                        label: 'All the time',
                        value: 'on'
                    }
                ],
                current: 'off'
            },

            autoClickSpeed: {
                type:  'range',
                label: 'Auto-click Speed:',
                desc:  'How many times per second to auto-click the big cookie. Note that most browsers throttle timers to 1 second intervals when the page is running in the background.',
                options: {
                    min: 1,
                    max: 250,
                    step: 1
                },
                current: 10
            }

        }

    };

    return helpers;

})();