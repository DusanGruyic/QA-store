'use strict';


/**
 * List all product images
 *
 * returns inline_response_200_16
 **/
exports.apiV1Product_imagesGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "images" : [ {
    "id" : 1,
    "src" : "https://example.com/image1.jpg",
    "title" : "Image 1",
    "description" : "Description of Image 1",
    "mime_type" : "image/jpeg",
    "alt_text" : "Alt text for Image 1"
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
 * Get product image by ID
 *
 * id Integer ID of the product image
 * returns inline_response_200_17
 **/
exports.apiV1Product_imagesIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "product_image" : {
    "id" : 1,
    "src" : "https://example.com/image1.jpg",
    "title" : "Image 1",
    "description" : "Description of Image 1",
    "mime_type" : "image/jpeg",
    "alt_text" : "Alt text for Image 1"
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
 * Update product image
 *
 * body Productimages_id_body  (optional)
 * id Integer ID of the product image
 * returns inline_response_200_18
 **/
exports.apiV1Product_imagesIdPUT = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product image updated successfully",
  "product_image" : {
    "id" : 1,
    "src" : "https://example.com/updated-image.jpg",
    "title" : "Updated Image",
    "description" : "Updated Description",
    "mime_type" : "image/png",
    "alt_text" : "Updated Alt Text"
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
 * Add new product image
 *
 * body V1_productimages_body  (optional)
 * returns inline_response_201_1
 **/
exports.apiV1Product_imagesPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Product image created successfully",
  "product_image" : {
    "id" : 2,
    "src" : "https://example.com/new-image.jpg",
    "title" : "New Image",
    "description" : "Description of New Image",
    "mime_type" : "image/png",
    "alt_text" : "Alt text for New Image"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

