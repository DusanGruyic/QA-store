import { test } from "../modules/base";
import {
    STATUS,
    API,
    METHODS,
    SHIPPING_PAYLOAD,
    RESPONSE_MESSAGES,
    FALSY_DATA,
    BOOLEAN_VALUES,
    NUMERIC_AND_CHAR_VALUES,
} from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

let token;
let counter = 1;

test.describe("Shipping info tests", () => {
    test.beforeAll("Login", async ({ loginApi }) => {
        await loginApi.login({});
        token = await loginApi.getAuthToken();
    });

    const { GET, PUT, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
    for (const method in UNSUPPORTED_METHODS) {
        test(`Should not pass shipping info API with unsupported method (${method})`, async ({
            shippingInfoApi,
        }) => {
            await shippingInfoApi.getShippingInfo({
                methodOverride: UNSUPPORTED_METHODS[method],
                token: token,
                statusCodeToMatch: STATUS.BAD_METHOD,
                errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED
            });
        });
    }

    test("Should not get shipping info without token", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.getShippingInfo({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not get shipping info with id of non-existing customer in URL", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.getShippingInfo({
            token: token,
            customerId: 1000,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getCustomerNotFoundMsg(1000),
        });
    });

    test("Should not get shipping info with bad URL (existing customer id in URL, typo error)", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.getShippingInfo({
            token: token,
            url: `${API.SHIPPING_INFO(2)}s`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(`${API.SHIPPING_INFO(2)}s`),
        });
    });

    test("Should not update shipping info without token", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not update shipping info with id of non-existing customer in URL", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            customerId: 1000,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getCustomerNotFoundMsg(1000),
        });
    });

    test("Should not update shipping info with bad URL (existing customer id in URL, typo error)", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            url: `${API.SHIPPING_INFO(2)}s`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(`${API.SHIPPING_INFO(2)}s`),
        });
    });

    for (const value in FALSY_DATA) {
        for (const field in SHIPPING_PAYLOAD) {
            test(`${counter}. Should not update shipping info with ${utils.getNameOfValue(
                FALSY_DATA[value]
            )} as ${field}`, async ({ shippingInfoApi }) => {
                await shippingInfoApi.updateShippingInfo({
                    token: token,
                    payload: {
                        ...SHIPPING_PAYLOAD,
                        [field]: FALSY_DATA[value],
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getRequiredFieldErrMsg(field),
                    fieldInTest: field,
                });
            });
            counter++;
        }
    }

    const { postal_code, ...STRING_FIELDS } = SHIPPING_PAYLOAD;
    for (const field in STRING_FIELDS) {
        test(`Should not update shipping info with integer as ${field}`, async ({
            shippingInfoApi,
        }) => {
            await shippingInfoApi.updateShippingInfo({
                token: token,
                payload: {
                    ...SHIPPING_PAYLOAD,
                    [field]: utils.getRandomInt(),
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMustBeTypeMsg(field),
                fieldInTest: field,
            });
        });
    }

    for (const value in BOOLEAN_VALUES) {
        for (const field in SHIPPING_PAYLOAD) {
            test(`${counter}. Should not update shipping info with boolean (${value}) as ${field}`, async ({
                shippingInfoApi,
            }) => {
                await shippingInfoApi.updateShippingInfo({
                    token: token,
                    payload: {
                        ...SHIPPING_PAYLOAD,
                        [field]: BOOLEAN_VALUES[value],
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch:
                        field !== Object.keys(SHIPPING_PAYLOAD)[6]
                            ? utils.getMustBeTypeMsg(field)
                            : utils.getRangeOffsetMessage(field, [4, 10]),
                    fieldInTest: field,
                });
            });
            counter++;
        }
    }

    for (const field in SHIPPING_PAYLOAD) {
        test(`${counter}. Should not update shipping info with valid data in array as ${field}`, async ({
            shippingInfoApi,
        }) => {
            await shippingInfoApi.updateShippingInfo({
                token: token,
                payload: {
                    ...SHIPPING_PAYLOAD,
                    [field]: [SHIPPING_PAYLOAD[field]],
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMustBeTypeMsg(field),
                fieldInTest: field,
            });
        });
        counter++;
    }

    for (const field in SHIPPING_PAYLOAD) {
        test(`${counter}. Should not update shipping info with valid data in object as ${field}`, async ({
            shippingInfoApi,
        }) => {
            await shippingInfoApi.updateShippingInfo({
                token: token,
                payload: {
                    ...SHIPPING_PAYLOAD,
                    [field]: { [field]: [SHIPPING_PAYLOAD[field]] },
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMustBeTypeMsg(field),
                fieldInTest: field,
            });
        });
        counter++;
    }

    test.describe("Unacceptable strings for string fields", () => {
        const {
            email,
            phone_number,
            postal_code,
            street_and_number,
            ...NON_NUMERIC_FIELDS
        } = SHIPPING_PAYLOAD;

        for (const field in NON_NUMERIC_FIELDS) {
            for (const value in NUMERIC_AND_CHAR_VALUES) {
                test(`${counter}. Should not update shipping info with ${value} string as ${field}`, async ({
                    shippingInfoApi,
                }) => {
                    await shippingInfoApi.updateShippingInfo({
                        token: token,
                        payload: {
                            ...SHIPPING_PAYLOAD,
                            [field]: NUMERIC_AND_CHAR_VALUES[value],
                        },
                        statusCodeToMatch: STATUS.BAD_ENTITY,
                        errorToMatch: utils.getInvalidFormatMessage(field),
                        fieldInTest: field,
                    });
                });
                counter++;
            }
        }
    });

    test.describe("Bad email formats", () => {
        const BAD_EMAILS = {
            NO_USERNAME: `@${SHIPPING_PAYLOAD.email.split("@")[1]}`,
            NO_CHAR: SHIPPING_PAYLOAD.email.replace("@", ""),
            NO_MAIL_SERVER: SHIPPING_PAYLOAD.email.replace("gmail", ""),
            NO_DOMAIN: SHIPPING_PAYLOAD.email.split(".")[0],
        };

        for (const email in BAD_EMAILS) {
            test(`${counter}. Should not update shipping info with email without all parts (${email})`, async ({
                shippingInfoApi,
            }) => {
                await shippingInfoApi.updateShippingInfo({
                    token: token,
                    payload: {
                        ...SHIPPING_PAYLOAD,
                        [Object.keys(SHIPPING_PAYLOAD)[2]]: BAD_EMAILS[email],
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getInvalidFormatMessage(
                        Object.keys(SHIPPING_PAYLOAD)[2]
                    ),
                    fieldInTest: Object.keys(SHIPPING_PAYLOAD)[2],
                });
            });
            counter++;
        }
    });

    test("Should not update shipping info with string that contains letters as phone number", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[3]]: `${
                    SHIPPING_PAYLOAD[Object.keys(SHIPPING_PAYLOAD)[3]]
                }A`,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(SHIPPING_PAYLOAD)[3]
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[3],
        });
    });

    test("Should not update shipping info with string that contains characters except +, -, () and whitespace as phone number", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[3]]: `${
                    SHIPPING_PAYLOAD[Object.keys(SHIPPING_PAYLOAD)[3]]
                }.@!?`,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(SHIPPING_PAYLOAD)[3]
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[3],
        });
    });

    test("Should not update shipping info with characters-only string as street and number", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[7]]:
                    NUMERIC_AND_CHAR_VALUES.CHAR,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(SHIPPING_PAYLOAD)[7]
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[7],
        });
    });

    for (const field in STRING_FIELDS) {
        test(`Should not update shipping info with 256 characters length string as ${field}`, async ({
            shippingInfoApi,
        }) => {
            await shippingInfoApi.updateShippingInfo({
                token: token,
                payload: {
                    ...SHIPPING_PAYLOAD,
                    [field]: utils.generateRandomString(256),
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMaxLengthMessage(field),
                fieldInTest: field,
            });
        });
    }

    test("Should not update shipping info with 11 digits as postal code", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[6]]: utils.getRandomInt(
                    10000000000,
                    99999999999
                ),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getRangeOffsetMessage(
                Object.keys(SHIPPING_PAYLOAD)[6],
                [4, 10]
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[6],
        });
    });

    test("Should not update shipping info with 5 numbers length string as phone number", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[3]]:
                    NUMERIC_AND_CHAR_VALUES.NUMERIC,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(SHIPPING_PAYLOAD)[3],
                6
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[3],
        });
    });

    test("Should not update shipping info with 3 digits as postal code", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[6]]: utils.getRandomInt(
                    100,
                    999
                ),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getRangeOffsetMessage(
                Object.keys(SHIPPING_PAYLOAD)[6],
                [4, 10]
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[6],
        });
    });

    test("Should not update shipping info with 2 characters length string as street and number", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({
            token: token,
            payload: {
                ...SHIPPING_PAYLOAD,
                [Object.keys(SHIPPING_PAYLOAD)[7]]: "A1",
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(SHIPPING_PAYLOAD)[7],
                3
            ),
            fieldInTest: Object.keys(SHIPPING_PAYLOAD)[7],
        });
    });

    test("Should get shipping info with id of existing customer", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.getShippingInfo({ token: token });
    });

    test("Should update shipping info with valid data", async ({
        shippingInfoApi,
    }) => {
        await shippingInfoApi.updateShippingInfo({ token: token });
    });
});
