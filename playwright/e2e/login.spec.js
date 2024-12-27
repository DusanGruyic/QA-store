import { test, expect } from "../modules/base";
import {
    LOGIN_PAYLOAD,
    FALSY_DATA,
    RESPONSE_MESSAGES,
    STATUS,
} from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

test.describe("Positive test cases", () => {
    test("should log in user", async ({ loginPage }) => {
        await loginPage.loginUser({});
    });

    test("should log out user and assert that token is deleted from window local storage", async ({
        loginPage,
        landingPage,
    }) => {
        await loginPage.loginUser({});
        await landingPage.logoutUser();
        expect(await loginPage.getToken()).toBeFalsy();
    });

    test("should log in with email in upper case", async ({ loginPage }) => {
        await loginPage.loginUser({
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email.toUpperCase()}`,
            },
        });
    });

    test("should log in with leading space in email", async ({ loginPage }) => {
        await loginPage.loginUser({
            success: true,
            payload: {
                ...LOGIN_PAYLOAD,
                email: ` ${LOGIN_PAYLOAD.email}`,
            },
        });
    });

    test("should log in with trailing space in email", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            success: true,
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email} `,
            },
        });
    });
});

test.describe("Negative test cases", () => {
    test("should not login without email address provided", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[0],
            errorToMatch: utils.getRequiredFieldErrMsg(
                Object.keys(LOGIN_PAYLOAD)[0]
            ),
            statusCodeToMatch: STATUS.BAD_ENTITY,
            payload: {
                ...LOGIN_PAYLOAD,
                email: FALSY_DATA.EMPTY_STRING,
            },
        });
    });

    test("should not log in without password provided", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[1],
            errorToMatch: utils.getRequiredFieldErrMsg(
                Object.keys(LOGIN_PAYLOAD)[1]
            ),
            payload: {
                ...LOGIN_PAYLOAD,
                password: FALSY_DATA.EMPTY_STRING,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("should not log in when email is missing @ character", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            fieldInTest: Object.keys(LOGIN_PAYLOAD)[0],
            errorToMatch: RESPONSE_MESSAGES.LOGIN_INVALID_EMAIL,
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email.replace("@", "")}`,
            },
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("should not log in when email is missing domain", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email.replace(".com", "")}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
        });
    });

    test("should not log in when email is mail server", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...LOGIN_PAYLOAD,
                email: `${LOGIN_PAYLOAD.email.replace(".com", "")}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
        });
    });

    test("should not login with incorrect user password", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...LOGIN_PAYLOAD,
                password: `${LOGIN_PAYLOAD.password}123`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
        });
    });

    test("should not login with unregistered user email", async ({
        loginPage,
    }) => {
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...LOGIN_PAYLOAD,
                email: `123${LOGIN_PAYLOAD.email}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
        });
    });

    test("should not login with upper case password", async ({ loginPage }) => {
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...LOGIN_PAYLOAD,
                password: `${LOGIN_PAYLOAD.password.toUpperCase()}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
        });
    });
});
