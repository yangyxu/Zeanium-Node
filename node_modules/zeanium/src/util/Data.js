/**
 * Created by yangyxu on 5/20/17.
 */
(function (zn){

    zn.data = zn.Class({
        static: true,
        methods: {
            arrayToTree: function (data, options){
                var _pids = {},
                    _ids = {},
                    _root = [],
                    _item = null,
                    _key = null,
                    _options = zn.extend({ id: 'id', pid: 'pid' }, options),
                    _id = _options.id,
                    _pid = _options.pid;

                for(_key in data){
                    _item = data[_key];
                    if(!_pids[_item[_pid]]){
                        _pids[_item[_pid]] = [];
                    }
                    _pids[_item[_pid]].push(_item);
                    _ids[_item[_id]] = _item;
                }

                for(_key in data){
                    if(_pids[data[_key][_id]]){
                        data[_key].children = _pids[data[_key][_id]];
                    }
                }

                for(var pid in _pids){
                    if(!_ids[pid]){
                        _root = _pids[pid];
                        break;
                    }
                }

                return _root;
            }
        }
    });

})(zn);
