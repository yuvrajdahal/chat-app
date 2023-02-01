import {
  createEntityAdapter,
  createSelector,
  createSlice,
  nanoid,
} from "@reduxjs/toolkit";

const errorSlice = createSlice({
  name: "error",
  initialState: { isError: false, error: null },
  reducers: {
    addError: (state, { payload }) => {
      state.isError = true;
      state.error = payload;
    },
    defaultError: (state) => {
      state.isError = false;
      state.error = null;
    },
  },
});
export const { addError, defaultError } = errorSlice.actions;
export default errorSlice.reducer;
const safeSelect = (state) => state;
export const errorSelector = createSelector(safeSelect, (state) => state.error);
