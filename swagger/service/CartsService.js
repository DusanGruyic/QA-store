'use strict';


/**
 * Delete cart
 *
 * id Integer ID of the cart to delete
 * returns inline_response_200_20
 **/
exports.apiV1CartIdDELETE = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Cart deleted",
  "eooo" : [ {
    "id" : 1,
    "name" : "Product 1",
    "price" : 100,
    "quantity" : 2
  } ]
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get cart by ID
 *
 * id Integer ID of the cart
 * returns inline_response_200_19
 **/
exports.apiV1CartIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "cart" : [ {
    "id" : 1,
    "name" : "Product 1",
    "price" : 100,
    "quantity" : 2
  } ],
  "customer_id" : 1
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Remove product from the cart
 *
 * id Integer ID of the cart
 * productId Integer ID of the product to remove
 * returns inline_response_200_22
 **/
exports.apiV1CartIdProductsProductIdPOST = function(id,productId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product removed from the cart"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Add product to the cart
 *
 * body Products_id_body_1  (optional)
 * id Integer ID of the product to add to the cart
 * returns inline_response_200_21
 **/
exports.apiV1CartProductsIdPOST = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product added to the cart",
  "cart" : [ {
    "id" : 1,
    "name" : "Product 1",
    "price" : 100,
    "quantity" : 2
  } ],
  "quantity" : 2,
  "pivot" : {
    "quantity" : 2
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

