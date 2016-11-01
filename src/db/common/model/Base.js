zn.define('../action/Base', function (BaseAction) {

    return zn.Class("zn.db.common.model.Base", zn.db.data.Model, {
        action: BaseAction,
        properties: {
            id: {
                value: null,
                type: ['bigint', 20],
                ignore: true,
                primary: true
            },
            title: {
                value: null,
                type: ['varchar', 100],
                default: '',
                common: {
                    title: '标题'
                },
                header: {
                    width: 150
                },
                input: {
                    type: 'text'
                }
            },
            createTime: {
                value: null,
                type: ['timestamp'],
                ignore: true,
                //format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: 'now()',
                header: {
                    title: '创建时间',
                    width: 150
                }
            },
            createPerson: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                //ignore: true,
                default: function (){
                    if(zn._request.session.hasItem()){
                        if(zn._request.session.getItem('@AdminUser')){
                            return zn._request.session.getItem('@AdminUser').id;
                        }else {
                            return 0;
                        }
                    }else {
                        return 0;
                    }
                }
            },
            modifyTime: {
                value: null,
                type: ['datetime'],
                ignore: true,
                auto_update: 'now()',
                //format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            },
            modifyPerson: {
                value: null,
                type: ['int', 11],
                convert: 'zn_convert_user({})',
                ignore: true,
                default: function (){
                    if(zn._request.session.hasItem()){
                        return zn._request.session.getItem('@AdminUser').id;
                    }else {
                        return 0;
                    }
                }
            },
            delFlag: {
                value: null,
                type: ['int', 4],
                ignore: true,
                default: '0'
            },
            note: {
                value: null,
                type: ['varchar', 250],
                default: ''
            }
        }
    });

})
