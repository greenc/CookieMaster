///////////////////////////////////////////////
// Numbers
///////////////////////////////////////////////

CM.Numbers = (function() {

    /**
     * Formats very large numbers with their appropriate suffix, also adds
     * thousands and decimal separators and performs correct rounding for
     * smaller numbers
     *
     * @param  {Integer} num    The number to be formatted
     * @param  {Integer} floats Amount of decimal places required
     * @return {String}
     */
    var largeNumFormat = function(num, precision) {

        var settings     = CM.Settings,
            config       = CM.Config,
            useShortNums = settings.shortNums.current === 'on' ? true : false,
            notation     = settings.suffixFormat.current,
            largeFloats  = settings.precision.current,
            decSep       = settings.numFormat.current === 'us' ? '.' : ',',
            ranges       = config.cmNumFormatRanges,
            decimal      = decSep === '.' ? '.' : ',',
            comma        = decSep === '.' ? ',' : '.',
            floats       = precision || 0,
            qualifier    = num < 0 ? '-' : '',
            parts,
            i;

        // We'd like our integers to be finite please :)
        if(!isFinite(num)) {
            return 'Infinity';
        }

        // Force positive int for working on it
        num = Math.abs(num);

        // Format the very large numbers
        if(useShortNums) {
            for(i = 0; i < ranges.length; i++) {
                if(num >= ranges[i].divider) {
                    num = Math.floor((num / ranges[i].divider) * Math.pow(10, largeFloats)) / Math.pow(10, largeFloats);
                    num = num.toFixed(largeFloats) + ranges[i].suffix[notation];
                    return qualifier + num.replace('.', decimal);
                }
            }
        }

        // Apply rounding
        num = Math.round(num * Math.pow(10, floats)) / Math.pow(10, floats);

        // Localize
        parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, comma);

        return qualifier + parts.join(decimal);

    };


    return {
        largeNumFormat: largeNumFormat
    };

})();