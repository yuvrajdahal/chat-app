import { createEntityAdapter } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { apiSlice } from "../../lib/api";
import { addMessage, messageAdapter, initialState } from "./chat_slice";

export const extendedSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    connect: builder.query({
      query: ({ from, to }) => ({ url: `chat?from=${from}&to=${to}` }),
      providesTags: ["Chats"],
    }),

    refetchChats: builder.mutation({
      query: ({ from, to }) => ({ url: `chat?from=${from}&to=${to}` }),
    }),
    sendMessage: builder.mutation({
      query: (cred) => ({
        url: `chat`,
        method: "POST",
        body: {
          from: cred.from._id,
          to: cred.to._id,
          message: cred.message,
          cloud_id: cred.cloud_id,
        },
      }),
    }),
    deletMessage: builder.mutation({
      query: ({ id }) => ({
        url: `chat/${id}`,
        method: "DELETE",
      }),
    }),

    uploadImage: builder.mutation({
      query: ({ file }) => ({
        url: "chat/upload",
        method: "POST",
        body: file,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    }),
  }),
});
export const {
  useConnectQuery,
  useSendMessageMutation,
  useUploadImageMutation,
  useRefetchChatsMutation,
  useDeletMessageMutation,
} = extendedSlice;
