zn.define([
    './AdminUser',
    './AdminUserLog',
    './AdminRole',
    './AdminMenu',
    './AdminVar',
    './AdminDocument'
], function (AdminUser, AdminUserLog, AdminRole, AdminMenu, AdminVar, AdminDocument){
    return {
        AdminUser: AdminUser,
        AdminUserLog: AdminUserLog,
        AdminRole: AdminRole,
        AdminMenu: AdminMenu,
        AdminVar: AdminVar,
        AdminDocument: AdminDocument
    }
});
