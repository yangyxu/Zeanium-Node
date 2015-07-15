var zn = require('../../src/zn');

zn.define([
    'templete'
], function (templete) {
    var Render = templete.html.Render;
    var _render = new Render({
        templete: './t3.html',
        data: {
            name: 'cisco',
            list: [
                {
                    name: 'yangyxu',
                    age: 25
                },
                {
                    name: 'wangyuan',
                    age: 24
                }
            ]
        }
    });

    _render.toHtml().then(function (data){
        console.log(data);
    });
    //console.log(Render);

}).exec();