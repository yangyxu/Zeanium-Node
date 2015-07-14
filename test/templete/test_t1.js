var zn = require('../../src/zn');

zn.define([
    'templete'
], function (templete) {
    var Render = templete.html.Render;
    var _render = new Render({
        templete: './t1.html',
        context: {
            user: 'test'
        }
    });

    _render.toHtml().then(function (data){
        console.log(data);
    });
    //console.log(Render);

}).exec();