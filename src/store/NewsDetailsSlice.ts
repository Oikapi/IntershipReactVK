import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import {News} from "../commonTypes/index"

export type NewsDetailsState = {
  newsDetails: News | null;
    loading: boolean;
    error: string | null;
}

export const fetchNewsDetails = createAsyncThunk<News, number, {rejectValue: string}>(
    'news/fetchNewsDetails',
    async function (newsId, { rejectWithValue }) {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
      
      if (!response.ok) {
        return rejectWithValue('Server Error!');
      }

      const data = await response.json();

      return data;
    }
);

const initialState: NewsDetailsState = {
    newsDetails: null,
  loading: false,
  error: null,
}

const movieDetailsSlice = createSlice({
  name: 'movieDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsDetails.fulfilled, (state, action) => {
        state.newsDetails = action.payload;
        state.loading = false;
      })
  }
});

export default movieDetailsSlice.reducer;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}