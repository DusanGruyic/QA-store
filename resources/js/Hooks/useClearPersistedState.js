// useSessionReset.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useResetCartStateMutation } from "@/redux/api/cartsRTK";
import { persistor } from "@/redux/store"; // Import the persistor

const useSessionReset = () => {
    const dispatch = useDispatch();
    const [resetCartState] = useResetCartStateMutation();

    useEffect(() => {
        const handleBeforeUnload = () => {
            resetCartState();
            persistor.purge(); // Clear persisted state
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dispatch, resetCartState]);
};

export default useSessionReset;
