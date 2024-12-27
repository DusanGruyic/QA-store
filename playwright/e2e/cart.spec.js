import { clearLocalStorage } from "playwright/modules/api/api-utils";
import { test, expect } from "../modules/base";
import { CartAPI } from "playwright/modules/api/cart/cartApi";

// test.describe.configure({ mode: "serial" });

test.describe("Cart functionalities", () => {
    let cartApi;

    test.beforeEach(
        "Should make dashboard accessible when user is logged in",
        async ({ loginPage, navbar }) => {
            await loginPage.loginUser({});
            const url = await navbar.getDashboardUrl();
            await navbar.goToDashboard(url);
        }
    );

    test.afterEach(
        "Cleanup after each test",
        async ({ wpage, cartApi, loginPage, navbar }) => {
            cartApi = new CartAPI();
            await cartApi.clearCart({
                cartId: 1,
                url: "http://localhost:8000/api/v1/cart/1",
                token: await wpage.evaluate(() =>
                    localStorage.getItem("token")
                ),
            });
            await clearLocalStorage({ page: wpage });
            await wpage.reload();
            await loginPage.loginUser({});
            const url = await navbar.getDashboardUrl();
            await navbar.goToDashboard(url);
        }
    );
    test("Should open cart when cart button is clicked", async ({
        cartWindow,
    }) => {
        await cartWindow.openTheCart();
        await expect(cartWindow.cartWindow).toBeVisible();
        await cartWindow.verifyCartIsEmpty();
    });

    test("Should be able to add product to cart", async ({ cartWindow }) => {
        await cartWindow.addProductToCart();
        await cartWindow.openTheCart();
        await expect(cartWindow.cartWindow).toBeVisible();
        await cartWindow.verifyAddedProduct();
    });

    test("Should correctly update item count when a product is added", async ({
        cartWindow,
    }) => {
        await cartWindow.clearCart();
        const initialItemCount = await cartWindow.getItemCount();
        await cartWindow.addProductToCart();
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
