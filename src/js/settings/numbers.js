///////////////////////////////////////////////
// Numbers
///////////////////////////////////////////////

CM.settings.numbers = (function() {

    this.title = 'Numbers';
    this.desc  = 'These settings modify how numbers are displayed throughout the game.';
    this.items = {

        numFormat: {
            type:  'select',
            label: 'Number Formatting:',
            desc:  'Sets the desired decimal and thousands separator symbols for numbers.',
            options: [
                {
                    label: '1,234,567.890',
                    value: 'us'
                },
                {
                    label: '1.234.567,890',
                    value: 'eu'
                }
            ],
            current: 'us'
        },

        shortNums: {
            type:    'checkbox',
            label:   'Shorten Numbers:',
            desc:    'Shorten large numbers with suffixes.',
            current: 'on'
        },

        suffixFormat: {
            type:  'select',
            label: 'Suffix Type:',
            desc:  'Notation type to use for shortened number suffixes.',
            options: [
                {
                    label: 'Mathematical',
                    value: 'math'
                },
                {
                    label: 'SI Units',
                    value: 'si'
                },
                {
                    label: 'Standard (Short Scale)',
                    value: 'standard'
                },
                {
                    label: 'Long Scale',
                    value: 'longscale'
                },
                {
                    label: 'Scientific',
                    value: 'scientific'
                },
                {
                    label: 'Scientific (e-notation)',
                    value: 'e'
                },
                {
                    label: 'Scientific (compact)',
                    value: 'compact'
                }
            ],
            current: 'math'
        },

        precision: {
            type:  'select',
            label: 'Precision:',
            desc:  'How many decimal places to show for shortened numbers.',
            options: [
                {
                    label: '0',
                    value: '0'
                },
                {
                    label: '1',
                    value: '1'
                },
                {
                    label: '2',
                    value: '2'
                },
                {
                    label: '3',
                    value: '3'
                },
                {
                    label: '4',
                    value: '4'
                }
            ],
            current: '3'
        }

    };

})();
