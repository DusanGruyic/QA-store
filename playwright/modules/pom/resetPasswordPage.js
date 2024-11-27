import * as constants from "playwright/fixtures/constants";
import { expect } from "../base";
import * as utils from "./e2e-utils";

export class ResetPasswordPage {
    newPage;

    constructor(page) {
        this.page = page;
        this.emailField = "#email";
        this.passwordField = "#password";
        this.passwordConfirmationField = "#password_confirmation";
        this.passwordRecoveryButton = "button .p-button-label";
        this.headerText = "h1";
        this.successMessage = ".text-sm";
    }

    async forgotPassword(email, message) {
        await utils.visitUrl(this.page, constants.URLS.FORGOTEN_PASSWORD);
        await utils.fillInputField(this.page.locator(this.emailField), email);
        await utils.clickOnElement(
            this.page.locator(this.passwordRecoveryButton)
        );
        await utils.verifyElementTextContent(
            this.page.locator(this.successMessage).last(),
            message
        );
    }

    async enterNewPassword({
        email,
        context,
        newPassword = constants.PASSWORD.VALID,
        message,
        passwordMatching = true,
    }) {
        (this.newPage = await context.waitForEvent("page"))
        expect(await this.newPage.url()).toContain(
            constants.URLS.RESET_PASSWORD,
            constants.LOGIN_PAYLOAD.email.replace("@", "%40")
        );

        await utils.verifyElementTextContent(
            this.newPage.locator(this.headerText),
            constants.FORM_TEXT.PASSWORD_RESET
        );
        await utils.fillInputField(
            this.newPage.locator(this.emailField),
            email
        );

        if (passwordMatching) {
            await utils.isEnabled(this.newPage.locator(this.passwordField));
            await utils.fillInputField(
                this.newPage.locator(this.passwordField),
                newPassword
            );
            await utils.isEnabled(
                this.newPage.locator(this.passwordConfirmationField)
            );
            await utils.fillInputField(
                this.newPage.locator(this.passwordConfirmationField),
                newPassword
            );
        } else {
            await utils.fillInputField(
                this.newPage.locator(this.passwordField),
                newPassword
            );
            await utils.fillInputField(
                this.newPage.locator(this.passwordConfirmationField),
                `${newPassword}@`
            );
        }
        await utils.clickOnElement(
            this.newPage.locator(this.passwordRecoveryButton)
        );
        await utils.verifyElementTextContent(
            this.newPage.locator(this.successMessage),
            message
        );
    }
}
