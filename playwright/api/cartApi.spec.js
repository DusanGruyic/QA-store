import { test, expect } from "../modules/base";
import * as utils from "../modules/api/api-utils";
import {
    PRODUCT_PAYLOAD,
    STATUS,
    METHODS,
    RESPONSE_MESSAGES,
    CART_MESSAGES,
} from "playwright/fixtures/constants";
import { CART_PAYLOAD } from "playwright/fixtures/constants/payloadData";

let token, userId;

test.describe.configure({ mode: "serial" });
test.beforeAll("Log into the app", async ({ loginApi }) => {
    const loginResponse = await loginApi.login({});
    userId = await loginResponse.user.id;
    token = await loginApi.getAuthToken();
});

test.afterEach("Clear the cart", async ({ cartApi }) => {
    const response = await cartApi.getCartById({
        cartId: userId,
        token: token,
    });
    response.cart.forEach((item) => {
        cartApi.clearCart({
            cartId: userId,
            token: token,
            productId: item.id,
        });
    });
});

test.describe("Cart API tests", () => {
    let { DELETE, GET, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
    for (const method in UNSUPPORTED_METHODS) {
        test.skip(`Should not be able to send a ${method} HTTP request when DELETE, GET, HEAD endpoints are expected `, async ({
            cartApi,
        }) => {
            await cartApi.getCartById({
                methodOverride: UNSUPPORTED_METHODS[method],
                cartId: userId,
                token: token,
                statusCodeToMatch: STATUS.BAD_METHOD,
                statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
            });
        });
    }
    let { POST, ...UNSUPPORTED_METHODS_NEW } = UNSUPPORTED_METHODS;
    UNSUPPORTED_METHODS = { ...UNSUPPORTED_METHODS_NEW, GET: "get" };
    for (const method in UNSUPPORTED_METHODS_NEW) {
        test.skip(`Shouldn't be able to send a ${method} HTTP request when POST, HEAD, DELETE endpoints are expected `, async ({
            cartApi,
        }) => {
            await cartApi.addProductToCart({
                methodOverride: UNSUPPORTED_METHODS_NEW[method],
                cartId: userId,
                token: token,
                statusCodeToMatch: STATUS.BAD_METHOD,
                statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
            });
        });
    }

    test.skip("Should not be able to clear cart without token", async ({
        cartApi,
    }) => {
        await cartApi.clearCart({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test.skip("Should not be able to add product to cart without token", async ({
        cartApi,
    }) => {
        await cartApi.addProductToCart({
            productPayload: {
                ...PRODUCT_PAYLOAD,
                name: `MAC - ${utils.getRandomInt()}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test.skip("Should not be able to remove product from cart without token", async ({
        cartApi,
    }) => {
        await cartApi.addProductToCart({
            cartId: userId,
            token: token,
            productPayload: {
                ...PRODUCT_PAYLOAD,
                name: `MAC - ${utils.getRandomInt()}`,
            },
        });
        await cartApi.removeProductFromCart({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test.skip("Should not be able to get cart id without token", async ({
        cartApi,
    }) => {
        await cartApi.getCartById({
            cartId: userId,
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });
});

let str = "api/v1/cart/1";
const { GET, DELETE, HEAD, ...UNSUPPORTED_METHODS } = METHODS;
for (const method in UNSUPPORTED_METHODS) {
    test.skip(`Should not be able to send a ${method} HTTP request when endpoint has a typo`, async ({
        cartApi,
    }) => {
        let newStr = str.replace("cart", "carrt");
        await cartApi.getCartById({
            token: token,
            cartId: userId,
            url: newStr,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(newStr),
        });
    });
}
let { POST, ...UNSUPPORTED_METHODS_NEW } = UNSUPPORTED_METHODS;
UNSUPPORTED_METHODS_NEW = { ...UNSUPPORTED_METHODS_NEW, GET: "get" };
for (const method in UNSUPPORTED_METHODS_NEW) {
    test.skip(`Shouldn't be able to send a ${method} HTTP request when endpoint has a typo using POST, HEAD, DELETE requests`, async ({
        cartApi,
    }) => {
        let newStr = str.replace("cart", "carrt");
        await cartApi.addProductToCart({
            cartId: userId,
            token: token,
            url: newStr,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(newStr),
        });
    });
}

test.skip("Should not be able to add product to cart if product quantity is 0", async ({
    cartApi,
    productsApi,
}) => {
    const response = await productsApi.updateProduct({
        token: token,
        fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        productPayload: {
            ...PRODUCT_PAYLOAD,
            in_stock: false,
            quantity: 0,
        },
        valueChanged: 0,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: RESPONSE_MESSAGES.SUCCESS,
    });

    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: response.product.id,
        quantity: 1,
        statusCodeToMatch: STATUS.BAD_REQUEST,
        statusMessageToMatch: RESPONSE_MESSAGES.PRODUCT_OUT_OF_STOCK,
    });
});

test.skip("Should be able to add product to cart if name is sent as string with leading spaces", async ({
    cartApi,
}) => {
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productPayload: CART_PAYLOAD,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
    });
    const response = await cartApi.getCartById({ cartId: 1, token: token });
    expect(response.cart[0].name).toEqual(CART_PAYLOAD["name"]);
});

test.skip("Should be able to add product to cart if name is sent as string with trailing spaces", async ({
    cartApi,
    productsApi,
}) => {
    let updatedProduct = await productsApi.updateProduct({
        token: token,
        fieldInTest: Object.keys(PRODUCT_PAYLOAD)[0],
        productPayload: {
            ...PRODUCT_PAYLOAD,
            name: `${PRODUCT_PAYLOAD.name}      `,
            valueChanged: "    ",
            statusCodeToMatch: STATUS.OK,
        },
    });
    console.log(updatedProduct);

    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productPayload: updatedProduct,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
    });

    const response = await cartApi.getCartById({ cartId: 1, token: token });
    expect(response.cart[0].name).toEqual(PRODUCT_PAYLOAD["name"]);
});

test.skip("Should be able to add product with special characters to cart", async ({
    cartApi,
}) => {
    let product = {
        ...PRODUCT_PAYLOAD,
        name: "M@nitoR$%",
    };
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productPayload: product,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
    });
    await cartApi.getCartById({
        cartId: userId,
        token: token,
    });
});

