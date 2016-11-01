zn.define(function () {

    return zn.Class("zn.db.common.model.File", zn.db.data.Model, {
        properties: {
            type: {
                value: null,
                type: ['int', 11],
                default: '0'    //0: 分类、目录, 1: 文件
            },
            path: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            url: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            tempTitle: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            specialTitle: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            fileSuffix: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            length: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            size: {
                value: null,
                type: ['varchar', 20],
                default: function (){
                    var value = this.getInt('length');
                    if(value){
            			var _v = value / (1024 * 1024);
            			if(_v<1){
            				return (value/1024).toFixed(2) + 'KB';
            			}else {
            				return _v.toFixed(2) + 'MB';
            			}
            		}else {
            			return '-';
            		}
                }
            }
        }
    });

})
