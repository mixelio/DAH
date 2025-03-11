import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Dream, DreamStatus} from "../types/Dream";
import {closeUnpaydDream, createDream, createPhotoForDream, donatePaydDream, getDream, getDreams} from "../api/dreams";

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

      builder.
        addCase(closeDream.pending, (state) => {
          state.dreamsLoading = true;
        }).
        addCase(closeDream.fulfilled, (state) => {
          state.dreamsLoading = false;
          if (state.currentDream) {
            state.currentDream = {...state.currentDream, status: DreamStatus.Completed};
          }
        });

      builder.
        addCase(donateToCurrentDream.pending, (state) => {
          state.dreamsLoading = true;
        }
      ).addCase(donateToCurrentDream.fulfilled, (state) => {
        state.dreamsLoading = false;
      }
    );
      
      builder.addCase(currentDreamInit.pending, (state) => {
        state.dreamsLoading = true;
      }).addCase(currentDreamInit.fulfilled, (state, action) => {
        state.dreamsLoading = false;
        console.log(action.payload)
        state.currentDream = action.payload;
      })
  },
});

export default dreamsSlice.reducer;
export const { actions } = dreamsSlice;

export const dreamsInit = createAsyncThunk("dreams/fetch", async () => {
  const response = await getDreams();
  return response;
});

export const currentDreamInit = createAsyncThunk("currDream/fetch", async (id: number) => {
  const dream = await getDream(id);
  return dream;
})

export const dreamCreateInit = createAsyncThunk("dreams/create", async ({data, token}: { data: FormData, token: string }) => {
  const dreamInfo: Partial<
      Record<"name" | "category" | "cost" | "description" | "image" | "location", string | number | File>
  > = {};

  (["name", "category", "cost", "description","image", "location"] as const).forEach(key => {
      const value = data.get(key);
      if(value !== null && value !== undefined && value !== "") {
        dreamInfo[key] = value as string | number | File;
      }
    })

    const formData = new FormData();
    Object.entries(dreamInfo).forEach(([key, value]) => {
      if(value !== null && value !== undefined) {
        if(key !== "image") {
          formData.append(key, value as string | Blob);
        } else {
        formData.append(key, value as File);
      }
      
}});
    console.log("name", formData.get("name"), "category", formData.get("category"), "cost", formData.get("cost"), "description", formData.get("description"),"image", formData.get("image"));
    const response = await createDream(formData, token);

    return response;
});

export const dreamPhotoCreateInit = createAsyncThunk("dream/photoCreate", async (data: { photoData: FormData, token: string }) => {
  const { photoData, token } = data;
  const response = await createPhotoForDream(photoData, token);
  return response;
});

export const closeDream = createAsyncThunk(
  "dream/close",
  async ({
    id,
    data,
    token,
  }: {
    id: number;
    data: { contribution_description: string };
    token: string;
  }) => {
    const response = await closeUnpaydDream({ id, data, token });
    return response;
  }
);

export const donateToCurrentDream = createAsyncThunk(
  "dream/donate",
  async ({
    id,
    data,
    token,
  }: {
    id: number;
    data: { 
      contribution_amount: number,
      return_url: string 
    };
    token: string;
  }) => {
    const response = await donatePaydDream({ id, data, token });
    return response;
  }
);
