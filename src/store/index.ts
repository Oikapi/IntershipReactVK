import { configureStore } from '@reduxjs/toolkit';
import newsListReducer from './NewsListSlice';
import newsDetailsReducer from "./NewsDetailsSlice"

const store = configureStore({
  reducer: {
    newsList: newsListReducer,
    newsDetails : newsDetailsReducer
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;