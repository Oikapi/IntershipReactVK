import { createAsyncThunk, createSlice,PayloadAction,AnyAction } from "@reduxjs/toolkit";
import { Item } from "../commonTypes/index";

type NewsListState = {
    list : Item[],
    error : boolean,
    loading : boolean
}

const initialState : NewsListState = {
  list : [],
  error : false,
  loading : false
}

const fetchNewsById = async (newsId: number): Promise<Item> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch news details');
  }
  const newsDetails:Item = await response.json();
  return newsDetails;
};

export const fetchNewsList = createAsyncThunk<boolean, undefined, {rejectValue: string}>(
    'newsList/fetchNewsList',
    async function (_, { rejectWithValue,dispatch  }) {
      const response = await fetch(`https://hacker-news.firebaseio.com/v0/newstories.json`);
      const newList:Item[] = []
      if (!response.ok) {
        return rejectWithValue('Server Error!');
      }
      const data = await response.json();
      const idsArray = data.slice(1,100);
      for (const id of idsArray) {
        const news = await fetchNewsById(id);
        dispatch(addNewsToList(news));
      }
      
      return true
    }
);

const newsListSlice = createSlice({
    name: 'newsList',
    initialState,
    reducers: {
      addNewsToList(state, action: PayloadAction<Item>) {
        state.list.push(action.payload);
        state.loading = false;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchNewsList.pending, (state) => {
          state.list = [];
          state.loading = true;
          state.error = false;
        })
        .addCase(fetchNewsList.fulfilled, (state, action) => {
          state.loading = false;
        })
    }
  });

  export default newsListSlice.reducer

  export const { addNewsToList } = newsListSlice.actions;

  function isError(action: AnyAction) {
    return action.type.endsWith('rejected');
  }