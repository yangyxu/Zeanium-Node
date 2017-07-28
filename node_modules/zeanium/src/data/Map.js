(function (zn) {

    var Map = zn.Class('zn.data.Map', {
        properties: {
            /**
             * @property length
             * @type {Number}
             */
            count: {
                get: function () {
                    var length = 0;
                    this.each(function () {
                        length++;
                    });

                    return length;
                }
            },
            /**
             * @property keys
             * @type {Array}
             */
            keys: {
                get: function () {
                    return Object.keys(this._map);
                },
                set: function (){
                    throw new Error("Unable to set keys of Map");
                }
            },
            /**
             * @property values
             * @type {Array}
             */
            values: {
                get: function () {
                    return this.__getMapValues();
                },
                set: function (){
                    throw new Error("Unable to set values of Map");
                }
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (map) {
                    this._map = {};
                    this.concat(map);
                }
            },
            concat: function (map){
                if (map) {
                    var _map = this._map,
                        _self = this;
                    zn.each(map, function (value, key) {
                        _self.set(key, value);
                    });
                }

                return this;
            },
            /**
             * @method contains
             * @param key {String}
             * @returns {Boolean}
             */
            contains: function (key) {
                return key in this._map;
            },
            /**
             * @method getItem
             * @param key {String}
             * @returns {*}
             */
            getItem: function (key) {
                return this._map[key];
            },
            /**
             * @method get
             * @param key {String}
             * @returns {*}
             */
            get: function (key) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _item = this.getItem(key);
                return _item && _item.value;
            },
            /**
             * @method set
             * @param key {String}
             * @param value {any}
             */
            set: function (key, value) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _key = key,
                    _item = this._map[_key];

                if (!_item) {
                    _item = this._map[_key] = {
                        key: _key
                    };
                }

                return _item.value = value, this;
            },
            /**
             * @method remove
             * @param key {String}
             */
            remove: function (key) {
                return delete this._map[key], this;
            },
            /**
             * @method clear
             */
            clear: function () {
                return this._map = {}, this;
            },
            /**
             * @method each
             * @param callback {Function}
             * @param [context] {Object}
             */
            each: function (callback, context) {
                return zn.each(this._map, callback, context), this;
            },
            eachKey: function (callback, context){
                return zn.each(this.keys, callback, context), this;
            },
            eachValue: function (callback, context){
                return zn.each(this.values, callback, context), this;
            },
            /**
             * @method toArray
             * @returns {Array}
             */
            toArray: function () {
                var _data = [];
                this.each(function (item) {
                    _data.push(item);
                });

                return _data;
            },
            /**
             * @method toObject
             * @returns {Object}
             */
            toObject: function () {
                var _data = {};
                this.each(function (item) {
                    _data[item.key] = item.value;
                });

                return _data;
            },
            __getMapValues: function () {
                var _data = [];
                this.each(function (item) {
                    _data.push(item.value);
                });

                return _data;
            }
        }
    });

})(zn);
