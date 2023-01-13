import { createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../lib/api";

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (credentials) => ({
        url: "auth/register",
        method: "POST",
        body: credentials,
      }),
      transformErrorResponse: (err) => {
        if (err?.data) {
          return { ...err.data }
        }
        return err
      }
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (res) => {
        localStorage.setItem("token", JSON.stringify(res?.token));
        return res;
      },
      invalidatesTags: ["User"],
      transformErrorResponse: ({ data, status }) => {
        return { ...data };
      },
    }),
    currentUser: builder.query({
      query: () => ({
        url: "auth/current_user",
        method: "GET"
      }),
      providesTags: ["User"],
      onQueryStarted: async (arg, { queryFulfilled }) => {
        await queryFulfilled.then(({ data }) => {
          setTimeout(() => {
            return data;
          }, 500);
        });
      },
      transformErrorResponse: (err) => {
        if (err?.data) {
          return { ...err.data }
        }
        return err
      },
    }),
  }),
});
export const {
  useSignupMutation,
  useLoginMutation,
  useProtectedMutation,
  useCurrentUserQuery: useCurrentUser,
} = extendedSlice;
