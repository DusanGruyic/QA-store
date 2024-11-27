import { test } from "../modules/base";
import { REGISTER_PAYLOAD, STATUS } from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

let counter = 1;

test.describe("Register user", () => {
    for (const field in REGISTER_PAYLOAD) {
        test(`${counter}. Should not register user without ${field} provided`, async ({
            registerPage,
        }) => {
            await registerPage.register({
                payload: { ...REGISTER_PAYLOAD, [field]: "" },
                negativeTestCase: true,
                errorToMatch: utils.getRequiredFieldErrMsg(field),
                fieldInTest: field,
                statusCodeToMatch: STATUS.BAD_ENTITY,
            });
        });
        counter++;
    }

    test.describe("Malformed email addresses", () => {
        const BAD_EMAILS = {
            NO_USERNAME: `@${String(REGISTER_PAYLOAD.email).split("@")[1]}`,
            NO_CHAR: String(REGISTER_PAYLOAD.email).replace("@", ""),
            NO_MAIL_SERVER: String(REGISTER_PAYLOAD.email).replace("gmail", ""),
            NO_DOMAIN: String(REGISTER_PAYLOAD.email).split(".")[0],
        };

        for (const email in BAD_EMAILS) {
            test(`${counter}. Should not register user with a malformed email address (${email})`, async ({
                registerPage,
            }) => {
                await registerPage.register({
                    payload: {
                        ...REGISTER_PAYLOAD,
                        [Object.keys(REGISTER_PAYLOAD)[1]]: BAD_EMAILS[email],
                    },
                    negativeTestCase: true,
                    fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
                    errorToMatch: utils.getInvalidFormatMessage(
                        Object.keys(REGISTER_PAYLOAD)[1]
                    ),
                    statusCodeToMatch: STATUS.BAD_ENTITY,
                });
            });
            counter++;
        }
    });

    test("Should not register user with 5 characters length password", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[2]]:
                    utils.generateRandomString(5),
            },
            negativeTestCase: true,
            errorToMatch: utils.getMinLengthMessage(
                Object.keys(REGISTER_PAYLOAD)[2],
                6
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[2],
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not register user with 6 whitespace characters as password", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[2]]: "      ",
            },
            negativeTestCase: true,
            errorToMatch: utils.getRequiredFieldErrMsg(
                Object.keys(REGISTER_PAYLOAD)[2]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[2],
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not register user with 256 characters length username", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[0]]:
                    utils.generateRandomString(256),
            },
            negativeTestCase: true,
            errorToMatch: utils.getMaxLengthMessage(
                Object.keys(REGISTER_PAYLOAD)[0]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[0],
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not register user with existing email", async ({
        registerPage,
    }) => {
        const newEmail = utils.generateEmail(8);

        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(REGISTER_PAYLOAD)[1]]: newEmail,
            },
        });

        await utils.clearLocalStorage(registerPage);

        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(REGISTER_PAYLOAD)[1]]: newEmail,
            },
            negativeTestCase: true,
            errorToMatch: utils.getAlreadyTakenMessage(
                Object.keys(REGISTER_PAYLOAD)[1]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[1],
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not register user with existing username", async ({
        registerPage,
    }) => {
        const newUsername = utils.generateRandomString(8);

        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[0]]: newUsername,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
            },
        });

        await utils.clearLocalStorage(registerPage);

        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[0]]: newUsername,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
            },
            negativeTestCase: true,
            errorToMatch: utils.getAlreadyTakenMessage(
                Object.keys(REGISTER_PAYLOAD)[0]
            ),
            fieldInTest: Object.keys(REGISTER_PAYLOAD)[0],
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should register user with valid data", async ({ registerPage }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
            },
        });
    });

    test("Should register user with whitespace character at the end of valid username", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: `${utils.generateRandomString(8)} `,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
            },
        });
    });

    test("Should register user with whitespace character at the beginning of valid username", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: ` ${utils.generateRandomString(8)}`,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
            },
        });
    });

    test("Should register user with whitespace character at the end of valid email", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: `${utils.generateEmail(8)} `,
            },
        });
    });

    test("Should register user with whitespace character at the beginning of valid email", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: ` ${utils.generateEmail(8)}`,
            },
        });
    });

    test("Should register user with whitespace character at the end of valid password", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[2]]: `${REGISTER_PAYLOAD.password} `,
            },
        });
    });

    test("Should register user with whitespace character at the beginning of valid password", async ({
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(
                    REGISTER_PAYLOAD
                )[0]]: utils.generateRandomString(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: utils.generateEmail(8),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[2]]: ` ${REGISTER_PAYLOAD.password}`,
            },
        });
    });
});
