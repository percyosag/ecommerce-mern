import { apiSlice } from "./apiSlice";
import { ORDERS_URL } from "../constants";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: "POST",
        body: { ...order },
      }),
    }),

    getOrderDetails: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
      }),
      providesTags: ["Order"],
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => ({
        url: `${ORDERS_URL}/${orderId}/pay`,
        method: "PUT",
        body: details,
      }),
      invalidatesTags: ["Order"],
    }),

    // getOrderDetails: builder.query({
    //   query: (id) => ({
    //     url: `${ORDERS_URL}/${id}`,
    //   }),
    //   keepUnusedDataFor: 5,
    // }),
    // payOrder: builder.mutation({
    //   query: ({ orderId, details }) => ({
    //     url: `${ORDERS_URL}/${orderId}/pay`,
    //     method: "PUT",
    //     body: { ...details },
    //   }),
    // }),

    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: "PUT",
      }),
    }),
    getPaypalClientId: builder.query({
      query: () => ({
        url: "/api/config/paypal",
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
} = ordersApiSlice;
