import {createSlice} from "@reduxjs/toolkit";
import {User} from "../types/User";

export type usersState = {
  users: User[],
  usersLoading: boolean,
  error: string,
};

const initialState: usersState = {
  users: [],
  usersLoading: false,
  error: '',
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {

  }
});

export default usersSlice.reducer;

// export const userInit = crerateAsyncThunk('users/fetch', () => {
//   return getUsers();
// })