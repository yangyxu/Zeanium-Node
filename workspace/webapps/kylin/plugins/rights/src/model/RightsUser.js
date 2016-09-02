zn.define(['node:chinese-to-pinyin'], function (pinyin) {

    var model = zn.db.common.model;

    return zn.Model("zn_rights_user", {
        mixins: [
            model.Base
        ],
        properties: {
            uid: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            pinYin: {
                value: null,
                type: ['varchar', 20],
                default: function (){
                    return pinyin(this.get('name'), { noTone: true, filterChinese: true });
                }
            },
            pinYinFirstChar: {
                value: null,
                type: ['varchar', 20],
                default: function (){
                    var _firsts = [];
                    zn.each(pinyin(this.get('name'), { noTone: true, filterChinese: true }).split(' '), function (value, index){
                        _firsts.push(value[0].toUpperCase());
                    });
                    return _firsts.join('');
                }
            },
            firstChar: {
                value: null,
                type: ['varchar', 2],
                default: function (){
                    return pinyin(this.get('name'), { noTone: true, filterChinese: true })[0].toUpperCase();
                }
            },
            roleIds: {
                value: null,
                type: ['varchar', 500],
                default: ','
            },
            name: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            pwd: {
                value: null,
                type: ['varchar', 100],
                default: '1234'
            },
            email: {
                value: null,
                type: ['varchar', 50],
                default: ''
            },
            phone: {
                value: null,
                type: ['varchar', 20],
                default: ''
            },
            address: {
                value: null,
                type: ['varchar', 250],
                default: ''
            },
            avatarImg: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            lastLoginTime: {
                value: null,
                type: ['datetime'],
                format: "date_format({},'%Y-%c-%d %h:%i:%s')",
                default: null
            }
        }
    });

})
