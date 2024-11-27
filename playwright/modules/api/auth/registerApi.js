import { expect, request } from "@playwright/test";
import BaseAPI from "../baseApi.js";
import {
    API,
    STATUS,
    METHODS,
    REGISTER_PAYLOAD,
    RESPONSE_MESSAGES,
} from "playwright/fixtures/constants";
import { writeToFile } from "../api-utils.js";

export class RegisterAPI extends BaseAPI {
    async register({
        methodOverride = null,
        url = API.REGISTER,
        payload = REGISTER_PAYLOAD,
        statusCodeToMatch = STATUS.OK,
        fieldInTest,
        errorToMatch = RESPONSE_MESSAGES.SUCCESS_CREATE_USER,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, payload });

            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                METHODS.POST,
            ]);
        }

        await this.post({ url, payload });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        writeToFile(this.reportPath, JSON.stringify(this.getResponseJSON()));

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch, fieldInTest);
        }

        await this.verifySuccessfulRegistration(payload);
    }

    async verifyErrorMessage(errorToMatch, fieldInTest = null) {
        if (fieldInTest) {
            return expect(this.getResponseJSON().errors[fieldInTest]).toContain(
                errorToMatch
            );
        } else {
            return expect(this.getResponseJSON().message).toContain(
                errorToMatch
            );
        }
    }

    async verifySuccessfulRegistration(
        payload,
        status = RESPONSE_MESSAGES.SUCCESS,
        message = RESPONSE_MESSAGES.SUCCESS_CREATE_USER
    ) {
        expect(this.getResponseJSON().status).toEqual(status);
        expect(this.getResponseJSON().message).toEqual(message);
        expect(this.getResponseJSON().user.username).toEqual(payload.username);
        expect(this.getResponseJSON().user.email).toEqual(payload.email);
    }
}
