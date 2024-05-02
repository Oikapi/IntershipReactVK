import { configureStore } from '@reduxjs/toolkit';
import newsListReducer from './NewsListSlice';

const store = configureStore({
  reducer: {
    newsList: newsListReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;