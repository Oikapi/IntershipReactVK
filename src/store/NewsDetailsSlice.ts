import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from '@reduxjs/toolkit';
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

// export const fetchCommentById = createAsyncThunk<Item, number, {rejectValue: Item}>(
//   'newsDetails/fetchCommentById',
//   async function (newsId, { rejectWithValue }){
//       const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${newsId}.json`);
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch news details');
//       }
//       const newsDetails: Item = await response.json() as Item;
//       return newsDetails;
//     }
// );

export const fetchNewsComments = createAsyncThunk<undefined, Item | ItemTreeNode, {rejectValue: string, state : {newsDetails: NewsDetailsState}}>(
  'newsDetails/fetchNewsComments',
  async function (item, { rejectWithValue,dispatch, getState }) {
    if(!(item as ItemTreeNode)?.children?.length){
      for(const id of item.kids){
        const newComment = await fetchCommentById(id);
        console.log("DJnnen")
        console.log()
        const treeComm : ItemTreeNode = {
          ...newComment ,
          level : item.type === "story" ? 0 : (item as ItemTreeNode).level + 1 ,
          children : []
        }
        dispatch(addCommentToList(treeComm))
      }
    }
      
      




    // console.log(args.idsArray)
    // for (const id of args.idsArray) {
    //   const payload = await dispatch(fetchCommentById(id));
    //   const treeComm : ItemTreeNode = {
    //     ...payload.payload ,
    //     level : args.level,
    //     children : []
    //   }
    //   const parentId =  args.level === 0 ? getState().newsDetails.newsDetails?.id || id : id
    //   dispatch(addCommentToList({treeComm :treeComm, parentId : parentId}));
    // }
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
      console.log(action.payload)
      if(action.payload.level === 0) {
        state.comments.push(action.payload)
      }else{
        for(const node of state.comments){
          const parent = findNodeById(node, action.payload.parent);
          console.log("Ищем")
          if (parent) {
            console.log("Нашли")
            action.payload.level = parent.level + 1; // Устанавливаем уровень нового узла
            parent.children.push(action.payload);
          }
          }
        }
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
        state.comments = [];
        state.loading = false;
      })
      .addCase(fetchNewsComments.pending, (state) => {
        state.comments = [];
        state.loading = true;
        state.error = null;
      })
  }
});

export default newsDetailsSlice.reducer;

export const { addCommentToList} = newsDetailsSlice.actions;

function isError(action: AnyAction) {
  return action.type.endsWith('rejected');
}