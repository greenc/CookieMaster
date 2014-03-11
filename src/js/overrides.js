var Overrides = (function() {

    /**
     * Append a piece of code to native code
     *
     * @param {String}  native
     * @param {Closure} append
     *
     * @return {Void}
     */
    var appendToNative = function(native, append) {
        return function() {
            native.apply(null, arguments);
            append.apply(CM);
        };
    };

    /**
     * Execute replacements on a method's code
     *
     * @param {String}  code
     * @param {Closure} replaces
     *
     * @return {String}
     */
    var replaceCode = function(code, replaces) {

        var replace;

        code = code.toString();

        // Apply the various replaces
        for(replace in replaces) {
            code = code.replace(replace, replaces[replace]);
        }

        return code
            .replace(/^function[^{]+{/i, "")
            .replace(/}[^}]*$/i, "");
    };

    /**
     * Replace a native CookieClicker function with another
     *
     * @param {String}  native
     * @param {Closure} replaces
     *
     * @return {void}
     */
    var replaceNative = function(native, replaces, args) {

        var newCode = Game[native];

        if (typeof args === 'undefined') {
            args = '';
        }

        Game[native] = new Function(args, this.replaceCode(newCode, replaces));

    };

    return {
        appendToNative: appendToNative,
        replaceCode:    replaceCode,
        replaceNative:  replaceNative
    };

})();