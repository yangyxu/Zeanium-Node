/**
 * Created by yangyxu on 8/20/14.
 */
zn.define(function () {

    return zn.Class({
        statics: {
            getInstance: function (inArgs, context) {
                return new this(inArgs, context);
            }
        },
        methods: {
            init: {
                auto: true,
                value: function (args, context){
                    this._table = null;
                    this._context = context;
                    this.sets(args);
                }
            },
            build: function (message){
                throw new Error(message || 'The Schema Class must be implement the build method.');
            },
            query: function () {
                return this._context.query(this.build());
            }
        }
    });

});
