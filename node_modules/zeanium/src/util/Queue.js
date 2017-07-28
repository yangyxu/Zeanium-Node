/**
 * Created by yangyxu on 2016/4/5.
 * Queue: Queue
 */
(function (zn){

    var __slice = Array.prototype.slice;

    //__slice.call(arguments);

    var TASK_STATE = {
        PENDING: 0,
        CANCLE: 1,
        PAUSE: 2,
        FINISHED: 3
    };

    /**
     * TaskProcessor: TaskProcessor
     * @class TaskProcessor
     **/
    var TaskProcessor = zn.Class({
        events: ['init', 'finished'],
        properties: {
            status: {
                value: TASK_STATE.PENDING,
                get: function (){
                    return this._status;
                }
            }
        },
        methods: {
            init: function (inArgs) {

            },
            doTask: function (task, argv){
                if(task){
                    var _argv = argv||[];
                    _argv.unshift(this);
                    task.handler.apply(task.context, _argv);
                }
            },
            done: function (){
                this._status = TASK_STATE.FINISHED;
                this._data = __slice.call(arguments);
                this.fire('finished', this._data);
                this.off('finished');
            }
        }
    });

    /**
     * Queue: Queue
     * @class Queue
     **/
    var Queue = zn.Class({
        events: [
            'clear',
            'insert',
            'pause',
            'resume',
            'exception',
            'every',
            'finally'
        ],
        properties: {
            count: {
                get: function (){
                    return this._tasks.length;
                }
            }
        },
        methods: {
            init: function (inArgs) {
                this._exceptions = [];
                this._finallys = [];
                this._everys = [];
                this._tasks = [];
                this._taskProcessor = [];
                this._lastTask = null;
                this._data = [];
                this._max = (inArgs||{}).max || 1;
            },
            destroy: function (){
                this._everys = [];
                this._tasks = [];
                this._taskProcessor = [];
                this.fire('finally', this._data, { method: 'apply' });
                this.super();
            },
            clear: function (){
                this._tasks = [];
            },
            pause: function (maxWaitTime){
                this._paused = true;
        		if(maxWaitTime > 0) {
        			this._pauseTimer = setTimeout(function() {
        				this.resume();
        			}.bind(this), maxWaitTime);
        		}
                this.fire('pause');
                return this;
            },
            resume: function (){
                if(this._pauseTimer){
                    clearTimeout(this._pauseTimer);
                }
                this._paused = false;
                this.fire('resume');
                this.doTask();

                return this;
            },
            exception: function (handler, context){
                return this.on('exception', handler, context || this), this;
            },
            catch: function (exception){
                return this.fire('exception', exception), this;
            },
            finally: function (handler, context){
                return this.on('finally', handler, context || this), this;
            },
            every: function (handler, context){
                return this.on('every', handler, context || this), this;
            },
            unshift: function (handler, context){
                return this.insert(handler, context, 0), this;
            },
            push: function (handler, context){
                return this.insert(handler, context, -1), this;
            },
            inserts: function (handlers, context, index){
                var _tasks = handlers||[],
                    _index = index || 0,
                    _first = this._tasks[0],
                    _last = null,
                    _task = null;
                _tasks = _tasks.map(function (handler){
                    _task = {
                        handler: handler,
                        context: context || this
                    };

                    if(_last){
                        _task.previous = _last;
                        _last.next = _task;
                    }
                    _last = _task;

                    return _task;
                }.bind(this));

                if(_first){
                    _last.next = _first;
                    _first.previous = _last;
                }

                _tasks.unshift(0);
                _tasks.unshift(_index);

                return this._tasks.splice.apply(this._tasks, _tasks), this;
            },
            insert: function (handler, context, index){
                var _task = {
                    handler: handler,
                    context: context || this
                }, _index = index || -1;

                switch (_index) {
                    case -1:
                        if(this._lastTask){
                            _task.previous = _task;
                            this._lastTask.next = _task;
                        }

                        this._lastTask = _task;
                        this._tasks.push(_task);
                        break;
                    case 0:
                        var _first = this._tasks[0];

                        if(_first){
                            _task.next = _first;
                            _first.previous = _task;
                        }

                        this._tasks.unshift(_task);
                        break;
                    default :
                        this._tasks.splice(_index, 0, _task);
                        break;
                }

                return this.fire('insert', _task), this;
            },
            getTaskProcessor: function (){
                var _tp = null, _len = this._taskProcessor.length;
                for (var i = 0; i < _len; i++) {
                    _tp = this._taskProcessor[i];
                    if(_tp.status == TASK_STATE.FINISHED){
                        return _tp;
                    }
                }
                if(!_tp&&this._max > _len){
                    var _processor = new TaskProcessor();
                    _processor.queue = this;
                    _processor.on('finished', this.__onProcessorFinished.bind(this), this);
                    return _processor;
                }
            },
            start: function (){
                this._data = [];
                return this.doTask();
            },
            doTask: function (data){
                var _task = this._tasks.shift();
                if(_task){
                    var _taskProcessor = this.getTaskProcessor();
                    if(_taskProcessor){
                        _task.previousResult = data;
                        _taskProcessor.doTask(_task, data);
                    }
                }else {
                    this.destroy();
                }

                return this;
            },
            __onProcessorFinished: function (sender, data){
                this._data.push(data);
                this.fire('every', data, { method: 'apply' });
                this.doTask(data);
            }
        }
    });

    zn.queue = function(argv){
        return new Queue(argv);
    };

})(zn);
