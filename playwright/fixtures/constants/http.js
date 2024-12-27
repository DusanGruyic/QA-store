export const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    DELETED: 204,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    BAD_METHOD: 405,
    NOT_ACCEPTABLE: 406,
    BAD_REQUEST: 400,
    BAD_ENTITY: 422,
    SERVER_ERROR: 500,
};

export const METHODS = {
    GET: "get",
    POST: "post",
    PUT: "put",
    PATCH: "patch",
    DELETE: "delete",
    HEAD: "head",
};

const apiVersion = "api/v1";
const apiAuth = `${apiVersion}/auth`;
const customersAPI = `${apiVersion}/customers`;
const productsAPI = `${apiVersion}/products`;
const productImagesAPI = `${apiVersion}/product-images`;
const cartAPI = `${apiVersion}/cart`;

export const ENDPOINTS = {
    LOGIN: `${apiAuth}/login`,
    LOGOUT: `${apiAuth}/logout`,
    REFRESH: `${apiAuth}/refresh`,
    REGISTER: `${apiAuth}/register`,
    PROFILE: `${apiAuth}/me`,
    CUSTOMERS: `${apiVersion}/customers`,
    CUSTOMER: (id) => `${apiVersion}/customers/${id}`,
    BILLING_INFO: (id) => `${customersAPI}/${id}/billing-info`,
    SHIPPING_INFO: (id) => `${customersAPI}/${id}/shipping-info`,
    PRODUCTS: `${apiVersion}/products`,
    PRODUCT: (id) => `${productsAPI}/${id}`,
    PRODUCT_IMAGES: `${apiVersion}/product-images`,
    PRODUCT_IMAGE: (id) => `${productImagesAPI}/${id}`,
    CART: (cartId) => `${cartAPI}/${cartId}`,
    ADD_TO_CART: (cartId, productId) =>
        `${cartAPI}/${cartId}/products/${productId}`,
    REMOVE_FROM_CART: (cartId, productId) =>
        `${cartAPI}/${cartId}/products/${productId}`,
};

export const URLS = {
    DASHBOARD: "/dashboard",
    FORGOTEN_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    MAIL_HOG: "http://localhost:8025/",
    LOGIN: "/login",
};

export const AUTH_TOKEN_TYPE = "Bearer";

export default {
    STATUS_CODES,
    METHODS,
    ENDPOINTS,
    AUTH_TOKEN_TYPE,
    URLS,
};
