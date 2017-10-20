# Zeanium-Node

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]

[简体中文文档](https://github.com/yangyxu/Zeanium-Node/blob/master/README.md)

## Installation

zeanium-node is based on [zeanium](https://github.com/yangyxu/zeanium). Basic development grammar, please visit Website https://github.com/yangyxu/zeanium. It is back-end solution for node.js. Provide `cache`、`cli`、`database`、`io`、`net`、`parser`、`session`、`template` module.

It's back-end mvc framework, provide integrated solutions.

```bash
$ npm install zeanium-node -g
```

Node.js >= 5.0.0 required.

## Features

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
- [plugins](https://github.com/search?q=zn-plugin&type=Repositories)

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

## The MIT License (MIT)

[MIT](https://github.com/yangyxu/Zeanium-Node/blob/master/LICENSE)

[downloads-image]: http://img.shields.io/npm/dm/zeanium-node.svg
[npm-image]: https://img.shields.io/npm/v/zeanium-node.svg
[npm-url]: https://www.npmjs.com/package/zeanium-node
