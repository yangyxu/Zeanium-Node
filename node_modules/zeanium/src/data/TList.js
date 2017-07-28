/**
 * Created by yangyxu on 2014/9/16.
 * TList
 */
(function (zn){

    /**
     * TList
     * @class TList
     * @namespace zn.util
     **/

    zn.Class('zn.data.TList', {
        statics: {
            getInstance: function (args){
                return new this(args);
            }
        },
        properties: {
            min: 0,
            max: 100,
            TClass: null,
            TClassArgv: {}
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
                this.reset();
            },
            reset: function (){
                this._data = [];
                for(var i= 0; i < (this.min||0); i++){
                    this.push(this.TClassArgv);
                }
            },
            push: function (tArgs){
                if(this.TClass){
                    var _t = new this.TClass(tArgs||this.TClassArgv);
                    return this._data.push(_t), _t;
                }
            },
            findOneT: function (filter){
                var _one = null,
                    _filter = filter || zn.idle;
                zn.each(this._data, function (one, index){
                    if(_filter(one, index)){
                        _one = one;
                        return -1;
                    }
                });

                return _one;
            },
            findAllT: function (filter){
                var _ones = [],
                    _filter = filter || zn.idle;
                zn.each(this._data, function (one, index){
                    if(_filter(one, index)){
                        _ones.push(one);
                    }
                });

                return _ones;
            }
        }
    });

})(zn);
