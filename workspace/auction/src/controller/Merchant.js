zn.define([
    'node:nodemailer'
], function (nodemailer) {

    return zn.Controller('merchant',{
        properties: {

        },
        methods: {
            init: function (args){
                this._action = this.action('Merchant');
            },
            testmail: {
                method: 'GET/POST',
                value: function (request, response, chain){
                    nodemailer.createTransport({
                        service: 'QQ',
                        secureConnection: true, // use SSL
                        port: 465, // port
                        auth: {
                            user: 'jimxyy@foxmail.com',
                            pass: 'slzyozjtkwaubahg'
                        }
                    }).sendMail({
                        from: 'jimxyy@foxmail.com',
                        to: 'yangyxu@cisco.com',
                        subject: '沪春点餐系统商户注册',
                        html: '您好 , <br><br>您已经成功注册我们系统， 登录账号：xx, 初始密码: xxx'
                    }, function(error, info){
                        if(error){
                            console.log(error);
                            response.error(error);
                        }else{
                            console.log('Message sent: ' + info.response);
                            response.success('Message sent: ' + info.response);
                        }
                    });
                }
            },
            getSession: {
                validate: true,
                method: 'GET/POST',
                value: function (request, response, chain){
                    response.success(request.session.getItem('@Merchant'));
                }
            },
            login: {
                method: 'GET/POST',
                argv: {
                    name: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne(request.getValue()).then(function (item){
                        if(item){
                            request.session.setItem('@Merchant', item);
                            response.success(item);
                        } else {
                            response.error('商户名称或密码不对');
                        }
                    }, function (error){
                        response.error(error.message);
                    });
                }
            },
            register: {
                method: 'GET/POST',
                argv: {
                    email: null,
                    password: null
                },
                value: function (request, response, chain){
                    this._action.selectOne({
                        title: request.getValue('title')
                    }).then(function (item){
                        if(item){
                            response.error('该商户已经注册过，请重新输入名字！');
                        } else {
                            this._action.addNode(request.getValue()).then(function (info){
                                this._action.selectOne({id: info.insertId}).then(function (item){
                                    nodemailer.createTransport({
                                        service: 'QQ',
                                        secureConnection: true, // use SSL
                                        port: 465, // port
                                        auth: {
                                            user: 'jimxyy@foxmail.com',
                                            pass: 'slzyozjtkwaubahg'
                                        }
                                    }).sendMail({
                                        from: 'jimxyy@foxmail.com',
                                        to: request.getValue('email'),
                                        subject: '沪春点餐系统商户注册',
                                        html: '您好 ' + request.getValue('title') + ', <br><br>您已经成功注册我们系统， 登录账号：'+item.code
                                    }, function(error, info){
                                        if(error){
                                            console.log(error);
                                        }else{
                                            console.log('Message sent: ' + info.response);
                                        }
                                    });
                                    response.success(item);
                                }, function (error){
                                    response.error(error.message);
                                });
                            }.bind(this), function (error){
                                response.error(error.message);
                            });
                        }
                    }.bind(this), function (error){
                        response.error(error.message);
                    });
                }
            }
        }
    });
});
