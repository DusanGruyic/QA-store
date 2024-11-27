'use strict';


/**
 * Log in with registered user
 *
 * body Auth_login_body  (optional)
 * returns inline_response_200
 **/
exports.apiV1AuthLoginPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "Success",
  "message" : "User logged in successfully",
  "user" : {
    "id" : 1,
    "username" : "testuser",
    "email" : "test-user@email.com",
    "password" : "$2y$12$1XSFpD5XpwBNWlZLYFj31Oewqi...",
    "created_at" : "2024-09-01T11:57:55.000000Z",
    "updated_at" : "2024-09-01T11:57:55.000000Z"
  },
  "auth" : {
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type" : "Bearer"
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
 * Log out user
 *
 * returns inline_response_200_2
 **/
exports.apiV1AuthLogoutPOST = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "message" : "Successfully logged out"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Get authenticated user
 *
 * returns inline_response_200_1
 **/
exports.apiV1AuthProfilePOST = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "id" : 2,
  "username" : "newuser",
  "email" : "new-user@email.com",
  "password" : "$2y$12$tjwddwXp6E/87dkdqokmm8@$)d...",
  "updated_at" : "2024-09-01T13:55:46.000000Z",
  "created_at" : "2024-09-01T13:55:46.000000Z"
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Regenerate JWT token
 *
 * returns inline_response_200_3
 **/
exports.apiV1AuthRefreshPOST = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "access_token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type" : "bearer",
  "expires_in" : 3600
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}


/**
 * Register a new user
 *
 * body Auth_register_body  (optional)
 * returns inline_response_201
 **/
exports.apiV1AuthRegisterPOST = function(body) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "status" : "Success",
  "message" : "User created successfully",
  "user" : {
    "username" : "newuser",
    "email" : "new-user@email.com",
    "password" : "$2y$12$tjwddwXp6E/87dkdqokmm8@$)d...",
    "updated_at" : "2024-09-01T13:55:46.000000Z",
    "created_at" : "2024-09-01T13:55:46.000000Z",
    "id" : 2
  },
  "auth" : {
    "token" : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type" : "Bearer"
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

