import { useGetCartQuery } from "@/redux/api/cartsRTK";

export const getTotalCartQuantity = (cartId) => {
    const { data: cart, refetch } = useGetCartQuery(cartId);

    let quantity = 0;
    if (!cart) {
        return quantity;
    }

    cart.map((item) => {
        quantity += item.pivot.quantity;
    });

    try {
        //refetch();
    } catch (err) {
        console.error("Error while refetching cart: ", err);
    }
    return quantity;
};

export const getMonths = () => {
    let months = [];

    for (let i = 1; i <= 12; i++) {
        i < 10 ? months.push(`0${i}`) : months.push(`${i}`);
    }

    return months;
};

export const getYears = () => {
    let years = [];

    for (let i = 2024; i <= 2032; i++) {
        years.push(`${i}`);
    }

    return years;
};
