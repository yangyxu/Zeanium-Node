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
    './ProjectItemAttach',
    './ProjectItemFeedback'
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
    ProjectItemAttach,
    ProjectItemFeedback
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
        ProjectItemAttach: ProjectItemAttach,
        ProjectItemFeedback: ProjectItemFeedback
    }

});
