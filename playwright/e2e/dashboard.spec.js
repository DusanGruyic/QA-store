import { test } from "playwright/modules/base";
import * as constants from "../fixtures/constants";
import * as apiUtils from "../modules/api/api-utils";

let newPage, newContext;

test.beforeAll("Create context and log in", async ({ wpage }) => {
    newPage = wpage;
    newContext = await newPage.context();
});

test.describe("Dashboard accessibility", () => {
    test("Should make dashboard accessible when user is logged in", async ({
        loginPage,
        navbar,
    }) => {
        await loginPage.loginUser({});
        const url = await navbar.getDashboardUrl();
        await navbar.goToDashboard(url);
    });

    test("Shouldn't be allowed to access Dashboard if user isn't logged in", async ({
        navbar,
    }) => {
        await navbar.goToDashboardRedirect(constants.URLS.LOGIN);
    });

    test("Should be allowed for API request to be resolved", async ({
        loginPage,
        dashboardPage,
    }) => {
        await loginPage.loginUser({});
        await apiUtils.clearLocalStorage(loginPage);
        await apiUtils.clearLocalStorage(loginPage);
        await apiUtils.verifyRequest(
            { loginPage },
            async () => {
                await loginPage.loginUser({});
            },
            constants.API.PRODUCTS,
            constants.METHODS.GET,
            constants.STATUS.OK
        );
        await dashboardPage.verifyRequest();
    });
});

test.describe("Dashboard functionalities", () => {
    test.beforeEach("login", async ({ loginPage, navbar }) => {
        await loginPage.loginUser({});
        const url = await navbar.getDashboardUrl();
        await navbar.goToDashboard(url);
    });

    test("Should be able to change pagination pages", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck();
    });

    test("Should find expected number of products on page", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck(async () => {
            await dashboardPage.checkNumberOfProductsOnPage(12);
        });
    });

    test("Should have product name, picture, rating, price and cart icon for every product", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck(async () => {
            await dashboardPage.checkElementsOnPages();
        });
    });

    test("Should discount match old price decreased by 33%", async ({
        dashboardPage,
    }) => {
        await dashboardPage.isDiscountCorrect();
    });

    test("Product cart button state should depend if product is in stock", async ({
        dashboardPage,
    }) => {
        await dashboardPage.isProductInStock();
    });

    test("Should be shown confirmation message after adding product in cart", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck(async () => {
            await dashboardPage.addProductInCart();
        });
    });

    test("Should open modal dialog of product, and product name on modal dialog should match with name on page", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck(async () => {
            await dashboardPage.checkModalDialog();
        });
    });

    test("Score rating should corresponde with star rating for one product", async ({
        dashboardPage,
    }) => {
        await dashboardPage.paginateAndCheck(async () => {
            await dashboardPage.isStarRatingMatchingScore();
        });
    });

    test("Shouldn't be allowed for price filter bar to reset after changing products page", async ({
        dashboardPage,
    }) => {
        await dashboardPage.setFilterPrices(
            constants.SLIDE_PRICE_BAR.EIGHTHUNDRED_FOURTHY_SEVEN,
            constants.SLIDE_PRICE_BAR.FIVETOUSEND_EIGHTY_FIVE
        );
        await dashboardPage.checkIfSlidersResetAfterChangingPage();
    });

    test("Prices should be in valid filter bar range", async ({
        dashboardPage,
    }) => {
        await dashboardPage.setFilterPrices(
            constants.SLIDE_PRICE_BAR.EIGHTHUNDRED_FOURTHY_SEVEN,
            constants.SLIDE_PRICE_BAR.FIVETOUSEND_EIGHTY_FIVE
        );
        await dashboardPage.isProductPriceInFilterRange();
    });
});
