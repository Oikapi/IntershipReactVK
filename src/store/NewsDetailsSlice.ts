import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {Item,ItemTreeNode} from "../commonTypes/index"

export type NewsDetailsState = {
    newsDetails: Item|null;
    comments : ItemTreeNode[];
    loading: boolean;
    error: string | null;
    loadingComms : boolean;
}

function findNodeById(node: ItemTreeNode, id: number): ItemTreeNode | undefined {
  if (node?.id === id) {
    return node;
  }
  for (const child of node.children) {
    const found = findNodeById(child, id);
    if (found) {
      return found;
    }
  }
  return undefined;
}

const fetchCommentById = async (newsId: number): Promise<Item> => {
  const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
  if (!response.ok) {
    throw new Error('Failed to fetch news details');
  }
  const newsDetails:Item = await response.json();
  return newsDetails;
};

export const fetchNewsComments = createAsyncThunk<undefined, Item | ItemTreeNode, {rejectValue: string, state : {newsDetails: NewsDetailsState}}>(
  'newsDetails/fetchNewsComments',
  async function (item, { dispatch }) {
    if(item.type === "story"){
      dispatch(refreshComments());
    }
    if(!(item as ItemTreeNode)?.children?.length){
      for(const id of item.kids){
        const newComment = await fetchCommentById(id);
        const treeComm : ItemTreeNode = {
          ...newComment ,
          children : []
        }
        dispatch(addCommentToList(treeComm))
      }
    }

    return undefined
  }
);

export const fetchNewsDetails = createAsyncThunk<Item, number, {rejectValue: string}>(
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
    addCommentToList(state, action: PayloadAction<ItemTreeNode>) {
      if(action.payload.parent === state.newsDetails?.id) {
        state.comments.push(action.payload)
      }else{
        for(const node of state.comments){
          const parent = findNodeById(node, action.payload.parent);
          if (parent) {
            parent.children.push(action.payload);
          }
          }
        }
      state.loading = false;
    },
    refreshComments(state){
      state.comments = []
    }
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

export const { addCommentToList,refreshComments} = newsDetailsSlice.actions;
