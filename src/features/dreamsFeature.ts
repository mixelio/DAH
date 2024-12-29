import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Dream} from "../types/Dream";
import {createDream, getDreams} from "../api/dreams";

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

    builder.
      addCase(dreamCreateInit.pending, (state) => {
        state.dreamsLoading = true;
      })
      .addCase(dreamCreateInit.fulfilled, (state, action) => {
        state.dreamsLoading = false;
        state.dreams = [...state.dreams, action.payload];
      },);
  },
});

export default dreamsSlice.reducer;
export const { actions } = dreamsSlice;

export const dreamsInit = createAsyncThunk("dreams/fetch", async () => {
  const response = await getDreams();
  return response;
});

export const dreamCreateInit = createAsyncThunk("dreams/create", async (data: { dreamData: FormData, token: string }) => {
  const { dreamData, token } = data;
  const response = await createDream(dreamData, token);
  return response;
});