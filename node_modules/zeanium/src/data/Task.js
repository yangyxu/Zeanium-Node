/**
 * Created by yangyxu on 2014/9/16.
 * Task
 */
(function (zn){

    /**
     * Task
     * @class Task
     * @namespace zn.util
     **/

    zn.Class('zn.data.Task', {
        statics: {
            getInstance: function (args){
                return new this(args);
            },
            PANDING: 0,
            WAITING: 1,
            DOING: 2,
            DONE: 3
        },
        properties: {
            statue: 0
        },
        methods: {
            init: function (inArgs) {
                this.sets(inArgs);
            }
        }
    });

})(zn);
