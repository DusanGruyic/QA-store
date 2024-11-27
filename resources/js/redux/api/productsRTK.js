import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const productApi = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `http://localhost:8000/api/v1/products`,
        // baseUrl: `https://automaticityacademy.ngrok.app/api/v1/products`,
        headers: headers,
    }),
    tagTypes: ["Product"],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => "/",
            transformResponse: (response) => {
                return response.products;
            },
            invalidatesTags: ({ id }) => [{ type: "Product", id }],
        }),
        getProduct: builder.query({
            query: (id) => ({ url: `/${id}` }),
            invalidatesTags: ({ id }) => [{ type: "Product", id }],
            transformResponse: (response) => {
                return response.product;
            },
        }),
        updateProduct: builder.mutation({
            query: ({ data, id }) => {
                return {
                    url: `/${Number(id)}`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: ({ id }) => [{ type: "Product", id }],
            transformResponse: (response) => {
                return response;
            },
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useUpdateProductMutation,
} = productApi;
