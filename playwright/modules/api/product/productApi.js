import { expect } from "@playwright/test";
import BaseAPI from "../baseApi";
import {
    API,
    STATUS,
    PRODUCT_PAYLOAD,
    RESPONSE_MESSAGES,
} from "playwright/fixtures/constants";
import {
    writeToFile,
    writePayLoadAndRespToFile,
    noTrailingSpacesObject,
} from "../api-utils";

export class ProductAPI extends BaseAPI {
    async getProducts({
        methodOverride = null,
        url = API.PRODUCTS,
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url: url, authToken: token });

            return this.verifyErrorMessage(statusMessageToMatch);
        }

        await this.get({ url: url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = await this.getResponseJSON();

        writeToFile(this.reportPath, response);

        if (responseStatusCode !== STATUS.OK) {
            this.verifyErrorMessage(statusMessageToMatch);
        } else expect(response.status).toBe(statusMessageToMatch);
    }

    async createProduct({
        methodOverride = null,
        url = API.PRODUCTS,
        token = "",
        statusCodeToMatch = STATUS.BAD_ENTITY,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        productPayload = PRODUCT_PAYLOAD,
        fieldInTest = "",
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url: url, authToken: token });

            return this.verifyErrorMessage(statusMessageToMatch);
        }

        await this.post({
            url: url,
            payload: productPayload,
            authToken: token,
        });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = this.getResponseJSON();
        writePayLoadAndRespToFile(this.reportPath, response, productPayload);

        if (responseStatusCode !== STATUS.OK) {
            this.verifyErrorMessage(statusMessageToMatch, fieldInTest);
        } else {
            productPayload = noTrailingSpacesObject(productPayload);
            this.verifyCreateProduct({
                statusMessageToMatch: statusMessageToMatch,
                productPayload: productPayload,
            });
        }
    }

    async getProductByIndex({
        methodOverride = null,
        id = 1,
        url = API.PRODUCT(id),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        successful = false,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url: url, authToken: token });

            return this.verifyErrorMessage(statusMessageToMatch);
        }

        await this.get({ url: url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = this.getResponseJSON();

        writeToFile(this.reportPath, response);

        if (successful) {
            expect.soft(response.status).toBe(statusMessageToMatch);
            return expect.soft(response.product.id).toBe(id);
        }
        this.verifyErrorMessage(statusMessageToMatch);

        return response;
    }

    async deleteProduct({
        methodOverride = null,
        id = 2,
        url = API.PRODUCT(id),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        messageToMatch = RESPONSE_MESSAGES.PRODUCT_DELETED,
        successful = false,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url: url, authToken: token });

            return this.verifyErrorMessage(statusMessageToMatch);
        }

        await this.delete({ url: url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = this.getResponseJSON();
        writeToFile(this.reportPath, response);

        if (successful) {
            return this.verifyDeleteProduct({
                statusMessageToMatch: statusMessageToMatch,
                messageToMatch: messageToMatch,
                id: id,
            });
        }
        this.verifyErrorMessage(statusMessageToMatch);
    }

    async updateProduct({
        methodOverride = null,
        token = "",
        id = 3,
        url = API.PRODUCT(id),
        statusCodeToMatch = STATUS.BAD_ENTITY,
        fieldInTest = "",
        valueChanged = "",
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        messageToMatch = RESPONSE_MESSAGES.PRODUCT_UPDATED,
        productPayload = PRODUCT_PAYLOAD,
    }) {
        if (methodOverride) {
            await this[methodOverride]({ url: url, authToken: token });

            return this.verifyErrorMessage(statusMessageToMatch);
        }

        await this.put({ url: url, payload: productPayload, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = this.getResponseJSON();
        writePayLoadAndRespToFile(this.reportPath, response, productPayload);

        if (responseStatusCode !== STATUS.OK) {
            return this.verifyErrorMessage(statusMessageToMatch, fieldInTest);
        } else
            this.verifyUpdateProduct({
                statusMessageToMatch: statusMessageToMatch,
                messageToMatch: messageToMatch,
                valueChanged: valueChanged,
                fieldInTest: fieldInTest,
            });

        return response;
    }

    async verifyErrorMessage(errorToMatch, fieldInTest = null) {
        if (fieldInTest) {
            return expect(this.getResponseJSON().errors[fieldInTest].toString()).toContain(
                errorToMatch
            );
        }
        this.getResponseJSON().error
            ? expect(this.getResponseJSON().error).toContain(errorToMatch)
            : expect(this.getResponseJSON().status || this.getResponseJSON().message).toContain(errorToMatch);
    }

    async verifyUpdateProduct({
        statusMessageToMatch,
        messageToMatch,
        fieldInTest,
        valueChanged,
    }) {
        expect.soft(this.getResponseJSON().status).toBe(statusMessageToMatch);
        expect.soft(this.getResponseJSON().message).toContain(messageToMatch);
        return expect
            .soft(this.getResponseJSON().product[fieldInTest])
            .toBe(valueChanged);
    }

    async verifyDeleteProduct({ statusMessageToMatch, messageToMatch, id }) {
        expect.soft(this.getResponseJSON().status).toBe(statusMessageToMatch);
        expect.soft(this.getResponseJSON().message).toBe(messageToMatch);

        return expect.soft(this.getResponseJSON().product.id).toBe(id);
    }

    async verifyCreateProduct({ statusMessageToMatch, productPayload }) {
        expect.soft(this.getResponseJSON().status).toBe(statusMessageToMatch);
        for (const key in productPayload) {
            expect(this.getResponseJSON().product.key).toBe(productPayload.key);
        }
    }
}
