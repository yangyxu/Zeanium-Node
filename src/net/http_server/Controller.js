zn.define([
    '../../templete/html/exports.js',
    'node:fs'
], function (html, fs) {

    var _htmlRender = new html.Render();

    var BaseController = zn.class('BaseController', {
        properties: {
            path: ''
        },
        methods: {
            viewModel: function (view, model, response){
                var _path = this.path + '/view/'+ view + '.html';
                _htmlRender.sets({
                    templete: _path,
                    data: model
                });
                _htmlRender.toHtml().then(function (data){
                    response.contentType = 'text/html';
                    response.writeEnd(data);
                });
            },

        }
    });

    zn.controller = function (){
        var _args = arguments,
            _name = _args[0], _meta = _args[1];
        _meta.controller = _name;
        return zn.class(_name, BaseController, _meta);
    }

    return zn.controller;

});