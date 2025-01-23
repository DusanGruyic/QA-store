import { test, expect } from "../modules/base";

test.describe("Cart functionalities", () => {
    test.beforeEach(
        "Should make dashboard accessible when user is logged in",
        async ({ loginPage, navbar }) => {
            await loginPage.loginUser({});
            const url = await navbar.getDashboardUrl();
            await navbar.goToDashboard(url);
        }
    );
    test.afterEach("Clear cart contents", async ({ wpage }) => {
        await wpage.evaluate(() => window.localStorage.clear());
        await wpage.evaluate(() => window.sessionStorage.clear());
    });

    test("Should open cart when cart button is clicked", async ({
        cartWindow,
    }) => {
        await cartWindow.openTheCart();
        await expect(cartWindow.cartWindow).toBeVisible();
        await cartWindow.verifyCartIsEmpty();
    });

    test.only("Should be able to add product to cart", async ({
        cartWindow,
    }) => {
        await cartWindow.addProductToCart();
        await cartWindow.openTheCart();
        await expect(cartWindow.cartWindow).toBeVisible();
        await cartWindow.verifyAddedProduct();
    });

    test.only("Should correctly update item count when a product is added", async ({
        cartWindow,
    }) => {
        const initialItemCount = await cartWindow.getItemCount();
        await cartWindow.addProductToCart();
        await cartWindow.openTheCart();
        const updatedItemCount = await cartWindow.getItemCount();
        await expect(updatedItemCount).toBe(initialItemCount + 1);
    });

    test("Should be able to remove a product from the cart", async ({
        cartWindow,
    }) => {
        await cartWindow.addProductToCart();
        await cartWindow.openTheCart();

        const initialItemCount = await cartWindow.getItemCount();

        await cartWindow.removeProductFromCart();

        const updatedItemCount = await cartWindow.getItemCount();
        expect(updatedItemCount).toBeLessThan(initialItemCount);
    });

    test("Should retain items in the cart after page refresh", async ({
        cartWindow,
        page,
    }) => {
        await cartWindow.addProductToCart();

        await page.reload();

        await cartWindow.openTheCart();
        const itemCount = await cartWindow.getItemCount();
        expect(itemCount).toBeGreaterThan(0);
    });

    test("Should empty the cart when clear button is clicked", async ({
        cartWindow,
    }) => {
        await cartWindow.addProductToCart();
        await cartWindow.openTheCart();

        await cartWindow.clearCart();
        const itemCount = await cartWindow.getItemCount();

        expect(itemCount).toBe(0);
    });

    test("Should be able to increase item quantity inside the cart", async ({
        cartWindow,
    }) => {
        await cartWindow.addProductToCart();

        await cartWindow.openTheCart();
        await cartWindow.increaseItemQuantityInCart();
        const itemQuantity = await cartWindow.getItemCount();
        expect(itemQuantity).toBeGreaterThan(1);
    });
});
