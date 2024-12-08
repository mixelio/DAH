import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {User} from "../types/User";
import {changeUser, createUser, getLoginedUser, getUsers} from "../api/users";

export type userState = {
  users: User[],
  loginedUser: User | null,
  usersLoading: boolean,
  error: string,
};

const initialState: userState = {
  users: [],
  loginedUser: null,
  usersLoading: false,
  error: '',
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // geting users from backend
    builder
      .addCase(usersInit.pending, (state) => {
        state.usersLoading = true
      })
      .addCase(usersInit.fulfilled, (state, action) => {
        state.users = action.payload;
      });
    // registrating user at the website
    builder
      .addCase(userRegister.pending, (state) => {
        state.usersLoading = true;

      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.users.push(action.payload);
        state.usersLoading = false;
      });
    // geting logined user
    builder
      .addCase(currentUserInit.pending, (state) => {
        console.log('loading...')
        state.usersLoading = true;
      })
      .addCase(currentUserInit.fulfilled, (state, action) => {
        console.log('loaded!');
        state.loginedUser = action.payload;
        state.usersLoading = false;
      })
  },
});

export default usersSlice.reducer;
export const { actions } = usersSlice;

export const usersInit = createAsyncThunk("users/fetch", async () => {
  const response = await getUsers();
  return response;
});

export const userRegister = createAsyncThunk("user/register", async (data: Pick<User, "first_name" | "last_name" | "email" | "password">, thunkAPI) => {
  try {
    const response = await createUser(data);

    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
})

export const currentUserInit = createAsyncThunk("currUser/fetch", async (token: string) => {
    const response = await getLoginedUser(token);
    return response;
})

export const currentUserUpdate = createAsyncThunk("currentUser/patch", async ({ data, token }: { data: FormData, token: string }) => {
  const userData: Omit<User, "id" | "is_staff" | "num_of_dreams"> = {
    email: data.get("email") as string,
    first_name: data.get("first_name") as string,
    last_name: data.get("last_name") as string,
    photo: data.get("photo") as string,
    password: data.get("password") as string,
    location: data.get("location") as string,
    about_me: data.get("about_me") as string,
  };

  const response = await changeUser(userData, token);

  return response;
})