///////////////////////////////////////////////
// UI
///////////////////////////////////////////////

CM.Settings.ui = (function() {

    var ui = {

        title : 'Interface',
        desc  : 'These settings modify the game interface.',
        items : {

            cleanUI: {
                type:    'checkbox',
                label:   'Clean Interface:',
                desc:    'Hide the top bar, and make other small graphical enhancements to the game interface.',
                current: 'on'
            },

            timerBarPosition: {
                type:  'select',
                label: 'Timer Bar Position:',
                desc:  'Position the custom timer bar at the top or bottom of the screen.',
                options: [
                    {
                        label: 'Top',
                        value: 'top'
                    },
                    {
                        label: 'Bottom',
                        value: 'bottom'
                    }
                ],
                current: 'bottom'
            },

            hideNativeTimers: {
                type:    'checkbox',
                label:   'Hide Native Timers:',
                desc:    'Hide the native game timer bars.',
                current: 'off'
            },

            showMissedGC: {
                type:    'checkbox',
                label:   'Show Missed Golden Cookies:',
                desc:    'Whether or not to show the stat for missed Golden Cookies.',
                current: 'on'
            },

            showAllUpgrades: {
                type:    'checkbox',
                label:   'Show All Upgrades:',
                desc:    'Always display all available upgrades in the store (no need to hover).',
                current: 'off'
            },

            hideBuildingInfo: {
                type:    'checkbox',
                label:   'Hide Building Info Boxes:',
                desc:    'Hides the building information boxes that normally display when hovering each building section',
                current: 'off'
            },

            colorBlind: {
                type:    'checkbox',
                label:   'Color Blind Mode:',
                desc:    'Alternate color scheme that is color-blind friendly.',
                current: 'off'
            },

            showEfficiencyKey: {
                type:    'checkbox',
                label:   'Show Efficiency Key:',
                desc:    'Display building efficiency color key in the right panel.',
                current: 'on'
            },

            showDeficitStats: {
                type:    'checkbox',
                label:   'Show Deficit Stats:',
                desc:    'Show labels on item tooltips warning about Lucky and Chain deficits',
                current: 'on'
            },

            changeFont: {
                type:  'select',
                label: 'Game Font:',
                desc:  'Set the highlight font used throughout the game.',
                options: [
                    {
                        label: 'Kavoon (default)',
                        value: 'default'
                    },
                    {
                        label: 'Serif',
                        value: 'serif'
                    },
                    {
                        label: 'Sans Serif',
                        value: 'sansserif'
                    }
                ],
                current: 'default'
            },

            highVisibilityCookie: {
                type:    'checkbox',
                label:   'High Visibility Cookies:',
                desc:    'Increase the contrast between Golden Cookies and the background.',
                current: 'off'
            },

            increaseClickArea: {
                type:    'checkbox',
                label:   'Increase Cookie Hitbox:',
                desc:    'Make the clickable area larger for Golden Cookies. Helps accuracy during chains. Requires "Show Timers" to be on.',
                current: 'off'
            }

        }

    };

    return ui;

})();