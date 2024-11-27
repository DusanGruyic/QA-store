import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import {
    useGetUsersBillingInfoQuery,
    useGetUsersShippingInfoQuery,
} from "@/redux/api/usersRTK";

const FinalizePurchase = ({ cart }) => {
    const {
        data: billingInfo,
        refetch: refetchBillingInfo,
        isLoading: billingInfoLoading,
    } = useGetUsersBillingInfoQuery(localStorage.getItem("userId"));
    const {
        data: shippingInfo,
        refetch: refetchShippingInfo,
        isLoading: shippingInfoLoading,
    } = useGetUsersShippingInfoQuery(localStorage.getItem("userId"));

    const [billingInfoData, setBillingInfoData] = useState();
    const [shippingInfoData, setShippingInfoData] = useState();

    useEffect(() => {
        refetchBillingInfo();
        refetchShippingInfo();
        if (!billingInfoLoading) {
            setBillingInfoData(billingInfo?.billing_info);
        }
        if (!shippingInfoLoading) {
            setShippingInfoData(shippingInfo.shipping_info);
        }
    }, [shippingInfo, billingInfo]);

    const calculateTotal = () => {
        let total = 0;
        for (let i = 0; i < cart?.length; i++) {
            total +=
                parseFloat(cart[i].price).toFixed(2) * cart[i].pivot.quantity;
        }

        return total || 0;
    };

    return (
        <div className="flex mt-48">
            <form className="ml-12">
                <p className="text-center text-xl text-primary font-semibold">
                    Shipping Information
                </p>
                <div className="w-80">
                    <div className="mb-1">
                        <label htmlFor="first_name" className="text-400">
                            First name
                        </label>
                        <InputText
                            disabled
                            id="first_name"
                            type="first_name"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.first_name}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="last_name" className="text-400">
                            Last name
                        </label>
                        <InputText
                            disabled
                            type="last_name"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.last_name}
                        />
                    </div>

                    <div className="mb-1">
                        <label htmlFor="email" className="text-400">
                            Email
                        </label>
                        <InputText
                            disabled
                            type="email_address"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.email}
                        />
                    </div>

                    <div className="mb-1">
                        <label htmlFor="phone_number" className="text-400">
                            Phone
                        </label>
                        <InputText
                            disabled
                            type="phone_number"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.phone_number}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="street_and_number" className="text-400">
                            Street and Number
                        </label>
                        <InputText
                            disabled
                            type="street_and_number"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.street_and_number}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="city" className="text-400">
                            City
                        </label>
                        <InputText
                            disabled
                            type="city"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.city}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="postal_code" className="text-400">
                            Postal code
                        </label>
                        <InputText
                            disabled
                            type="postal_code"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.postal_code}
                        />
                    </div>
                    <div className="mb-1">
                        <label htmlFor="country" className="text-400">
                            Country
                        </label>
                        <InputText
                            disabled
                            type="country"
                            placeholder="..."
                            className="w-full rounded pl-[14px]"
                            value={shippingInfoData?.country}
                        />
                    </div>
                </div>
            </form>
            <div>
                <form className="ml-16">
                    <div className="w-60">
                        <p className="text-center text-xl text-primary font-semibold">
                            Billing Information
                        </p>
                        <div className="mb-2">
                            <label htmlFor="cardholder" className="text-400">
                                Cardholder
                            </label>
                            <InputText
                                disabled
                                id="cardholder"
                                type="cardholder"
                                placeholder="..."
                                className="w-full rounded pl-[14px]"
                                value={billingInfoData?.cardholder}
                            />
                        </div>
                        <div className="mb-2">
                            <div className="flex flex-row justify-content-middle align-items-center">
                                <label
                                    htmlFor="card_type"
                                    className="text-400 w-6"
                                >
                                    Card Type
                                </label>
                                <InputText
                                    disabled
                                    type="card_type"
                                    value={billingInfoData?.card_type}
                                    placeholder="Select Card type"
                                    className="w-10 h-8 text-center mt-2"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label htmlFor="card_number" className="text-400">
                                Card number
                            </label>
                            <InputText
                                disabled
                                type="card_number"
                                placeholder="****-****-****-****"
                                className="w-full rounded pl-[14px]"
                                value={billingInfoData?.card_number}
                            />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="cvv" className="text-400">
                                CVV
                            </label>
                            <InputText
                                disabled
                                type="cvv"
                                placeholder="***"
                                className="w-full rounded pl-[14px]"
                                value={billingInfoData?.cvv}
                            />
                        </div>
                        <div className="mb-2 mt-3">
                            <div className="flex flex-row justify-content-middle h-8 align-items-center">
                                <label
                                    htmlFor="card_expiration_date"
                                    className="text-400 "
                                >
                                    Expiration Date
                                </label>
                                <InputText
                                    disabled
                                    type="expiration_month"
                                    value={
                                        billingInfoData?.card_expiration_date.split(
                                            "/"
                                        )[0]
                                    }
                                    placeholder="Month"
                                    className="w-full rounded pl-[14px] ml-2"
                                />
                                <InputText
                                    disabled
                                    type="expiration_year"
                                    value={`20${
                                        billingInfoData?.card_expiration_date.split(
                                            "/"
                                        )[1]
                                    }`}
                                    placeholder="Year"
                                    className="w-full rounded pl-[14px] ml-2"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex">
                        <div className="flex flex-column border-2 border-gray-300 shadow-2xl rounded overflow-y-scroll no-scrollbar h-48 mt-4 mr-4 pl-4 w-2/3 z-50">
                            <p className="text-left text-xl text-primary font-semibold">
                                Your stuff
                            </p>
                            {cart.map((item, index) => (
                                <div className="h-8">
                                    <span>
                                        <strong>{item.name}</strong> -{" "}
                                    </span>
                                    <span>{item.price} - </span>
                                    <span>
                                        <small>{item.pivot.quantity}x</small>
                                    </span>
                                    <hr />
                                </div>
                            ))}
                        </div>
                        <div className="z-50 h-fit w-fit bg-white rounded mt-4 ml-10">
                            <div className="flex flex-column text-xl text-primary font-bold align-items-center w-fit h-fit p-2">
                                To pay:{" "}
                                <span className="text-500 text-xs">
                                    (with taxes)
                                </span>
                                <div className="bg-white rounded px-4 py-1 mt-2 mx-2 border-2 border-gray-200">
                                    Total: {calculateTotal().toFixed(2)}€
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FinalizePurchase;
