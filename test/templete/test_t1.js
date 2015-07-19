var zn = require('../../src/zn');

zn.define([
    'templete'
], function (templete) {
    var Render = templete.html.Render;
    var _render = new Render({
        templete: './t1.html',
        data: {
            name: 'cisco',
            users: [
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

    _render.toRender(function (value){
        console.log(value);
    });

}).exec();