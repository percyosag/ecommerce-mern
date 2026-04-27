import { PRODUCTS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // This creates a custom Hook we can use in our components!
    getProducts: builder.query({
      query: () => ({
        url: PRODUCTS_URL,
      }),
      keepUnusedDataFor: 5, // Caches the data for 5 seconds
    }),
  }),
});

// RTK Query automatically generates a hook based on the name of the endpoint
export const { useGetProductsQuery } = productsApiSlice;
