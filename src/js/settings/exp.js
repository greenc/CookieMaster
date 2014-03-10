///////////////////////////////////////////////
// Experimental
///////////////////////////////////////////////

CM.settings.exp = (function() {

    this.title = 'Experimental';
    this.desc  =  '60% of the time; these work every time.';
    this.items = {

        autoBuy: {
            type:    'checkbox',
            label:   'Auto-buy:',
            desc:    'Automatically buy the most efficient buildings and upgrades',
            current: 'off'
        },

        maintainBank: {
            type:    'checkbox',
            label:   'Maintain Bank:',
            desc:    'If enabled, the auto-buyer will respect the Lucky+Frenzy bank requirements after Get Lucky has been purchased.',
            current: 'off'
        },

        noPocalypse: {
            type:    'checkbox',
            label:   'No-pocalypse:',
            desc:    'Do not let auto-buy purchase further research upgrades past Underworld ovens',
            current: 'off'
        },

        enableLogging: {
            type:  'checkbox',
            label: 'Enable Logging:',
            desc:  'Enables the ability to log stats and view a log chart. Logging can be managed in the Stats panel when this setting is active.',
            current: 'off'
        },

        trueCpsAverage: {
            type:  'range',
            label: 'True CpS Tracking Duration:',
            desc:  'CookieMaster tracks your true CpS on a rolling basis in order to improve efficiency algorithms. This setting allows you to adjust the rolling period in minutes. If you are building very quickly (e.g. have many HCs), you should set this to a lower value.',
            options: {
                min: 5,
                max: 240,
                step: 1
            },
            current: 60
        },

        clickingAverage: {
            type:  'range',
            label: 'Click Tracking Duration:',
            desc:  'CookieMaster tracks your Big Cookie clicks on a rolling basis in order to improve efficiency algorithms. This setting allows you to adjust the rolling period in minutes.',
            options: {
                min: 5,
                max: 240,
                step: 1
            },
            current: 60
        }

    };

})();
