import { test } from "../modules/base";
import * as utils from "../modules/api/api-utils";
import {
    STATUS,
    METHODS,
    API,
    PRODUCT_PAYLOAD,
    FALSY_DATA,
    BOOLEAN_VALUES,
    RESPONSE_MESSAGES,
    TEST_DATA_BY_TYPE,
    FLOAT_DATA,
    INTEGER_DATA,
} from "playwright/fixtures/constants";

let token;
let counter = 1;
let wrongUrl = `${API.PRODUCTS}s/2`;
const { price, quantity, in_stock, cart_quantity, rating, ...payloadNameDesc } =
    PRODUCT_PAYLOAD;
const FLOAT_INT = {
    float: FLOAT_DATA,
    integer: INTEGER_DATA,
};

test.beforeAll("", async ({ loginApi }) => {
    await loginApi.login({});
    token = await loginApi.getAuthToken();
});

test.describe("CRUD - Happy flow", () => {
    test("Should be able to delete the product info by the id sent", async ({
        productsApi,
    }) => {
        await productsApi.deleteProduct({
            token: token,
            successful: true,
            id: 10,
        });
    });

    test("List all products", async ({ productsApi }) => {
        await productsApi.getProducts({
            token: token,
        });
    });

    test("Add Product - happy flow", async ({ productsApi }) => {
        await productsApi.createProduct({
            token: token,
            productPayload: {
                ...PRODUCT_PAYLOAD,
                name: `MAC - ${utils.getRandomInt()}`,
            },
            statusCodeToMatch: STATUS.OK,
        });
    });

    test("Update product - happy flow", async ({ productsApi }) => {
        await productsApi.updateProduct({
            token: token,
            statusCodeToMatch: STATUS.OK,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[2],
            valueChanged: PRODUCT_PAYLOAD.price,
        });
    });
});

test.describe("Falsy values negative tests - POST/PUT", () => {
    for (const value in FALSY_DATA) {
        for (const field in PRODUCT_PAYLOAD) {
            test(`${counter} - Should not be able to add product when product ${field} is ${value.toLowerCase()}`, async ({
                productsApi,
            }) => {
                await productsApi.createProduct({
                    token: token,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: FALSY_DATA[value],
                    },
                    fieldInTest: field,
                    statusMessageToMatch: utils.getRequiredFieldErrMsg(field),
                });
            });

            test(`${counter} - Should not be able to update product when product ${field} is ${value.toLowerCase()}`, async ({
                productsApi,
            }) => {
                await productsApi.updateProduct({
                    token: token,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: FALSY_DATA[value],
                    },
                    fieldInTest: field,
                    statusMessageToMatch: utils.getRequiredFieldErrMsg(field),
                });
            });
            counter++;
        }
    }
});

test.describe("Token negative tests - POST/PUT/DELETE", () => {
    test("Should not be able to delete the product without token", async ({
        productsApi,
    }) => {
        await productsApi.deleteProduct({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not be able to get products without token", async ({
        productsApi,
    }) => {
        await productsApi.getProducts({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not be able to create product without token", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            productPayload: {
                ...PRODUCT_PAYLOAD,
                name: `MAC - ${utils.getRandomInt()}`,
            },
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });

    test("Should not be able to update product without token", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            statusCodeToMatch: STATUS.UNAUTHORIZED,
            statusMessageToMatch: RESPONSE_MESSAGES.UNAUTHENTICATED,
        });
    });
});

