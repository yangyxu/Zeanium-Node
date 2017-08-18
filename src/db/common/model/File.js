zn.define(function () {

    return zn.Class("zn.db.common.model.File", zn.db.data.Model, {
        properties: {
            zn_file_type: {
                value: null,
                type: ['int', 11],
                default: '0'    //0: 分类、目录, 1: 文件
            },
            zn_file_path: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_file_url: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_file_temp_title: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_file_specify_title: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_file_suffix: {
                value: null,
                type: ['varchar', 100],
                default: ''
            },
            zn_file_length: {
                value: null,
                type: ['int', 10],
                default: 0
            },
            zn_file_size: {
                value: null,
                type: ['varchar', 20],
                get: function (){
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
