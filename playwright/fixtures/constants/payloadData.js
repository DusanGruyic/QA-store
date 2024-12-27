export const LOGIN_PAYLOAD = {
    email: "zarkotest@mail.com",
    password: "Test123",
};

export const REGISTER_PAYLOAD = {
    username: "edi",
    email: "editorta@gmail.com",
    password: "Test123",
};

export const SHIPPING_PAYLOAD = {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com",
    phone_number: "+(387) 555-333",
    country: "USA",
    city: "Chicago",
    postal_code: 12345,
    street_and_number: "Main Street, 345B",
};

export const CUSTOMER_PAYLOAD = {
    username: 'edyUsername',
    first_name: 'Edy',
    last_name: 'Torta',
    date_of_birth: "2005-03-25",
};

export let PRODUCT_PAYLOAD = {
    name: `LG - ${Math.floor(Math.random() * 10000000)}`,
    description: "Monitor 27inch",
    price: 250,
    in_stock: 1,
    quantity: 2,
    cart_quantity: 2,
    rating: 4.5,
};

export const CART_PAYLOAD = {
    id: 1,
    name: "NVIDIA GeForce RTX 3080 Ti",
    description:
        "High-end graphics card with Ampere architecture for smooth gaming at 4K resolution.",
    price: 1199.99,
    in_stock: false,
    quantity: 10,
    cart_quantity: 0,
    category: "GPUs",
    rating: 4.9,
    product_image: {
        id: 1,
        product_id: 1444,
        description: "NVIDIA GeForce RTX 3080 Ti front view",
    },
};

export const BILLING_PAYLOAD = {
    cardholder: "Zarko Djurdjev testic",
    card_type: "master-card",
    card_number: "123456789123",
    cvv: 504,
    card_expiration_date: "07/25",
};

export default {
    LOGIN_PAYLOAD,
    REGISTER_PAYLOAD,
    PRODUCT_PAYLOAD,
    SHIPPING_PAYLOAD,
    CUSTOMER_PAYLOAD,
    BILLING_PAYLOAD,
    CART_PAYLOAD,
};
