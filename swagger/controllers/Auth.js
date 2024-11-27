"use strict";

var utils = require("../utils/writer.js");
var Auth = require("../service/AuthService.js");

module.exports.apiV1AuthLoginPOST = function apiV1AuthLoginPOST(
    req,
    res,
    next,
    body
) {
    Auth.apiV1AuthLoginPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1AuthLogoutPOST = function apiV1AuthLogoutPOST(
    req,
    res,
    next
) {
    Auth.apiV1AuthLogoutPOST()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1AuthProfilePOST = function apiV1AuthProfilePOST(
    req,
    res,
    next
) {
    Auth.apiV1AuthProfilePOST()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1AuthRefreshPOST = function apiV1AuthRefreshPOST(
    req,
    res,
    next
) {
    Auth.apiV1AuthRefreshPOST()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1AuthRegisterPOST = function apiV1AuthRegisterPOST(
    req,
    res,
    next,
    body
) {
    Auth.apiV1AuthRegisterPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
