import { createEntityAdapter, createSelector, createSlice, nanoid } from "@reduxjs/toolkit";
import { extendedSlice } from "./chat_service";

export const messageAdapter = createEntityAdapter({
    selectId: (chats) => {
        return chats._id
    }
});
export const initialState = messageAdapter.getInitialState({
    chats: [],
    activeChats: [],
    isLoading: false
});

const chatSlice = createSlice({
    name: "chat",
    initialState: initialState,
    // reducers: {
    //     addMessage: (state, action) => {
    //         state.chats = action.payload
    //     },
    //     setLoading: (state, action) => {
    //         state.isLoading = action.payload
    //     },
    //     addNewMessage: (state, action) => {
    //         state.chats = [...state.chats, action.payload]
    //     },
    //     addActiveChats: (state, action) => {
    //         state.activeChats = (action.payload)
    //     }
    // },
    reducers: {
        addMessage: messageAdapter.addMany,
        addNewMessage: (state, action) => {
            state.chats = [...state.chats, action.payload]
        },
        addNewMessage: messageAdapter.addOne,
        addActiveChats: (state, action) => {
            state.activeChats = (action.payload)
        }
    },

    extraReducers: (builder) => {
        builder.addMatcher(
            extendedSlice.endpoints.connect.matchFulfilled,
            (state, action) => {
                state.isLoading = false
                messageAdapter.setAll(state, action.payload.data)
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
export const { setLoading, addActiveChats, addMessage, addNewMessage } = chatSlice.actions
export default chatSlice.reducer;
const safeSelect = (state) => state;
export const chatSelector = createSelector(safeSelect, (state) => state.chat);
export const chatAdapterSelector = messageAdapter.getSelectors((state) => state.chat)
