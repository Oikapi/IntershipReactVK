import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
import {News,Comment} from "../commonTypes/index"

export type NewsDetailsState = {
    newsDetails: News|null;
    comments : Comment[];
    loading: boolean;
    error: string | null;
    loadingComms : boolean;
}

const fetchCommentById = async (newsId: number): Promise<Comment> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch news details');
  }
  const newsDetails:Comment = await response.json();
  return newsDetails;
};

export const fetchNewsComments = createAsyncThunk<undefined, number[], {rejectValue: string}>(
  'newsDetails/fetchNewsComments',
  async function (commentIds, { rejectWithValue,dispatch }) {
    
    // commentIds.map((id: number) => fetchCommentById(id));
    console.log(commentIds)
    for (const id of commentIds) {
      const news = await fetchCommentById(id);
      dispatch(addCommentToList(news));
    }

    return undefined
    
  }
);

export const fetchNewsDetails = createAsyncThunk<News, number, {rejectValue: string}>(
    'newsDetails/fetchNewsDetails',
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
  comments : [],
  loading: false,
  error: null,
  loadingComms : false,
}

const newsDetailsSlice = createSlice({
  name: 'newsDetails',
  initialState,
  reducers: {
    addCommentToList(state, action: PayloadAction<Comment>) {
      state.comments.push(action.payload);
      state.loading = false;
    },
  },
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

export default newsDetailsSlice.reducer;

export const { addCommentToList } = newsDetailsSlice.actions;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}