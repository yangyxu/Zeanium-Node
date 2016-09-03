zn.define(function () {

    return zn.Controller('menu',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('RightsMenu');
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
