import * as constants from "playwright/fixtures/constants";
import * as utils from "./e2e-utils";

export class MailHog {
    href;
    newPage;
    resetPass;

    constructor(page) {
        this.page = page;
        this.sender = page.locator(".ng-scope td.ng-binding").first();
        this.receiver = page.locator(".ng-scope td.ng-binding").last();
        this.welcomeMessage = page
            .frameLocator("#preview-html")
            .locator("tbody p")
            .first();
        this.resetPasswordButton = page
            .frameLocator("#preview-html")
            .locator(".button-primary");
        this.deleteAllMessages = page.locator("[ng-click='deleteAll()']");
        this.confirmDeleteAllMessages = page.locator(
            '[ng-click="deleteAllConfirm()"]'
        );
        this.timeReceivedEmails = page.locator(".col-md-9");
    }

    async findEmail(email) {
        await utils.visitUrl(this.page, constants.URLS.MAIL_HOG);
        await this.page
            .locator(
                `[ng-click='selectMessage(message)']:has-text("${email}"):has-text("Reset Password Notification")`
            )
            .first()
            .click();

        await utils.isVisible(await this.welcomeMessage);
    }

    async clickOnExpiredEmail() {
        await utils.visitUrl(this.page, constants.URLS.MAIL_HOG);

        let timeIntervals = await this.timeReceivedEmails.allTextContents();
        for (const interval in timeIntervals) {
            let time = await timeIntervals[interval];

            if (
                Number(time.trim().split(" ")[0]) > 2 &&
                time.trim().split(" ")[1] === "hours"
            ) {
                await this.page
                    .locator(
                        `[ng-click='selectMessage(message)']:has-text("${timeIntervals[
                            interval
                        ].trim()}"):has-text("Reset Password Notification")`
                    )
                    .click();
                break;
            }
        }
    }

    async clickOnReset(link = false) {
        if (link) {
            this.href = await this.resetPasswordButton.getAttribute("href");
            let passwordLink = await this.page
                .frameLocator("#preview-html")
                .locator(`span a[href="${this.href}"]`);
            await Promise.all([await utils.clickOnElement(passwordLink)]);

            return;
        }

        await utils.isEnabled(this.resetPasswordButton);
        this.href = await this.resetPasswordButton.getAttribute("href");
        await Promise.all([
            await utils.clickOnElement(this.resetPasswordButton),
        ]);
    }
}
