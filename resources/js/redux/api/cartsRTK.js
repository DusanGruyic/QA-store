import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
};

export const cartApi = createApi({
    reducerPath: "cartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `http://localhost:8000/api/v1/cart`,
        // baseUrl: `https://automaticityacademy.ngrok.app/api/v1/cart`,
        headers: headers,
    }),
    tagTypes: ["Cart"],
    endpoints: (builder) => ({
        getCart: builder.query({
            query: (id) => ({ url: `/${id}` }),
            transformResponse: (response) => response.cart,
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({
                              type: "Cart",
                              id: id,
                          })),
                      ]
                    : [{ type: "Cart", id: "CART" }],
        }),
        invalidatesTags: () => [{ type: "Cart", id: "CART" }],
        getCartItem: builder.query({
            query: ({ cartId, productId }) => ({
                url: `/${cartId}/items/${productId}`,
            }),
            transformResponse: (response) => response.item,
            providesTags: (result, error, { productId }) =>
                result ? [{ type: "Cart", id: productId }] : [],
        }),
        addToCart: builder.mutation({
            query({ cartId, productId }, data) {
                return {
                    url: `${Number(cartId)}/products/${Number(productId)}`,
                    method: "POST",
                    body: data,
                };
            },
            invalidatesTags: ({ productId }) => [
                { type: "Product", id: productId },
            ],
            transformResponse: (response) => {
                return response.cart;
            },
        }),
        removeFromCart: builder.mutation({
            query: ({ cartId, productId }) => ({
                url: `/${cartId}/products/${Number(productId)}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, arg) => [
                // { type: "Cart", id: "CART" }, // Invalidate the specific product ID
            ],
            transformResponse: (response) => {
                return response;
            },
        }),
        // updateCart: builder.mutation({
        //     query: ({ data, cartId }) {

        //     }
        // }),
        deleteCart: builder.mutation({
            query: (id) => {
                return {
                    url: `/${id}`,
                    method: "DELETE",
                    headers: headers,
                };
            },
            // invalidatesTags: (id) => [{ type: "Cart", id: "CART" }],
            // transformResponse: (response) => {
            //     return response;
            // },
        }),
        resetCartState: builder.mutation({
            query: () => {
                return {
                    url: "",
                    method: "GET", // Dummy request to satisfy query structure
                };
            },
            // This is just to reset the state; it doesn't perform any actual API call
        }),
    }),
});

export const {
    useGetCartQuery,
    useGetCartItemQuery,
    useUpdateCartMutation,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useDeleteCartMutation,
    useResetCartStateMutation,
} = cartApi;
