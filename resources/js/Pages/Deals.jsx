import { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { LayoutProvider } from "@/Layouts/layout/context/layoutcontext";

export default function Deals({ products }) {
    const [deals, setDeals] = useState([]);

    useEffect(() => {
        let deals = [];

        products?.forEach((product) => {
            if (parseFloat(product.price) < 200) {
                deals.push(product);
            }
        });
        setDeals(deals);
    }, [products]);

    const getPrices = (deal) => {
        let price = parseFloat(deal.price).toFixed(2),
            discountPrice = parseFloat(price * 0.33).toFixed(2),
            gigatronPrice = parseFloat(price + discountPrice).toFixed(2);

        return (
            <>
                <span
                    style={iframeStyles.originalPrice}
                >{`${gigatronPrice}€`}</span>{" "}
                <p style={iframeStyles.discountPrice}>{`${discountPrice}€`}</p>
            </>
        );
    };

    return (
        <>
            <PrimeReactProvider>
                <LayoutProvider />
                <div style={iframeStyles.container}>
                    <h4 style={iframeStyles.heading}>Today deals:</h4>
                    {deals.map((deal, index) => (
                        <li key={index}>
                            <div style={iframeStyles.dealContainer}>
                                <span>{deal.name}</span>
                                <span>{getPrices(deal)}</span>
                            </div>
                        </li>
                    ))}
                </div>
            </PrimeReactProvider>
        </>
    );
}

const iframeStyles = {
    container: {
        marginTop: "-24px",
        textAlign: "center",
        color: "#4b5563",
        fontFamily: "sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    dealContainer: {
        borderStyle: "solid",
        borderRadius: "10px",
        borderColor: "#c7d2fe",
        borderWidth: "2px",
        marginBottom: "10px",
        width: "560px",
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        paddingTop: "1rem",
    },
    discountPrice: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#6366f1",
    },
    heading: {
        fontSize: "28px",
    },
    originalPrice: {
        textDecoration: "line-through",
        marginTop: "-14px",
    },
};
