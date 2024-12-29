import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Dream} from "../types/Dream";
import {createDreamComment, getDream, getDreamComments} from "../api/dreams";
import {CommentType} from "../types/Comment";

export type currentDreamState = {
  currentDream: Dream | null,
  currentDreamLoading: boolean,
  comments: Comment[],
  commentsLoading: boolean,
  currentDreamError: string | null,
  commentsError: string | null,
}

const initialState: currentDreamState = {
  currentDream: null,
  currentDreamLoading: false,
  comments: [],
  commentsLoading: false,
  currentDreamError: null,
  commentsError: null,
};

export const currentDreamSlice = createSlice({
  name: "currentDream",
  initialState,
  reducers: {
    addNewComment: (state, action) => {
      state.comments = [...state.comments, action.payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(currentDreamInit.pending, (state) => {
      state.currentDreamLoading = true;
      state.currentDreamError = null;
    }).addCase(currentDreamInit.fulfilled, (state, action) => {
      state.currentDream = action.payload;
      state.currentDreamLoading = false;
    }).addCase(currentDreamInit.rejected, (state) => {
      state.currentDreamLoading = false;
      state.currentDreamError = "Failed to load dream";
    });

  }
});

export default currentDreamSlice.reducer;
export const {actions} = currentDreamSlice;

// all about current dream

export const currentDreamInit = createAsyncThunk("currentDream/fetch", async (dreamId: string) => {
  const dream = await getDream(+dreamId);
  return dream;
});

// all about comments

export const commentsInit = createAsyncThunk("currentDream/comments", async (dreamId: string) => {
  const comments = await getDreamComments(+dreamId);
  return comments;
});

export const commentAdd = createAsyncThunk(
  "currentDream/commentAdd",
  async ({dreamId, comment, token}: {dreamId: string, comment: Pick<CommentType, "text">, token: string}) => {
    try{
      const comments = await createDreamComment(+dreamId, comment, token);
      return comments;
    } catch (e) {
      return e;
    }
    
    
  }
);