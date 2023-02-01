import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";
import { extendedSlice } from "./chat_service";

export const messageAdapter = createEntityAdapter({
  selectId: (chats) => {
    return chats._id;
  },
});
export const initialState = messageAdapter.getInitialState({
  chats: [],
  activeChats: [],
  isLoading: false,
  isSending: false,
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
    setMessage: messageAdapter.setAll,
    removeMessage: messageAdapter.removeOne,
    removeAll: messageAdapter.removeAll,
    addNewMessage: messageAdapter.addOne,
    updateOne: messageAdapter.updateOne,
    removePreviousChat: (state, { payload }) => {
      messageAdapter.removeAll(state);
      state.isLoading = true;
    },
    addActiveChats: (state, { payload }) => {
      state.activeChats = payload;
    },
  },

  extraReducers: (builder) => {
    // fetch-chat
    builder.addMatcher(
      extendedSlice.endpoints.connect.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        messageAdapter.setAll(state, action.payload.data);
      }
    );
    builder.addMatcher(
      extendedSlice.endpoints.connect.matchPending,
      (state, action) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      extendedSlice.endpoints.refetchChats.matchPending,
      (state, action) => {
        state.isLoading = true;
      }
    );
    builder.addMatcher(
      extendedSlice.endpoints.refetchChats.matchFulfilled,
      (state, action) => {
        state.isLoading = false;
        messageAdapter.setAll(state, action.payload.data);
      }
    );

    // send-message
    builder.addMatcher(
      extendedSlice.endpoints.sendMessage.matchPending,
      (state, action) => {
        state.isSending = true;
      }
    );
    builder.addMatcher(
      extendedSlice.endpoints.sendMessage.matchFulfilled,
      (state, action) => {
        state.isSending = false;
      }
    );
  },
});
export const {
  setMessage,
  removePreviousChat,
  removeMessage,
  setLoading,
  addActiveChats,
  addMessage,
  removeAll,
  addNewMessage,
  updateOne,
} = chatSlice.actions;
export default chatSlice.reducer;
const safeSelect = (state) => state;
export const chatSelector = createSelector(safeSelect, (state) => state.chat);
export const chatAdapterSelector = messageAdapter.getSelectors(
  (state) => state.chat
);
