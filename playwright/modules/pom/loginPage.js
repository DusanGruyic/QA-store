import { expect } from "@playwright/test";
import {
    LOGIN_PAYLOAD,
    API,
    METHODS,
    STATUS,
    URLS,
} from "playwright/fixtures/constants";
import * as utils from "../../modules/pom/e2e-utils";

export class LoginPage {
    constructor(page) {
        this.page = page;
        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.signInBtn = page.getByLabel("Sign In");
        this.invalidCredentialsMsg = page.locator("div p");
    }

    async getToken() {
        const token = await this.page.evaluate(() => {
            return this.window.localStorage.getItem("token");
        });

        return token;
    }

    async fillCredentials({ payload }) {
        await this.emailInput.fill(payload.email);

        await expect(await this.emailInput).toHaveValue(payload.email);

        await this.passwordInput.fill(payload.password);

        await expect(this.passwordInput).toHaveValue(payload.password);
    }

    async loginUser({
        payload = LOGIN_PAYLOAD,
        badCredentials = false,
        fieldInTest = null,
        errorToMatch = null,
        statusCodeToMatch = STATUS.OK,
    }) {
        await utils.visitUrl(this.page, "/login");
        await this.fillCredentials({ payload });
        // await this.signInBtn.click({ force: true });
        await this.verifyRequest(payload, statusCodeToMatch);

        await this.checkCredentials({
            badCredentials,
            fieldInTest,
            errorToMatch,
        });
    }

    async verifyRequest(payload, statusCodeToMatch) {
        const requestPromise = this.page.waitForRequest((request) => {
            return (
                request.url() ===
                    `${this.page.context()._options.baseURL}/${API.LOGIN}` &&
                request.method() === METHODS.POST.toUpperCase()
            );
        });

        await this.signInBtn.click();

        const request = await requestPromise;
        const response = await request.response();
        expect(await response.status()).toEqual(statusCodeToMatch);

        const requestJson = await request.postDataJSON();
        expect(requestJson.email).toEqual(payload.email);
        expect(requestJson.password).toEqual(payload.password);
    }

    async checkCredentials({
        badCredentials = false,
        errorToMatch = null,
        fieldInTest = null,
    }) {
        if (badCredentials) {
            return await this.verifyErrorMessage(errorToMatch, fieldInTest);
        } else {
            await expect(await this.page).toHaveURL("/dashboard");
            expect(await this.getToken()).toBeTruthy();
        }
    }

    async verifyErrorMessage(errorToMatch, fieldInTest) {
        if (!fieldInTest) {
            await expect(await this.invalidCredentialsMsg).toHaveText(
                errorToMatch
            );

            return;
        }

        const errorMsg = await this.page.locator(
            `input[id='${fieldInTest}'] ~ div > p`
        );

        await expect(await errorMsg).toHaveText(errorToMatch);
    }
}
