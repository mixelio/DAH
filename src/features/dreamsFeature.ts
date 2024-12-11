import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Dream} from "../types/Dream";
import {getDreams} from "../api/dreams";

export type dreamsState = {
  dreams: Dream[],
  currentDream: Dream | null,
  dreamsLoading: boolean,
  error: string,
}

const initialState: dreamsState = {
  dreams: [],
  currentDream: null,
  dreamsLoading: false,
  error: '',
}

const dreamsSlice = createSlice({
  name: "dreams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // geting dreams from backend
    builder
      .addCase(dreamsInit.pending, (state) => {
        state.dreamsLoading = true
      })
      .addCase(dreamsInit.fulfilled, (state, action) => {
        state.dreams = action.payload;
      });
    // geting current dream
    // builder
    //   .addCase(currentDreamInit.pending, (state) => {
    //     state.dreamsLoading = true;
    //   })
    //   .addCase(currentDreamInit.fulfilled, (state, action) => {
    //     state.currentDream = action.payload;
    //     state.dreamsLoading = false;
    //   });
  },
});

export default dreamsSlice.reducer;
export const { actions } = dreamsSlice;

export const dreamsInit = createAsyncThunk("dreams/fetch", async () => {
  const response = await getDreams();
  return response;
});