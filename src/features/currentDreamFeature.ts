import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {Dream} from "../types/Dream";
import {createDreamComment, getDream, getDreamComments} from "../api/dreams";
import {CommentType} from "../types/Comment";

export type currentDreamState = {
  currentDream: Dream | null,
  currentDreamLoading: boolean,
  comments: CommentType[],
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

    builder.addCase(commentsInit.pending, (state) => {
      state.commentsLoading = true;
      state.commentsError = null;
    }).addCase(commentsInit.fulfilled, (state, action) => {
      state.comments = [...action.payload as CommentType[]];
      state.commentsLoading = false;
    }).addCase(commentsInit.rejected, (state) => {
      state.commentsLoading = false;
      state.commentsError = "Failed to load comments";
    });

    builder.addCase(commentAdd.pending, (state) => {
      state.commentsLoading = true;
      state.commentsError = null;
    }).addCase(commentAdd.fulfilled, (state, action) => {
      state.comments.push(action.payload as CommentType);
      console.log(action.payload);
      state.commentsLoading = false;
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
      const newComment = await createDreamComment(+dreamId, comment, token);
      return newComment;
    } catch (e) {
      return e;
    }
  }
);