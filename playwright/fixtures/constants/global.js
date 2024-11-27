export const STRING_FIELDS = ["name", "description", "email", "password"];
export const BOOLEAN_FIELDS = ["in_stock"];
export const NUMERIC_FIELDS = [
    "price",
    "quantity",
    "postal_code",
    "cart_quantity",
    "rating",
];
export const IS_REQUIRED = ["email", "password"];
export const ENV_PATH = "./.env.playwright";
export const RESPONSE_REPORT_NAME = "responses.json";

export const RESPONSE_MESSAGES = {
    UNAUTHORIZED: "Unauthorized",
    UNAUTHENTICATED: "Unauthenticated.",
    NOT_SUPPORTED: "not supported",
    NOT_FOUND: "not be found",
    SUCCESS: "Success",
    SUCCESS_CREATE_USER: "User created successfully",
    SUCCESS_UPDATE_CUSTOMER: "Customer updated successfully.",
    EMAIL_TAKEN: "The email has already been taken.",
    SHIPPING_INFO_SUCCESSFUL_UPDATE: "Shippinginfo updated successfully.",
    GAVRILO_PRINCIP: "Really? Did you know Gavrilo Princip?",
    FUTURE_DATE_OF_BIRTH: "You need to be over 16 years old",
    SUCCESS_CUSTOMER_DELETE: "Customer deleted successfully.",
    PRODUCT_UPDATED: "Product updated successfully",
    PRODUCT_DELETED: "Product deleted successfully.",
    SET_QUANTITY_NOT_IN_STOCK:
        "Cannot set quantity when product is not in stock.",
    SET_IN_STOCK_NO_QUANTITY: "Cannot set stock when there is no products.",
    NO_PRODUCT_FOUND: "No product found.",
    BILLING_INFO_SUCCESSFUL_UPDATE: "Billinginfo updated successfully.",
    LOGIN_BAD_CREDENTIALS:
        "The email address or password you entered is invalid",
    LOGIN_INVALID_EMAIL: "The email field must be a valid email address.",
    METHOD_NOT_ALLOWED: "Method Not Allowed"
};

export const MAX_FIELD_LENGTH_255 = 255;

export const FALSY_DATA = {
    EMPTY_STRING: "",
    NULL: null,
    ARRAY: [],
    OBJECT: {},
};

export const TEST_DATA_BY_TYPE = {
    STRING_DATA: "stringData",
    ARRAY_DATA: ["arrayData1", 123],
    OBJECT_DATA: {
        stringData: "stringData",
        integerData: 123,
    },
};

export const BOOLEAN_VALUES = {
    TRUE: true,
    FALSE: false,
};

export const NUMERIC_AND_CHAR_VALUES = {
    NUMERIC: "12345",
    CHAR: "@+?=!",
};
export const FLOAT_DATA = 1.2;
export const INTEGER_DATA = 2;

export const NAVBAR_LINKS = {
    REGISTER: "register",
    LOGIN: "login",
    DASHBOARD: "dashboard",
    LOGOUT: "logout",
};

export const FORGOT_PASSWORD_FORM_TEXT = {
    FORGOT_PASSWORD: "Forgot your password?",
    DESCRIPTION_TEXT:
        "No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.",
    PASSWORD_RESET: "Password Reset ",
};

export const FORGOT_PASSWORD_MESSAGES = {
    SUCCESSFUL: "We have emailed your password reset link.",
    NOT_SUPPORTED_EMAIL_FORMAT:
        "The email field must be a valid email address.",
    EMPTY_EMAIL_FIELD: "The email field is required.",
    NEW_PASSWORD_SET: "New password successfully set!",
    PASSWORD_FIELD_REQUIRED: "The password field is required.",
    CONFIRMATION_FIELD_DOESNT_MATCH:
        "The password field confirmation does not match.",
    USER_DOESNT_EXIST: "We can't find a user with that email address.",
    PASSWORD_LENGTH_ERROR: "The password field must be at least 8 characters.",
    INVALID_RESET_TOKEN: "This password reset token is invalid.",
};

export const PASSWORD = {
    VALID: "123456789",
};

export const DASHBOARD_TEXTS = {
    BUY_SOME : "Buy some stuff bruh",
}

export const DISCOUNTS = {
    SIXTY_SEVEN : 0.67,
}

export const SLIDE_PRICE_BAR = {
    EIGHTHUNDRED_FOURTHY_SEVEN : 20,
    FIVETOUSEND_EIGHTY_FIVE : 120,
}

export const PRODUCTS_MESSAGES = {
    PRODUCT_ADDED_SUCCESSFULLY : "Product added to cart!",
}

export const NGROK_LINK_TEXT = "ngrok.com";

export default {
    STRING_FIELDS,
    BOOLEAN_FIELDS,
    NUMERIC_FIELDS,
    ENV_PATH,
    RESPONSE_REPORT_NAME,
    RESPONSE_MESSAGES,
    FALSY_DATA,
    BOOLEAN_VALUES,
    NUMERIC_AND_CHAR_VALUES,
    MAX_FIELD_LENGTH_255,
    FLOAT_DATA,
    INTEGER_DATA,
    TEST_DATA_BY_TYPE,
    NAVBAR_LINKS,
    FORGOT_PASSWORD_FORM_TEXT,
    FORGOT_PASSWORD_MESSAGES,
    PASSWORD,
    DASHBOARD_TEXTS,
    DISCOUNTS,
    SLIDE_PRICE_BAR,
    PRODUCTS_MESSAGES,
    NGROK_LINK_TEXT,
};
