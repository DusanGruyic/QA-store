import { expect } from "@playwright/test";
import BaseAPI from "../baseApi";
import {
    API,
    STATUS,
    LOGIN_PAYLOAD,
    RESPONSE_MESSAGES,
    METHODS,
} from "playwright/fixtures/constants";
import { writeToFile } from "../api-utils";

export class LoginAPI extends BaseAPI {
    async login({
        methodOverride = null,
        url = API.LOGIN,
        payload = LOGIN_PAYLOAD,
        fieldInTest = null,
        statusCodeToMatch = STATUS.OK,
        errorToMatch = null,
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

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch, fieldInTest);
        }
        this.verifyAuthToken();

        return this.getResponseJSON();
    }

    async verifyErrorMessage(errorToMatch, fieldInTest) {
        if (errorToMatch === RESPONSE_MESSAGES.UNAUTHORIZED) {
            return expect(this.getResponseJSON().error).toContain(errorToMatch);
        } else if (errorToMatch.includes(RESPONSE_MESSAGES.NOT_FOUND)) {
            return expect(this.getResponseJSON().message).toContain(
                errorToMatch
            );
        }

        expect(this.getResponseJSON().errors[fieldInTest]).toContain(
            errorToMatch
        );
    }
}
