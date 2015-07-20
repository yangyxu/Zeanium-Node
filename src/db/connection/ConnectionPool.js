/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.class('ConnectionPool', {
        static: true,
        properties: {

        },
        methods: {
            init: function (){
                this._mysql = {};
                this._nosql = {};
                this._mssql = {};
            },
            getConnection: function(){

            }
        }
    });

});