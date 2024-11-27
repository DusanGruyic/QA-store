import { useDispatch } from "react-redux";
import { setActiveStep } from "@/redux/activeStepSlice";
import React, { useState } from "react";
import axios from "@/Api/axios";
import InputError from "@/Components/InputError";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useGetUsersShippingInfoQuery } from "@/redux/api/usersRTK";
import { Formik, Form, Field } from "formik";

const ShippingInfo = () => {
    const dispatch = useDispatch();
    const [isEditable, setIsEditable] = useState(false);
    const { data } = useGetUsersShippingInfoQuery(
        localStorage.getItem("userId"),
        { refetchOnMountOrArgChange: true }
    );
    const initialValues = {
        first_name: data?.shipping_info?.first_name || "",
        last_name: data?.shipping_info?.last_name || "",
        email: data?.shipping_info?.email || "",
        phone_number: data?.shipping_info?.phone_number || "",
        street_and_number: data?.shipping_info?.street_and_number || "",
        city: data?.shipping_info?.city || "",
        postal_code: data?.shipping_info?.postal_code || "",
        country: data?.shipping_info?.country || "",
    };

    const [submitError, setSubmitError] = useState(null);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await axios.put(
                `api/v1/customers/${localStorage.getItem(
                    "userId"
                )}/shipping-info`,
                JSON.stringify(values),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            dispatch(setActiveStep(3));
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
                                    {Object.keys(initialValues).map((key) => (
                                        <div className="mb-1" key={key}>
                                            <label
                                                htmlFor={key}
                                                className="text-400"
                                            >
                                                {key
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (char) =>
                                                        char.toUpperCase()
                                                    )}
                                            </label>
                                            <Field
                                                as={InputText}
                                                disabled={!isEditable}
                                                id={key}
                                                name={key}
                                                className="w-full rounded pl-[14px] h-8"
                                            />
                                            <div className="text-center">
                                                <InputError
                                                    message={submitError?.[key]}
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                                            Dis u?
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
                                        label="Next screen ->"
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

export default ShippingInfo;
