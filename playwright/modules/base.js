import { chromium, test as baseTest } from "@playwright/test";
import { LoginAPI } from "./api/auth/loginApi.js";
import { RegisterAPI } from "./api/auth/registerApi.js";
import { CustomerApi } from "./api/customer/customerApi.js";
import { ShippingInfoApi } from "./api/customer/shippingInfoApi.js";
import { ProductAPI } from "./api/product/productApi.js";
import { BillingInfoApi } from "./api/customer/billingInfoApi.js";
import { LoginPage } from "./pom/loginPage.js";
import { LandingPage } from "./pom/landingPage.js";
import { Navbar } from "playwright/modules/pom/navbar.js";
import { RegisterPage } from "playwright/modules/pom/registerPage.js";
import { ResetPasswordPage } from "./pom/resetPasswordPage.js";
import { MailHog } from "./pom/mailHogPage.js";
import { DashboardPage } from "./pom/dashboardPage.js";

const testPages = baseTest.extend({
    wpage: [
        async ({}, use, testInfo) => {
            const browser = await chromium.launch();
            const context = await browser.newContext();
            const page = await context.newPage();
            await use(page);
            await page.close();
            await context.close();
            await browser.close();
        },
        { auto: "true" },
    ],
    loginApi: async ({ wpage }, use) => {
        await use(new LoginAPI(wpage));
    },
    registerApi: async ({ wpage }, use) => {
        await use(new RegisterAPI(wpage));
    },
    customerApi: async ({ wpage }, use) => {
        await use(new CustomerApi(wpage));
    },
    productsApi: async ({ wpage }, use) => {
        await use(new ProductAPI(wpage));
    },
    billingInfo: async ({ wpage }, use) => {
        await use(new BillingInfoApi(wpage));
    },
    shippingInfoApi: async ({ wpage }, use) => {
        await use(new ShippingInfoApi(wpage));
    },
    loginPage: async ({ wpage }, use) => {
        await use(new LoginPage(wpage));
    },
    landingPage: async ({ wpage }, use) => {
        await use(new LandingPage(wpage));
    },
    navbar: async ({ wpage }, use) => {
        await use(new Navbar(wpage));
    },
    registerPage: async ({ wpage }, use) => {
        await use(new RegisterPage(wpage));
    },
    resetPasswordPage: async ({ wpage }, use) => {
        await use(new ResetPasswordPage(wpage));
    },
    mailHogPage: async ({ wpage }, use) => {
        await use(new MailHog(wpage));
    },
    dashboardPage: async ({ wpage }, use) => {
        await use(new DashboardPage(wpage));
    },
});
export const test = testPages;
export const expect = testPages.expect;
