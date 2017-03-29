zn.define({
    create: {
        url: '/menu/create',
        method: 'POST',
        argv: {
            access_token: null
        }
    },
    get: {
        url: '/menu/get',
        method: 'GET',
        argv: {
            access_token: null
        }
    },
    delete: {
        url: '/menu/delete',
        method: 'GET',
        argv: {
            access_token: null
        }
    },
    get_current_selfmenu_info: {
        url: '/get_current_selfmenu_info',
        method: 'GET',
        argv: {
            access_token: null
        }
    }
});
