zn.define({
    '403': {
        code: 403,
        msg: '禁止访问: 访问被拒绝。',
        detail:'您使用所提供的凭据无权查看此目录或页面。'
    },
    '404': {
        code: 404,
        msg: '未找到: 网络资源暂时没找到。',
        detail:'您使用所提供的凭据查找不到此目录或页面。'
    },
    '405': {
        code: 405,
        msg: '方法禁用: 禁用请求中指定的方法。',
        detail:'请求行中指定的请求方法不能被用于请求相应的资源。该响应必须返回一个Allow 头信息用以表示出当前资源能够接受的请求方法的列表。'
    },
    '406': {
        code: 406,
        msg: '不接受: 请求不被服务器接受。',
        detail:'无法使用请求的内容特性响应请求的网页。'
    }
});