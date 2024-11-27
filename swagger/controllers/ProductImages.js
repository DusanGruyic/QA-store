"use strict";

var utils = require("../utils/writer.js");
var ProductImages = require("../service/ProductImagesService.js");

module.exports.apiV1Product_imagesGET = function apiV1Product_imagesGET(
    req,
    res,
    next
) {
    ProductImages.apiV1Product_imagesGET()
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1Product_imagesIdGET = function apiV1Product_imagesIdGET(
    req,
    res,
    next,
    id
) {
    ProductImages.apiV1Product_imagesIdGET(id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1Product_imagesIdPUT = function apiV1Product_imagesIdPUT(
    req,
    res,
    next,
    body,
    id
) {
    ProductImages.apiV1Product_imagesIdPUT(body, id)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};

module.exports.apiV1Product_imagesPOST = function apiV1Product_imagesPOST(
    req,
    res,
    next,
    body
) {
    ProductImages.apiV1Product_imagesPOST(body)
        .then(function (response) {
            utils.writeJson(res, response);
        })
        .catch(function (response) {
            utils.writeJson(res, response);
        });
};
