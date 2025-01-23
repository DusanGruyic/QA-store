import { test } from "playwright/modules/base";
import * as constants from "playwright/fixtures/constants";
import utils from "playwright/modules/api/api-utils";

let newPage, newContext, testUser;

test.describe("Reseting forgoten password", () => {
    test.beforeEach("Delete all messages", async ({ wpage, registerApi }) => {
        newPage = wpage;
        newContext = await newPage.context();

        testUser = utils.createFakeUser();
        await registerApi.register({
            payload: testUser,
        });
    });

    for (const data in constants.NUMERIC_AND_CHAR_VALUES) {
        test(`Shouldn't be  allowed to send recovery link with not supported email format - ${data}`, async ({
            resetPasswordPage,
        }) => {
            await resetPasswordPage.forgotPassword(
                constants.NUMERIC_AND_CHAR_VALUES[data],
                constants.MESSAGES.NOT_SUPPORTED_EMAIL_FORMAT
            );
        });
    }

    test("Shouldn't be allowed to reset password for non-existing users", async ({
        resetPasswordPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            utils.generateEmail(6),
            constants.MESSAGES.USER_DOESNT_EXIST
        );
    });

    test("Shouldn't be able to use the same reset link twice", async ({
        resetPasswordPage,
        mailHogPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            context: newContext,
        });
        await newPage.waitForLoadState();
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.INVALID_RESET_TOKEN,
            context: newContext,
        });
    });

    test("Shouldn't use another users reset link to reset password", async ({
        resetPasswordPage,
        mailHogPage,
        registerApi,
    }) => {
        let nonExistingUserEmail = utils.generateEmail(6);
        await registerApi.register({
            payload: {
                ...constants.REGISTER_PAYLOAD,
                username: utils.generateRandomString(8),
                email: nonExistingUserEmail,
            },
        });
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: nonExistingUserEmail,
            message: constants.MESSAGES.INVALID_RESET_TOKEN,
            context: newContext,
        });
    });

    test("Shouldn't login with old password after reseting it to new one", async ({
        resetPasswordPage,
        mailHogPage,
        loginPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            newPassword: constants.PASSWORD.VALID,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            context: newContext,
        });
        await loginPage.loginUser({
            badCredentials: true,
            errorToMatch: constants.RESPONSE_MESSAGES.LOGIN_BAD_CREDENTIALS,
            payload: {
                ...testUser,
                password: testUser.password,
            },
            statusCodeToMatch: constants.STATUS.UNAUTHORIZED,
        });
    });

    test("Shouldn't be able to reset password if the new one is white space", async ({
        resetPasswordPage,
        mailHogPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            newPassword: " ",
            message: constants.MESSAGES.PASSWORD_FIELD_REQUIRED,
            context: newContext,
        });
    });

    // tets skipped because, currently there aren't expired emails
    test("Shouldn't reset pasword if reset link is expired", async ({
        mailHogPage,
        resetPasswordPage,
    }) => {
        await mailHogPage.clickOnExpiredEmail();
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            message: constants.MESSAGES.INVALID_RESET_TOKEN,
            context: newContext,
        });
    });

    test("Shouldn't be able to reset password if the new one has seven characters", async ({
        resetPasswordPage,
        mailHogPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            newPassword: utils.generateRandomString(7),
            message: constants.MESSAGES.PASSWORD_LENGTH_ERROR,
            context: newContext,
        });
    });

    test("Shouldn't be able to reset password if password confirmation doesn't match", async ({
        resetPasswordPage,
        mailHogPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            newPassword: constants.PASSWORD.VALID,
            passwordMatching: false,
            message: constants.MESSAGES.CONFIRMATION_FIELD_DOESNT_MATCH,
            context: newContext,
        });
    });

    test("Should be allowed to reset password to last password used", async ({
        resetPasswordPage,
        mailHogPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            context: newContext,
        });

        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            password: constants.LOGIN_PAYLOAD.password,
            context: newContext,
        });
    });

    test("Should reset password by clicking on button", async ({
        resetPasswordPage,
        mailHogPage,
        loginPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset();
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            context: newContext,
        });

        await loginPage.loginUser({
            payload: {
                ...testUser,
                password: constants.PASSWORD.VALID,
            },
        });
    });

    test("Should reset password with recovery link", async ({
        resetPasswordPage,
        mailHogPage,
        loginPage,
    }) => {
        await resetPasswordPage.forgotPassword(
            testUser.email,
            constants.MESSAGES.SUCCESSFUL
        );
        await mailHogPage.findEmail(testUser.email);
        await mailHogPage.clickOnReset(true);
        await resetPasswordPage.enterNewPassword({
            email: testUser.email,
            message: constants.MESSAGES.NEW_PASSWORD_SET,
            context: newContext,
        });

        await loginPage.loginUser({
            payload: {
                email: testUser.email,
                password: constants.PASSWORD.VALID,
            },
        });
    });
});
