import * as utils from "./e2e-utils.js";
import * as constants from "../../fixtures/constants";
import { expect } from "../base.js";

export class DashboardPage {
    counter = 0;
    constructor(page) {
        this.page = page;
        this.dashboard = page.locator(
            "[href='http://localhost:8000/dashboard'].ml-5"
        );
        this.headLine = page.locator(".text-7xl");
        this.products = page.locator("[test-data='product-container']");
        this.todaysDealsHeader = page.frameLocator(".border-4").locator("h4");
        this.paginationButtons = page.locator(
            ".paginated [data-pc-name='button']"
        );
        this.todaysDeals = page.frameLocator(".border-4").locator("li");
        this.dealsOldPrices = "span";
        this.dealsDiscounts = "p";
        this.productImages = "product image";
        this.productNames = ".text-md";
        this.productStarRatings = ".space-x-1";
        this.productScoreRatings = "span.border-2";
        this.productDescriptions = ".text-sm.text-gray-600";
        this.productPrices = ".w-full.inset-x-0";
        this.productCarts = ".w-full.inset-x-0 button";
        this.outOfStock = "[data-pc-section='text']";
        this.productNameModal = page.locator(".p-dialog-title");
        this.productDescriptionModal = page.locator(".m-0");
        this.closeModalDialog = page.locator("[data-pc-section='closebutton']");
        this.confirmationMessage = page
            .locator(".Toastify__toast-icon ~ div")
            .last();
        this.closeMessage = page.locator(".Toastify__close-button").last();
        this.cartButton = page
            .locator(".inline-flex.rounded-md.button")
            .first();
        this.disabledCartButton = "p-button p-component p-disabled";
        this.ratingStar = "[role='rating']";
        this.fullStar = "full-star";
        this.emptyStar = "empty-star";
        this.halfStar = "half-star";
        this.leftSlider = page.locator(".p-slider-handle-start");
        this.rightSlider = page.locator(".p-slider-handle-end");
        this.minPrice = page.locator(".px-4.mt-2 span:first-child").first();
        this.maxPrice = page.locator(".px-4.mt-2 span:last-child").first();
        this.applyFilter = page.locator(".layout-menu [data-pc-name='button']");
    }

    async paginateAndCheck(checkElements = null) {
        const paginationButtons = await this.paginationButtons.all();
        for (let button of paginationButtons) {
            await utils.clickOnElement(button);
            await this.page.waitForLoadState();
            if (checkElements) {
                await checkElements();
            }
            await expect(button).toHaveCSS(
                "background-color",
                "rgb(158, 160, 246)"
            );
            for (let otherButton of paginationButtons) {
                if (otherButton !== button) {
                    await expect(otherButton).not.toHaveCSS(
                        "background-color",
                        "rgb(158, 160, 246)"
                    );
                }
            }
        }
    }

    async verifyRequest(statusCodeToMatch) {
        await this.page.waitForRequest("http://localhost:8000/api/v1/products");
        const requestPromise = await this.page.waitForRequest((request) => {
            return (
                request.url() === "http://localhost:8000/api/v1/products" &&
                request.method() === constants.METHODS.GET.toUpperCase()
            );
        });

        await this.dashboard.click();
        const request = await requestPromise;
        const response = await request.response();

        expect(await response.status()).toEqual(statusCodeToMatch);
    }

    async checkNumberOfProductsOnPage(numberOfProducts) {
        const productsQuantity = await this.products.count();
        expect(productsQuantity).toEqual(numberOfProducts);
    }

    async checkElementsOnPages() {
        for (let product of await this.products.all()) {
            await utils.isVisible(product.getByAltText(this.productImages));
            await utils.isVisible(product.locator(this.productNames));
            await utils.isVisible(product.locator(this.productStarRatings));
            await utils.isVisible(product.locator(this.productScoreRatings));
            await utils.isVisible(product.locator(this.productDescriptions));
            await utils.isVisible(product.locator(this.productPrices));
            await utils.isVisible(product.locator(this.productCarts));
        }
    }

    async checkModalDialog() {
        for (let product of await this.products.all()) {
            const productNameText = await product
                .locator(this.productNames)
                .textContent();
            const productDescriptionText = await product
                .locator(this.productDescriptions)
                .textContent();
            await utils.clickOnElement(
                product.getByAltText(this.productImages)
            );
            const productNameModalText =
                await this.productNameModal.textContent();
            const productDescriptionModalText =
                await this.productDescriptionModal.textContent();
            expect(productNameModalText.trim()).toEqual(productNameText.trim());
            expect(productDescriptionModalText.trim()).toEqual(
                productDescriptionText.trim()
            );
            await utils.clickOnElement(this.closeModalDialog);
        }
    }

