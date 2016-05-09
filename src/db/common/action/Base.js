/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Action({
        methods: {
            findOne: function (inWhere, fields){
                var _defer = zn.async.defer();
                this.select(fields, inWhere)
                    .then(function (rows){
                        _defer.resolve(rows[0]);
                    });

                return _defer.promise;
            }
        }
    });

});
