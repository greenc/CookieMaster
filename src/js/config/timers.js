///////////////////////////////////////////////
// Timer bar settings
///////////////////////////////////////////////

CM.Config.timerSettings = (function() {

    var settings = {

        gc          : {label: 'Next Cookie:'  },
        sp          : {label: 'Next Reindeer:'},
        frenzy      : {label: 'Frenzy:',       hide: ['clot',   'elderFrenzy']},
        elderFrenzy : {label: 'Elder Frenzy:', hide: ['clot',   'frenzy'     ]},
        clickFrenzy : {label: 'Click Frenzy:' },
        clot        : {label: 'Clot:',         hide: ['frenzy', 'elderFrenzy']},
        pledge      : {label: 'Pledge:'       },
        wrinklers   : {label: 'Pop Wrinklers:'}

    };

    return settings;

})();