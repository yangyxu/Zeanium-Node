(function (zn) {

    var ArrayPrototype = Array.prototype,
        __push = ArrayPrototype.push,
        __sort = ArrayPrototype.sort,
        __join = ArrayPrototype.join,
        __slice = ArrayPrototype.slice,
        __splice = ArrayPrototype.splice,
        __indexOf = ArrayPrototype.indexOf,
        __lastIndexOf = ArrayPrototype.lastIndexOf,
        __forEach = ArrayPrototype.forEach,
        __toArray = function (data) {
            if (zn.is(data, List)) {
                return data.toArray();
            }
            else if (zn.is(data, 'array')) {
                return data.slice(0);
            }
            else {
                var _data = [];
                zn.each(data, function (item) {
                    _data.push(item);
                });

                return _data;
            }
        };

    var List = zn.Class('zn.data.List', {
        properties: {
            /**
             * @property count
             * @type {Number}
             */
            count: {
                get: function () {
                    return this.length;
                },
                set: function (){
                    throw new Error("Unable to set count of List");
                }
            }
        },
        methods: {
            init: {
                auto:true,
                value: function (data) {
                    this.length = 0;
                    this.insertRange(data, 0);
                }
            },
            unique: function (){

            },
            dispose: function () {
                this.clear();
            },
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var _index = this.length;
                __push.call(this, item);

                return _index;
            },
            /**
             * Add multiple items.
             * @method addRange
             * @param iter
             * @returns {*}
             */
            addRange: function (data) {
                return this.insertRange(data, this.length);
            },
            /**
             * @method remove
             * @param item
             * @returns {*}
             */
            remove: function (item) {
                var _index = this.indexOf(item);
                if (_index >= 0) {
                    __splice.call(this, _index, 1);
                    return _index;
                }
                else {
                    return -1;
                }
            },
            /**
             * @method removeAt
             * @param index
             * @returns {*}
             */
            removeAt: function (index) {
                return __splice.call(this, index, 1)[0];
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                return __splice.call(this, index, 0, item), item;
            },
            /**
             * @method insertRange
             * @param index
             * @param iter
             * @returns {*}
             */
            insertRange: function (data, index) {
                return __splice.apply(this, [index, 0].concat(__toArray(data))), index;
            },
            /**
             * @method clear
             * @returns {*}
             */
            clear: function () {
                return __splice.call(this, 0);
            },
            /**
             * @method getItem
             * @param index
             * @returns {*}
             */
            getItem: function (index) {
                if (index < this.length) {
                    return this[index];
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method setItem
             * @param index
             * @param item
             * @returns {*}
             */
            setItem: function (index, item) {
                if (index < this.length) {
                    this[index] = item;
                }
                else {
                    throw new Error('Index out of range.');
                }
            },
            /**
             * @method getRange
             * @param index
             * @param count
             * @returns {*}
             */
            getRange: function (index, count) {
                return new List(__slice.call(this, index, index + count));
            },
            /**
             * @method indexOf
             * @param item
             * @returns {*}
             */
            indexOf: function (item) {
                return __indexOf.call(this, item);
            },
            /**
             * @method lastIndexOf
             * @param item
             * @returns {*}
             */
            lastIndexOf: function (item) {
                return __lastIndexOf.call(this, item);
            },
            /**
             * @method contains
             * @param item
             * @returns {boolean}
             */
            contains: function (item) {
                return this.indexOf(item) >= 0;
            },
            toggle: function (item){
                if(this.contains(item)){
                    this.remove(item);
                }else{
                    this.add(item);
                }
            },
            /**
             * @method sort
             * @param callback
             * @returns {Array}
             */
            sort: function (callback) {
                return __sort.call(this, callback);
            },
            /**
             * @method each
             * @param callback
             * @param context
             */
            each: function (callback, context) {
                __forEach.call(this, callback, context);
            },
            /**
             * @method  toArray
             * @returns {Array}
             */
            toArray: function () {
                return __slice.call(this, 0);
            },
            join: function (){
                return __join.call(this);
            }
        }
    });

})(zn);
