(function (nx) {

    /**
     * JSON: JSON
     * @class JSON
     * @namespace zn.util
     */
    zn.JSON = zn.Class({
        static: true,
        properties: {
            charMaps: {
                get: function (){
                    return {
                        "\b": "\\b",
                        "\t": "\\t",
                        "\n": "\\n",
                        "\f": "\\f",
                        "\r": "\\r",
                        "\"": "\\\"",
                        "\\": "\\\\"
                    };
                }
            }
        },
        methods: {
            toString: function (s){
                if (/["\\\x00-\x1f]/.test(s)) {
                    return "\"" + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                        var c = this.charMaps()[b];
                        if (c) {
                            return c;
                        }
                        c = b.charCodeAt();
                        return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
                    }) + "\"";
                }

                return "\"" + s + "\"";
            },
            toArray: function (o){
                var a = ["["], b, i, l = o.length, v;
                for (i = 0; i < l; i += 1) {
                    v = o[i];
                    switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if (b) {
                                a.push(",");
                            }
                            a.push(v === null ? "null" : this.stringify(v));
                            b = true;
                    }
                }

                a.push("]");
                return a.join("");
            },
            toDate: function (date, split){
                var m = date.getMonth() + 1, d = date.getDate(), m = (m <= 9 ? ("0" + m) : m);
                var d = (d <= 9 ? ("0" + d) : d), s = split || '-';
                return [this.getFullYear(), m, d].join(s);
            },
            stringify: function (o){
                if (typeof o == "undefined" || o === null) {
                    return "null";
                }
                else {
                    if (o instanceof Array) {
                        return this.toArray(o);
                    }
                    else {
                        if (o instanceof Date) {
                            return this.toDate(o);
                        }
                        else {
                            if (typeof o == "string") {
                                return this.toString(o);
                            }
                            else {
                                if (typeof o == "number") {
                                    return isFinite(o) ? String(o) : "null";
                                }
                                else {
                                    if (typeof o == "boolean") {
                                        return String(o);
                                    }
                                    else {
                                        var a = ["{"], b, i, v;
                                        for (i in o) {
                                            if (!({}.hasOwnProperty ? true : false) || o.hasOwnProperty(i)) {
                                                v = o[i];
                                                switch (typeof v) {
                                                    case "undefined":
                                                    case "function":
                                                    case "unknown":
                                                        break;
                                                    default:
                                                        if (b) {
                                                            a.push(",");
                                                        }
                                                        a.push(this.stringify(i), ":", v === null ? "null" : this.stringify(v));
                                                        b = true;
                                                }
                                            }
                                        }
                                        a.push("}");
                                        return a.join("");
                                    }
                                }
                            }
                        }
                    }
                }
            },
            parse: function (str){
                return eval("("+str+")");
            }
        }
    });

})(zn);
