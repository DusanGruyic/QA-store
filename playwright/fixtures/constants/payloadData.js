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
    username: process.env.TEST_CUSTOMER_USERNAME,
    first_name: process.env.TEST_CUSTOMER_FIRST_NAME,
    last_name: process.env.TEST_CUSTOMER_LAST_NAME,
    date_of_birth: process.env.TEST_CUSTOMER_DATE_OF_BIRTH,
};

export const PRODUCT_PAYLOAD = {
    name: `LG - ${Math.floor(Math.random() * 10000000)}`,
    description: "Monitor 27inch",
    price: 250,
    in_stock: 1,
    quantity: 2,
    cart_quantity: 2,
    rating: 4.5,
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
};
