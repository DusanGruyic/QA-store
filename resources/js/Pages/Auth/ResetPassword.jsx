import { useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import axios from "@/Api/axios";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import FormLayout from "@/Layouts/FormLayout";

const RESET_PASSWORD_URL = "reset-password";

export default function ResetPassword({ token, email }) {
    let [errors, setErrors] = useState(false);
    const [status, setStatus] = useState(null);
    const [redirectMessage, setRedirectMessage] = useState(false);
    const { data, setData, reset } = useForm({
        token: token,
        email: email,
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const redirectToLogin = () => {
        setRedirectMessage("Redirecting to Login page...");
        setTimeout(() => {
            window.location.replace("/login");
        }, 3000);
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios
                .post(RESET_PASSWORD_URL, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                })
                .then(() => {
                    setErrors(false);
                    setStatus("New password successfully set!");
                    redirectToLogin();
                });
        } catch (err) {
            console.error(err);
            setErrors(err.response.data.errors);
        }
    };

    return (
        <GuestLayout>
            <Head title="Reset Password" />
            <FormLayout status={status} redirectMessage={redirectMessage}>
                <div className="text-center mb-5">
                    <h1 className="flex flex-column text-primary">
                        Password Reset{" "}
                    </h1>
                    <span className="text-600 text-l text-gray-600 line-height-3">
                        Set your new password
                    </span>
                </div>
                <form onSubmit={submit}>
                    <div>
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="block text-900 font-medium mb-2"
                            >
                                Email
                            </label>
                            <InputText
                                id="email"
                                type="text"
                                placeholder="Email address"
                                className="w-full rounded"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <InputError message={errors?.email} />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="password"
                                className="block text-900 font-medium mb-2"
                            >
                                Password
                            </label>
                            <InputText
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="w-full rounded"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError message={errors?.password} />
                        </div>

                        <div className="mb-3">
                            <label
                                htmlFor="password_confirmation"
                                value="Confirm Password"
                                className="block text-900 font-medium mb-2"
                            >
                                Confirm Password
                            </label>
                            <InputText
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                placeholder="Confirm Password"
                                className="w-full rounded"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                            />
                            <div className="text-center">
                                <InputError
                                    message={errors?.password_confirmation}
                                />
                            </div>
                        </div>

                        <div className="flex flex-column text-center">
                            <InputError
                                message={
                                    errors?.unauthorized
                                        ? "The email address or password you entered is invalid"
                                        : null
                                }
                            />
                            <Button
                                label="Reset Password"
                                className="w-full bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mr-2 text-semibold py-2 px-4 border border-indigo-700 rounded mt-5"
                            />
                        </div>
                    </div>
                </form>
            </FormLayout>
        </GuestLayout>
    );
}
