import { expect } from "@playwright/test";
import { Navbar } from "./navbar";
import * as utils from "../pom/e2e-utils";

export class LandingPage extends Navbar {
    async logoutUser() {
        await expect(await this.dashboardNavLink).toBeVisible();
        await expect(await this.loginNavLink).not.toBeVisible();

        await utils.clickOnElement(this.hamburgerMenu);
        await expect(await this.logoutNavLink).toBeVisible();
        await this.page.waitForSelector("button", { state: "visible" });
        await this.logoutNavLink.click();

        await expect(await this.loginNavLink).toBeVisible();
        await expect(await this.logoutNavLink).not.toBeVisible();
        await expect(await this.registerNavLink).toBeVisible();
    }
}
