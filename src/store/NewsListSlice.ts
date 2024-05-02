import { createAsyncThunk, createSlice,PayloadAction,AnyAction } from "@reduxjs/toolkit";
import { News } from "../commonTypes/index";

type NewsListState = {
    list : News[],
    error : boolean,
    loading : boolean
}

const initialState : NewsListState = {
  list : [],
  error : false,
  loading : false
}

const fetchNewsById = async (newsId: number): Promise<News> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch news details');
  }
  const newsDetails:News = await response.json();
  return newsDetails;
};

export const fetchNewsList = createAsyncThunk<News[], undefined, {rejectValue: string}>(
    'newsList/fetchNewsIdList',
    async function (_, { rejectWithValue }) {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/newstories.json`);
      const newList:News[] = []
      if (!response.ok) {
        return rejectWithValue('Server Error!');
      }
      const data = await response.json();
      const idsArray = data.slice(1,100);
      const promises = idsArray.map((id: number) => fetchNewsById(id));
      const newsArray:News[] = await Promise.all(promises);
      return newsArray;
    }
);

const newsListSlice = createSlice({
    name: 'newsList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchNewsList.pending, (state) => {
          state.loading = true;
          state.error = false;
        })
        .addCase(fetchNewsList.fulfilled, (state, action) => {
          state.list = action.payload;
          state.loading = false;
        })
    }
  });

  export default newsListSlice.reducer

  function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
  }