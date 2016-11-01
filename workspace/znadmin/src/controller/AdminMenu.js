zn.define(function () {

    return zn.Controller('menu',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('AdminMenu');
            },
            getPCMenus: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){

                }
            }
        }
    });

});
