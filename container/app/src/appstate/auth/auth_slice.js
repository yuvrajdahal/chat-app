import { createSelector, createSlice } from "@reduxjs/toolkit";
import { extendedSlice } from "./auth_service";
const authSlice = createSlice({
  name: "auth",
  initialState: {
    userIsLoading: false,
    user: {},
  },
  reducers: {
    logOut: (state, action) => {
      localStorage.clear();
      state.user = {};
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      extendedSlice.endpoints.currentUser.matchPending,
      (state, action) => {
        state.userIsLoading = true;
      }
    );
    builder.addMatcher(
      extendedSlice.endpoints.currentUser.matchFulfilled,
      (state, action) => {
        state.userIsLoading = false;
        state.user = action.payload.data;
      }
    );
  },
});
export default authSlice.reducer;
export const { logOut } = authSlice.actions;
const safeSelect = (state) => state;
export const authSelector = createSelector(safeSelect, (state) => state.user);
