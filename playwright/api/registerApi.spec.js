import { test } from "../modules/base";
import {
    API,
    STATUS,
    METHODS,
    REGISTER_PAYLOAD,
    FALSY_DATA,
    BOOLEAN_VALUES,
    RESPONSE_MESSAGES,
    MAX_FIELD_LENGTH_255,
} from "../fixtures/constants";
import utils from "playwright/modules/api/api-utils";

let counter = 1;

test.describe("Register user", () => {
    const { POST, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
    for (const method in UNSUPPORTED_METHODS) {
        test(`${counter} Should not register user with ${method} as method`, async ({
            registerApi,
        }) => {
            await registerApi.register({
                methodOverride: UNSUPPORTED_METHODS[method],
                statusCodeToMatch: STATUS.BAD_METHOD,
                errorToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
            });
        });
    }

    test("Should not register user with bad URL", async ({ registerApi }) => {
        const route = `${API.REGISTER}ss`;
        await registerApi.register({
            statusCodeToMatch: STATUS.NOT_FOUND,
            url: route,
            errorToMatch: utils.getRouteNotFoundMsg(route),
        });
    });

    for (const value in FALSY_DATA) {
        for (const field in REGISTER_PAYLOAD) {
            test(`${counter} Should not log in with ${utils.getNameOfValue(
                FALSY_DATA[value]
            )} as ${field}`, async ({ registerApi }) => {
                await registerApi.register({
                    payload: {
                        ...REGISTER_PAYLOAD,
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

    const { email, ...USERNAME_PASSWORD_FIELDS } = REGISTER_PAYLOAD;
    for (const value in BOOLEAN_VALUES) {
        for (const field in USERNAME_PASSWORD_FIELDS) {
            test(`${counter} Should not register when ${field} is ${value} as ${field}`, async ({
                registerApi,
            }) => {
                await registerApi.register({
                    payload: {
                        ...USERNAME_PASSWORD_FIELDS,
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

    for (const value in BOOLEAN_VALUES) {
        test(`Should not register user with ${value} value as email`, async ({
            registerApi,
        }) => {
            await registerApi.register({
                payload: {
                    ...REGISTER_PAYLOAD,
                    email: BOOLEAN_VALUES[value],
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getInvalidFormatMessage(
                    Object.keys(REGISTER_PAYLOAD)[1]
                ),
                fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
            });
        });
    }

    test("Should not register user without @ character", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: { ...REGISTER_PAYLOAD, email: email.replace("@", "") },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(REGISTER_PAYLOAD)[1]
            ),
        });
    });

    test("Should not register user without mail server in email", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: { ...REGISTER_PAYLOAD, email: email.replace("gmail", "") },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(REGISTER_PAYLOAD)[1]
            ),
        });
    });

    test("Should not register user when mail is missing domain", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: { ...REGISTER_PAYLOAD, email: email.replace(".com", "") },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(REGISTER_PAYLOAD)[1]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
        });
    });

    for (const field in USERNAME_PASSWORD_FIELDS) {
        test(`${counter} Should not register user when ${field} is in array`, async ({
            registerApi,
        }) => {
            await registerApi.register({
                payload: {
                    ...USERNAME_PASSWORD_FIELDS,
                    [field]: [USERNAME_PASSWORD_FIELDS[field]],
                },
                statusCodeToMatch: STATUS.BAD_ENTITY,
                errorToMatch: utils.getMustBeTypeMsg(field),
                fieldInTest: field,
            });
        });
        counter++;
    }

    test("Should not register user when valid email is in array", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: {
                ...REGISTER_PAYLOAD,
                email: [REGISTER_PAYLOAD.email],
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getInvalidFormatMessage(
                Object.keys(REGISTER_PAYLOAD)[1]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
        });
    });

    test("Should not register user when password length is less than 6", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: {
                ...REGISTER_PAYLOAD,
                password: utils.generateRandomString(5),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(REGISTER_PAYLOAD)[2],
                6
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[2],
        });
    });

    test("Should not register user when username is integer", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: { ...REGISTER_PAYLOAD, username: utils.getRandomInt() },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMustBeTypeMsg(
                Object.keys(REGISTER_PAYLOAD)[0]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[0],
        });
    });

    test("Should not register user when username length bigger than 255", async ({
        registerApi,
    }) => {
        await registerApi.register({
            payload: {
                ...REGISTER_PAYLOAD,
                username: utils.generateRandomString(256),
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(REGISTER_PAYLOAD)[0],
                MAX_FIELD_LENGTH_255
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[0],
        });
    });

    test("Should not be able to register with the same email address'", async ({
        registerApi,
    }) => {
        const newUsername = "NewUser";
        const newEmail = `${newUsername}@gmail.com`;

        await registerApi.register({
            payload: {
                ...REGISTER_PAYLOAD,
                username: newUsername,
                email: newEmail,
            },
        });

        await registerApi.register({
            payload: {
                ...REGISTER_PAYLOAD,
                username: newUsername,
                email: newEmail,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
            errorToMatch: RESPONSE_MESSAGES.EMAIL_TAKEN,
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
        });
    });

    test("Should succesfully register user with valid data", async ({
        registerApi,
    }) => {
        await registerApi.register({});
    });
});
