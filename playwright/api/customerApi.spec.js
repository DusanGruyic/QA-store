import { test } from "../modules/base";
import * as utils from "../modules/api/api-utils";
import {
    STATUS,
    API,
    FALSY_DATA,
    BOOLEAN_VALUES,
    METHODS,
    RESPONSE_MESSAGES,
    CUSTOMER_PAYLOAD,
    MAX_FIELD_LENGTH_255,
} from "playwright/fixtures/constants";

let counter = 1;

test.describe("Customer tests", async () => {
    let token;
    test.beforeAll("Login before each", async ({ loginApi }) => {
        await loginApi.login({});
        token = await loginApi.getAuthToken();
    });

    test.describe("Positive cases", async () => {
        test("Should get all customers", async ({ customerApi }) => {
            await customerApi.getAllCustomers({ token: token });
        });

        test("Should get single customer", async ({ customerApi }) => {
            await customerApi.getSingleCustomer({
                token: token,
            });
        });

        test("Should update customer", async ({ customerApi }) => {
            await customerApi.updateCustomer({
                token: token,
            });
        });

        test("Should delete customer", async ({ customerApi }) => {
            await customerApi.deleteCustomer({
                token: token,
            });
        });
    });

    test.describe("Negative tests", async () => {
        test("Should not update customer without token", async ({
            customerApi,
        }) => {
            await customerApi.updateCustomer({
                statusCodeToMatch: STATUS.UNAUTHORIZED,
                errorToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
            });
        });

        test.describe("should not get all customers", async () => {
            const { GET, HEAD, ...UNSUPPORTED_GET_CUSTOMERS_METHODS } = METHODS;
            for (const method in UNSUPPORTED_GET_CUSTOMERS_METHODS) {
                test(`with unsupported method ${method.toLowerCase()}`, async ({
                    customerApi,
                }) => {
                    await customerApi.getAllCustomers({
                        token: token,
                        methodOverride:
                            UNSUPPORTED_GET_CUSTOMERS_METHODS[method],
                        errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
                        statusCodeToMatch: STATUS.BAD_METHOD,
                    });
                });
            }
        });

        const { PUT, GET, HEAD, DELETE, ...UNSUPPORTED_METHODS } = METHODS;
        for (const method in UNSUPPORTED_METHODS) {
            test(`${counter} Should not update customer with unsupported method ${method.toLowerCase()}`, async ({
                customerApi,
            }) => {
                await customerApi.updateCustomer({
                    token: token,
                    methodOverride: UNSUPPORTED_METHODS[method],
                    errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
                    
                    statusCodeToMatch: STATUS.BAD_METHOD,
                });
            });
            counter++;
        }

        const { date_of_birth, ...USER_FIRST_LAST_NAME_FIELDS } =
            CUSTOMER_PAYLOAD;
        for (const value in FALSY_DATA) {
            for (const field in USER_FIRST_LAST_NAME_FIELDS) {
                test(`${counter} Should not update ${utils.underscoreToSpace(
                    field
                )} as ${utils.underscoreToSpace(value.toLowerCase())}`, async ({
                    customerApi,
                }) => {
                    await customerApi.updateCustomer({
                        token: token,
                        payload: {
                            ...USER_FIRST_LAST_NAME_FIELDS,
                            [field]: FALSY_DATA[value],
                        },
                        errorToMatch: utils.getMustBeTypeMsg(field),
                        statusCodeToMatch: STATUS.BAD_ENTITY,
                        fieldInTest: field,
                    });
                });
                counter++;
            }
        }

        for (const value in FALSY_DATA) {
            test(`${counter} Should not update when date of birth is ${utils.underscoreToSpace(
                value.toLowerCase()
            )}`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    token: token,
                    payload: {
                        ...CUSTOMER_PAYLOAD,
                        date_of_birth: FALSY_DATA[value],
                    },
                    errorToMatch: utils.getInvalidFormatMessage(
                        Object.keys(CUSTOMER_PAYLOAD)[3]
                    ),
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
                });
            });
        }

        for (const field in USER_FIRST_LAST_NAME_FIELDS) {
            test(`${counter} Shouldn't update customer, when ${utils.underscoreToSpace(
                field
            )} is integer`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    token: token,
                    payload: {
                        ...CUSTOMER_PAYLOAD,
                        [field]: utils.getRandomInt(),
                    },

                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getMustBeTypeMsg(field),
                    fieldInTest: field,
                });
            });
            counter++;
        }

        for (const value in BOOLEAN_VALUES) {
            for (const field in USER_FIRST_LAST_NAME_FIELDS) {
                test(`${counter} Shouldn't update customer, when ${utils.underscoreToSpace(
                    field
                )} is ${value.toLowerCase()}`, async ({ customerApi }) => {
                    await customerApi.updateCustomer({
                        token: token,
                        payload: {
                            ...CUSTOMER_PAYLOAD,
                            [field]: BOOLEAN_VALUES[value],
                        },
                        statusCodeToMatch: STATUS.BAD_ENTITY,
                        errorToMatch: utils.getMustBeTypeMsg(field),
                        fieldInTest: field,
                    });
                });
            }
            counter++;
        }

        for (const value in BOOLEAN_VALUES) {
            test(`Shouldn't update customer, when date of birth is ${value.toLowerCase()}`, async ({
                customerApi,
            }) => {
                await customerApi.updateCustomer({
                    token: token,
                    payload: {
                        ...CUSTOMER_PAYLOAD,
                        date_of_birth: BOOLEAN_VALUES[value],
                    },

                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getInvalidFormatMessage(
                        Object.keys(CUSTOMER_PAYLOAD)[3]
                    ),
                    fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
                });
            });
        }

        test(`Shouldn't update customer, when date of birth is integer`, async ({
            customerApi,
        }) => {
            await customerApi.updateCustomer({
                token: token,
                payload: {
                    ...CUSTOMER_PAYLOAD,
                    date_of_birth: utils.getRandomInt(),
                },

                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getInvalidFormatMessage(
                    Object.keys(CUSTOMER_PAYLOAD)[3]
                ),
                fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
            });
        });

        for (const field in USER_FIRST_LAST_NAME_FIELDS) {
            test(`${counter} Shouldn't update customer, ${utils.underscoreToSpace(
                field
            )} inside object`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    payload: {
                        ...USER_FIRST_LAST_NAME_FIELDS,
                        [field]: {
                            [field]: USER_FIRST_LAST_NAME_FIELDS[field],
                        },
                    },
                    token: token,
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getMustBeTypeMsg(field),
                    fieldInTest: field,
                });
            });
            counter++;
        }

        test("Should not update customer when date of birth is in object", async ({
            customerApi,
        }) => {
            await customerApi.updateCustomer({
                token: token,
                payload: { date_of_birth: { date_of_birth: date_of_birth } },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getInvalidFormatMessage(
                    Object.keys(CUSTOMER_PAYLOAD)[3]
                ),
                fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
            });
        });

        for (const field in USER_FIRST_LAST_NAME_FIELDS) {
            test(`${counter} Shouldn't update customer, ${utils.underscoreToSpace(
                field
            )} has more than 255 characters`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    token: token,
                    payload: {
                        ...USER_FIRST_LAST_NAME_FIELDS,
                        [field]: utils.generateRandomString(256),
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getMaxLengthMessage(
                        utils.underscoreToSpace(field),
                        MAX_FIELD_LENGTH_255
                    ),
                });
            });
            counter++;
        }

        for (const field in USER_FIRST_LAST_NAME_FIELDS) {
            test(`${counter} Shouldn't update customer, when ${utils.underscoreToSpace(
                field
            )} is in array`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    token: token,
                    payload: { [field]: [USER_FIRST_LAST_NAME_FIELDS[field]] },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getMustBeTypeMsg(field),
                    fieldInTest: field,
                });
            });
            counter++;
        }

        test(`Shouldn't update customer, when date of birth is in array`, async ({
            customerApi,
        }) => {
            await customerApi.updateCustomer({
                token: token,
                payload: { date_of_birth: [CUSTOMER_PAYLOAD.date_of_birth] },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getInvalidFormatMessage(
                    Object.keys(CUSTOMER_PAYLOAD)[3]
                ),
                fieldInTest: utils.underscoreToSpace(
                    Object.keys(CUSTOMER_PAYLOAD)[3]
                ),
            });
        });

        test.describe("Should not update customer when date of birth", async () => {
            const INVALID_DATES = {
                MONTH_OVER_12: "2005-13-12",
                MONTH_ZERO: "2005-00-12",
                DAY_OVER_31: "2005-32-12",
                DAY_ZERO: "2005-10-00",
            };

            const INVALID_YEARS = {
                YEAR_FUTURE: "2026-10-10",
                YEAR_PAST: "1900-10-10",
            };

            for (const date in INVALID_DATES) {
                test(`${[
                    utils.underscoreToSpace(date.toLowerCase()),
                ]}`, async ({ customerApi }) => {
                    await customerApi.updateCustomer({
                        payload: {
                            ...CUSTOMER_PAYLOAD,
                            date_of_birth: INVALID_DATES[date],
                        },
                        token: token,
                        statusCodeToMatch: STATUS.BAD_ENTITY,
                        errorToMatch: utils.getInvalidFormatMessage(
                            Object.keys(CUSTOMER_PAYLOAD)[3]
                        ),
                        fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
                    });
                });
            }

            test(`${utils.underscoreToSpace(
                INVALID_YEARS.YEAR_PAST.toLowerCase()
            )}`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    payload: {
                        ...CUSTOMER_PAYLOAD,
                        date_of_birth: INVALID_YEARS.YEAR_PAST,
                    },
                    token: token,
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: RESPONSE_MESSAGES.GAVRILO_PRINCIP,
                    fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
                });
            });

            test(`${utils.underscoreToSpace(
                INVALID_YEARS.YEAR_FUTURE.toLowerCase()
            )}`, async ({ customerApi }) => {
                await customerApi.updateCustomer({
                    payload: {
                        ...CUSTOMER_PAYLOAD,
                        date_of_birth: INVALID_YEARS.YEAR_FUTURE,
                    },
                    token: token,
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: RESPONSE_MESSAGES.FUTURE_DATE_OF_BIRTH,
                    fieldInTest: Object.keys(CUSTOMER_PAYLOAD)[3],
                });
            });
        });
    });
});
