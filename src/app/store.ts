import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
// import postsReducer from '../features/posts';
import usersReducer from '../features/users';
import dreamsReducer from '../features/dreamsFeature';
// import currentUserReducer from '../features/currentUser';
// import currentPostReducer from '../features/currentPost';

export const store = configureStore({
  reducer: {
    // posts: postsReducer,
    users: usersReducer,
    dreams: dreamsReducer,
    // currentUser: currentUserReducer,
    // currentPost: currentPostReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;