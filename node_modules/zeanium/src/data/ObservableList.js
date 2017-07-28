(function (zn) {

    zn.Class('zn.data.ObservableList', zn.data.List, {
        mixins: [ zn.data.Observable ],
        events: ['change'],
        methods: {
            /**
             * Add an item.
             * @method add
             * @param item
             */
            add: function (item) {
                var _index = this.super(item);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [ item ],
                    index: _index
                });

                return _index;
            },
            /**
             * @method addRange
             * @param data
             */
            addRange: function (data) {
                var _index = this.super(data);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: data,
                    index: _index
                });

                return _index;
            },
            /**
             * @method insert
             * @param item
             * @param index
             */
            insert: function (item, index) {
                this.super(item, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: [ item ],
                    index: index
                });

                return index;
            },
            /**
             * @method insertRange
             * @param data
             * @param index
             */
            insertRange: function (data, index) {
                this.super(data, index);
                this.notify('count');
                this.fire('change', {
                    action: 'add',
                    items: data,
                    index: index
                });

                return index;
            },
            /**
             * @method remove
             * @param item
             */
            remove: function (item) {
                var _index = this.super(item);
                if (_index >= 0) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ item ],
                        index: _index
                    });
                }

                return index;
            },
            /**
             * @method removeAt
             * @param index
             */
            removeAt: function (index) {
                var _item = this.super(index);
                if (_item !== undefined) {
                    this.notify('count');
                    this.fire('change', {
                        action: 'remove',
                        items: [ _item ],
                        index: index
                    });
                }

                return _item;
            },
            /**
             * @method clear
             */
            clear: function () {
                var _items = this.super();
                this.notify('count');
                this.fire('change', {
                    action: 'clear',
                    items: _items
                });

                return _items;
            },
            /**
             * @method sort
             * @param callback
             */
            sort: function (callback) {
                var _items = this.super(callback);
                this.notify('count');
                this.fire('change', {
                    action: 'sort',
                    sort: callback || function (a, b) {
                        if (a > b) {
                            return 1;
                        }
                        else if (a < b) {
                            return -1;
                        }
                        else {
                            return 0;
                        }
                    }
                });

                return _items;
            }
        }
    });

})(zn);
