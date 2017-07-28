(function (zn) {

    zn.cookie = zn.Class({
        static: true,
        methods: {
            setItem: function (name, value, time) {
                var _name = name + '=' + encodeURIComponent(value);
                if (time) {
                    _name += '; expires=' + (new Date(+(new Date()) + time * 36E5)).toGMTString();
                }

                document.cookie = _name;
            },
            getItem: function (name) {
                var oRE = new RegExp('(?:; )?' + name + '=([^;]*);?');
                if (oRE.test(document.cookie)) {
                    return decodeURIComponent(RegExp.$1);
                } else {
                    return null;
                }
            },
            removeItem: function (name) {
                this.setItem(name, null, -9999);
            },
            clear: function () {
                document.cookie = null;
            }
        }
    });

})(zn);
