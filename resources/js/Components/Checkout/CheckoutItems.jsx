import { Button } from "primereact/button";
import CheckoutItem from "./CheckoutItem";
import { useDispatch } from "react-redux";
import { setActiveStep } from "@/redux/activeStepSlice";

const CheckoutItems = ({ cart }) => {
    const dispatch = useDispatch();

    const next = () => {
        dispatch(setActiveStep(2));
    };

    return (
        <div className="w-3/6 h-3/5 flex fixed top-48">
            <div className="flex flex-row-reverse border-2 border-gray-200 rounded shadow-2xl">
                <div className="flex flex-column overflow-y-scroll no-scrollbar py-2 px-2">
                    {cart?.map((item, index) => (
                        <CheckoutItem key={index} item={item} />
                    ))}
                </div>
                <div className="flex flex-column justify-center">
                    <p className="block text-primary text-4xl font-bold text-center px-2">
                        Sure you want this?
                    </p>
                    <Button
                        onClick={next}
                        label="Proceed ->"
                        type="button"
                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl  mt-4 text-semibold mr-4 ml-4 border border-indigo-700 rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default CheckoutItems;
