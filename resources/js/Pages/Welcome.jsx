import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Spinner from "@/Components/Spinner";
import Cart from "@/Components/Cart/Cart";

export default function Welcome({ auth }) {
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );

    const [redirectMessage, setRedirectMessage] = useState(false);
    const redirectToRegister = () => {
        setRedirectMessage("Redirecting to Register page...");
        setTimeout(() => {
            window.location.replace("/register");
        }, 1000);
    };

    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    };

    // useEffect(() => {
    //     localStorage.setItem("cartId", null);
    // }, [redirectMessage]);
    useEffect(() => {
        let storedCartId = Number(localStorage.getItem("cartId"));
        if (!storedCartId) {
            storedCartId = Number(localStorage.getItem("userId"));
            localStorage.setItem("cartId", storedCartId);
        }

        setCurrentCartId(storedCartId);
    }, []);

    return (
        <div className="max-w-full h-max">
            <Header auth={auth} toggleSidebar={handleViewSidebar} />
            {redirectMessage ? (
                <Spinner />
            ) : (
                <div className="flex md:px-8 border-t-2 bg-gradient-to-br from-gray-300 to-white w-full lg:h-screen">
                    <div className="col-12 md:t-4 sm:t-2 md:col-6 p-6">
                        <section className="text-left mb-4">
                            <span className="text-5xl font-bold">
                                AQA eShop
                            </span>
                            <div className="text-xl text-primary">
                                ...test your automation skills
                            </div>
                        </section>
                        <section>
                            <div className="md:col-12 sm:col-14 p-2 md:text-left pl-1">
                                <div className="md:text-l sm:text-sm text-gray-600 mb-2">
                                    Welcome to Automaticity - where precision
                                    meets perfection in the world of online
                                    shopping and automated QA! Step into our
                                    virtual realm and experience the magic of
                                    effortless automation as you browse through
                                    our curated selection of top-quality
                                    merchandise.
                                </div>
                                <div className="flex md:text-l sm:text-sm text-gray-600 mb-4">
                                    At Automaticity, we're dedicated to
                                    providing a smooth and seamless shopping
                                    experience, ensuring that every click and
                                    scroll is met with reliability and precision
                                    🧪
                                </div>
                                <div className="md:text-l sm:text-sm text-gray-600 mt-16">
                                    Let Automaticity be your trusted companion
                                    in the digital realm, where automation is
                                    key, and customer satisfaction is our top
                                    priority.
                                </div>
                                <div className="flex align-items-center md:mt-6 sm:mt-8 pl-4 mt-12">
                                    <Button
                                        label="Sign up"
                                        type="button"
                                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white mr-2 py-2 sm:w-12 px-4 border border-indigo-700 rounded"
                                        onClick={() => redirectToRegister()}
                                    />
                                    <span className="text-xl ml-4 text-gray-600">
                                        and start using our app!
                                    </span>
                                </div>
                            </div>
                        </section>
                    </div>
                    <div className="md:col-6 z-50">
                        <img
                            src="/images/hero/gearhead.png"
                            alt="hero-1"
                            className="md:ml-auto sm:mr-8 h-full"
                        />
                    </div>
                    <Cart
                        isOpen={sidebarOpen}
                        toggleSidebar={handleViewSidebar}
                    />
                </div>
            )}
            <Footer className="w-screen" />
        </div>
    );
}
