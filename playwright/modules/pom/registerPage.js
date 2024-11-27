import { expect } from "@playwright/test";
import {
    REGISTER_PAYLOAD,
    API,
    METHODS,
    STATUS,
} from "playwright/fixtures/constants";
import * as utils from "../../modules/pom/e2e-utils";

export class RegisterPage {
    constructor(page) {
        this.page = page;
        this.registrationForm = page.locator("form");
        this.registerBtn = page.getByLabel("Register");
        this.dashboardPageSuccessMsg = page
            .locator('div:has-text("You\'re logged in!")')
            .last();
    }

    async getElementById(id) {
        return await this.page.locator(`input[id="${id}"]`);
    }

    async register({
        payload = REGISTER_PAYLOAD,
        negativeTestCase = false,
        errorToMatch = null,
        fieldInTest = null,
        statusCodeToMatch = STATUS.OK,
    }) {
        await utils.visitUrl(this.page,"/register");

        await this.fillRegisterForm(payload);
        await this.verifyRequest(payload, statusCodeToMatch, negativeTestCase);

        negativeTestCase ? await this.verifyErrorMessage(errorToMatch, fieldInTest) : await this.verifyRegistration();
    }

    async fillRegisterForm(payload) {
        const usernameInput = await this.getElementById(
            Object.keys(REGISTER_PAYLOAD)[0]
        );
        const emailInput = await this.getElementById(
            Object.keys(REGISTER_PAYLOAD)[1]
        );
        const passwordInput = await this.getElementById(
            Object.keys(REGISTER_PAYLOAD)[2]
        );

        await usernameInput.fill(payload.username);
        await expect(usernameInput).toHaveValue(payload.username);

        await emailInput.fill(payload.email);
        await expect(emailInput).toHaveValue(payload.email);

        await passwordInput.fill(payload.password);
        await expect(passwordInput).toHaveValue(payload.password);
    }

    async verifyRequest(payload, statusCodeToMatch, negativeTestCase) {
        const requestPromise = this.page.waitForRequest((request) => {
            return (
                request.url() ===
                    `${this.page.context()._options.baseURL}/${API.REGISTER}` &&
                request.method() === METHODS.POST.toUpperCase()
            );
        });

        await this.registerBtn.click();

        const request = await requestPromise;
        const requestJson = await request.postDataJSON();
        expect(requestJson.username).toEqual(payload.username);
        expect(requestJson.email).toEqual(payload.email);
        expect(requestJson.password).toEqual(payload.password);

        const response = await request.response();
        expect(await response.status()).toEqual(statusCodeToMatch);

        if (negativeTestCase) return;

        const responseJson = await response.json();
        expect(responseJson.user.id).toBeGreaterThanOrEqual(0);
        expect(responseJson.user.username).toEqual(payload.username.trim());
        expect(responseJson.user.email).toEqual(payload.email.trim());
        expect(responseJson.user.password.length).toBeGreaterThan(0);
        expect(responseJson.auth.token.length).toBeGreaterThan(0);
    }

    async verifyRegistration() {
        await this.page.waitForRequest("/dashboard");
        await expect(this.page).toHaveURL("/dashboard");
        // await expect(this.dashboardPageSuccessMsg).toBeVisible();
    }

    async verifyErrorMessage(errorToMatch, fieldInTest) {
        const errorMsg = await this.page.locator(
            `input[id='${fieldInTest}'] ~ div > p`
        );
        await expect(errorMsg).toHaveText(errorToMatch);
    }
}
