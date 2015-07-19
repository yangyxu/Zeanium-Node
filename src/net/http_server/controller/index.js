zn.define([
    './Controller',
    './DefaultController',
    './ErrorController'
], function (Controller, DefaultController, ErrorController) {

    return {
        DefaultController: DefaultController,
        ErrorController: ErrorController
    }

});