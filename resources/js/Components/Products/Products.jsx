import ProductInfoCard from "@/Components/Products/ProductInfoCard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = ({ data, onCartUpdate }) => {
    return (
        <div
            className="w-4/5 justify-end mr-12 z-0 products-container"
            test-id="products-container"
        >
            <div className="flex flex-row-reverse flex-wrap basis-3">
                {data?.map((product, index) => (
                    <div
                        key={index}
                        className="flex flex-row-reverse"
                        test-data="product-container"
                    >
                        <ProductInfoCard
                            inStock={product.quantity}
                            productId={product.id}
                            key={index}
                            className="w-fit"
                            onCartUpdate={onCartUpdate}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;
