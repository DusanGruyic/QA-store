import { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import {
    useGetCartQuery,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useDeleteCartMutation,
} from "@/redux/api/cartsRTK";
import { useUpdateProductMutation } from "@/redux/api/productsRTK";
import { useState } from "react";

const CheckoutItem = (props) => {
    const [currentCartId] = useState(Number(localStorage.getItem("cartId")));

    const buttonIncrementRef = useRef(null);
    const buttonDecrementRef = useRef(null);

    const { data: fetchedCart, refetch } = useGetCartQuery(currentCartId, {
        refetchOnMountOrArgChange: true,
    });
    const [productUpdate] = useUpdateProductMutation();
    const [cartAdd] = useAddToCartMutation();
    const [cartRemove] = useRemoveFromCartMutation();
    const cartItem = fetchedCart?.find((item) => item.id === props.item.id);
    const handleCartItemIncrement = async () => {
        if (
            buttonIncrementRef.current &&
            !buttonIncrementRef.current.disabled
        ) {
            buttonIncrementRef.current.disabled = true;
            try {
                await cartAdd(
                    { cartId: currentCartId, productId: cartItem.id },
                    cartItem
                );
                const payload = {
                    ...cartItem,
                    quantity: cartItem.quantity - 1,
                };
                await productUpdate({ data: payload, id: cartItem.id });
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
        <div
            className={
                "flex justify-between bg-white border-2 border-gray-200 rounded-lg py-2 my-2 pl-4"
            }
            key={props.index}
        >
            <div className={"flex flex-column justify-between"}>
                <div>
                    <div className="font-semibold underline">
                        {props.item.name}
                    </div>
                    <div>{props.item.pivot.quantity}x</div>
                </div>
                <div>
                    {(props.item.price * props.item.pivot.quantity).toFixed(2)}€
                </div>
            </div>
            {!props.finalize ? (
                <div className="flex flex-column justify-between border-l-2 border-left-indigo-200 mr-2 py-1 px-2">
                    <Button
                        onClick={handleCartItemRemove}
                        className=" w-fit px-1"
                        icon="pi pi-trash"
                    />
                    <Button
                        onClick={handleCartItemDecrement}
                        icon="pi pi-minus"
                        className=" w-fit px-1"
                        ref={buttonDecrementRef}
                    />
                    <Button
                        onClick={() => handleCartItemIncrement()}
                        disabled={!props.item.quantity}
                        icon="pi pi-plus"
                        className="w-fit px-1"
                        ref={buttonIncrementRef}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default CheckoutItem;
