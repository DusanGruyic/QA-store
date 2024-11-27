"use strict";

var utils = require("../utils/writer.js");
var Carts = require("../service/CartsService.js");

module.exports.apiV1CartIdDELETE = function apiV1CartIdDELETE(
    req,
    res,
    next,
    id
) {
    Carts.apiV1CartIdDELETE(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CartIdGET = function apiV1CartIdGET(req, res, next, id) {
    Carts.apiV1CartIdGET(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1CartIdProductsProductIdPOST =
    function apiV1CartIdProductsProductIdPOST(req, res, next, id, productId) {
        Carts.apiV1CartIdProductsProductIdPOST(id, productId)
            .then(function (response) {
                utils.writeJson(res, response);
            })
            .catch(function (response) {
                utils.writeJson(res, response);
            });
    };

module.exports.apiV1CartProductsIdPOST = function apiV1CartProductsIdPOST(
    req,
    res,
    next,
    body,
    id
) {
    Carts.apiV1CartProductsIdPOST(body, id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
