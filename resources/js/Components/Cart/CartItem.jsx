import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useDeleteCartMutation,
} from "@/redux/api/cartsRTK";
import { useUpdateProductMutation } from "@/redux/api/productsRTK";

const CartItem = ({ data }) => {
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );

    const buttonIncrementRef = useRef(null);
    const buttonDecrementRef = useRef(null);

    const { data: fetchedCart, refetch } = useGetCartQuery(currentCartId, {
        refetchOnMountOrArgChange: true,
        skip: !currentCartId,
    });

    const [productUpdate] = useUpdateProductMutation();
    const [cartAdd] = useAddToCartMutation();
    const [cartRemove] = useRemoveFromCartMutation();
    const cartItem = fetchedCart?.find((item) => item.id === data.id);

    const handleCartItemIncrement = async () => {
        if (
            buttonIncrementRef.current &&
            !buttonIncrementRef.current.disabled
        ) {
            buttonIncrementRef.current.disabled = true;
            try {
                await cartAdd(
                    { cartId: currentCartId, productId: data.id },
                    data
                );
                const payload = {
                    ...data,
                    quantity: data.quantity - 1,
                };
                await productUpdate({ data: payload, id: data.id });
                await refetch();
            } catch (err) {
                console.error(err);
            } finally {
                buttonIncrementRef.current.disabled = false;
            }
        }
    };

    const handleCartItemDecrement = async () => {
        if (
            buttonDecrementRef.current &&
            !buttonDecrementRef.current.disabled
        ) {
            buttonDecrementRef.current.disabled = true;
            try {
                if (cartItem.pivot.quantity === 1) {
                    await cartRemove({
                        cartId: currentCartId,
                        productId: cartItem.id,
                    });
                } else {
                    await cartRemove({
                        cartId: currentCartId,
                        productId: cartItem.id,
                    });
                }
                let payload = {
                    ...cartItem,
                    quantity: cartItem.quantity + 1,
                };

                await productUpdate({ data: payload, id: payload.id });
                await refetch();
            } catch (err) {
                console.error("Error while removing item from cart: ", err);
            } finally {
                buttonDecrementRef.current.disabled = false;
            }
        }
    };

    const handleCartItemRemove = async () => {
        try {
            for (let i = 0; i < cartItem.pivot.quantity; i++) {
                await cartRemove({
                    cartId: currentCartId,
                    productId: cartItem.id,
                });
            }
            let payload = {
                ...cartItem,
                quantity: cartItem.quantity + cartItem.pivot.quantity,
            };

            await productUpdate({
                data: payload,
                id: payload.id,
            });
            await refetch();
        } catch (err) {
            console.log("Error while removing item from cart: ", err);
        }
    };

    return (
        <div className="flex justify-between align-items-center my-2 px-1 bg-white rounded border-2 border-indigo-200 relative">
            <Button
                onClick={() => handleCartItemRemove()}
                className="absolute border-2 border-gray-200 bg-gray-400 text-white overflow-visible -left-3 -top-3 w-fit p-px h-6 shadow-none hover:bg-white hover:text-indigo-300"
                icon="pi pi-times"
            />
            <Button
                onClick={() => handleCartItemDecrement()}
                icon="pi pi-minus"
                className="bg-gray-200 text-primary hover:bg-indigo-300 border border-indigo-700 rounded-full w-1 h-5"
                ref={buttonDecrementRef}
            />
            <div className="flex flex-column">
                <div className="my-1 text-center font-bold">
                    {cartItem?.name}
                </div>
                <div className="w-44 ml-4">
                    Price: {cartItem?.price.toFixed(2)}
                </div>
                <div className="w-44 ml-4">
                    Quantity: {cartItem?.pivot?.quantity}
                </div>
            </div>
            <Button
                onClick={() => handleCartItemIncrement()}
                disabled={!cartItem?.quantity}
                icon="pi pi-plus"
                className="bg-gray-200 text-primary hover:bg-indigo-300 border border-indigo-700 rounded-full w-1 h-5"
                ref={buttonIncrementRef}
            />
        </div>
    );
};

export default CartItem;
