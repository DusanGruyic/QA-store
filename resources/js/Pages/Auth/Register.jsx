import React, { useEffect, useState } from "react";
import axios from "@/Api/axios";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "primereact/button";
import route from "ziggy-js";
import { InputText } from "primereact/inputtext";
import FormLayout from "@/Layouts/FormLayout";

const REGISTER_URL = "api/v1/auth/register";

export default function Register() {
    let [errors, setErrors] = useState(false);
    const [status, setStatus] = useState(null);
    const [redirectMessage, setRedirectMessage] = useState(false);
    const { data, setData, reset } = useForm({
        username: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);
    useEffect(() => {}, [errors]);

    const redirectToDashoard = () => {
        setRedirectMessage("Redirecting to Dashboard page...");
        setTimeout(() => {
            window.location.replace("/dashboard");
        }, 3000);
    };

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios
                .post(REGISTER_URL, JSON.stringify(data), {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                })
                .then(async (response) => {
                    localStorage.setItem("token", response.data.auth.token);
                    localStorage.setItem("userId", response.data.user.id);
                    localStorage.setItem("cartId", response.data.user.id);
                    setErrors(false);
                    setStatus("Successfully registered!");
                    redirectToDashoard();
                });
        } catch (err) {
            setErrors(err.response.data.errors);
            console.error(err);
        }
    };

    return (
        <GuestLayout>
            <Head title="Register" />
            <FormLayout status={status} redirectMessage={redirectMessage}>
                <div className="text-center mb-5">
                    <h1 className="flex flex-column text-primary">Register!</h1>
                    <span className="text-l text-gray-600">
                        Already have an account?
                    </span>
                    <Link
                        href={route("login")}
                        className="no-underline ml-2 text-primary font-semibold hover:text-gray-600 cursor-pointer"
                    >
                        Log in now!
                    </Link>
                </div>
                <form onSubmit={submit}>
                    <div>
                        <div className="mb-3">
                            <label
                                htmlFor="username"
                                className="block text-900 font-medium mb-2"
                            >
                                Username
                            </label>
                            <InputText
                                id="username"
                                type="text"
                                placeholder="Username address"
                                className="w-full rounded"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                            />
                            <div className="text-center">
                                <InputError message={errors?.username} />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="email"
                                className="block text-900 font-medium mb-2"
                            >
                                Email
                            </label>
                            <InputText
                                id="email"
                                placeholder="Email"
                                className="w-full rounded"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                            <div className="text-center">
                                <InputError message={errors?.email} />
                            </div>
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
                            <div className="text-center">
                                <InputError message={errors?.password} />
                            </div>
                        </div>

                        <div className="flex align-items-center justify-content-between">
                            <Button
                                label="Register"
                                className="w-full bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mr-2 text-semibold py-2 px-4 border border-indigo-700 rounded"
                            />
                        </div>
                    </div>
                </form>
            </FormLayout>
        </GuestLayout>
    );
}
