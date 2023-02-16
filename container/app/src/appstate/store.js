import { apiSlice } from "../lib/api";
import { configureStore } from "@reduxjs/toolkit";
import UserReducer, { logOut } from "./auth/auth_slice";
import ChatReducer from "./chats/chat_slice";
import { isRejectedWithValue } from "@reduxjs/toolkit";
import ErrorReducer, { addError } from "./error/error_slice";
export const rtkQueryErrorLogger = (api) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    if (action?.payload?.statuscode === 401) {
      store.dispatch(logOut());
    }
    store.dispatch(addError(action.payload.error));
  }

  return next(action);
};

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    user: UserReducer,
    chat: ChatReducer,
    error: ErrorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(apiSlice.middleware)
      .concat(rtkQueryErrorLogger),
});
export default store;
