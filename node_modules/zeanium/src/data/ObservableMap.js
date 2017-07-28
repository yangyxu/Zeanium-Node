(function (zn) {

    zn.Class('zn.data.ObservableMap', zn.data.Map, {
        mixins: [ zn.data.Observable ],
        events: [ 'change' ],
        methods: {
            set: function (key, value) {
                if(this.has(key)){
                    return this.super(key);
                }

                var _map = this._map,
                    _item = {
                        key: key,
                        value: value
                    };

                if (key in _map) {
                    var _old = _map[key];
                    _map[key] = _item;
                    this.fire('change', {
                        action: 'replace',
                        oldItem: _old,
                        newItem: _item
                    });
                }
                else {
                    _map[key] = _item;
                    this.notify('count');
                    this.fire('change', {
                        action: 'add',
                        items: [ _item ]
                    });
                }
            },
            remove: function (key) {
                var _map = this._map;
                if (key in _map) {
                    var _item = _map[key];
                    delete _map[key];
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ _item ]
                    });
                }
            },
            clear: function () {
                var _items = this.toArray();
                this.super();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: this.toArray()
                });

                return this;
            }
        }
    });

})(zn);
