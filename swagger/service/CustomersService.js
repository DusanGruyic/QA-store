'use strict';


/**
 * Lists all customers
 *
 * returns inline_response_200_4
 **/
exports.apiV1CustomersGET = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "customers" : [ {
    "id" : 1,
    "username" : "john_doe",
    "email" : "john.doe@example.com",
    "first_name" : "John",
    "last_name" : "Doe",
    "date_of_birth" : "1980-01-01"
  } ],
  "status" : "status"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve billing information for a customer
 *
 * id Integer ID of the customer
 * returns inline_response_200_7
 **/
exports.apiV1CustomersIdBilling_infoGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Billing information for customer ID 123",
  "billing_info" : {
    "cardholder" : "John Doe",
    "card_type" : "Visa",
    "card_number" : "4111111111111111",
    "cvv" : 123,
    "card_expiration_date" : "12/24"
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
 * Update billing information for a customer
 *
 * body Id_billinginfo_body  (optional)
 * id Integer ID of the customer
 * returns inline_response_200_8
 **/
exports.apiV1CustomersIdBilling_infoPUT = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Billing information updated successfully",
  "billing_info" : {
    "cardholder" : "John Doe",
    "card_type" : "Visa",
    "card_number" : "4111111111111111",
    "cvv" : 123,
    "card_expiration_date" : "12/24"
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
 * Deletes a customer
 *
 * id Integer ID of the customer to delete
 * returns inline_response_200_6
 **/
exports.apiV1CustomersIdDELETE = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message",
  "status" : "status",
  "customer" : "{\"id\":1,\"username\":\"john_doe\",\"email\":\"john.doe@example.com\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"date_of_birth\":\"1980-01-01\"}"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Gets customer by ID
 *
 * id Integer ID of the customer
 * returns inline_response_200_5
 **/
exports.apiV1CustomersIdGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "status",
  "customer" : {
    "status" : "Success",
    "customer" : {
      "id" : 1,
      "username" : "john_doe",
      "email" : "john.doe@example.com",
      "first_name" : "John",
      "last_name" : "Doe",
      "date_of_birth" : "1980-01-01"
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
 * Updates customer basic information
 *
 * body Customers_id_body  (optional)
 * id Integer ID of the customer to update
 * returns inline_response_200_6
 **/
exports.apiV1CustomersIdPUT = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "message",
  "status" : "status",
  "customer" : "{\"id\":1,\"username\":\"john_doe\",\"email\":\"john.doe@example.com\",\"first_name\":\"John\",\"last_name\":\"Doe\",\"date_of_birth\":\"1980-01-01\"}"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Retrieve shipping information for a customer
 *
 * id Integer ID of the customer
 * returns inline_response_200_9
 **/
exports.apiV1CustomersIdShipping_infoGET = function(id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Shipping information for customer ID 123",
  "shipping_info" : {
    "first_name" : "John",
    "last_name" : "Doe",
    "email" : "john.doe@example.com",
    "street_and_number" : "123 Main St",
    "phone_number" : "+1234567890",
    "city" : "Springfield",
    "postal_code" : 12345,
    "country" : "USA"
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
 * Update shipping information for a customer
 *
 * body Id_shippinginfo_body  (optional)
 * id Integer ID of the customer
 * returns inline_response_200_10
 **/
exports.apiV1CustomersIdShipping_infoPUT = function(body,id) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "success",
  "message" : "Shipping information updated successfully",
  "shipping_info" : {
    "first_name" : "John",
    "last_name" : "Doe",
    "email" : "john.doe@example.com",
    "street_and_number" : "123 Main St",
    "phone_number" : "+1234567890",
    "city" : "Springfield",
    "postal_code" : 12345,
    "country" : "USA"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

