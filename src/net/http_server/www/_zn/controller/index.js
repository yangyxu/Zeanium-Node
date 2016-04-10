zn.define([
    './DefaultController',
    './ErrorController',
    './APIController'
], function (DefaultController, ErrorController, APIController) {

    return {
        DefaultController: DefaultController,
        ErrorController: ErrorController,
        APIController: APIController
    }

});
