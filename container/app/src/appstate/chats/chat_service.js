import { createEntityAdapter } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { apiSlice } from "../../lib/api";
import { addMessage } from "./chat_slice"

const messagesAdapter = createEntityAdapter()
export const extendedSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        connect: builder.query({
            query: ({ from, to }) => ({ url: `chat?from=${from}&to=${to}` }),
            transformResponse(response) {
                return response
            },
            providesTags: ["Chats"],
        }),
        sendMessage: builder.mutation({
            query: (cred) => ({
                url: `chat`,
                method: "POST",
                body: {
                    from: cred.from._id,
                    to: cred.to._id,
                    message: cred.message
                }
            }),
        }),
        deletMessage: builder.mutation({
            query: ({ id }) => ({
                url: `chat/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Chats"]
        }),

        uploadImage: builder.mutation({
            query: ({ file }) => ({
                url: "chat/upload",
                method: "POST",
                body: file,
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            }),
            invalidatesTags: ["Chats"]
        })
    }),
});
export const {
    useConnectQuery,
    useSendMessageMutation,
    useUploadImageMutation
} = extendedSlice;
