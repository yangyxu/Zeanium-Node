# zeanium-node

[English Document](https://github.com/yangyxu/Zeanium-Node/blob/master/README.md)

## 介绍

zeanium-node是基于[zeanium](https://github.com/yangyxu/zeanium), 是专门为nodejs开发的后端框架，提供了基础的`cache`、`cli`、`database`、`io`、`net`、`parser`、`session`、`template`. 基本的OOP使用语法请访问https://github.com/yangyxu/zeanium.


## 基础模块列表
- `cache`：有`数据库缓存`、`内存缓存`、`redis缓存`等三种cache的实现.
- `cli`: 提供一系列基于zn命令行工具如`zn run`.
- `database`: 提供不同数据库标准访问接口, 本框架已经提供基于mysql的实现方案, 也实现sql语句拼接及生成、mysql基于事件队列的事务机制、常见基础model实现及API操作.
- `net`: 网络模块提供http、socket、web socket三种网络服务的实现接口,.
zeanium-node http模块是基于MVC框架.

```bash
$ npm install zeanium-node -g
```

Node.js >= 5.0.0 required.

## 功能

- Http server base
- Plugin customization
- Dynamic development & deployment
    >This is very important feature, developer don't need restart http server when develop mode or release mode. If you do any change for project, the system will auto reload the newly code.
- Using event queue to solve asynchronous
- Support promise
- Support middleware
- Support SQL transaction
- Support some Class(Model, Controller) inherit.
- Customize model(M)&view(V)&controller(C)
- Customize http handler router

## Docs & Community

- [Website && Documentations](https://www.zeanium.com)
- [plugins](https://github.com/search?q=topic%3Azeanium-node-plugin&type=Repositories)

## Getting Started

```js
//define database model
zn.define(function () {

    //common data model
    var model = zn.db.common.model;
    //zn.Model is define.
    return zn.Model("zn_rights_user", {
        mixins: [
            model.Base
        ],
        //define property
        properties: {
            name: {
                value: null,            //field data value
                type: ['varchar', 100], //field data type
                default: ''             //field default value
            },
            pwd: {
                value: null,
                type: ['varchar', 100],
                default: ''
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
```

```js
//define user controller
zn.define(function () {
    //define controller name
    return zn.Controller('user',{
        methods: {
            init: function (args){
                //init
                this._action = this.action('zn_rights_user');
            },
            //define login action
            login: {
                method: 'GET/POST',     //action method
                argv: {                 //action argv
                    username: null,
                    password: null
                },
                value: function (request, response, chain){
                    this.collection('zn_rights_user')
                        .selectOne(request.getValue())
                        .then(function (user){
                            if(user){
                                request.session.user = user;
                                response.success(user);
                            } else {
                                response.error('Username or password is incorrect.');
                            }
                        }, function (error){
                            response.error(error.message);
                        });
                }
            }
        }
    });
});
```

## Try it

```sh
npm install zeanium-node -g
git clone https://github.com/yangyxu/zeanium-node-demo.git
cd zeanium-node-demo
zn run config:zn.workspace.config.js
```
The terminal will show the message for http server.

## Create Workspace

```sh
zn create workspace workspace_demo
```

## Create Application

```sh
zn create app app_demo
```

## Install dependencies

```sh
npm install
```

## Start Application

```sh
zn run config:xxx.config.js
```

If you start server you will see the detail on console:

```text
2016-08-17 21:12:44.043 [INFO] [ Begin ] Scanning Path:../www/
2016-08-17 21:12:44.051 [INFO] Loading Application: ../www/__zn__
2016-08-17 21:12:44.059 [INFO] Register Project(Application): __zn__
2016-08-17 21:12:44.060 [INFO] [ End ] Scanning Path(Application:1):../www/
2016-08-17 21:12:44.060 [INFO] [ Begin ] Scanning Path:../bin/
2016-08-17 21:12:44.063 [INFO] [ End ] Scanning Path(Application:0):../bin/
2016-08-17 21:12:44.066 [INFO] http://0.0.0.0:8080
2016-08-17 21:12:44.068 [INFO] http://127.0.0.1:8080
2016-08-17 21:12:44.069 [INFO] You can press [ control + c ] to stop current zeanium server.
```

## Documentation

[http://www.zeanium.com](http://www.zeanium.com)

## License

[MIT](https://github.com/yangyxu/Zeanium-Node/blob/master/LICENSE)
