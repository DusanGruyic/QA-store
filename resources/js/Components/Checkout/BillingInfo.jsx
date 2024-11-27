import { useDispatch } from "react-redux";
import { setActiveStep } from "@/redux/activeStepSlice";
import React, { useState } from "react";
import axios from "@/Api/axios";
import InputError from "@/Components/InputError";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getMonths, getYears } from "@/Shared/utils";
import { useGetUsersBillingInfoQuery } from "@/redux/api/usersRTK";
import { Formik, Form, Field } from "formik";

const BillingInfo = () => {
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);
    const { data } = useGetUsersBillingInfoQuery(
        localStorage.getItem("userId"),
        { refetchOnMountOrArgChange: true }
    );

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
        cardholder: data?.billing_info?.cardholder || "",
        card_type: data?.billing_info?.card_type || "",
        card_number: data?.billing_info?.card_number || "",
        cvv: data?.billing_info?.cvv || "",
        card_expiration_month:
            data?.billing_info?.card_expiration_date.split("/")[0] || "",
        card_expiration_year:
            `20${data?.billing_info?.card_expiration_date.split("/")[1]}` || "",
    };

    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        setSubmitError(null);
        try {
            const payload = {
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
                JSON.stringify(payload),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            dispatch(setActiveStep(4));
        } catch (err) {
            setSubmitError(err.response?.data.errors || {});
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-full w-3/6 flex fixed top-48">
            <div className="flex border-2 border-gray-200 rounded shadow-2xl w-4/5">
                <div
                    className="flex flex-grow py-2 mr-4 overflow-y-auto ml-4 no-scrollbar"
                    style={{ maxHeight: "500px" }}
                >
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-row">
                                <div className="flex flex-col w-full mr-4">
                                    <div className="mb-1">
                                        <label
                                            htmlFor="cardholder"
                                            className="text-400"
                                        >
                                            Cardholder
                                        </label>
                                        <Field
                                            as={InputText}
                                            disabled={!isEditable}
                                            id="cardholder"
                                            name="cardholder"
                                            className="w-full rounded pl-[14px] h-8"
                                        />
                                        <InputError
                                            message={submitError?.cardholder}
                                        />
                                    </div>
                                    <div className="mb-1">
                                        <label
                                            htmlFor="card_type"
                                            className="text-400"
                                        >
                                            Card Type
                                        </label>
                                        <Field
                                            as={Dropdown}
                                            disabled={!isEditable}
                                            id="card_type"
                                            name="card_type"
                                            options={cardTypes}
                                            placeholder="Select Card type"
                                            className="w-full rounded border-1 border-gray-600"
                                        />
                                        <InputError
                                            message={submitError?.card_type}
                                        />
                                    </div>
                                    <div className="mb-1">
                                        <label
                                            htmlFor="card_number"
                                            className="text-400"
                                        >
                                            Card Number
                                        </label>
                                        <Field
                                            as={InputText}
                                            disabled={!isEditable}
                                            id="card_number"
                                            name="card_number"
                                            className="w-full rounded pl-[14px] h-8"
                                        />
                                        <InputError
                                            message={submitError?.card_number}
                                        />
                                    </div>
                                    <div className="mb-1">
                                        <label
                                            htmlFor="cvv"
                                            className="text-400"
                                        >
                                            CVV
                                        </label>
                                        <Field
                                            as={InputText}
                                            disabled={!isEditable}
                                            id="cvv"
                                            name="cvv"
                                            className="w-full rounded pl-[14px] h-8"
                                        />
                                        <InputError
                                            message={submitError?.cvv}
                                        />
                                    </div>
                                    <div className="flex">
                                        <div className="mb-1">
                                            <label
                                                htmlFor="card_expiration_month"
                                                className="text-400"
                                            >
                                                Expiration Month
                                            </label>
                                            <Field
                                                as={Dropdown}
                                                disabled={!isEditable}
                                                id="card_expiration_month"
                                                name="card_expiration_month"
                                                options={months}
                                                placeholder="Month"
                                                className="w-fit border-1 border-gray-600"
                                            />
                                        </div>
                                        <div className="mb-1">
                                            <label
                                                htmlFor="card_expiration_year"
                                                className="text-400"
                                            >
                                                Expiration Year
                                            </label>
                                            <Field
                                                as={Dropdown}
                                                disabled={!isEditable}
                                                id="card_expiration_year"
                                                name="card_expiration_year"
                                                options={years}
                                                placeholder="Year"
                                                className="w-fit border-1 border-gray-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-start">
                                    <div className="flex flex-row-reverse mb-48">
                                        <Button
                                            onClick={() =>
                                                dispatch(setActiveStep(1))
                                            }
                                            className="text-indigo-500 mb-2 pl-4"
                                            icon="pi pi-arrow-circle-left"
                                            tooltip="Go back"
                                        />
                                        <p className="block text-primary text-4xl font-bold text-center">
                                            Dis right?
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() =>
                                            setIsEditable(!isEditable)
                                        }
                                        label={`${
                                            !isEditable
                                                ? "Let me fix this"
                                                : "Guess it's fixed"
                                        }`}
                                        type="button"
                                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl text-semibold mb-2 border border-indigo-700 rounded"
                                    />
                                    <Button
                                        type="submit"
                                        label="Next step ->"
                                        disabled={isSubmitting}
                                        className="bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl text-semibold border border-indigo-700 rounded mt-6"
                                    />
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default BillingInfo;
