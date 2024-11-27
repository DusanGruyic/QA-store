import { test } from "../modules/base";
import {
    STATUS,
    METHODS,
    API,
    LOGIN_PAYLOAD,
    FALSY_DATA,
    BOOLEAN_VALUES,
    RESPONSE_MESSAGES,
} from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

let counter = 1;

test.describe("Login user", () => {
    test("Should not log in with wrong password of a registered user", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password:`${LOGIN_PAYLOAD.password}4`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHORIZED,
        });
    });

    test("Should not log in with email of a non-registered user", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                email: `a${LOGIN_PAYLOAD.email}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHORIZED,
        });
    });

    test("Should not log in with all characters of valid password uppercase", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password: LOGIN_PAYLOAD.password.toUpperCase(),
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHORIZED,
        });
    });

    test("Should not log in with whitespace character at the end of valid password", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password: `${LOGIN_PAYLOAD.password} `,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHORIZED,
        });
    });

    test("Should not log in with whitespace character at the beginning of valid password", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password: ` ${LOGIN_PAYLOAD.password}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            errorToMatch: RESPONSE_MESSAGES.UNAUTHORIZED,
        });
    });

    for (const value in FALSY_DATA) {
        for (const field in LOGIN_PAYLOAD) {
            test(`${counter}. Should not log in with ${utils.getNameOfValue(
                FALSY_DATA[value]
            )} as ${field}`, async ({ loginApi }) => {
                await loginApi.login({
                    payload: {
                        ...LOGIN_PAYLOAD,
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

    for (const value in BOOLEAN_VALUES) {
        for (const field in LOGIN_PAYLOAD) {
            test(`${counter}. Should not log in with ${BOOLEAN_VALUES[value]} as ${field}`, async ({
                loginApi,
            }) => {
                await loginApi.login({
                    payload: {
                        ...LOGIN_PAYLOAD,
                        [field]: BOOLEAN_VALUES[value],
                    },
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                    errorToMatch: utils.getMustBeTypeMsg(field),
                    fieldInTest: field,
                });
            });

            counter++;
        }
    }

    test("Should not log in with number as password", async ({ loginApi }) => {
        await loginApi.login({
            payload: { ...LOGIN_PAYLOAD, password: utils.getRandomInt() },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[1]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[1],
        });
    });

    test("Should not log in with valid password in array as password", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password: [LOGIN_PAYLOAD.password],
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[1]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[1],
        });
    });

    test("Should not log in with valid password in object as password", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                password: { password: LOGIN_PAYLOAD.password },
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[1]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[1],
        });
    });

    test("Should not log in with number as email", async ({ loginApi }) => {
        await loginApi.login({
            payload: { ...LOGIN_PAYLOAD, email: utils.getRandomInt() },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[0]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[0],
        });
    });

    test("Should not log in with valid email in array as email", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                email: [LOGIN_PAYLOAD.email],
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[0]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[0],
        });
    });

    test("Should not log in with valid email in object as email", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                email: {
                    email: LOGIN_PAYLOAD.email,
                },
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(Object.keys(LOGIN_PAYLOAD)[0]),
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[0],
        });
    });

    test("Should not log in with bad URL", async ({ loginApi }) => {
        const route = `${API.LOGIN}s`;

        await loginApi.login({
            url: route,
            statusCodeToMatch: STATUS.NOT_FOUND,
            errorToMatch: utils.getRouteNotFoundMsg(route),
        });
    });

    const { POST, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
    for (const method in UNSUPPORTED_METHODS) {
        test(`${counter}. Should not log in with unsupported method (${method})`, async ({
            loginApi,
        }) => {
            await loginApi.login({
                methodOverride: UNSUPPORTED_METHODS[method],
                statusCodeToMatch: STATUS.BAD_METHOD,
                errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED
            });
        });

        counter++;
    }

    test("Should log in with valid credentials", async ({ loginApi }) => {
        await loginApi.login({
            });
    });

    test("Should log in with whitespace character at the end of valid email", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: { ...LOGIN_PAYLOAD, email: `${LOGIN_PAYLOAD.email} ` },
            statusCodeToMatch: STATUS.OK,
        });
    });

    test("Should log in with whitespace character at the beginning of valid email", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: { ...LOGIN_PAYLOAD, email: ` ${LOGIN_PAYLOAD.email}` },
            statusCodeToMatch: STATUS.OK,
        });
    });

    test("Should log in with all characters of valid email uppercase", async ({
        loginApi,
    }) => {
        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                email: LOGIN_PAYLOAD.email.toUpperCase(),
            },
            statusCodeToMatch: STATUS.OK,
        });
    });

    test("Should log in with first characters of valid email uppercase", async ({
        loginApi,
    }) => {
        const emailAfterFirstChar = LOGIN_PAYLOAD.email.slice(1);

        await loginApi.login({
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email
                    .charAt(0)
                    .toUpperCase()}${emailAfterFirstChar}`,
            },
            statusCodeToMatch: STATUS.OK,
        });
    });
});
