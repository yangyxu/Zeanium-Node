/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Action({
        methods: {
            addNode: function (data){
                return this.addTreeNode(data);
            },
            deleteNode: function (where){
                return this.deleteTreeNode(where);
            },
            addTreeNode: function (model){
                return zn.service.Tree.addTreeNode(this, this._table, model);
            },
            deleteTreeNode: function (where){
                return zn.service.Tree.deleteTreeNode(this, this._table, where);
            },
            orderTreeNode: function (id, order){
                return zn.service.Tree.deleteTreeNode(this, this._table, id, order);
            }
        }
    });

});
