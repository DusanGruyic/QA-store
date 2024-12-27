import { expect } from "@playwright/test";
import * as utils from "./e2e-utils.js";
import * as constants from "../../fixtures/constants";

export class CartWindow {
    counter = 0;
    constructor(page) {
        this.page = page;
        this.cartButton = page.locator(".inline-flex.rounded-md").first();
        this.cartWindow = page.locator(".px-2.flex.flex-column-reverse");
        this.emptyCartMessage = page.locator(
            'text="No items in cart. Add some!"'
        );
        this.cartItemCard = page.locator(".px-2.flex.flex-column-reverse");
        this.clearCartButton = page.getByRole("button", { name: "Clear" });
        this.eraseItemCard = page.locator(
            ".absolute.overflow-visible.p-button"
        );
        this.decreseItemQuantity = page.locator(
            ".bg-gray-200.text-primary.p-button:nth-of-type(2)"
        );

        this.increaseItemQuantity = page.locator(
            ".bg-gray-200.text-primary.p-button:nth-of-type(3)"
        );
        this.itemName = page.locator(".my-1.text-center.font-bold");
        this.itemPrice = page.locator(".w-44.ml-4");
        this.checkoutButton = page.getByRole("button", { name: "Checkout" });
        this.products = page.locator("[test-data='product-container']");
        this.productCarts = page.locator(".p-button.p-component");
        this.outOfStock = "[data-pc-section='text']";
        this.confirmationMessage = page
            .locator(".Toastify__toast-icon ~ div")
            .last();
        this.closeMessage = page.locator(".Toastify__close-button").last();
        this.itemQuantity = page.locator(".w-44 ml-4");
    }

    async openTheCart() {
        await this.cartButton.hover();
        await utils.clickOnElement(this.cartButton);
        await this.cartWindow.waitFor({ state: "visible" });
    }
    async verifyCartIsEmpty() {
        await expect(this.emptyCartMessage).toBeVisible();
    }
    async verifyAddedProduct() {
        await expect(this.cartItemCard).toBeVisible();
    }
    async addProductToCart() {
        const product = await this.products.first();
        const productCart = product.locator(this.productCarts);
        let getResponse;
        if (await productCart.isEnabled()) {
            expect(await this.page.locator(this.outOfStock)).toBeHidden();

            getResponse = this.page.waitForResponse(
                "http://localhost:8000/api/v1/cart/1"
            );

            await utils.clickOnElement(productCart);
            this.counter = 1;

            await utils.verifyElementTextContent(
                this.confirmationMessage,
                constants.CART_MESSAGES.PRODUCT_ADDED_UI
            );

            await utils.clickOnElement(this.closeMessage);
        }

        await getResponse;
        expect(Number(await this.cartButton.textContent())).toEqual(
            this.counter
        );
    }
    async removeProductFromCart() {
        const removeButton = await this.eraseItemCard.first();
        if (await removeButton.isVisible()) {
            await utils.clickOnElement(removeButton);
        }
        await this.page.waitForTimeout(2000);
    }
    async getItemCount() {
        const countText = await this.cartButton.textContent();
        await this.page.waitForTimeout(2000);
        return parseInt(countText) || 0;
    }

    async clearCart() {
        if (await this.clearCartButton.isVisible()) {
            await utils.clickOnElement(this.clearCartButton);
        }
        await this.page.waitForTimeout(2000);
    }
    async increaseItemQuantityInCart() {
        if (await this.increaseItemQuantity.isVisible())
            await utils.clickOnElement(this.increaseItemQuantity);
        await this.page.waitForTimeout(2000);
    }
}
