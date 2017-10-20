# zeanium-node

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[English Document](https://github.com/yangyxu/Zeanium-Node/blob/master/README_EN.md)

## 介绍

zeanium-node是基于[zeanium](https://github.com/yangyxu/zeanium), 是专门为nodejs开发的后端框架，提供了基础的`cache`、`cli`、`database`、`io`、`net`、`parser`、`session`、`template`. 基本的OOP使用语法请访问https://github.com/yangyxu/zeanium.

## 官方QQ群: 627104335

有任务问题可以添加qq群进行咨询

## 相关产品

- [zeanium](https://github.com/yangyxu/zeanium): 面向对象的JavaScript底层框架
- [zeanium-react-web](https://github.com/yangyxu/zeanium-react-web): 基于zeanium和react同时支持web和wap端的前端UI框架
- [zeanium-react-native](https://github.com/yangyxu/zeanium-react-native): 基于zeanium和react native的Android/ios应用原生开发框架

## 基础模块列表
- `cache`：有`数据库缓存`、`内存缓存`、`redis缓存`等三种cache的实现.
- `cli`: 提供一系列基于zn命令行工具如`zn run`.
- `db`: 提供不同数据库标准访问接口, 本框架已经提供基于mysql的实现方案, 也实现sql语句拼接及生成、mysql基于事件队列的事务机制、常见基础model实现及API操作.
- `net`: 网络模块提供http、socket、web socket三种网络服务的实现接口,zeanium-node http模块是基于MVC框架.
- `session`: 提供后台session管理机制, 有内存模式, 数据库模式.
- `template`: 提供静态化模板引擎.

```bash
$ npm install zeanium-node -g
```

Node.js 版本 >= 6.0.0.

## 功能

- 基础的http服务
- 自定义插件机制
- 框架最突出的亮点：动态开发、动态部署
    >对于开发者来说这是非常重要的功能，常规的node.js开发需要借助于第三方库如forever, pm2等来守护node进程。使用我们的框架可以在不借助任何库的前提下可以动态开发和部署。如果你的工程代码发生改变，框架自身回去判断是否需要重新编译最新版本, 而且编译速度极快能看到整个编译过程.
- 提供事件队列和promise来解决JavaScript异步
- 支持promise
- 支持中间件
- 支持SQL事务来处理服务业务逻辑
- 支持Model, Controller继承.
- 自定义model(M)&view(V)&controller(C)
- 自定义http服务处理路由
- 提供静态化模板引擎
- 实现MySql数据库驱动接口

## 文档和社区

- [官方网站/文档](https://www.zeanium.com)（正在完善中...）
- [插件](https://github.com/search?q=topic%3Azn-plugin&type=Repositories)：
    我们提供系统开发常见的插件`zn-plugin-admin`、`zn-plugin-dbms`、`zn-plugin-wechat`、`zn-plugin-alipay`、`zn-plugin-workflow`
- 官方QQ交流群: 627104335

## 开始学习
zeanium-node是基于zeanium框架底层实现的后端框架, 提供面向对象编程的继承、封装、多态特性，同理zeanium-node也具备这些特性。想了解更多的面向对象功能请参考[zeanium](https://github.com/yangyxu/zeanium)。

db模块定义常规的数据模型和数据访问层接口
- 模型：Model、Collection、Store
    Model: 提供系统表结构数据模型的基类, 会对系统提交表单进行字段验证以及sql语句处理
    Collection: 处理数据模型是某个具体的Model的几个对象
    Store: 数据库对外统一接口

```js
//定义数据库模型
zn.define(function () {

    //公共数据模型
    var model = zn.db.common.model;
    //zn.Model是定义数据库模型函数, 返回数据模型.
    return zn.Model("zn_rights_user", {
        mixins: [
            model.Base //继承基础数据模型对象
        ],
        //定义模型属性
        properties: {
            name: {
                value: null,            //字段值
                type: ['varchar', 100], //字段数据类型
                default: ''             //创建表字段默认值
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
//定义控制器
zn.define(function () {

    return zn.Controller('user',{
        methods: {
            init: function (args){
                //构造函数
            },
            //定义login的接口
            login: {
                method: 'GET/POST',     //接口可接受的方法
                argv: {                 //接口参数，如值是null则是必填参数
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
            },
            selectUsers: {
                method: 'GET/POST',     //接口可接受的方法
                argv: {                 //接口参数，如值是null则是必填参数
                    where: {}
                },
                value: function (request, response, chain){
                    this.collection('zn_rights_user')
                        .select({
                            fields: ['id','name'],
                            where: request.getValue('where')
                        })
                        .then(function (data){
                            response.success(data)
                        }, function (error){
                            response.error(error.message);
                        });
                }
            }
        }
    });
});
```

## 试一下

```sh
npm install zeanium-node -g
git clone https://github.com/yangyxu/zeanium-node-demo.git
cd zeanium-node-demo
zn run config:zn.workspace.config.js
```
The terminal will show the message for http server.

## 安装项目依赖

```sh
npm install
```

## 启动应用

系统启动默认配置是当前目录下的zn.server.config.js, 所以如果服务启动文件是这个文件名就可以直接运行zn run来启动服务。
也可以自定义启动配置文件，则需要运行zn run config:your.config.js
```sh
zn run || zn run config:xxx.config.js
```

如果您启动服务有一下内容输出到控制台则说明启动:

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

## 文档

[http://www.zeanium.com](http://www.zeanium.com)

## The MIT License (MIT)

[MIT](https://github.com/yangyxu/Zeanium-Node/blob/master/LICENSE)

[downloads-image]: http://img.shields.io/npm/dm/zeanium-node.svg
[npm-image]: https://img.shields.io/npm/v/zeanium-node.svg
[npm-url]: https://www.npmjs.com/package/zeanium-node
