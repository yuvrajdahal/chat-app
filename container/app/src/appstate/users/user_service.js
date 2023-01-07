import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../lib/api'

export const usersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    users: builder.query({
      query: () => ({
        url: `users`,
        method: "GET",
      }),
      transformErrorResponse: ({ data, status }) => {
        return { ...data }
      },
    }),
    user: builder.query({
      query: ({ id }) => ({
        url: `users/${id}`,
        method: "GET"
      }),
      transformResponse: (res) => {
        return { ...res.data }
      },
      transformErrorResponse: ({ data, status }) => {
        return { ...data }
      },
    })
  }),
})
export const {
  useLoginMutation,
  useCurrentUserQuery: useCurrentUser,
  useUsersQuery: getUsers,
  useUserQuery: getUser,
} = usersService
