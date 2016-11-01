# Zeanium-Node

[简体中文文档](https://github.com/yangyxu/Zeanium-Node/blob/master/README_zh-CN.md)


## Introduction

Zeanium-Node is based on Zeanium-Core(https://github.com/yangyxu/Zeanium), it is back-end solution for node.js. Provide `cache`、`database`、`io`、`net`、`parser`、`session`、`template` features.

It's back-end mvc framework, provide integrated solutions.

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
                    this._action.selectOne(request.getValue()).then(function (user){
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

```js
//define user Action
zn.define(function () {

    return zn.Action({
        methods: {
            getLoginInfo: function (userId){

            }
        }
    });

});
```

## Features

* Fully OOP.

## Installation

```sh
npm install zeanium-node -g
```

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
npm start or zn
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
