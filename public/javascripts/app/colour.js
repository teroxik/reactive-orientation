var Colour = (function() {
    var colourServices = function() {

        this.stringToColour = function(str) {
            var randStr = str + Date.now();

            var hash = 0;
            for (var i = 0; i < randStr.length; i++) {
                hash = randStr.charCodeAt(i) + ((hash << 5) - hash);
            }
            var colour = '0x';
            for (var i = 0; i < 3; i++) {
                var value = (hash >> (i * 8)) & 0xFF;
                colour += ('00' + value.toString(16)).substr(-2);
            }
            return parseInt(colour , 16);
        }
    }

    return new colourServices();
})();