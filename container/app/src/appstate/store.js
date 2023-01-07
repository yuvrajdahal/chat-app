import { apiSlice } from "../lib/api";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./auth/auth_slice";
import ChatReducer from "./chats/chat_slice";
import { isRejectedWithValue } from '@reduxjs/toolkit'

export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
  if (isRejectedWithValue(action)) {
    console.warn('We got a rejected action!')

  }

  return next(action)
}
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: UserReducer,
    chat: ChatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
export default store;