test.describe("Values set in array negative tests - POST/PUT", () => {
    for (const field in payloadNameDesc) {
        test(`${counter} - Should not be able to add product when product ${field} is set as string array`, async ({
            productsApi,
        }) => {
            await productsApi.createProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: [TEST_DATA_BY_TYPE.STRING_DATA],
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });

        test(`${counter} - Should not be able to update product when product ${field} is set as string array`, async ({
            productsApi,
        }) => {
            await productsApi.updateProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: [TEST_DATA_BY_TYPE.STRING_DATA],
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });
        counter++;
    }

    for (const value in FLOAT_INT) {
        const { name, description, in_stock, ...payloadPriceQuantity } =
            PRODUCT_PAYLOAD;
        for (const field in payloadPriceQuantity) {
            test(`${counter} - Should not be able to add product when product ${field} is ${value.toLowerCase()} set in array`, async ({
                productsApi,
            }) => {
                await productsApi.createProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: [FLOAT_INT[value]],
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });

            test(`${counter} - Should not be able to update product when product ${field} is ${value.toLowerCase()} set in array`, async ({
                productsApi,
            }) => {
                await productsApi.updateProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: [FLOAT_INT[value]],
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });
            counter++;
        }
    }

    for (const field in PRODUCT_PAYLOAD) {
        test(`${counter} - Should not be able to add product when product ${field} is set as multiple data array`, async ({
            productsApi,
        }) => {
            await productsApi.createProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: TEST_DATA_BY_TYPE.ARRAY_DATA,
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });

        test(`${counter} - Should not be able to update product when product ${field} is set as multiple data array`, async ({
            productsApi,
        }) => {
            await productsApi.updateProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: TEST_DATA_BY_TYPE.ARRAY_DATA,
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });
        counter++;
    }
});

test.describe("Values set in an object negative tests - POST/PUT", () => {
    for (const field in payloadNameDesc) {
        test(`${counter} - Should not be able to add product when product ${field} is set as string object`, async ({
            productsApi,
        }) => {
            await productsApi.createProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: {
                        [field]: TEST_DATA_BY_TYPE.STRING_DATA,
                    },
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });

        test(`${counter} - Should not be able to update product when product ${field} is set as string object`, async ({
            productsApi,
        }) => {
            await productsApi.updateProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: {
                        [field]: TEST_DATA_BY_TYPE.STRING_DATA,
                    },
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });
        counter++;
    }

    for (const value in FLOAT_INT) {
        const { name, description, in_stock, ...payloadPriceQuantity } =
            PRODUCT_PAYLOAD;
        for (const field in payloadPriceQuantity) {
            test(`${counter} - Should not be able to add product when product ${field} is ${value.toLowerCase()} set in object`, async ({
                productsApi,
            }) => {
                await productsApi.createProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: {
                            [field]: FLOAT_INT[value],
                        },
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });

            test(`${counter} - Should not be able to update product when product ${field} is ${value.toLowerCase()} set in object`, async ({
                productsApi,
            }) => {
                await productsApi.updateProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: {
                            [field]: FLOAT_INT[value],
                        },
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });
            counter++;
        }
    }

    for (const field in PRODUCT_PAYLOAD) {
        test(`${counter} - Should not be able to add product when product ${field} is set as multiple data object`, async ({
            productsApi,
        }) => {
            await productsApi.createProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: TEST_DATA_BY_TYPE.OBJECT_DATA,
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });

        test(`${counter} - Should not be able to update product when product ${field} is set as multiple data object`, async ({
            productsApi,
        }) => {
            await productsApi.updateProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: TEST_DATA_BY_TYPE.OBJECT_DATA,
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });
        counter++;
    }
});

test.describe("Fields(name,description) with float and integer data types - POST/PUT", () => {
    for (const value in FLOAT_INT) {
        for (const field in payloadNameDesc) {
            test(`${counter} - Should not be able to add product when product ${field} is ${value.toLowerCase()}`, async ({
                productsApi,
            }) => {
                await productsApi.createProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: FLOAT_INT[value],
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });

            test(`${counter} - Should not be able to update product when product ${field} is ${value.toLowerCase()}`, async ({
                productsApi,
            }) => {
                await productsApi.updateProduct({
                    token: token,
                    fieldInTest: field,
                    productPayload: {
                        ...PRODUCT_PAYLOAD,
                        [field]: FLOAT_INT[value],
                    },
                    statusMessageToMatch: utils.getMustBeTypeMsg(field),
                });
            });
            counter++;
        }
    }
});

