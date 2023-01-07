import { createSelector, createSlice } from "@reduxjs/toolkit";
import { extendedSlice } from "./chat_service";
const chatSlice = createSlice({
    name: "chats",
    initialState: {
        chats: [],
        activeChats: []
    },
    reducers: {
        addMessage: (state, action) => {
            state.chats = action.payload
        },
        addNewMessage: (state, action) => {
            state.chats = [...state.chats, action.payload]
        },
        addActiveChats: (state, action) => {
            state.activeChats = (action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            extendedSlice.endpoints.connect.matchFulfilled,
            (state, action) => {
                state.chats = [...action.payload.data];
            }
        );
    },
});
export const { addActiveChats, addMessage, addNewMessage } = chatSlice.actions
export default chatSlice.reducer;
const safeSelect = (state) => state;
export const chatSelector = createSelector(safeSelect, (state) => state.chat);
