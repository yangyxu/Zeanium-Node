(function (zn){

    var TestLoader = zn.Class('zn.unit.TestLoader',{
        static: true,
        properties: {
            basePath: ''
        },
        methods: {
            init: function (){
                this._casePaths = [];
                this._caseMethods = [];
            },
            load: function (path){
                if(Array.isArray(path)){
                    this._casePaths.concat(path);
                }else {
                    this._casePaths.push(path);
                }

                return this;
            },
            run: function () {
                this.__testingCase();
            },
            __testingCase: function (){
                var _case = this._casePaths.shift(),
                    _basePath = this.basePath,
                    _path = _basePath + _case;
                    _self = this;

                if(_case){
                    zn.load(_path, function (testCaseClass){
                        var _methods = testCaseClass.getMeta('methods')||[];
                        zn.info('Testing Case: '+ _case);
                        _self.__testingCaseMethods(_methods);
                    });
                }
            },
            __testingCaseMethods: function (methods){
                this._caseMethods = [];
                for(var name in methods){
                    var _method = methods[name];
                    _method.key = name;
                    this._caseMethods.push(_method);
                }
                this.__testingCaseMethod();
            },
            __testingCaseMethod: function (){
                var _method = this._caseMethods.shift(), _self = this;
                if(_method){
                    var _beginTime = (new Date()).getTime(), _methodname = _method.key;
                    var _promise = _method.call(null);
                    if(_promise&&_promise.then){
                        _promise.then(function (){
                            _self.__getDiffSecond(_beginTime, _methodname);
                            _self.__testingCaseMethod();
                        });
                    }else{
                        _self.__getDiffSecond(_beginTime, _methodname);
                        _self.__testingCaseMethod();
                    }
                }else {
                    _self.__testingCase();
                }
            },
            __getDiffSecond: function (beginTime, methodname){
                var _endTime = (new Date()).getTime();
                var _diff = _endTime - beginTime;
                var days=Math.floor(_diff/(24*3600*1000));
                var leave1=_diff%(24*3600*1000);
                var hours=Math.floor(leave1/(3600*1000));
                var leave2=leave1%(3600*1000);
                var minutes=Math.floor(leave2/(60*1000));
                var leave3=leave2%(60*1000);
                var seconds=Math.round(leave3/1000);
                zn.info('Test method '+methodname+' :{ second: '+seconds+'s, diff: '+_diff+' }');
            }
        }
    });

})(zn);