test.describe("CRUD - endpoints negative tests", () => {
    test("Should not list all products when endpoint is incorrect", async ({
        productsApi,
    }) => {
        await productsApi.getProducts({
            url: `${API.PRODUCTS}s`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(`${API.PRODUCTS}s`),
        });
    });

    test("Should not be able to add product when endpoint is incorrect", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            url: `${wrongUrl}/`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(wrongUrl),
        });
    });

    test("Should not be able to get the product info if the endpoint is incorrect", async ({
        productsApi,
    }) => {
        await productsApi.getProductByIndex({
            token: token,
            url: `${wrongUrl}`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(wrongUrl),
        });
    });

    test("Should not be able to update product when endpoint is incorrect", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            url: `${wrongUrl}/`,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(wrongUrl),
        });
    });

    test("Should not be able to delete product when endpoint is incorrect", async ({
        productsApi,
    }) => {
        await productsApi.deleteProduct({
            token: token,
            url: wrongUrl,
            statusCodeToMatch: STATUS.NOT_FOUND,
            statusMessageToMatch: utils.getRouteNotFoundMsg(wrongUrl),
        });
    });
});

test.describe("CRUD - Request methods negative tests", () => {
    const messageForGetAndCreateProduct = `${METHODS.GET.toUpperCase()}, ${METHODS.HEAD.toUpperCase()}, ${METHODS.POST.toUpperCase()}`;
    const messageForGetAndDeleteProduct = `${METHODS.GET.toUpperCase()}, ${METHODS.HEAD.toUpperCase()}, ${METHODS.PUT.toUpperCase()}, ${METHODS.DELETE.toUpperCase()}`;
    test("Should not list all products when method is not appropriate [PUT]", async ({
        productsApi,
    }) => {
        await productsApi.getProducts({
            methodOverride: METHODS.PUT,
            token: token,
            statusCodeToMatch: STATUS.BAD_METHOD,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
        });
    });

    test("Should not list all products when method is not appropriate [PATCH]", async ({
        productsApi,
    }) => {
        await productsApi.getProducts({
            methodOverride: METHODS.PATCH,
            token: token,
            statusCodeToMatch: STATUS.BAD_METHOD,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
        });
    });

    test("Should not be able to add product when method is not appropriate [PUT]", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            methodOverride: METHODS.PUT,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
        });
    });

    test("Should not be able to add product when method is not appropriate [PATCH]", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            methodOverride: METHODS.PATCH,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,

            statusCodeToMatch: STATUS.BAD_METHOD,
        });
    });

    test("Should not be able to get the product info when method is not appropriate [PATCH]", async ({
        productsApi,
    }) => {
        await productsApi.getProductByIndex({
            methodOverride: METHODS.PATCH,
            token: token,
            statusCodeToMatch: STATUS.BAD_METHOD,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
        });
    });

    test("Should not be able to get the product info when method is not appropriate [POST]", async ({
        productsApi,
    }) => {
        await productsApi.getProductByIndex({
            id: 10,
            methodOverride: METHODS.POST,
            token: token,
            statusCodeToMatch: STATUS.BAD_METHOD,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
        });
    });

    test("Should not be able to update product when method is not appropriate [POST]", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            methodOverride: METHODS.POST,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
            statusCodeToMatch: STATUS.BAD_METHOD,
        });
    });

    test("Should not be able to update product when method is not appropriate [PATCH]", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            methodOverride: METHODS.PATCH,
            statusMessageToMatch: RESPONSE_MESSAGES.METHOD_NOT_ALLOWED,
            statusCodeToMatch: STATUS.BAD_METHOD,
        });
    });
});

