zn.define([
    './block/',
    './service/',
    './action/',
    './model/'
], function (block, service, action, model) {
    zn.block = block;
    zn.service = service;

    return {
        block: block,
        service: service,
        action: action,
        model: model
    }

});
