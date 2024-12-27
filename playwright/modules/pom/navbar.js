import * as utils from "./e2e-utils.js";

export class Navbar {
    constructor(page) {
        this.page = page;
        this.registerNavLink = page.getByRole("link", { name: "Register" });
        this.loginNavLink = page.getByRole("link", { name: "Log in" });
        this.dashboardNavLink = page.locator(".text-m a").nth(1);
        this.hamburgerMenu = page
            .locator(".inline-flex.border-transparent.text-sm")
            .nth(1);
        this.logoutNavLink = page.locator("button", { hasText: "Log Out" });
    }

    async getDashboardUrl() {
        return await this.dashboardNavLink.getAttribute("href");
    }

    async goToHomePage() {
        await utils.visitUrl(this.page, this.page.context()._options.baseURL);
    }

    async goToDashboard(urlToVerify) {
        await utils.visitUrl(this.page, this.page.context()._options.baseURL);
        await utils.clickOnElement(this.dashboardNavLink);
        await utils.verifyUrl(this.page, urlToVerify);
    }
    async goToDashboardRedirect(urlToVerify) {
        await utils.visitUrl(this.page, this.page.context()._options.baseURL);
        const context = this.page.context();
        const pagePromise = context.waitForEvent("page");
        await utils.clickOnElement(this.dashboardNavLink);
        const newPage = await pagePromise;
        await utils.verifyUrl(newPage, urlToVerify);
    }
}