test.skip("Should decrease product quantity when product is addedd to cart", async ({
    cartApi,
    productsApi,
}) => {
    const productBeforeAdd = await productsApi.getProductByIndex({
        token: token,
        id: 1,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: RESPONSE_MESSAGES.SUCCESS,
    });

    const initialQuantity = productBeforeAdd.product.quantity;

    await cartApi.addProductToCart({
        token: token,
        id: 1,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
    });

    await cartApi.addProductToCart({
        token: token,
        id: 1,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: CART_MESSAGES.PRODUCT_ADDED_SUCCESSFULLY,
    });

    const cart = await cartApi.getCartById({
        token: token,
        cartId: userId,
        successful: true,
    });

    const productAfterAdd = await productsApi.getProductByIndex({
        id: 1,
        token: token,
        statusCodeToMatch: STATUS.OK,
        statusMessageToMatch: RESPONSE_MESSAGES.SUCCESS,
    });
    expect(await productBeforeAdd.product.name).toBe(cart.cart[0].name);
    expect(await productAfterAdd.product.quantity).toBe(initialQuantity - 2);
});

test.skip("Should be able to add a product to cart", async ({ cartApi }) => {
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
    });
    const response = await cartApi.getCartById({ cartId: 1, token: token });
    expect(response.cart[0].name).toEqual(CART_PAYLOAD["name"]);
});

