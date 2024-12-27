import path from "path";
import fs, { writeFileSync } from "fs";
import * as constants from "playwright/fixtures/constants";
import { expect } from "@playwright/test";
import { stringify } from "querystring";

export const getRandomInt = (min = null, max = 1000000000) => {
    min = min ?? Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (!min ? max : max - min + 1) + min);
};

export const getHeaders = (token) => {
    return {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
    };
};

export const writeToFile = (path, content) => {
    fs.writeFileSync(path, JSON.stringify(content));
};

export const writePayLoadAndRespToFile = (path, response, payload = "") => {
    writeToFile(
        path,
        JSON.stringify({
            payload: payload,
            resp: response,
        })
    );
};

export const getMethodNotSupportedMsg = (
    method,
    supportedMethods,
    route = "api/v1/products"
) => {
    return `The ${method.toUpperCase()} method is not supported for route ${route}. Supported methods: ${supportedMethods}.`;
};

export const getRouteNotFoundMsg = (route, id = "") => {
    return `The route ${route}${id} could not be found.`;
};

export const getCustomerNotFoundMsg = (id) => {
    return `No customer found with ID ${id} found`;
};
export const generateRandomString = (length) => {
    let chars = "abcdefghijklmnopqrstuvwxyz";
    let result = "";
    const charactersLength = chars.length;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

export const getMustBeTypeMsg = (field) => {
    if (constants.BOOL_FIELDS.includes(field)) {
        return `The ${underscoreToSpace(field)} field must be true or false.`;
    } else if (
        field === Object.keys(constants.SHIPPING_PAYLOAD)[6] ||
        field === Object.keys(constants.BILLING_PAYLOAD)[3] ||
        field === Object.keys(constants.CART_PAYLOAD)[6]
    ) {
        return `The ${underscoreToSpace(field)} field must be an integer.`;
    } else if (constants.NUM.includes(field)) {
        return `The ${underscoreToSpace(field)} field must be a number`;
    }

    return `The ${underscoreToSpace(field)} field must be a string.`;
};

export const getRangeOffsetMessage = (field, range) => {
    return `The ${underscoreToSpace(field)} field must not be lower than ${
        range[0]
    } and greater than ${range[1]} characters.`;
};

export const getRequiredFieldErrMsg = (string) => {
    if (string === "description") {
        return `The ${string} field must be a string.`;
    } else if (string === "in_stock") {
        return `The in stock field is required.`;
    } else return `The ${underscoreToSpace(string)} field is required.`;
};

export const getInvalidFormatMessage = (field) => {
    if (field === Object.keys(constants.BILLING_PAYLOAD)[4]) {
        return `The ${underscoreToSpace(
            field
        )} format is invalid. Should be MM/YY`;
    } else if (field === Object.keys(constants.CUSTOMER_PAYLOAD)[3]) {
        return `The ${underscoreToSpace(
            field
        )} field must match the format Y-m-d.`;
    }

    return `The ${underscoreToSpace(field)} field format is invalid.`;
};

export const getMaxLengthMessage = (field, maxLength = 255) => {
    if (field === Object.keys(constants.BILLING_PAYLOAD)[3]) {
        return `The ${underscoreToSpace(
            field
        )} field must be ${maxLength} digits.`;
    }

    return `The ${underscoreToSpace(
        field
    )} field must not be greater than ${maxLength} characters.`;
};

export const getMinLengthMessage = (field, minLength) => {
    if (field === Object.keys(constants.BILLING_PAYLOAD)[3]) {
        return `The ${underscoreToSpace(
            field
        )} field must be ${minLength} digits.`;
    }

    return `The ${underscoreToSpace(
        field
    )} field must be at least ${minLength} characters.`;
};

export const getAlreadyTakenMessage = (field) => {
    return `The ${underscoreToSpace(field)} has already been taken.`;
};

export const getAbsPath = (__filename, fileName) => {
    const __dirname = path.dirname(__filename);
    const destinationPath = ["custom-report", fileName];

    return path.join(__dirname, ...destinationPath);
};

export const getAbsolutePath = (__filename, value, level = 2) => {
    const __dirname = path.dirname(__filename);
    const destinationPath = ["custom-report", value];
    if (level === 2) {
        return path.join(__dirname, "..", "..", ...destinationPath);
    } else if (level === 3) {
        return path.join(__dirname, "..", "..", "..", ...destinationPath);
    } else
        throw new Error(
            "This path is not set, implement aditional case into switch"
        );
};

export const splitStringByUppercase = (string, join) => {
    return string
        .split(/(?=[A-Z])/)
        .join(join)
        .toLowerCase();
};

export const splitStringByDelimiter = (string, delimiter, join) => {
    return string.split(delimiter).join(join).toLowerCase();
};

export const snakeToCamelCase = (string) => {
    return string.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

export const getNameOfValue = (value) => {
    if (typeof value === "string" && !value.trim().length) {
        return "empty string";
    }
    if (value === null) {
        return "null";
    }
    if (!Object.keys(value).length && value.constructor === Object) {
        return "empty object";
    }
    if (value instanceof Array && !value.length) {
        return "empty array";
    }
};

export const underscoreToSpace = (value) => {
    return value.replace(/_/g, " ");
};

export const noTrailingSpacesObject = (obj) => {
    const trimmedObject = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === "string") {
                trimmedObject[key] = obj[key].trim();
            } else {
                trimmedObject[key] = obj[key];
            }
        }
    }

    return trimmedObject;
};

