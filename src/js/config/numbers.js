///////////////////////////////////////////////
// Long number formatting settings
///////////////////////////////////////////////

CM.config.cmNumFormatRanges = (function() {

    var settings = [
        {
            divider: 1e24,
            suffix: {
                math:       ' Sp',
                si:         ' Y',
                standard:   ' septillion',
                longscale:  ' quadrillion',
                e:          'e24',
                scientific: ' &times; 10&sup2;&#8308;',
                compact:    '*10&sup2;&#8308;'
            }
        },
        {
            divider: 1e21,
            suffix: {
                math:       ' Sx',
                si:         ' Z',
                standard:   ' sextillion',
                longscale:  ' trilliard',
                e:          'e21',
                scientific: ' &times; 10&sup2;&sup1;',
                compact:    '*10&sup2;&sup1;'
            }
        },
        {
            divider: 1e18,
            suffix: {
                math:       ' Qi',
                si:         ' E',
                standard:   ' quintillion',
                longscale:  ' trillion',
                e:          'e18',
                scientific: ' &times; 10&sup1;&#8312;',
                compact:    '*10&sup1;&#8312;'
            }
        },
        {
            divider: 1e15,
            suffix: {
                math:       ' Qa',
                si:         ' P',
                standard:   ' quadrillion',
                longscale:  ' billiard',
                e:          'e15',
                scientific: ' &times; 10&sup1;&#8309;',
                compact:    '*10&sup1;&#8309;'
            }
        },
        {
            divider: 1e12,
            suffix: {
                math:       ' T',
                si:         ' T',
                standard:   ' trillion',
                longscale:  ' billion',
                e:          'e12',
                scientific: ' &times; 10&sup1;&sup2;',
                compact:    '*10&sup1;&sup2;'
            }
        },
        {
            divider: 1e9,
            suffix: {
                math:       ' B',
                si:         ' G',
                standard:   ' billion',
                longscale:  ' milliard',
                e:          'e9',
                scientific: ' &times; 10&#8313;',
                compact:    '*10&#8313;'
            }
        },
        {
            divider: 1e6,
            suffix: {
                math:       ' M',
                si:         ' M',
                standard:   ' million',
                longscale:  ' million',
                e:          'e6',
                scientific: ' &times; 10&#8310;',
                compact:    '*10&#8310;'
            }
        }
    ];

    return settings;

})();