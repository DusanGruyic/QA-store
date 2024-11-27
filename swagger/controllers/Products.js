"use strict";

var utils = require("../utils/writer.js");
var Products = require("../service/ProductsService.js");

module.exports.apiV1ProductsGET = function apiV1ProductsGET(req, res, next) {
    Products.apiV1ProductsGET()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1ProductsIdDELETE = function apiV1ProductsIdDELETE(
    req,
    res,
    next,
    id
) {
    Products.apiV1ProductsIdDELETE(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1ProductsIdGET = function apiV1ProductsIdGET(
    req,
    res,
    next,
    id
) {
    Products.apiV1ProductsIdGET(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1ProductsIdPUT = function apiV1ProductsIdPUT(
    req,
    res,
    next,
    body,
    id
) {
    Products.apiV1ProductsIdPUT(body, id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1ProductsPOST = function apiV1ProductsPOST(
    req,
    res,
    next,
    body
) {
    Products.apiV1ProductsPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
