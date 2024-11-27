import { expect } from "@playwright/test";
import { Navbar } from "./navbar";

export class LandingPage extends Navbar {
    async logoutUser() {
        await this.page.goto("");

        await expect(await this.dashboardNavLink).toBeVisible();
        await expect(await this.logoutNavLink).toBeVisible();
        await expect(await this.loginNavLink).not.toBeVisible();

        await this.logoutNavLink.click();

        await expect(await this.loginNavLink).toBeVisible();
        await expect(await this.logoutNavLink).not.toBeVisible();
        await expect(await this.registerNavLink).toBeVisible();
    }
}
