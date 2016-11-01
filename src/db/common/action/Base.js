/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Action({
        methods: {
            addNode: function (data){
                return this.insert(data);
            },
            deleteNode: function (where){
                return this.delete(where);
            },
            updateNode: function (data, where){
                return this.update(data, where);
            }
        }
    });

});
