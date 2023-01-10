import { createSelector, createSlice } from "@reduxjs/toolkit";
import { extendedSlice } from "./chat_service";
const chatSlice = createSlice({
    name: "chats",
    initialState: {
        chats: [],
        activeChats: [],
        isLoading: false
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
                state.isLoading = false
            }
        );
        builder.addMatcher(
            extendedSlice.endpoints.connect.matchPending,
            (state, action) => {
                state.isLoading = true
            }
        );

    },
});
export const { addActiveChats, addMessage, addNewMessage } = chatSlice.actions
export default chatSlice.reducer;
const safeSelect = (state) => state;
export const chatSelector = createSelector(safeSelect, (state) => state.chat);
