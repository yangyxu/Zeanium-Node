/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn){

    var CHAR_CODE = {
        lower: [97, 123],
        upper: [65, 91]
    };

    zn.char = zn.Class({
        static: true,
        methods: {
            lowercase: function (value){
                return zn.is(value, 'string') ? value.replace(/[A-Z]/g, function(char) {
                    return String.fromCharCode(char.charCodeAt(0) | 32);
                }) : value;
            },
            uppercase: function (value){
                return zn.is(value, 'string') ? value.replace(/[a-z]/g, function(char) {
                    return String.fromCharCode(char.charCodeAt(0) & ~32);
                }) : value;
            },
            toUnicode: function (value){
                var _codes = [];
                for(var i = 0, _len = value.length; i < _len; i++){
                    _codes.push(value.charCodeAt(i));
                }

                return _codes;
            },
            toChar: function (start, end){
                var _chars = [];
                for(var i = start; i < end; i++){
                    _chars.push(String.fromCharCode(i));
                }

                return _chars;
            },
            getLowercaseLetters: function (){
                var _index = CHAR_CODE.lower;
                return this.toChar(_index[0], _index[1]);
            },
            getUppercaseLetters: function (){
                var _index = CHAR_CODE.upper;
                return this.toChar(_index[0], _index[1]);
            },
            getStringFromChar: function (char, length){
                var _char = char || 'A',
                    _len = length || 26,
                    _chars = [];
                for(var i = 0; i < _len; i++){
                    _chars.push(String.fromCharCode(_char.charCodeAt(0) + i));
                }

                return _chars.join('');
            }
        }
    });

})(zn);
