import Header from "@/Components/Header";
import Footer from "@/Components/Footer";
import { useDispatch } from "react-redux";
import { setActiveStep } from "@/redux/activeStepSlice";
import React, { useEffect, useState } from "react";
import axios from "@/Api/axios";
import InputError from "@/Components/InputError";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getMonths, getYears } from "@/Shared/utils";
import {
    useGetUsersBillingInfoQuery,
    useGetUsersShippingInfoQuery,
} from "@/redux/api/usersRTK";
import { Formik, Form, Field } from "formik";

export default function Profile() {
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);

    // Fetch Billing Info
    const { data: billingData, isLoading: isBillingLoading } =
        useGetUsersBillingInfoQuery(localStorage.getItem("userId"), {
            refetchOnMountOrArgChange: true,
        });
    // Fetch Shipping Info
    const { data: shippingData, isLoading: isShippingLoading } =
        useGetUsersShippingInfoQuery(localStorage.getItem("userId"), {
            refetchOnMountOrArgChange: true,
        });

    // Card types and expiration options
    const cardTypes = [
        "Visa",
        "MasterCard",
        "American Express",
        "Discover",
        "JCB",
    ];
    const months = getMonths();
    const years = getYears();

    const initialValues = {
        // Billing Info
        cardholder: billingData?.billing_info?.cardholder || "",
        card_type: billingData?.billing_info?.card_type || "",
        card_number: billingData?.billing_info?.card_number || "",
        cvv: billingData?.billing_info?.cvv || "",
        card_expiration_month:
            billingData?.billing_info?.card_expiration_date.split("/")[0] || "",
        card_expiration_year:
            `20${
                billingData?.billing_info?.card_expiration_date.split("/")[1]
            }` || "",

        // Shipping Info
        first_name: shippingData?.shipping_info?.first_name || "",
        last_name: shippingData?.shipping_info?.last_name || "",
        email: shippingData?.shipping_info?.email || "",
        phone_number: shippingData?.shipping_info?.phone_number || "",
        street_and_number: shippingData?.shipping_info?.street_and_number || "",
        city: shippingData?.shipping_info?.city || "",
        postal_code: shippingData?.shipping_info?.postal_code || "",
        country: shippingData?.shipping_info?.country || "",
    };

    const submit = async (values) => {
        try {
            const billingPayload = {
                ...values,
                card_expiration_date:
                    values.card_expiration_month && values.card_expiration_year
                        ? `${
                              values.card_expiration_month
                          }/${values.card_expiration_year.replace("20", "")}`
                        : undefined,
            };

            await axios.put(
                `api/v1/customers/${localStorage.getItem(
                    "userId"
                )}/billing-info`,
                billingPayload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            const shippingPayload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: values.email,
                phone_number: values.phone_number,
                street_and_number: values.street_and_number,
                city: values.city,
                postal_code: values.postal_code,
                country: values.country,
            };

            await axios.put(
                `api/v1/customers/${localStorage.getItem(
                    "userId"
                )}/shipping-info`,
                shippingPayload,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            dispatch(setActiveStep(4));
        } catch (err) {
            console.error("Error submitting form:", err);
        }
    };

    return (
        <div className="fixed w-full">
            <Header />
            <div className="px-8 h-screen overflow-y-auto border-t-2 bg-gradient-to-br from-white to-gray-300">
                <div className="flex h-full w-full">
                    {/* Billing Info Section */}
                    <div className="flex border-2 border-gray-200 rounded shadow-2xl w-1/3 mx-4 p-4 h-fit my-4">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={submit}
                            enableReinitialize
                        >
                            {({ handleChange, values }) => (
                                <Form>
                                    <h2 className="text-2xl font-bold text-primary">
                                        Billing Information
                                    </h2>
                                    {[
                                        "cardholder",
                                        "card_type",
                                        "card_number",
                                        "cvv",
                                    ].map((field) => (
                                        <div className="mb-2" key={field}>
                                            <label
                                                htmlFor={field}
                                                className="text-400"
                                            >
                                                {field
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (char) =>
                                                        char.toUpperCase()
                                                    )}
                                            </label>
                                            {field === "card_type" ? (
                                                <Field
                                                    as={Dropdown}
                                                    id={field}
                                                    value={values[field]}
                                                    options={cardTypes}
                                                    onChange={(e) =>
                                                        handleChange({
                                                            target: {
                                                                name: field,
                                                                value: e.value,
                                                            },
                                                        })
                                                    }
                                                    placeholder="Select Card type"
                                                    className="w-full text-center mt-2 border-1 border-gray-500"
                                                />
                                            ) : (
                                                <Field
                                                    as={InputText}
                                                    id={field}
                                                    name={field}
                                                    value={values[field]}
                                                    placeholder={
                                                        field === "card_number"
                                                            ? "****-****-****-****"
                                                            : field === "cvv"
                                                            ? "***"
                                                            : ""
                                                    }
                                                    className="w-full rounded pl-[14px] mt-1"
                                                    onChange={handleChange}
                                                />
                                            )}
                                            <InputError message={null} />
                                        </div>
                                    ))}
                                    <div className="mb-2">
                                        <label
                                            htmlFor="card_expiration_date"
                                            className="text-400"
                                        >
                                            Expiration Date
                                        </label>
                                        <div className="flex">
                                            <Field
                                                as={Dropdown}
                                                id="card_expiration_month"
                                                value={
                                                    values.card_expiration_month
                                                }
                                                options={months}
                                                onChange={(e) =>
                                                    handleChange({
                                                        target: {
                                                            name: "card_expiration_month",
                                                            value: e.value,
                                                        },
                                                    })
                                                }
                                                placeholder="Month"
                                                className="w-fit border-1 border-gray-500"
                                            />
                                            <Field
                                                as={Dropdown}
                                                id="card_expiration_year"
                                                value={
                                                    values.card_expiration_year
                                                }
                                                options={years}
                                                onChange={(e) =>
                                                    handleChange({
                                                        target: {
                                                            name: "card_expiration_year",
                                                            value: e.value,
                                                        },
                                                    })
                                                }
                                                placeholder="Year"
                                                className="w-fit ml-4 border-1 border-gray-500"
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        label="Update"
                                        type="submit"
                                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mt-4 border-1 border-indigo-400 w-full"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>

                    {/* Shipping Info Section */}
                    <div className="flex border-2 border-gray-200 rounded shadow-2xl w-2/3 mx-4 p-4 h-fit my-4">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={submit}
                            enableReinitialize
                        >
                            {({ handleChange, values }) => (
                                <Form>
                                    <h2 className="text-2xl font-bold text-primary">
                                        Shipping Information
                                    </h2>
                                    <div className="flex">
                                        {" "}
                                        {/* Grid layout for two columns */}
                                        {/* Column 1 */}
                                        <div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="first_name"
                                                    className="text-400"
                                                >
                                                    First Name
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="first_name"
                                                    name="first_name"
                                                    value={values.first_name}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="last_name"
                                                    className="text-400"
                                                >
                                                    Last Name
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="last_name"
                                                    name="last_name"
                                                    value={values.last_name}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="email"
                                                    className="text-400"
                                                >
                                                    Email
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="email"
                                                    name="email"
                                                    value={values.email}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="phone_number"
                                                    className="text-400"
                                                >
                                                    Phone Number
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="phone_number"
                                                    name="phone_number"
                                                    value={values.phone_number}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                        </div>
                                        {/* Column 2 */}
                                        <div className="ml-4">
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="street_and_number"
                                                    className="text-400"
                                                >
                                                    Street Address
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="street_and_number"
                                                    name="street_and_number"
                                                    value={
                                                        values.street_and_number
                                                    }
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="city"
                                                    className="text-400"
                                                >
                                                    City
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="city"
                                                    name="city"
                                                    value={values.city}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="postal_code"
                                                    className="text-400"
                                                >
                                                    Postal Code
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="postal_code"
                                                    name="postal_code"
                                                    value={values.postal_code}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                            <div className="mb-2">
                                                <label
                                                    htmlFor="country"
                                                    className="text-400"
                                                >
                                                    Country
                                                </label>
                                                <Field
                                                    as={InputText}
                                                    id="country"
                                                    name="country"
                                                    value={values.country}
                                                    className="w-full rounded pl-[14px]"
                                                    onChange={handleChange}
                                                />
                                                <InputError message={null} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        label="Update"
                                        type="submit"
                                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mt-4 border-1 border-indigo-400 w-full"
                                    />
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
