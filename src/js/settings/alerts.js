///////////////////////////////////////////////
// Alerts
///////////////////////////////////////////////

CM.Settings.alerts = (function() {

    var alerts = {

        title : 'Timers & Alerts',
        desc  : '<strong>Notice:</strong>If you want to use custom audio alerts, please be mindful to link to non-copyrighted audio files on sites that explicitly allow hotlinking to avoid http://orteil.dashnet.org getting blacklisted!<br />Links to soundjay.com files are blocked as per the main game code.',
        items : {

            showGCTimer: {
                type:    'checkbox',
                label:   'Show Golden Cookie Timer:',
                desc:    'Display countdown timer for next Golden Cookie.',
                current: 'on'
            },

            showSPTimer: {
                type:    'checkbox',
                label:   'Show Reindeer Timer:',
                desc:    'Display countdown timer for next Reindeer.',
                current: 'on'
            },

            showFrenzyTimer: {
                type:    'checkbox',
                label:   'Show Frenzy Timer:',
                desc:    'Display time remaining for Frenzy buff when active.',
                current: 'on'
            },

            showElderFrenzyTimer: {
                type:    'checkbox',
                label:   'Show Elder Frenzy Timer:',
                desc:    'Display time remaining for Elder Frenzy buff when active.',
                current: 'on'
            },

            showClickFrenzyTimer: {
                type:    'checkbox',
                label:   'Show Click Frenzy Timer:',
                desc:    'Display time remaining for Click Frenzy buff when active.',
                current: 'on'
            },

            showClotTimer: {
                type:    'checkbox',
                label:   'Show Clot Timer:',
                desc:    'Display time remaining for Clot nerf when active.',
                current: 'on'
            },

            showPledgeTimer: {
                type:    'checkbox',
                label:   'Show Pledge Timer:',
                desc:    'Display time remaining for Elder Pledge when active.',
                current: 'on'
            },

            showGCCountdown: {
                type:    'checkbox',
                label:   'Show Golden Cookie Countdown:',
                desc:    'Display a countdown timer on Golden Cookies showing how long you have left to click them',
                current: 'on'
            },

            visualAlerts: {
                type:    'select',
                label:   'Visual Alerts:',
                desc:    'Flash the screen when Golden Cookies and Reindeer spawn.',
                options: [
                    {
                        label: 'Off',
                        value: 'off'
                    },
                    {
                        label: 'Golden Cookie',
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
                current: 'all'
            },

            audioAlerts: {
                type:    'select',
                label:   'Audio Alerts:',
                desc:    'Play an audio alert when Golden Cookies and Reindeer spawn.',
                options: [
                    {
                        label: 'Off',
                        value: 'off'
                    },
                    {
                        label: 'Golden Cookie',
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
                current: 'all'
            },

            audioVolume: {
                type:  'range',
                label: 'Audio Alert Volume:',
                desc:  'Adjust the playback volume of the audio alerts.',
                options: {
                    min: 0,
                    max: 1,
                    step: 0.1
                },
                current: 0.4
            },

            customGCAlert: {
                type:        'text',
                label:       'Custom Golden Cookie Alert URL:',
                desc:        'Specify your own audio alert for Golden Cookie notifications. URL should link to an MP3 file with a max play time of 2 seconds.',
                placeholder: 'http://example.com/file.mp3',
                current:     ''
            },

            customSPAlert: {
                type:        'text',
                label:       'Custom Reindeer Alert URL:',
                desc:        'Specify your own audio alert for Reindeer notifications. URL should link to an MP3 file with a max play time of 2 seconds.',
                placeholder: 'http://example.com/file.mp3',
                current:     ''
            }

        }

    };

    return alerts;

})();

