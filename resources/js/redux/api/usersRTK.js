import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        // baseUrl: "https://automaticityacademy.ngrok.app/api/v1/",
        baseUrl: "http://localhost:8000/api/v1/",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }),
    endpoints: (builder) => ({
        getUserById: builder.query({
            query: (id) => `customers/${id}`,
        }),
        getUsersShippingInfo: builder.query({
            query: (id) => `customers/${id}/shipping-info`,
        }),
        getUsersBillingInfo: builder.query({
            query: (id) => `customers/${id}/billing-info`,
        }),
    }),
});

export const {
    useGetUserByIdQuery,
    useGetUsersShippingInfoQuery,
    useGetUsersBillingInfoQuery,
} = userApi;
