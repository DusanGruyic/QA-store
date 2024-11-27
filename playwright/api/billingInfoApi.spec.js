import { test } from "../modules/base";
import {
    STATUS,
    API,
    METHODS,
    BILLING_PAYLOAD,
    RESPONSE_MESSAGES,
    FALSY_DATA,
    BOOLEAN_VALUES,
} from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

let token;
let counter = 1;

test.describe("Billing info tests", () => {
    test.beforeAll("Login", async ({ loginApi }) => {
        await loginApi.login({});
        token = await loginApi.getAuthToken();
    });

    const { GET, PUT, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
    for (const method in UNSUPPORTED_METHODS) {
        test(`Should not pass billing info API with unsupported method (${method})`, async ({
            billingInfo,
        }) => {
            await billingInfo.getBillingInfo({
                methodOverride: UNSUPPORTED_METHODS[method],
                token: token,
                statusCodeToMatch: STATUS.BAD_METHOD,
                errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED
            });
        });
    }

    test("Should not get billing info without token", async ({
        billingInfo,
    }) => {
        await billingInfo.getBillingInfo({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not get billing info with id of non-existing customer in URL", async ({
        billingInfo,
    }) => {
        await billingInfo.getBillingInfo({
            token: token,
            customerId: 1000,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getCustomerNotFoundMsg(1000),
        });
    });

    test("Should not get billing info with bad URL (existing customer id in URL, typo error)", async ({
        billingInfo,
    }) => {
        await billingInfo.getBillingInfo({
            token: token,
            url: `${API.BILLING_INFO(2)}s`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(`${API.BILLING_INFO(2)}s`),
        });
    });

    test("Should not update billing info without token", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not update billing info with id of non-existing customer in URL", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            customerId: 1000,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(API.BILLING_INFO(1000)),
        });
    });

    test("Should not update billing info with bad URL (existing customer id in URL, typo error)", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            url: `${API.BILLING_INFO(2)}s`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(`${API.BILLING_INFO(2)}s`),
        });
    });

    for (const value in FALSY_DATA) {
        for (const field in BILLING_PAYLOAD) {
            test(`${counter}. Should not update billing info with ${utils.getNameOfValue(
                FALSY_DATA[value]
            )} as ${field}`, async ({ billingInfo }) => {
                await billingInfo.updateBillingInfo({
                    token: token,
                    payload: {
                        ...BILLING_PAYLOAD,
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

    const { cvv, ...STRING_FIELDS } = BILLING_PAYLOAD;
    for (const field in STRING_FIELDS) {
        test(`${counter}. Should not update billing info with integer as ${field}`, async ({
            billingInfo,
        }) => {
            await billingInfo.updateBillingInfo({
                token: token,
                payload: {
                    ...BILLING_PAYLOAD,
                    [field]: utils.getRandomInt(),
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch:
                    field !== Object.keys(STRING_FIELDS)[2]
                        ? utils.getMustBeTypeMsg(field)
                        : utils.getMinLengthMessage(field, 12),
                fieldInTest: field,
            });
        });
        counter++;
    }

    for (const value in BOOLEAN_VALUES) {
        for (const field in STRING_FIELDS) {
            test(`${counter}. Should not update billing info with boolean (${value}) as ${field}`, async ({
                billingInfo,
            }) => {
                await billingInfo.updateBillingInfo({
                    token: token,
                    payload: {
                        ...BILLING_PAYLOAD,
                        [field]: BOOLEAN_VALUES[value],
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch:
                        field !== Object.keys(BILLING_PAYLOAD)[2]
                            ? utils.getMustBeTypeMsg(field)
                            : utils.getMinLengthMessage(field, 12),
                    fieldInTest: field,
                });
            });
            counter++;
        }
    }

    for (const value in BOOLEAN_VALUES) {
        test(`${counter}. Should not update billing info with boolean (${value}) as cvv`, async ({
            billingInfo,
        }) => {
            await billingInfo.updateBillingInfo({
                token: token,
                payload: {
                    ...BILLING_PAYLOAD,
                    [Object.keys(BILLING_PAYLOAD)[3]]: BOOLEAN_VALUES[value],
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMinLengthMessage(
                    Object.keys(BILLING_PAYLOAD)[3],
                    3
                ),
                fieldInTest: Object.keys(BILLING_PAYLOAD)[3],
            });
        });
        counter++;
    }

    for (const field in BILLING_PAYLOAD) {
        test(`${counter}. Should not update billing info with valid data in array as ${field}`, async ({
            billingInfo,
        }) => {
            await billingInfo.updateBillingInfo({
                token: token,
                payload: {
                    ...BILLING_PAYLOAD,
                    [field]: [BILLING_PAYLOAD[field]],
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch:
                    field !== Object.keys(BILLING_PAYLOAD)[2]
                        ? utils.getMustBeTypeMsg(field)
                        : utils.getMinLengthMessage(field, 12),

                fieldInTest: field,
            });
        });
        counter++;
    }

    for (const field in BILLING_PAYLOAD) {
        test(`${counter}. Should not update billing info with valid data in object as ${field}`, async ({
            billingInfo,
        }) => {
            await billingInfo.updateBillingInfo({
                token: token,
                payload: {
                    ...BILLING_PAYLOAD,
                    [field]: { [field]: [BILLING_PAYLOAD[field]] },
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch:
                    field !== Object.keys(BILLING_PAYLOAD)[2]
                        ? utils.getMustBeTypeMsg(field)
                        : utils.getMinLengthMessage(field, 12),

                fieldInTest: field,
            });
        });
        counter++;
    }

    test.describe("Bad expiration date formats", () => {
        const BAD_EXPIRATION_DATE_FORMATS = [
            "13/25",
            "00/25",
            "0/25",
            "aa/25",
            "1a/25",
            "10/aa",
            "10/2a",
            "!./25",
            "110/25",
            "07/250",
            "02/!.",
            "00/00",
            "0/0",
        ];

        for (const date of BAD_EXPIRATION_DATE_FORMATS) {
            test(`${counter}. Should not update billing info with bad expiration date format (${date})`, async ({
                billingInfo,
            }) => {
                await billingInfo.updateBillingInfo({
                    token: token,
                    payload: {
                        ...BILLING_PAYLOAD,
                        [Object.keys(BILLING_PAYLOAD)[4]]: date,
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getInvalidFormatMessage(
                        Object.keys(BILLING_PAYLOAD)[4]
                    ),
                    fieldInTest: Object.keys(BILLING_PAYLOAD)[4],
                });
            });
            counter++;
        }
    });

    test("Should not update billing info with 256 characters length cardholder", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[0]]:
                    utils.generateRandomString(256),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(BILLING_PAYLOAD)[0]
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[0],
        });
    });

    test("Should not update billing info with 21 characters length card type", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[1]]:
                    utils.generateRandomString(21),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(BILLING_PAYLOAD)[1],
                20
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[1],
        });
    });

    test("Should not update billing info with 21 characters length card number", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[2]]:
                    utils.generateRandomString(21),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(BILLING_PAYLOAD)[2],
                20
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[2],
        });
    });

    test("Should not update billing info with 2 characters length card type", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[1]]:
                    utils.generateRandomString(2),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(BILLING_PAYLOAD)[1],
                3
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[1],
        });
    });

    test("Should not update billing info with 11 characters length card number", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[2]]:
                    utils.generateRandomString(11),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(BILLING_PAYLOAD)[2],
                12
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[2],
        });
    });

    test("Should not update billing info with number 110 as cvv", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[3]]: 110,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(BILLING_PAYLOAD)[3],
                3
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[3],
        });
    });

    test("Should not update billing info with number 1000 as cvv", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({
            token: token,
            payload: {
                ...BILLING_PAYLOAD,
                [Object.keys(BILLING_PAYLOAD)[3]]: 110,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(BILLING_PAYLOAD)[3],
                3
            ),
            fieldInTest: Object.keys(BILLING_PAYLOAD)[3],
        });
    });

    test("Should get billing info with id of existing customer", async ({
        billingInfo,
    }) => {
        await billingInfo.getBillingInfo({ token: token });
    });

    test("Should update billing info with valid data", async ({
        billingInfo,
    }) => {
        await billingInfo.updateBillingInfo({ token: token });
    });
});
