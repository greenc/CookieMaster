///////////////////////////////////////////////
// Timer bar settings
///////////////////////////////////////////////

CM.config.cmTimerSettings = (function() {

    this.gc          = {label: 'Next Cookie:'  };
    this.sp          = {label: 'Next Reindeer:'};
    this.frenzy      = {label: 'Frenzy:',       hide: ['clot',   'elderFrenzy']};
    this.elderFrenzy = {label: 'Elder Frenzy:', hide: ['clot',   'frenzy'     ]};
    this.clickFrenzy = {label: 'Click Frenzy:' };
    this.clot        = {label: 'Clot:',         hide: ['frenzy', 'elderFrenzy']};
    this.pledge      = {label: 'Pledge:'       };
    this.wrinklers   = {label: 'Pop Wrinklers:'};

})();