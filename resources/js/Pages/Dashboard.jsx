import React, { useEffect, useState } from "react";
import { useAuth, verifyToken } from "@/Provider/authProvider";
import AppSidebar from "@/Layouts/layout/AppSidebar";
import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import Iframe from "@/Components/Iframe";
import Deals from "./Deals";
import Products from "@/Components/Products/Products";
import Paginated from "@/Components/Paginated";
import Cart from "@/Components/Cart/Cart";
import { useGetProductsQuery } from "@/redux/api/productsRTK";
import Spinner from "@/Components/Spinner";
import { ToastContainer } from "react-toastify";

export default function Dashboard() {
    const [currentCartId, setCurrentCartId] = useState(
        Number(localStorage.getItem("cartId"))
    );
    const { token } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const {
        data: products,
        isLoading,
        isFetching,
    } = useGetProductsQuery({
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        verifyToken(token);
    }, [token, isLoading, isFetching]);

    useEffect(() => {
        let storedCartId = Number(localStorage.getItem("cartId"));
        if (!storedCartId) {
            storedCartId = Number(localStorage.getItem("userId"));
            localStorage.setItem("cartId", storedCartId);
        }

        setCurrentCartId(storedCartId);
    }, []);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    const currentProducts =
        products && products.slice(indexOfFirstProduct, indexOfLastProduct);
    const handlePagination = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const [sidebarOpen, setSideBarOpen] = useState(false);
    const handleViewSidebar = () => {
        setSideBarOpen(!sidebarOpen);
    };

    return (
        <div className="w-screen h-max lg:h-screen">
            <Header toggleSidebar={handleViewSidebar} />
            {isLoading && isFetching ? (
                <Spinner />
            ) : (
                <div className="px-8 h-fit border-t-2 bg-gradient-to-br from-white to-gray-300 z-0">
                    <div className="flex justify-center w-full">
                        <section className="text-left mb-4">
                            <span className="block text-primary text-5xl font-semibold mb-4 mt-4">
                                Buy some stuff bruh
                            </span>
                        </section>
                    </div>
                    <div className="flex justify-between">
                        <AppSidebar />
                        <div className="flex flex-column">
                            <div className="flex flex-column align-middle">
                                <Iframe>
                                    <Deals products={products} />
                                </Iframe>
                                <Products data={currentProducts} />
                            </div>
                        </div>
                    </div>
                    <Paginated
                        length={products?.length ?? 0}
                        currentPage={currentPage}
                        productsPerPage={productsPerPage}
                        handlePagination={handlePagination}
                    />
                    <Cart
                        isOpen={sidebarOpen}
                        toggleSidebar={handleViewSidebar}
                    />
                </div>
            )}
            <ToastContainer
                position="bottom-center"
                autoClose={1000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition:Bounce
                limit={3}
            />
            <Footer />
        </div>
    );
}