export const isString = (value) => {
    return typeof value === "string" || value instanceof String;
};

export const clearLocalStorage = async (pom) => {
    await pom.page.evaluate(() => window.localStorage.clear());
};

export const navigateTo = async (pom, option) => {
    await pom.page.goto("");
    await expect(pom.page).toHaveURL("");

    switch (option) {
        case constants.NAVBAR_LINKS.REGISTER:
            await pom.registerNavLink.click();
            await expect(pom.page).toHaveURL("/register");
            break;
        case constants.NAVBAR_LINKS.LOGIN:
            await pom.loginNavLink.click();
            await expect(pom.page).toHaveURL("/login");
            break;
        case constants.NAVBAR_LINKS.DASHBOARD:
            await pom.dashboardNavLink.click();
            await expect(pom.page).toHaveURL("/dashboard");
            break;
        case constants.NAVBAR_LINKS.LOGOUT:
            await pom.logoutNavLink.click();
            await expect(pom.page).toHaveURL("");
            break;
    }
};

export const generateEmail = (usernameLength) => {
    return `${generateRandomString(usernameLength)}@test.com`;
};

export const createFakeUser = () => {
    return {
        username: generateRandomString(8),
        email: generateEmail(6),
        password: generateRandomString(8),
    };
};

export const verifyRequest = async (
    pom,
    sendRequest,
    endpoint,
    method,
    statusCodeToMatch
) => {
    await sendRequest();
    const request = await pom.page.waitForResponse((request) => {
        return (
            request.url() === `${endpoint}` &&
            request.method() === method.toUpperCase()
        );
    });
    const response = await request.response();

    expect(await response.status()).toEqual(statusCodeToMatch);
};

export const verifyReq = async (page, url, method, sendRequest) => {
    const [response] = await Promise.all([
        page.waitForRequest(
            (response) =>
                response.url().includes(url) &&
                response.request().method() === method
        ),
        await sendRequest(),
    ]);

    expect(response).toBeOK();
};

export default {
    getRandomInt,
    getHeaders,
    writeToFile,
    writePayLoadAndRespToFile,
    getMethodNotSupportedMsg,
    getRouteNotFoundMsg,
    generateRandomString,
    getMustBeTypeMsg,
    getRangeOffsetMessage,
    getRequiredFieldErrMsg,
    getInvalidFormatMessage,
    getMaxLengthMessage,
    getMinLengthMessage,
    getAlreadyTakenMessage,
    splitStringByUppercase,
    getAbsPath,
    getAbsolutePath,
    underscoreToSpace,
    splitStringByDelimiter,
    snakeToCamelCase,
    getNameOfValue,
    noTrailingSpacesObject,
    isString,
    clearLocalStorage,
    navigateTo,
    generateEmail,
    createFakeUser,
    verifyRequest,
    verifyReq,
};
