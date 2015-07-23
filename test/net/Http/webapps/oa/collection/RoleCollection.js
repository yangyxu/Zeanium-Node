zn.define([
    '../model/Role'
], function (Role) {

    return zn.class("UserCollection", zn.db.common.collection.Tree, {
        methods: {
            init: function (inStore, inModel){
                this.super(inStore, inModel);
                this._model = Role;
            }
        }
    })
})