(function (zn) {

    var JSONFormater = zn.Class({
        events: [ 'init' ],
        properties: {
            vars: null,
            keys: null
        },
        methods: {
            init: function (config) {
                this.reload(config);
            },
            parse: function (prefix, config){
                var _prefix = prefix || '',
                    _key = null,
                    _value = null;

                for(var key in config){
                    _key = _prefix + '/' + key;
                    _value = config[key];
                    if(key.indexOf('$')!=-1){
                        this._vars[key.slice(1)] = _value;
                        continue;
                    }
                    switch (typeof _value) {
                        case 'string':
                            this._keys[_key] = this.format(_value);
                            break;
                        case 'object':
                            this.parse(_key, _value);
                            break;
                    }
                }
            },
            format: function (path){
                var _value = null;
                path = path.replace(/\$/g, '');
                for(var _key in this._vars){
                    _value = this._vars[_key];
                    if(_value !== undefined){
                        path = path.replace(new RegExp('{' + _key + '}', 'gi'), _value);
                    }
                }

                return _value = null, path;
            },
            reload: function (config){
                this._vars = {};
                this._keys = {};
                this.parse('', config);
            },
            getValue: function (key){
                return this._keys[key];
            }
        }
    });

    zn.JSON = zn.Class({
        static: true,
        properties: {

        },
        methods: {

        }
    });

})(zn);
