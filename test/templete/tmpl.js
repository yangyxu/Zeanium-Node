/**
 * Created by yangyxu on 7/14/15.
 */
var tmpl = (function (cache, $) {
    return function (str, data) {

        console.log(/\s/.test(str));

        var fn = !/\s/.test(str) ? cache[str] = cache[str]: function (data) {
            var i, variable = [$], value = [[]];
            for (i in data) {
                variable.push(i);
                value.push(data[i]);
            };
            return (new Function(variable, fn.$))
                .apply(data, value).join("");
        };

        fn.$ = fn.$ || $ + ".push('"
        + str.replace(/\\/g, "\\\\")
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join($ + ".push('")
            .split("\r").join("\\'")
        + "');return " + $;

        return data ? fn(data) : fn;
    }})({}, '$' + (+ new Date));


var _str = '<div>name</div>';


tmpl(_str, {name: 'yangyxu'});


