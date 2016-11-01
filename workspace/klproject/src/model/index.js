zn.define([
    './Customer',
    './CustomerShop',
    './KylinUser',
    './KylinAdminUser',
    './KylinUserComment',
    './KylinUserSuggestion',
    './Project',
    './ProjectItem',
    './ProjectItemAdInfo',
    './ProjectItemAttach'
], function (
    Customer,
    CustomerShop,
    KylinUser,
    KylinAdminUser,
    KylinUserComment,
    KylinUserSuggestion,
    Project,
    ProjectItem,
    ProjectItemAdInfo,
    ProjectItemAttach
){

    return {
        Customer: Customer,
        CustomerShop: CustomerShop,
        KylinUser: KylinUser,
        KylinAdminUser: KylinAdminUser,
        KylinUserComment: KylinUserComment,
        KylinUserSuggestion: KylinUserSuggestion,
        Project: Project,
        ProjectItem: ProjectItem,
        ProjectItemAdInfo: ProjectItemAdInfo,
        ProjectItemAttach: ProjectItemAttach
    }

});
