/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn){

    var CHAR_CODE = {
        lower: [97, 123],
        upper: [65, 91]
    };

    zn.html = zn.Class({
        static: true,
        methods: {
            decode: function (value){
                if(value && value.length){
                    value = value.replace(/&amp;/g, "&");
                    value = value.replace(/&lt;/g, "<");
                    value = value.replace(/&gt;/g, ">");
                    value = value.replace(/&nbsp;/g, " ");
                    value = value.replace(/&#39;/g, "\'");
                    value = value.replace(/&quot;/g, "\"");
                    value = value.replace(/<br>/g, "\n");
                }

                return value;
            },
            encode: function (value){
                if(value&&value.length){
                    value = value.replace(/&/g, "&amp;");
                    value = value.replace(/</g, "&lt;");
                    value = value.replace(/>/g, "&gt;");
                    value = value.replace(/ /g, "&nbsp;");
                    value = value.replace(/\'/g, "&#39;");
                    value = value.replace(/\"/g, "&quot;");
                    //value = value.replace(/\n/g, "<br>");

                }

                return value;
            }
        }
    });

})(zn);
