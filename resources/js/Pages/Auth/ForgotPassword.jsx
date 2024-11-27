import { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import axios from "@/Api/axios";
import FormLayout from "@/Layouts/FormLayout";
import { InputText } from "primereact/inputtext";

const FORGOT_PASSWORD_URL = "forgot-password";

export default function ForgotPassword() {
    const [status, setStatus] = useState(null);
    let [errors, setErrors] = useState(false);
    const { data, setData } = useForm({
        email: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios
                .post(FORGOT_PASSWORD_URL, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                })
                .then(() => {
                    setErrors(false);
                    setStatus("We have emailed your password reset link.");
                });
        } catch (err) {
            console.error(err);
            setErrors(err.response.data.errors);
        }
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />
            <FormLayout status={status} errors={errors}>
                <div className="text-center mb-5">
                    <h1 className="flex flex-column text-primary font-semibold hover:text-gray-600">
                        Forgot your password?{" "}
                    </h1>
                </div>
                <div className="flex flex-column line-height-3 text-l text-gray-600 mb-4 text-center">
                    No problem. Just let us know your email address and we will
                    email you a password reset link that will allow you to
                    choose a new one.
                </div>

                <form onSubmit={submit}>
                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="block text-900 font-medium mb-2"
                        >
                            Email
                        </label>
                        <InputText
                            id="email"
                            name="email"
                            value={data.email}
                            className="w-full rounded"
                            isFocused={true}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                        <div className="text-center">
                            <InputError
                                message={errors?.email}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    <div className="flex align-items-center justify-content-between mt-4">
                        <Button
                            label="Password recovery link"
                            className="w-full bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mr-2 text-semibold py-2 px-4 border border-indigo-700 rounded mt-5"
                        />
                    </div>
                </form>
            </FormLayout>
        </GuestLayout>
    );
}
