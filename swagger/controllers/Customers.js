"use strict";

var utils = require("../utils/writer.js");
var Customers = require("../service/CustomersService.js");

module.exports.apiV1CustomersGET = function apiV1CustomersGET(req, res, next) {
    Customers.apiV1CustomersGET()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CustomersIdBilling_infoGET =
    function apiV1CustomersIdBilling_infoGET(req, res, next, id) {
        Customers.apiV1CustomersIdBilling_infoGET(id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    };

module.exports.apiV1CustomersIdBilling_infoPUT =
    function apiV1CustomersIdBilling_infoPUT(req, res, next, body, id) {
        Customers.apiV1CustomersIdBilling_infoPUT(body, id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    };

module.exports.apiV1CustomersIdDELETE = function apiV1CustomersIdDELETE(
    req,
    res,
    next,
    id
) {
    Customers.apiV1CustomersIdDELETE(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CustomersIdGET = function apiV1CustomersIdGET(
    req,
    res,
    next,
    id
) {
    Customers.apiV1CustomersIdGET(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CustomersIdPUT = function apiV1CustomersIdPUT(
    req,
    res,
    next,
    body,
    id
) {
    Customers.apiV1CustomersIdPUT(body, id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CustomersIdShipping_infoGET =
    function apiV1CustomersIdShipping_infoGET(req, res, next, id) {
        Customers.apiV1CustomersIdShipping_infoGET(id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    };

module.exports.apiV1CustomersIdShipping_infoPUT =
    function apiV1CustomersIdShipping_infoPUT(req, res, next, body, id) {
        Customers.apiV1CustomersIdShipping_infoPUT(body, id)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    };
