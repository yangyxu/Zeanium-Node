zn.define([
    '../../../templete/html/exports.js',
    'node:fs'
], function (html, fs) {

    var _htmlRender = new html.Render();

    var BaseController = zn.class('BaseController', {
        properties: {
            config: null,
            stores: null
        },
        methods: {
            init: function (args){
                this.sets(args);
            },
            getStore: function (name){
                var _store = this.stores[name];
                if(!_store){
                    throw new Error('The database '+name+' is not exist.');
                }

                return _store;
            },
            viewModel: function (view, model, response){
                var _context = this.getContext();
                _context['contextPath'] = _context['root']+'/'+this.config.deploy;
                zn.extend(model, _context);

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

    return BaseController;

});