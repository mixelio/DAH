import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {User} from "../types/User";
import {addToFavourite, changeUser, changeUserPhoto, createUser, getLoginedUser, getUserFavourites, getUsers, removeFromFavorite} from "../api/users";
import {Dream} from "../types/Dream";

export type userState = {
  users: User[],
  loginedUser: User | null,
  userAvatar: unknown | null,
  userFavouriteList: Dream[],
  usersLoading: boolean,
  error: string,
};

const initialState: userState = {
  users: [],
  loginedUser: null,
  userAvatar: null,
  userFavouriteList: [],
  usersLoading: false,
  error: '',
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addToFavourite: (state, action: PayloadAction<Dream>) => {state.userFavouriteList = [...state.userFavouriteList, action.payload]},
    removeFromFavourite: (state, action: PayloadAction<Dream>) => {state.userFavouriteList = state.userFavouriteList.filter(dream => dream.id !== action.payload.id)},
  },
  extraReducers: (builder) => {
    // geting users from backend
    builder
      .addCase(usersInit.pending, (state) => {
        state.usersLoading = true
      })
      .addCase(usersInit.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = action.payload;
        }
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
        console.log()
        state.usersLoading = true;
      })
      .addCase(currentUserInit.fulfilled, (state, action) => {
        console.log();
        state.loginedUser = action.payload;
        state.usersLoading = false;
      });

      builder.addCase(currentUserUpdate.pending, (state) => {
        state.usersLoading = true;
      }).addCase(currentUserUpdate.fulfilled, (state, action) => {
        state.loginedUser = action.payload;
        state.usersLoading = false;
      }).addCase(currentUserUpdate.rejected, (state, action) => {
        state.error = action.error.message || '';
        state.usersLoading = false;
      });

    // updating user photo

      builder
        .addCase(userPhotoUpdate.pending, (state) => {
          state.usersLoading = true;
        })
        .addCase(userPhotoUpdate.fulfilled, (state, action) => {
          state.userAvatar = action.payload;
          state.usersLoading = false;
        })
        .addCase(userPhotoUpdate.rejected, (state, action) => {
          state.error = action.error.message || "";
          state.usersLoading = false;
        });

        // favorite list

      builder
        .addCase(userFavouritesInit.pending, (state) => {
          state.usersLoading = true;
        })
        .addCase(userFavouritesInit.fulfilled, (state, action) => {
          state.userFavouriteList = [...action.payload as Dream[]];
          state.usersLoading = false;
        });

      builder
        .addCase(userFavouriteAdd.pending, () => {
          console.log("favorite is adding...");
        })
        .addCase(userFavouriteAdd.fulfilled, (state, action) => {
          const payload = action.payload as { message: string };
          console.log(payload.message);
          console.log(state.userFavouriteList);
        });

      builder
        .addCase(userFavoriteRemove.pending, () => {
          console.log("favorite is removing...");
        })
        .addCase(userFavoriteRemove.fulfilled, (state, action) => {
          console.log(action.payload);
          state.userFavouriteList = state.userFavouriteList.filter(dream => dream.id !== action.payload);
        })
  },
});

export default usersSlice.reducer;
export const { actions } = usersSlice;

export const usersInit = createAsyncThunk("users/fetch", async () => {
  const response = await getUsers();
  return response;
});

export const userFavouritesInit = createAsyncThunk("user/favorites", async (token: string) => {
  console.log("inside userFavouritesInit thunk");
  try {
    const response = await getUserFavourites(token);
    return response;
  } catch (error) {
    return error;
  }
});

export const userFavouriteAdd = createAsyncThunk("favourite/add", async ({dream_id, token}: {dream_id: number, token: string} ) => {
  try {
    const response = await addToFavourite({dream_id: dream_id}, token);
    return response;
  } catch (error) {
    return error;
  }
});

export const userFavoriteRemove = createAsyncThunk("favorite/remove", async ({dream_id, token}: {dream_id: number, token: string}) => {
  try {
    await removeFromFavorite({dream_id: dream_id}, token);
    return dream_id;
  } catch (error) {
    return error;
  }
})

export const userRegister = createAsyncThunk("user/register", async (data: Pick<User, "first_name" | "last_name" | "email" | "password">, thunkAPI) => {
  try {
    const response = await createUser(data);

    return response;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const currentUserInit = createAsyncThunk("currUser/fetch", async (token: string) => {
    const response = await getLoginedUser(token);
    return response;
});

export const currentUserUpdate = createAsyncThunk("currentUser/patch", async ({ data, token }: { data: FormData, token: string }) => {
  const userData: Partial<
    Pick<User, "first_name" | "last_name" | "location" | "about_me" | "photo_url">
  > = {};

  (["first_name", "last_name", "location", "about_me", "photo_url"] as const).forEach(key => {
    const value = data.get(key);
    if(value !== null && value !== undefined && value !== "") {
      userData[key] = value as string;
    }
  })

  const response = await changeUser(userData, token);

  return response;
});

export const userPhotoUpdate = createAsyncThunk("user/photo", async ({ data, token }: { data: FormData, token: string }) => {
  const response = await changeUserPhoto(data, token);

  return response;
});