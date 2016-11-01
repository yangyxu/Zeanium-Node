zn.define(['node:chinese-to-pinyin'],function (pinyin) {

    return zn.Controller('role',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('AdminRole');
            }
        }
    });

});