    async isDiscountCorrect() {
        await utils.isVisible(await this.todaysDealsHeader);
        for (const todaysDeal of await this.todaysDeals.all()) {
            let oldPrice = await utils.getPriceAsNumber(
                todaysDeal.locator(this.dealsOldPrices)
            );
            let discountPrice = await utils.getPriceAsNumber(
                todaysDeal.locator(this.dealsDiscounts)
            );
            expect(discountPrice).toEqual(
                utils.calculateDiscount(
                    oldPrice,
                    constants.DISCOUNTS.SIXTY_SEVEN
                )
            );
        }
    }

    async isProductInStock() {
        for (let product of await this.products.all()) {
            const productCart = product.locator(this.productCarts);
            if (await productCart.isDisabled()) {
                // await this.page.hover(productCart);
                await productCart.hover({ force: true });
                await this.page.waitForSelector(this.outOfStock);
                await utils.isVisible(this.page.locator(this.outOfStock));
                expect(await productCart).toHaveClass(this.disabledCartButton);
                await expect(productCart).toBeDisabled();
                await productCart.blur();
            }
            await productCart.focus();
            await utils.isEnabled(productCart);
        }
    }

    async addProductInCart() {
        for (let product of await this.products.all()) {
            const productCart = product.locator(this.productCarts);
            if (await productCart.isEnabled()) {
                expect(await this.page.locator(this.outOfStock)).toBeHidden();
                await utils.clickOnElement(productCart);
                this.counter++;
                await utils.verifyElementTextContent(
                    this.confirmationMessage,
                    constants.CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY
                );
                await utils.clickOnElement(this.closeMessage);
            }
        }

        expect(Number(await this.cartButton.textContent())).toEqual(
            this.counter
        );
    }

    async isStarRatingMatchingScore() {
        for (let product of await this.products.all()) {
            let scoreRating = await product
                .locator(this.productScoreRatings)
                .textContent();
            let [fullStarsNumber, halfStarNumber] = [
                Number(scoreRating.split(".")[0]),
                Number(scoreRating.split(".")[1]),
            ];
            const numberOfStars = await product
                .locator(this.ratingStar)
                .count();
            for (let star = 0; star < numberOfStars; star++) {
                let expectedTestId;
                switch (true) {
                    case star < fullStarsNumber:
                        expectedTestId = this.fullStar;
                        break;
                    case star === fullStarsNumber && halfStarNumber >= 5:
                        expectedTestId = this.halfStar;
                        break;
                    default:
                        expectedTestId = this.emptyStar;
                        break;
                }
                const starElement = await product
                    .locator(this.ratingStar)
                    .nth(star);

                expect(await starElement.getAttribute("data-testid")).toEqual(
                    expectedTestId
                );
            }
        }
    }

    async setFilterPrices(offsetLeftSlider, offsetRightSlider) {
        await utils.moveSlider(this.page, offsetLeftSlider, this.leftSlider);
        await utils.moveSlider(this.page, offsetRightSlider, this.rightSlider);
        await utils.clickOnElement(this.applyFilter);
    }

    async checkIfSlidersResetAfterChangingPage() {
        const minPriceBefore = await utils.getPriceAsNumber(this.minPrice);
        const maxPriceBefore = await utils.getPriceAsNumber(this.maxPrice);

        await this.paginateAndCheck();

        const minPriceAfter = await utils.getPriceAsNumber(this.minPrice);
        const maxPriceAfter = await utils.getPriceAsNumber(this.maxPrice);

        expect(minPriceBefore).toEqual(minPriceAfter);
        expect(maxPriceBefore).toEqual(maxPriceAfter);
    }

    async isProductPriceInFilterRange() {
        const minPrice = await utils.getPriceAsNumber(this.minPrice);
        const maxPrice = await utils.getPriceAsNumber(this.maxPrice);
        for (let product of await this.products.all()) {
            let price = await utils.getPriceAsNumber(
                product.locator(this.productPrices)
            );

            expect(price).toBeGreaterThanOrEqual(minPrice);
            expect(price).toBeLessThanOrEqual(maxPrice);
        }
    }
}
