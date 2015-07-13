/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.class('Schema', {
        statics: {
            getInstance: function (inArgs, context) {
                return new this(inArgs, context);
            }
        },
        methods: {
            init: function (args, context){
                this._table = null;
                this._context = context;
                this.sets(args);
            },
            build: function (msg){
                var _msg = msg||'The function must be implement the build method.'
                throw new Error(_msg);
            },
            query: function () {
                return this._context.query(this.build());
            }
        }
    });

});