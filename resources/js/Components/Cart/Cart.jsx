import { useEffect, useState } from "react";
import { router } from "@inertiajs/react";
import { Button } from "primereact/button";
import CartItem from "./CartItem";
import NoItems from "./NoItems";
import {
    useGetCartQuery,
    useRemoveFromCartMutation,
} from "@/redux/api/cartsRTK";
import "./cart.css";
import { useUpdateProductMutation } from "@/redux/api/productsRTK";

const Cart = (props) => {
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );
    const [clearingCart, setClearingCart] = useState(false);

    const { data: cart, refetch } = useGetCartQuery(currentCartId, {
        refetchOnMountOrArgChange: true,
        skip: !currentCartId,
    });
    const [cartRemove] = useRemoveFromCartMutation();
    const [productUpdate] = useUpdateProductMutation();

    const handleClearCart = async () => {
        try {
            for (let i = 0; i < cart.length; i++) {
                setClearingCart(true);
                for (let j = 0; j < cart[i].pivot.quantity; j++) {
                    await cartRemove({
                        cartId: cart[i].pivot.cart_id,
                        productId: cart[i].pivot.product_id,
                    });

                    let payload = {
                        ...cart[i],
                        quantity: cart[i].quantity + cart[i].pivot.quantity,
                    };

                    await productUpdate({
                        data: payload,
                        id: payload.id,
                    });
                }
            }
            await refetch();
        } catch (err) {
            console.error("Error while deleting cart: ", err);
        } finally {
            setClearingCart(false);
        }
    };

    const calculateTotal = () => {
        let total = 0;
        for (let i = 0; i < cart?.length; i++) {
            total +=
                parseFloat(cart[i].price).toFixed(2) * cart[i].pivot.quantity;
        }

        return total || 0;
    };

    useEffect(() => {
        let storedCartId = Number(localStorage.getItem("cartId"));
        if (!storedCartId) {
            storedCartId = Number(localStorage.getItem("userId"));
            localStorage.setItem("cartId", storedCartId);
        }
        setCurrentCartId(storedCartId);
        calculateTotal();
    }, [currentCartId]);

    const className = props.isOpen ? "sidebar open" : "sidebar";

    return (
        <div className={`${className} flex flex-column fixed z-50 w-80`}>
            <section className="h-fit w-full text-center relative">
                {cart?.length ? (
                    <>
                        <span className="block text-primary text-2xl font-bold mb-4 my-4">
                            Your stuff
                        </span>
                        <Button
                            onClick={() => handleClearCart()}
                            className="absolute border-2 border-gray-200 bg-indigo-400 text-white overflow-visible -right-0 -top-0 w-fit px-2 h-fit shadow-none hover:bg-white hover:text-indigo-300"
                            icon="pi pi-trash"
                            disabled={clearingCart}
                        >
                            {clearingCart ? (
                                <div className="ml-2 h-fit">Clearing...</div>
                            ) : (
                                <span className="ml-2">Clear</span>
                            )}
                        </Button>
                    </>
                ) : null}
            </section>
            <section className="text-center mb-4 overflow-y-scroll no-scrollbar h-2/5">
                <div className="px-2 flex flex-column-reverse">
                    {!cart?.length ? (
                        <NoItems />
                    ) : (
                        cart?.map((item, index) => (
                            <CartItem key={index} data={item} />
                        ))
                    )}
                </div>
            </section>
            <section className="sticky bottom-0 bg-gray-200 border-t-4 border-gray-100">
                <div className="flex flex-column align-items-center mt-4">
                    <div className="font-bold">
                        Total: {calculateTotal().toFixed(2)}€
                    </div>
                    <Button
                        onClick={() => router.visit("/checkout")}
                        disabled={!cart?.length}
                        label="Checkout"
                        type="button"
                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mb-4 mt-6 text-semibold px-8 border border-indigo-700 rounded"
                    />
                </div>
            </section>
        </div>
    );
};

export default Cart;