test.describe("Positive - with different data types", () => {
    test("Should be able to add product when product name is sent as string with trailing spaces on left", async ({
        productsApi,
    }) => {
        let payload = { ...PRODUCT_PAYLOAD, name: ` ${PRODUCT_PAYLOAD.name}` };
        await productsApi.createProduct({
            token: token,
            statusCodeToMatch: STATUS.OK,
            productPayload: payload,
        });
    });

    test("Should be able to add product when product name is sent as string with trailing spaces on right", async ({
        productsApi,
    }) => {
        let payload = { ...PRODUCT_PAYLOAD, name: `${PRODUCT_PAYLOAD.name}1 ` };
        await productsApi.createProduct({
            token: token,
            statusCodeToMatch: STATUS.OK,
            productPayload: payload,
        });
    });

    test("Should be able to update product when product in stock parameter is sent as string", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            statusCodeToMatch: STATUS.OK,
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: "1",
                name: "LG - TRC123",
            }, // TODO - name becomes undefined whenever this test is run globally with all the tests, needs research
            valueChanged: "1",
        });
    });

    test("Should be able to update product when product name is sent as string with trailing spaces on left, trimming it", async ({
        productsApi,
    }) => {
        let name = ` LG - ${utils.getRandomInt(30)}`;
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[0],
            statusCodeToMatch: STATUS.OK,
            productPayload: { ...PRODUCT_PAYLOAD, name: name },
            valueChanged: name.trim(),
        });
    });

    test("Should be able to update product when product name is sent as string with trailing spaces on right, trimming it", async ({
        productsApi,
    }) => {
        let name = `LG - ${utils.getRandomInt(30)} `;
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[0],
            statusCodeToMatch: STATUS.OK,
            productPayload: { ...PRODUCT_PAYLOAD, name: name },
            valueChanged: name.trim(),
        });
    });

    test("Should be able to get the product info by the id sent", async ({
        productsApi,
    }) => {
        await productsApi.getProductByIndex({ token: token, successful: true });
    });
});

test.describe("Negative cases", () => {
    test("Should not be able update product not in stock when quantity is set", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: false,
                quantity: 2,
                name: `HP - ${utils.getRandomInt()}`,
            },
            id: 11,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
            statusMessageToMatch: RESPONSE_MESSAGES.SET_QUANTITY_NOT_IN_STOCK,
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not be able to update product in stock when there's no quantity", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: true,
                quantity: 0,
                cart_quantity: 0,
                name: `HP - ${utils.getRandomInt()}`,
            },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            id: 11,
            statusMessageToMatch: RESPONSE_MESSAGES.SET_IN_STOCK_NO_QUANTITY,
            statusCodeToMatch: STATUS.BAD_ENTITY,
        });
    });

    test("Should not be able to update product when product price is sent as string", async ({
        productsApi,
    }) => {
        let price = `${utils.getRandomInt(500)}`;
        await productsApi.updateProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, price: price },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[2]
            ),
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[2],
        });
    });

    test("Should not be able to add product when product price is sent as string", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[2]
            ),
            productPayload: { ...PRODUCT_PAYLOAD, price: "123" },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[2],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as more than 1", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: 2 },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as string", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: "2" },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as array with integer data", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: [1] },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as array with float data", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: 1.2 },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as object with integer data type", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: { in_stock: 1 },
            },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    test("Should not be able to add product when product in stock parameter is sent as object with float data type", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: { in_stock: 1.2 },
            },
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        });
    });

    // TODO - should be automatically turn in stock if quantity is set - will need refactoring
    test("Should not be able to add product when product quantity parameter is set but is not in stock", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: 0 },
            statusMessageToMatch: RESPONSE_MESSAGES.SET_QUANTITY_NOT_IN_STOCK,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        });
    });

    test("Should not be able to add product when product quantity parameter is sent as string data type", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, quantity: "12" },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[4]
            ),
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        });
    });

    test("Should not be able to add product when product quantity parameter is sent as float data type", async ({
        productsApi,
    }) => {
        await productsApi.createProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, quantity: 12.12 },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[4]
            ),
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        });
    });

    test("Should not be able to update product when product in stock parameter is not 0 or 1(false or true)", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: 2 },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
        });
    });

    test("Should not be able to update product when product in stock parameter is sent as array with integer data", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: [1] },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
        });
    });

    test("Should not be able to update product when product in stock parameter is sent as array with float data", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: [1.2] },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
        });
    });

    test("Should not be able to update product when product in stock parameter is sent as object with integer data type", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: { in_stock: 1 },
            },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
        });
    });

    test("Should not be able to update product when product in stock parameter is sent as object with float data type", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
            productPayload: {
                ...PRODUCT_PAYLOAD,
                in_stock: { in_stock: 1.2 },
            },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[3]
            ),
        });
    });

    // TODO - will need refactor - if quantity set it should be automatically in stock
    test("Should not be able to update product when product quantity parameter is set but is not in stock", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
            productPayload: { ...PRODUCT_PAYLOAD, in_stock: 0 },
            statusMessageToMatch: RESPONSE_MESSAGES.SET_QUANTITY_NOT_IN_STOCK,
        });
    });

    test("Should not be able to update product when product quantity parameter is sent as string data type", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, quantity: "12" },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[4]
            ),
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        });
    });

    test("Should not be able to update product when product quantity parameter is sent as float data type", async ({
        productsApi,
    }) => {
        await productsApi.updateProduct({
            token: token,
            productPayload: { ...PRODUCT_PAYLOAD, quantity: 1.2 },
            statusMessageToMatch: utils.getMustBeTypeMsg(
                Object.keys(PRODUCT_PAYLOAD)[4]
            ),
            fieldInTest: Object.keys(PRODUCT_PAYLOAD)[4],
        });
    });

    test("Should not be able to get a product that does not exist", async ({
        productsApi,
    }) => {
        await productsApi.getProductByIndex({
            token: token,
            statusCodeToMatch: STATUS.NOT_FOUND,
            id: utils.getRandomInt(),
            statusMessageToMatch: RESPONSE_MESSAGES.ERROR,
        });
    });
});

