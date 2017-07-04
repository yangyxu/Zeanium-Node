/**
 * Created by yangyxu on 9/17/14.
 */
zn.define(function () {

    return zn.Collection({
        methods: {
            pagingForRights: function (argv){
                var _defer = zn.async.defer();
                argv.table = this._table;
                this.beginTransaction()
                    .block(zn.block.rights.paging(argv))
                    .on('error', function (sender, error){
                        _defer.reject(error);
                    })
                    .on('finally', function (sender, data){
                        _defer.resolve(data);
                    })
                    .commit();

                return _defer.promise;
            }
        }
    });

});
