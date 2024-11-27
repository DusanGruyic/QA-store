'use strict';


/**
 * List all products
 *
 * returns inline_response_200_11
 **/
exports.apiV1ProductsGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "products" : [ {
    "id" : 1,
    "name" : "Product 1",
    "description" : "Description of Product 1",
    "price" : 19.99,
    "in_stock" : true,
    "quantity" : 100,
    "rating" : 4.5,
    "productImage" : {
      "id" : 1,
      "url" : "https://example.com/image1.jpg"
    }
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
 * Delete a product
 *
 * id Integer ID of the product
 * returns inline_response_200_15
 **/
exports.apiV1ProductsIdDELETE = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product deleted successfully",
  "product" : {
    "id" : 1,
    "name" : "Product 1",
    "description" : "Description of Product 1",
    "price" : 19.99,
    "in_stock" : true,
    "quantity" : 100,
    "rating" : 4.5
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get product by ID
 *
 * id Integer ID of the product
 * returns inline_response_200_13
 **/
exports.apiV1ProductsIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "product" : {
    "id" : 1,
    "name" : "Product 1",
    "description" : "Description of Product 1",
    "price" : 19.99,
    "in_stock" : true,
    "quantity" : 100,
    "rating" : 4.5,
    "productImage" : {
      "id" : 1,
      "url" : "https://example.com/image1.jpg"
    }
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Update a product
 *
 * body Products_id_body  (optional)
 * id Integer ID of the product
 * returns inline_response_200_14
 **/
exports.apiV1ProductsIdPUT = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product updated successfully",
  "product" : {
    "id" : 1,
    "name" : "Updated Product",
    "description" : "Updated Product Description",
    "price" : 59.99,
    "in_stock" : false,
    "quantity" : 30,
    "rating" : 4.2
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Add new product
 *
 * body V1_products_body  (optional)
 * returns inline_response_200_12
 **/
exports.apiV1ProductsPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product created successfully",
  "product" : {
    "id" : 2,
    "name" : "New Product",
    "description" : "New Product Description",
    "price" : 49.99,
    "in_stock" : true,
    "quantity" : 50,
    "rating" : 4.8
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