test("Should be able to add more than one product to the cart", async ({
    cartApi,
}) => {
    await cartApi.getCartById({
        token: token,
        cartId: userId,
        successful: true,
    });
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 2,
        statusCodeToMatch: STATUS.OK,
    });
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 2,
        statusCodeToMatch: STATUS.OK,
    });

    const cartContents = await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    const productNames = cartContents.cart.map((product) => product.name);
    expect(productNames).toEqual([cartContents.cart[0].name]);
    expect(productNames.length).toBe(1);
    console.log(productNames);
});

test.skip("Should allow adding multiple distinct products to the cart", async ({
    cartApi,
}) => {
    await cartApi.getCartById({
        token: token,
        cartId: userId,
        successful: true,
    });
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 11,
        statusCodeToMatch: STATUS.OK,
    });

    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 22,
        statusCodeToMatch: STATUS.OK,
    });
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 33,
        statusCodeToMatch: STATUS.OK,
    });

    const cartContents = await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    expect(cartContents.cart.length).toBe(3);
});

test.skip("Should be able to get cart by ID", async ({ cartApi }) => {
    await cartApi.addProductToCart({
        cartId: userId,
        token: token,
        productId: 2,
        statusCodeToMatch: STATUS.OK,
    });

    const response = await cartApi.getCartById({
        cartId: userId,
        token: token,
        statusCodeToMatch: STATUS.OK,
    });
    const product = response.cart.find((item) => item.id === 2);
    expect(product.name).toBe(response.cart[0].name);
    expect(product.pivot.cart_id).toBe(userId);
    expect(response.cart.length).toBeGreaterThan(0);
});

test.skip("Should remove product from cart without affecting other items", async ({
    cartApi,
}) => {
    await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    await cartApi.addProductToCart({
        cartId: userId,
        productId: 9,
        token: token,
        statusCodeToMatch: STATUS.OK,
    });
    await cartApi.addProductToCart({
        cartId: userId,
        productId: 9,
        token: token,
        statusCodeToMatch: STATUS.OK,
    });
    let responseMessage = await cartApi.removeProductFromCart({
        cartId: userId,
        token: token,
        productId: 9,
        statusCodeToMatch: STATUS.OK,
        messageToMatch: CART_MESSAGES.PRODUCT_REMOVED_SUCCESSFULLY,
    });

    const cartContents = await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    const cart = cartContents.cart.map((product) => product.name);
    expect(await responseMessage.message).toBe(
        CART_MESSAGES.PRODUCT_REMOVED_SUCCESSFULLY
    );
    expect(cart.length).toBe(1);
});

test.skip("Should be able to remove product from cart leaving the cart empty", async ({
    cartApi,
}) => {
    await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    await cartApi.addProductToCart({
        cartId: userId,
        productId: 1,
        token: token,
        statusCodeToMatch: STATUS.OK,
    });

    const messageRemove = await cartApi.removeProductFromCart({
        cartId: userId,
        token: token,
        statusCodeToMatch: STATUS.OK,
        messageToMatch: CART_MESSAGES.PRODUCT_REMOVED_SUCCESSFULLY,
    });

    const sameCart = await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    const cartStatus = sameCart.cart.map((product) => product.name);
    expect(messageRemove.message).toEqual(
        CART_MESSAGES.PRODUCT_REMOVED_SUCCESSFULLY
    );
    expect(cartStatus.length).toBe(0);
});

test.skip("Should be able to clear the whole cart", async ({ cartApi }) => {
    await cartApi.addProductToCart({
        cartId: userId,
        productId: 1,
        token: token,
        statusCodeToMatch: STATUS.OK,
    });
    const newCart = await cartApi.getCartById({
        token: token,
        cartId: userId,
        statusCodeToMatch: STATUS.OK,
    });

    const clearTheCart = await cartApi.clearCart({
        methodOverride: null,
        cartId: userId,
        token: token,
        statusCodeToMatch: STATUS.OK,
        messageToMatch: CART_MESSAGES.CART_DELETED_SUCCESSFULLY,
    });

    expect(await newCart.cart.length).toBe(1);
    expect(await clearTheCart.message).toBe(
        CART_MESSAGES.CART_DELETED_SUCCESSFULLY
    );
});
