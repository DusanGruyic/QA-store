import { expect } from "@playwright/test";
import BaseAPI from "../baseApi";
import {
    API,
    RESPONSE_MESSAGES,
    STATUS,
    CART_MESSAGES,
    PRODUCT_PAYLOAD,
} from "../../../fixtures/constants";
import { writeToFile } from "../api-utils";

export class CartAPI extends BaseAPI {
    async getCartById({
        methodOverride = null,
        cartId,
        url = API.CART(cartId),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
    }) {
        if (methodOverride) {
            const response = await this[methodOverride]({
                url: url,
                authToken: token,
            });
            return this.verifyErrorMessage(
                statusMessageToMatch,
                response.error
            );
        }

        await this.get({ url: url, authToken: token });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = await this.getResponseJSON();

        writeToFile(this.reportPath, response);

        responseStatusCode !== STATUS.OK
            ? this.verifyErrorMessage(statusMessageToMatch, response.message)
            : expect(response.status).toBe(statusMessageToMatch);

        return response;
    }

    async addProductToCart({
        methodOverride = null,
        cartId,
        productId = 1,
        url = API.ADD_TO_CART(cartId, productId),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
        productPayload = PRODUCT_PAYLOAD,
    }) {
        if (methodOverride) {
            const response = await this[methodOverride]({
                url: url,
                authToken: token,
            });

            return this.verifyErrorMessage(
                statusMessageToMatch,
                response.error
            );
        }
        await this.post({
            url: url,
            product: productPayload,
            authToken: token,
        });

        let responseStatusCode = this.getResponseStatusCode();
        expect.soft(responseStatusCode).toEqual(statusCodeToMatch);

        let response = await this.getResponseJSON();

        writeToFile(this.reportPath, response);

        responseStatusCode !== STATUS.OK
            ? this.verifyErrorMessage(statusMessageToMatch, response.message)
            : expect(response.message).toBe(statusMessageToMatch);

        return response;
    }

    async verifyErrorMessage(
        errorToMatch,
        actualError = null,
        fieldInTest = null
    ) {
        if (fieldInTest) {
            return expect(this.getResponseJSON().errors[fieldInTest]).toContain(
                errorToMatch
            );
        }
        expect(errorToMatch).toEqual(actualError);
    }

    async clearCart({
        methodOverride = null,
        cartId,
        url = API.CART(cartId),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        messageToMatch = CART_MESSAGES.CART_DELETED_SUCCESSFULLY,
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

        if (responseStatusCode !== STATUS.OK) {
            this.verifyErrorMessage(statusMessageToMatch, response.message);
        } else
            this.verifyClearCart({
                statusMessageToMatch: statusMessageToMatch,
                messageToMatch: messageToMatch,
            });

        return response;
    }

    async removeProductFromCart({
        methodOverride = null,
        cartId,
        productId = 1,
        url = API.REMOVE_FROM_CART(cartId, productId),
        token = "",
        statusCodeToMatch = STATUS.OK,
        statusMessageToMatch = RESPONSE_MESSAGES.SUCCESS,
        messageToMatch = CART_MESSAGES.QUANTITY_DECREASED,
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

        if (responseStatusCode !== STATUS.OK) {
            this.verifyErrorMessage(statusMessageToMatch, response.message);
        } else
            this.verifyClearCart({
                statusMessageToMatch: statusMessageToMatch,
                messageToMatch: messageToMatch,
            });

        return response;
    }

    async verifyClearCart({ statusMessageToMatch, messageToMatch, cartId }) {
        expect.soft(this.getResponseJSON().status).toBe(statusMessageToMatch);
        expect.soft(this.getResponseJSON().message).toBe(messageToMatch);

        return expect.soft(this.getResponseJSON().cartId).toBe(cartId);
    }
}
