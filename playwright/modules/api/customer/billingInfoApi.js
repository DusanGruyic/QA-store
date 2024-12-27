import { expect } from "@playwright/test";
import BaseAPI from "../baseApi";
import {
    STATUS,
    API,
    METHODS,
    BILLING_PAYLOAD,
    RESPONSE_MESSAGES,
} from "playwright/fixtures/constants";
import * as utils from "../api-utils";

export class BillingInfoApi extends BaseAPI {
    async getBillingInfo({
        methodOverride = null,
        customerId = 2,
        url = API.BILLING_INFO(customerId),
        token,
        statusCodeToMatch = STATUS.OK,
        errorToMatch = null,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, authToken: token });

            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                (METHODS.GET, METHODS.PUT),
            ]);
        }

        await this.get({ url, authToken: token });
        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        utils.writePayLoadAndRespToFile(
            this.reportPath,
            this.getResponseJSON()
        );

        responseStatusCode !== STATUS.OK
            ? this.verifyErrorMessage(errorToMatch)
            : this.verifyGetResponse(customerId);
    }

    async verifyErrorMessage(errorToMatch, fieldInTest = null) {
        if (fieldInTest) {
            return expect(this.getResponseJSON().errors[fieldInTest]).toContain(
                errorToMatch
            );
        }
        this.getResponseJSON().error
            ? expect(this.getResponseJSON().error).toContain(errorToMatch)
            : expect(this.getResponseJSON().message).toContain(errorToMatch);
    }

    async verifyGetResponse(customerId, status = RESPONSE_MESSAGES.SUCCESS) {
        expect(this.getResponseJSON().status).toEqual(status);
        expect(this.getResponseJSON().billing_info.customer_id).toEqual(
            customerId
        );
    }

    async updateBillingInfo({
        methodOverride = null,
        customerId = 2,
        url = API.BILLING_INFO(customerId),
        token,
        payload = BILLING_PAYLOAD,
        statusCodeToMatch = STATUS.OK,
        errorToMatch = null,
        fieldInTest = null,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, authToken: token });

            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                (METHODS.GET, METHODS.PUT),
            ]);
        }

        await this.put({ url, payload, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        utils.writePayLoadAndRespToFile(
            this.reportPath,
            this.getResponseJSON(),
            payload
        );

        responseStatusCode !== STATUS.OK
            ? this.verifyErrorMessage(errorToMatch, fieldInTest)
            : this.verifyUpdateResponse(payload);
    }
    async verifyUpdateResponse(
        payload,
        status = RESPONSE_MESSAGES.SUCCESS,
        message = RESPONSE_MESSAGES.BILLING_INFO_SUCCESSFUL_UPDATE
    ) {
        expect(this.getResponseJSON().status).toEqual(status);
        expect(this.getResponseJSON().message).toEqual(message);

        for (const field in this.getResponseJSON().billing_info) {
            expect(this.getResponseJSON().billing_info.field).toEqual(
                payload.field
            );
        }
    }
}
