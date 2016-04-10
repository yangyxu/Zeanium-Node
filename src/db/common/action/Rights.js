/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {
    var Async = zn.async;
    var String = zn.format.String;

    return zn.collection('zn.db.common.action.Rights', {
        methods: {
            init: function (inStore){
                this.super(inStore);
            },
            query: function (table, fields, where){

            },
            paging: function (table, fields, where){

            }
        }
    });

});
