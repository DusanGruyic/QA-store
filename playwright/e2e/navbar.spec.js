import { test } from "../modules/base";
import { REGISTER_PAYLOAD, NAVBAR_LINKS } from "playwright/fixtures/constants";
import * as utils from "../modules/api/api-utils";

test.describe("Visit navbar links", () => {
    test.beforeEach("Clear local storage", async ({navbar}) => {
        await navbar.goToHomePage();
        await utils.clearLocalStorage(navbar);
    })

    test.afterEach("Clear local storage", async ({navbar}) => {
        await utils.clearLocalStorage(navbar);
    })

    test("Should be redirected to register page on register link click", async ({
        navbar,
    }) => {
        await utils.navigateTo(navbar, NAVBAR_LINKS.REGISTER);
    });

    test("Should be redirected to login page on login link click", async ({
        navbar,
    }) => {
        await utils.navigateTo(navbar, NAVBAR_LINKS.LOGIN);
    });

    test("Should be redirected to dashboard page on dashboard link click", async ({
        navbar,
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[0]]:
                    utils.generateRandomString(10),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: `${utils.generateRandomString(10)}${
                    REGISTER_PAYLOAD.email
                }`,
            },
        });
        await utils.navigateTo(navbar, NAVBAR_LINKS.DASHBOARD);
    });

    test.skip("Should be redirected to home page on logout link click", async ({
        navbar,
        registerPage,
    }) => {
        await registerPage.register({
            payload: {
                ...REGISTER_PAYLOAD,
                [Object.keys(REGISTER_PAYLOAD)[0]]:
                    utils.generateRandomString(10),
                [Object.keys(
                    REGISTER_PAYLOAD
                )[1]]: `${utils.generateRandomString(10)}${
                    REGISTER_PAYLOAD.email
                }`,
            },
        });
        await utils.navigateTo(navbar, NAVBAR_LINKS.LOGOUT);
    });
});
