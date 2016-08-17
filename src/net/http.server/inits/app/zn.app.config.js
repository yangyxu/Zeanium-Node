zn.define({
    deploy: 'huchun',
    models: '/src/model/',
    controllers: '/src/controller/',
    views: {
        path: '/src/view/',
        suffix: 'html'
    },
    plugin: '/plugins/',
    session: {
        name: '',       //设置 cookie 中，保存 session 的字段名称，默认为 connect.sid
        store: '',      //session 的存储方式，默认存放在内存中，也可以使用 redis，mongodb 等
        genid: '',      //产生一个新的 session_id 时，所使用的函数， 默认使用 uid2 这个 npm 包
        rolling: '',    //每个请求都重新设置一个 cookie，默认为 false
        resave: '',     //即使 session 没有被修改，也保存 session 值，默认为 true
        secret: "d3b07384d113edec49eaa6238ad5ff00",     //通过设置的 secret 字符串，来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
        cookie: {
            // cookie maxAge defaults to 14400000, path defaults to '/' and
            // httpOnly defaults to true.
            maxAge: 60 * 1000,
            domain: 'www.youyang-info.com',
            path: '/',
            expires: '',
            httpOnly: true,
            secure: false
        }
    },
    databases: {
        'mysql': {
            default: true,
            type: 'mysql',
            host: '0.0.0.0',
            user: 'root',
            password: '123456',
            database:'zn_demo',
            port: 3306
        }
    }
});
