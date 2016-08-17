zn.define(function () {

    return zn.Controller('group',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('RightsGroup');
            },
            addGroup: {
                method: 'GET/POST',
                argv: {
                    userId: null,
                    name: 'test'
                },
                value: function (request, response, chain){
                    this._action.addTreeNode({
                        code: 'code_0',
                        title: 'title_0',
                        pid: 2
                    }).then(function (data){
                        response.success(data);
                    }, function (error){
                        response.error(error);
                    });
                }
            },
            deleteGroup: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.deleteTreeNode(2).then(function (data){
                        response.success(data);
                    }, function (error){
                        response.error(error);
                    });
                }
            },
            orderGroup: {
                method: 'GET/POST',
                argv: {
                    userId: null
                },
                value: function (request, response, chain){
                    this._action.orderTreeNode(3, 'down').then(function (data){
                        response.success(data);
                    }, function (error){
                        response.error(error);
                    });
                }
            }
        }
    });

});