test(`Should be able to add product when product in stock is true`, async ({
    productsApi,
}) => {
    await productsApi.createProduct({
        token: token,
        productPayload: {
            ...PRODUCT_PAYLOAD,
            in_stock: true,
            name: "LG - T321",
        }, // TODO - if false is set(test below) with name then this is name already been taken
        statusCodeToMatch: STATUS.OK,
    });
});

test(`Should be able to add product when product in stock is false`, async ({
    productsApi,
}) => {
    await productsApi.createProduct({
        token: token,
        productPayload: {
            ...PRODUCT_PAYLOAD,
            in_stock: false,
            quantity: 0,
            cart_quantity: 0,
            name: "LG - F321",
        }, // TODO - name already taken
        statusCodeToMatch: STATUS.OK,
    });
});

test(`Should be able to update product when product in stock is true`, async ({
    productsApi,
}) => {
    await productsApi.updateProduct({
        token: token,
        fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        productPayload: { ...PRODUCT_PAYLOAD, in_stock: true },
        valueChanged: true,
        statusCodeToMatch: STATUS.OK,
    });
});

test(`Should be able to update product when product in stock is false`, async ({
    productsApi,
}) => {
    await productsApi.updateProduct({
        token: token,
        fieldInTest: Object.keys(PRODUCT_PAYLOAD)[3],
        productPayload: {
            ...PRODUCT_PAYLOAD,
            in_stock: false,
            quantity: 0,
        },
        valueChanged: false,
        statusCodeToMatch: STATUS.OK,
    });
});

for (const value in BOOLEAN_VALUES) {
    const { in_stock, ...payloadWithoutInStock } = PRODUCT_PAYLOAD;
    for (const field in payloadWithoutInStock) {
        test(`${counter} - Should not be able to add product when product ${field} is set as boolean value - ${value.toLowerCase()}`, async ({
            productsApi,
        }) => {
            await productsApi.createProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: BOOLEAN_VALUES[value],
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });

        test(`${counter} - Should not be able to update product when product ${field} is set as boolean value - ${value.toLowerCase()}`, async ({
            productsApi,
        }) => {
            await productsApi.updateProduct({
                token: token,
                fieldInTest: field,
                productPayload: {
                    ...PRODUCT_PAYLOAD,
                    [field]: BOOLEAN_VALUES[value],
                },
                statusMessageToMatch: utils.getMustBeTypeMsg(field),
            });
        });
        counter++;
    }
}
