// useSessionReset.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useResetCartStateMutation } from "@/redux/api/cartsRTK"; // Adjust the import based on your file structure
import { persistor } from "@/redux/store"; // Import the persistor

const useSessionReset = () => {
    const dispatch = useDispatch();
    const [resetCartState] = useResetCartStateMutation(); // Use the reset mutation

    useEffect(() => {
        const handleBeforeUnload = () => {
            console.log("Resetting cart state...");
            resetCartState(); // Call the reset mutation
            persistor.purge(); // Clear persisted state
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [dispatch, resetCartState]);
};

export default useSessionReset;
