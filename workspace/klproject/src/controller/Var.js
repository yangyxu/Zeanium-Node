zn.define(function () {

    return zn.Controller('var',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('KylinUser');
            },
            getProvinces: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    this._store.command.query("select id as value, title as text from zn_admin_var where locate(',2,44,', parentPath)<>0 and depth=4;").then(function (data){
                        response.success(data);
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            }
        }
    });
});
