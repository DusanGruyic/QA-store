import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RESET_APP_STATE } from "./redux/actionTypes";
import { useRemoveFromCartMutation } from "./redux/api/cartsRTK";
import { useUpdateProductMutation } from "./redux/api/productsRTK";

const AppWrapper = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            dispatch({ type: RESET_APP_STATE });
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dispatch]);

    return <>{children}</>;
};

export default AppWrapper;
