import React, { useContext, useMemo, useEffect, useState } from "react";
import { LayoutContext } from "@/Layouts/layout/context/layoutcontext.jsx";
import { Link, Head } from "@inertiajs/react";
import { useAuth } from "@/Provider/authProvider";
import Dropdown from "@/Components/Dropdown";
import CartIcon from "./Icons/CartIcon";
import HamburgerMenuIcon from "./Icons/HamburgerMenuIcon";
import { Badge } from "primereact/badge";
import {
    cartApi,
    useDeleteCartMutation,
    useGetCartQuery,
    useRemoveFromCartMutation,
} from "@/redux/api/cartsRTK";
// import { getTotalCartQuantity } from "@/Shared/utils";
import { useDispatch } from "react-redux";
import { logoutAndPurge } from "@/redux/authSlice";
import { jwtDecode } from "jwt-decode";
import { useUpdateProductMutation } from "@/redux/api/productsRTK";

const Header = (props) => {
    const [cartQuantity, setCartQuantity] = useState(0);
    const [cart, setCart] = useState([]);
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );
    const { data: fetchedCart } = useGetCartQuery(currentCartId, {
        refetchOnMountOrArgChange: true,
        skip: !currentCartId,
    });
    const [cartRemove] = useRemoveFromCartMutation();
    const [productUpdate] = useUpdateProductMutation();

    const dispatch = useDispatch();
    const { layoutConfig } = useContext(LayoutContext);
    const { token } = useAuth();

    const logoutUser = async () => {
        try {
            for (let i = 0; i < cart.length; i++) {
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
        } catch (err) {
            console.error("Error while deleting cart: ", err);
        } finally {
            window.localStorage.clear();
            dispatch(logoutAndPurge);
            window.location.replace("/");
        }
    };

    useEffect(() => {
        if (fetchedCart) {
            console.log("fetch");
            setCart(fetchedCart);
            setCartQuantity(
                fetchedCart.reduce(
                    (total, item) => total + item.pivot.quantity,
                    0
                )
            );
        }
    }, [fetchedCart]);

    return (
        <div className="max-w-full sticky z-10 top-0 overscroll-none">
            <div className="text-m bg-gray-300 border-2 flex justify-between align-items-center">
                <div className="flex flex-row h-full w-fit align-items-center">
                    <a href="/">
                        <img
                            src={`/images/logo/-${
                                layoutConfig.colorScheme !== "light"
                                    ? "dark"
                                    : "white"
                            }.png`}
                            alt="logo"
                            className="md:ml-4 sm:ml-2 h-14 w-14 pt-1 pb-1"
                        />
                    </a>
                    <div className="ml-4">
                        <Link
                            href={route("dashboard")}
                            className="md:ml-4 md:text-xl sm:text-lg bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white py-1 sm:w-12 px-4 border border-indigo-700 rounded semibold"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
                <div>
                    {token && jwtDecode(token) ? (
                        <>
                            <div className="sm:flex sm:items-center sm:ml-6">
                                <div className="ml-3">
                                    <div className="flex w-32 h-12 align-items-center">
                                        <span className="inline-flex rounded-md">
                                            <button
                                                onClick={props.toggleSidebar}
                                                type="button"
                                                className="inline-flex items-center py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary hover:text-gray-600 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                <CartIcon />
                                                {cartQuantity ?? (
                                                    <Badge className="mb-4 " />
                                                )}
                                            </button>
                                        </span>
                                        <Dropdown className="-z-50">
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary hover:text-gray-600 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        <HamburgerMenuIcon />
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route("profile")}
                                                >
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route(
                                                        "order-history"
                                                    )}
                                                >
                                                    Order History
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    onClick={logoutUser}
                                                    as="button"
                                                >
                                                    {" "}
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="mr-2">
                            <Link
                                href={route("register")}
                                className="md:ml-4 md:text-xl sm:text-lg bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white mr-1 py-1 sm:w-12 px-4 border border-indigo-700 rounded"
                            >
                                Register
                            </Link>
                            <Link
                                href={route("login")}
                                className="md:ml-4 md:text-xl sm:text-lg bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white mr-1 py-1 sm:w-12 px-4 border border-indigo-700 rounded"
                                id={"loginBtn"}
                            >
                                Log in
                            </Link>
                        </div>
                    )}
                </div>
            </div>
            <Head title="QA Store" />
        </div>
    );
};

export default Header;
