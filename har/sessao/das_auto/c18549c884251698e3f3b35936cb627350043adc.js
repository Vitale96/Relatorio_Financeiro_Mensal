(function($) {
    validaTecla = function(p, permitir) {
        var ch = permitir;
        $(p).keypress(function(e) {

            var k = String.fromCharCode(e.which);

            if ((e.keyCode >= 35 && e.keyCode <= 40) || // setas
		       (e.keyCode == 8) || // backspace		       
		       (e.keyCode == 9) || e.ctrlKey) { // tab
                return;
            }

            if (ch.indexOf(k) == -1) {
                e.preventDefault();
            }

            if (e.ctrlKey && k === 86) {//ctrl+V
                return;
            }

            if (e.ctrlKey && k === 67) {//ctrl+c
                return;
            }
        });
    };

    $.fn.numerico = function(p) {
        return this.each(function() {
            validaTecla(this, "0123456789");
        });
    };

})(jQuery);
