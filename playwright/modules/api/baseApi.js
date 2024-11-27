import { request } from "@playwright/test";
import { expect } from "@playwright/test";
import dotenv from "dotenv";
import {
    ENV,
    RESP_REPORT,
    TOKEN_TYPE,
    METHODS,
} from "playwright/fixtures/constants";
import { getAbsolutePath, getHeaders, isString } from "./api-utils";

export default class BaseAPI {
    response;
    statusCode;
    responseJSON;
    url;
    reportPath;
    authToken;

    constructor() {
        dotenv.config({
            path: ENV,
        });
        this.reportPath = getAbsolutePath(
            new URL(import.meta.url).pathname,
            RESP_REPORT
        );
    }

    // request methods ----------------------------------------------------------------//
    async get({ url, authToken = this.authToken }) {
        const apiContext = await request.newContext();

        this.response = await apiContext[METHODS.GET](url, {
            headers: getHeaders(authToken),
        });

        await this.setResponseJSON(await this.response.json());
        await this.setResponseStatusCode(await this.response.status());
    }

    async put({ url, payload, authToken = this.authToken }) {
        const apiContext = await request.newContext();

        this.response = await apiContext[METHODS.PUT](url, {
            headers: getHeaders(authToken),
            data: payload,
        });

        await this.setResponseJSON(await this.response.json());

        await this.setResponseStatusCode(await this.response.status());
    }

    async post({ url, payload, authToken = this.authToken }) {
        const apiContext = await request.newContext();

        this.response = await apiContext[METHODS.POST](url, {
            
            headers: getHeaders(authToken),
            data: payload,
            
        });

        await this.setResponseJSON(await this.response.json());

        await this.setResponseStatusCode(await this.response.status());
    }

    async patch({ url, payload, authToken = this.authToken }) {
        const apiContext = await request.newContext();

        this.response = await apiContext[METHODS.PATCH](url, {
            headers: getHeaders(authToken),
            data: payload,
        });

        await this.setResponseJSON(await this.response.json());
        await this.setResponseStatusCode(await this.response.status());
    }

    async delete({ url, authToken = this.authToken }) {
        const apiContext = await request.newContext();

        this.response = await apiContext[METHODS.DELETE](url, {
            headers: getHeaders(authToken),
        });

        await this.setResponseJSON(await this.response.json());
        await this.setResponseStatusCode(await this.response.status());
    }

    // getters and setters ------------------------------------------------------------//
    getResponseStatusCode() {
        return this.statusCode;
    }

    async setResponseStatusCode(value) {
        try {
            this.statusCode = value;
        } catch (err) {
            return console.error(err);
        }
    }

    getResponseJSON() {
        return this.responseJSON;
    }

    async setResponseJSON(value) {
        try {
            this.responseJSON = await value;
        } catch (err) {
            return console.error(err);
        }
    }

    getAuthToken() {
        return this.authToken;
    }

    async setAuthToken(value) {
        try {
            this.authToken = await value;
        } catch (err) {
            return console.error(err);
        }
    }

    // helpers methods ----------------------------------------------------------------//
    verifyAuthToken() {
        let responseJSON = this.getResponseJSON(),
            [accessToken, typeOfToken] = [
                responseJSON.auth.token,
                responseJSON.auth.type,
            ];

        expect(isString(accessToken)).toBeTruthy();
        expect(accessToken.length).toBeGreaterThan(0);
        expect(typeOfToken).toEqual(TOKEN_TYPE);

        this.setAuthToken(`${typeOfToken} ${accessToken}`);
    }

    handleNotAllowedMethods(method, errorToMatch, supportedMethods) {
        for (const supported of supportedMethods) {
            if (method !== supported) {

                expect(this.getResponseJSON().error).toContain(errorToMatch);
            }
            
        }
    }
}
