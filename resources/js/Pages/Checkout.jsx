import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "@/Components/Header";
import { Button } from "primereact/button";
import CheckoutItems from "@/Components/Checkout/CheckoutItems";
import Progress from "@/Components/Checkout/Progress";
import Footer from "@/Components/Footer";
import ShippingInfo from "@/Components/Checkout/ShippingInfo";
import { selectActiveStep } from "@/redux/activeStepSlice";
import BillingInfo from "@/Components/Checkout/BillingInfo";
import { useAuth, verifyToken } from "@/Provider/authProvider";
import FinalizePurchase from "@/Components/Checkout/FinalizePurchase";
import { Dialog } from "primereact/dialog";
import { useGetCartQuery } from "@/redux/api/cartsRTK";
import { useGetUsersBillingInfoQuery } from "@/redux/api/usersRTK";

const Checkout = (props) => {
    const { token } = useAuth();
    const [redirectMessage, setRedirectMessage] = useState(false);
    let step = useSelector(selectActiveStep);
    const [activeStep, setActiveStep] = useState(1);
    const [visible, setVisible] = useState(false);

    const { data: cart } = useGetCartQuery(
        Number(localStorage.getItem("cartId"))
    );

    useEffect(() => {
        verifyToken(token);
        if (typeof step !== "number") return;
        setActiveStep(step);
    }, [cart, step]);

    const totalToPay = () => {
        return calcTaxesAndTotal(cart);
    };

    const redirectToDashoard = () => {
        setRedirectMessage("Redirecting to Dashboard page...");
        setTimeout(() => {
            window.location.replace("/dashboard");
        }, 5000);
    };

    const order = async () => {
        try {
            axios.post(
                `api/v1/customers/${localStorage.getItem("userId")}/order`,
                {
                    taxes: Number(totalToPay()[0].toFixed(2)),
                    total: Number(totalToPay()[1].toFixed(2)),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    withCredentials: true,
                }
            );
        } catch (err) {
            console.error(err);
        }

        setVisible(true);
        redirectToDashoard();
    };

    return (
        <>
            <Dialog
                className="text-center"
                header="Order successfully placed"
                visible={visible}
                closable={false}
            >
                <hr />
                <p className="m-0">{redirectMessage}</p>
            </Dialog>
            <div className="fixed w-full">
                <Header auth={props.auth} />
                <Progress activeStep={activeStep} />
            </div>
            <div className="px-8 h-screen border-t-2 bg-gradient-to-br from-white to-gray-300">
                <div>
                    <div className="flex flex-column justify-items-center">
                        {activeStep === 1 ? (
                            <CheckoutItems cart={cart} />
                        ) : activeStep === 2 ? (
                            <ShippingInfo />
                        ) : activeStep === 3 ? (
                            <BillingInfo />
                        ) : (
                            <FinalizePurchase cart={cart} />
                        )}
                    </div>
                </div>
                <div className="flex items-center justify-end fixed right-80 top-40">
                    <div className="bg-white p-4 my-6 rounded-lg shadow-2xl">
                        {activeStep === 1 ? (
                            <>
                                <p>Free of charge: one never pays here.</p>
                                <p className="font-bold">Not with money.</p>
                            </>
                        ) : activeStep === 2 ? (
                            <>
                                <p>
                                    Please, <strong>call me the devil.</strong>
                                </p>
                            </>
                        ) : activeStep === 3 ? (
                            <div>
                                <p>
                                    I was Zuckerberging people before
                                    Zuckerberg's balls dropped.
                                </p>
                            </div>
                        ) : activeStep === 4 ? (
                            <>
                                <Button
                                    onClick={() => order()}
                                    label="Click to order!"
                                    type="button"
                                    className=" text-primary text-2xl text-semibold"
                                />
                            </>
                        ) : null}
                    </div>
                    <div className="w-3 overflow-hidden">
                        <div className="h-4 bg-white rotate-45 transform origin-top-left rounded-sm"></div>
                    </div>
                </div>
                <img
                    src="/images/hero/lucius.png"
                    alt="hero-1"
                    className="ml-auto mr-16 mt-10 block h-4/5 fixed right-24 bottom-2 z-40"
                />
            </div>
            <Footer />
        </>
    );
};

export default Checkout;
