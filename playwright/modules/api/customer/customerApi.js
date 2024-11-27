import { expect } from "@playwright/test";
import {
    API,
    STATUS,
    CUSTOMER_PAYLOAD,
    RESPONSE_MESSAGES,
    METHODS,
} from "playwright/fixtures/constants";
import BaseAPI from "../baseApi";
import { writeToFile } from "../api-utils";

export class CustomerApi extends BaseAPI {
    async getAllCustomers({
        methodOverride = null,
        url = API.CUSTOMERS,
        statusCodeToMatch = STATUS.OK,
        errorToMatch,
        token,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, authToken: token });
            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                METHODS.GET,
                METHODS.HEAD,
                METHODS.PUT,
                METHODS.DELETE,
            ]);
        }

        await this.get({ url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        writeToFile(this.reportPath, JSON.stringify(this.getResponseJSON()));

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch);
        }

        await this.verifyResponse();
    }

    async verifyErrorMessage(errorToMatch, fieldInTest = null) {
        if (fieldInTest) {
            return expect(this.getResponseJSON().errors[fieldInTest]).toContain(
                errorToMatch
            );
        }

        return expect(this.getResponseJSON().message).toContain(errorToMatch);
    }

    async verifyResponse(
        customerID = null,
        status = RESPONSE_MESSAGES.SUCCESS
    ) {
        expect(this.getResponseJSON().status).toEqual(status);

        if (customerID) {
            expect(this.getResponseJSON().customer.id).toEqual(customerID);
        } else {
            expect(this.getResponseJSON().customers.length).toBeGreaterThan(0);
        }
    }

    async getSingleCustomer({
        customerID = 2,
        url = API.CUSTOMER(customerID),
        methodOverride = null,
        statusCodeToMatch = STATUS.OK,
        token,
        errorToMatch = null,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, authToken: token });

            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                METHODS.GET,
                METHODS.HEAD,
                METHODS.PUT,
                METHODS.DELETE,
            ]);
        }

        await this.get({ url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        writeToFile(this.reportPath, JSON.stringify(this.getResponseJSON()));

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch);
        }

        await this.verifyResponse(customerID);
    }

    async updateCustomer({
        customerID = 2,
        methodOverride = null,
        url = API.CUSTOMER(customerID),
        token,
        errorToMatch = null,
        statusCodeToMatch = STATUS.OK,
        payload = CUSTOMER_PAYLOAD,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url, authToken: token });

            return this.handleNotAllowedMethods(methodOverride, errorToMatch, [
                METHODS.GET,
                METHODS.HEAD,
                METHODS.PUT,
                METHODS.DELETE,
            ]);
        }

        await this.put({ url, payload, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        writeToFile(this.reportPath, JSON.stringify(this.getResponseJSON()));

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch);
        }

        await this.verifyUpdateResponse(payload);
    }

    async verifyUpdateResponse(
        payload,
        status = RESPONSE_MESSAGES.SUCCESS,
        message = RESPONSE_MESSAGES.SUCCESS_UPDATE_CUSTOMER
    ) {
        expect(this.getResponseJSON().status).toEqual(status);
        expect(this.getResponseJSON().message).toEqual(message);
        expect(this.getResponseJSON().customer.username).toEqual(
            payload.username
        );
        expect(this.getResponseJSON().customer.first_name).toEqual(
            payload.first_name
        );
        expect(this.getResponseJSON().customer.last_name).toEqual(
            payload.last_name
        );
        expect(this.getResponseJSON().customer.date_of_birth).toEqual(
            payload.date_of_birth
        );
    }

    async deleteCustomer({
        customerID = 12,
        url = API.CUSTOMER(customerID),
        token,
        statusCodeToMatch = STATUS.OK,
    }) {
        await this.delete({ url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect(responseStatusCode).toEqual(statusCodeToMatch);

        writeToFile(this.reportPath, JSON.stringify(this.getResponseJSON()));

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(errorToMatch);
        }

        await this.verifyDelete(customerID);
    }

    async verifyDelete(
        customerID,
        status = RESPONSE_MESSAGES.SUCCESS,
        message = RESPONSE_MESSAGES.SUCCESS_CUSTOMER_DELETE
    ) {
        expect(this.getResponseJSON().status).toEqual(status);
        expect(this.getResponseJSON().message).toEqual(message);
        expect(this.getResponseJSON().customer.id).toEqual(customerID);
    }
}
