zn.define([
    './Controller',
    './DefaultController',
    './ErrorController'
], function (Controller, DefaultController, ErrorController) {

    return {
        BaseController: BaseController,
        DefaultController: DefaultController,
        ErrorController: ErrorController
    }

});