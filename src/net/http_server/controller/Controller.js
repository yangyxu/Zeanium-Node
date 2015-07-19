zn.define([
    '../../../templete/html/exports.js',
    'node:fs'
], function (html, fs) {

    var _htmlRender = new html.Render();

    var BaseController = zn.class('BaseController', {
        properties: {
            config: {}
        },
        methods: {
            viewModel: function (view, model, response){
                _htmlRender.sets({
                    templete: view,
                    templeteConvert: this.__getTempletePath.bind(this),
                    data: model
                });
                _htmlRender.toRender(function (data){
                    response.contentType = 'text/html';
                    response.end(data, 'utf8');
                });
            },
            __getTempletePath: function (view){
                var _viewConfig = zn.overwrite(this.config.view || {}, {
                    path: '/view/',
                    suffix: 'html'
                });

                return this.config.root + _viewConfig.path + view + '.' + _viewConfig.suffix;
            }
        }
    });

    zn.controller = function (){
        var _args = arguments,
            _name = _args[0],
            _meta = _args[1];

        _meta.controller = _name;

        return zn.class(_name, BaseController, _meta);
    }

    return zn.controller;

});