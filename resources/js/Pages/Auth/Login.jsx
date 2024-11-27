import { useEffect, useState } from "react";
import axios from "@/Api/axios";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import FormLayout from "@/Layouts/FormLayout";
import { useDispatch } from "react-redux";
import { login } from "@/redux/authSlice";

const LOGIN_URL = "api/v1/auth/login";

export default function Login({ status }) {
    const dispatch = useDispatch();
    const { data, setData, reset } = useForm({
        email: "",
        password: "",
    });

    let [errors, setErrors] = useState(false);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);
    useEffect(() => {}, [errors]);

    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios
                .post(LOGIN_URL, JSON.stringify(data), {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                    withCredentials: true,
                })
                .then(async (response) => {
                    dispatch(login(response.data));
                    localStorage.setItem("token", response.data.auth.token);
                    localStorage.setItem("userId", response.data.user.id);
                    localStorage.setItem("cartId", response.data.user.id);
                    window.location.replace("/dashboard");
                });
        } catch (err) {
            setErrors(
                err.response.data.errors || {
                    unauthorized: err.response.data.error,
                }
            );
            console.error(err);
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            <FormLayout status={status}>
                <div className="text-center mb-5">
                    <h1 className="flex flex-column text-primary">
                        Welcome Back!{" "}
                        <span className="animate-waving-hand">👋🏻</span>
                    </h1>
                    <span className="text-600 text-l text-gray-600 line-height-3">
                        Don't have an account?
                    </span>
                    <Link
                        href={route("register")}
                        className="font-medium no-underline ml-2 text-primary font:semibold hover:text-gray-600 cursor-pointer"
                    >
                        Create today!
                    </Link>
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

                        <div className="flex align-items-center justify-content-between mb-3">
                            <Link
                                href={route("password.request")}
                                className="font-medium no-underline text-primary text-right cursor-pointer"
                            >
                                Forgot your password?
                            </Link>
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
                                label="Sign In"
                                className="w-full bg-gray-200 text-primary hover:bg-indigo-300 hover:text-white text-xl mr-2 text-semibold py-2 px-4 border border-indigo-700 rounded"
                            />
                        </div>
                    </div>
                </form>
            </FormLayout>
        </GuestLayout>
    );
}
