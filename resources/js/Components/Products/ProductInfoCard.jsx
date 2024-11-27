import { useState, useRef } from "react";
import { useAddToCartMutation, useGetCartQuery } from "@/redux/api/cartsRTK";
import {
    useUpdateProductMutation,
    useGetProductQuery,
} from "@/redux/api/productsRTK";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import Rating from "./Ratings/Rating";
import Spinner from "../Spinner";
import debounce from "debounce";
import { toast } from "react-toastify";

export default function ProductInfoCard({ productId }) {
    const defaultImage = "/images/products/default-product.png";
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );
    const [visible, setVisible] = useState(false);
    const {
        data: product,
        isFetching,
        isLoading,
    } = useGetProductQuery(productId, {
        refetchOnMountOrArgChange: true,
    });

    const { refetch } = useGetCartQuery(currentCartId, {
        skip: !currentCartId,
    });
    const [cartAdd] = useAddToCartMutation();
    const [productUpdate] = useUpdateProductMutation();

    const buttonRef = useRef(null);

    const handleCartAdd = async () => {
        if (buttonRef.current && !buttonRef.current.disabled) {
            buttonRef.current.disabled = true;
            try {
                await cartAdd(
                    { cartId: currentCartId, productId: product.id },
                    product
                );
                const payload = {
                    ...product,
                    quantity: product.quantity - 1,
                };
                await productUpdate({ data: payload, id: product.id });
                await refetch();
            } catch (err) {
                console.error(err);
            } finally {
                toast.success("Product added successfully!");
                buttonRef.current.disabled = false;
            }
        }
    };

    return isLoading && isFetching ? (
        <Spinner />
    ) : (
        <div
            className="border-2 bg-white border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 w-40 h-72 ml-4 flex flex-col"
            test-id="product-card"
        >
            <Dialog
                className="text-center"
                header={`${product.name}`}
                visible={visible}
                onHide={() => setVisible(false)}
                draggable={false}
            >
                <hr />
                <div className="flex justify-center items-center mb-4">
                    <img
                        src={product.product_image?.src || defaultImage}
                        className="max-w-full max-h-48 py-4"
                    />
                </div>
                <p className="m-0">{product.description}</p>
            </Dialog>
            <div className="flex-1 overflow-y-auto">
                <a href="#">
                    <h5 className="text-md line-clamp-2 tracking-tight text-gray-600 dark:text-white text-center pt-1 ">
                        {product.name} {"\n"}
                    </h5>
                    <Rating
                        rating={`${parseFloat(product.rating).toFixed(1)}`}
                    />
                    <img
                        onClick={() => setVisible(true)}
                        className="px-2 py-2 lg:w-[220px] lg:h-[120px] md:w-[190px] md:h-[90px]"
                        src={product.product_image?.src || defaultImage}
                        alt="product image"
                    />
                </a>
                <p className="text-sm text-gray-600 text-ellipsis line-clamp-3 px-1 py-1">
                    {product.description}
                </p>
            </div>
            <div className="flex justify-between px-3 py-1 border-t-2 border-t-gray-300 bg-gray-100">
                <span className="font-semibold">{`${parseFloat(
                    product.price
                ).toFixed(2)}€`}</span>
                <Button
                    onClick={debounce(() => handleCartAdd(), 600)}
                    disabled={!product?.quantity}
                    tooltip={product?.quantity ? null : "Out of stock"}
                    tooltipOptions={{ showOnDisabled: true }}
                    ref={buttonRef}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-fit hover:fill-indigo-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                        />
                    </svg>
                </Button>
            </div>
        </div>
    );
}
