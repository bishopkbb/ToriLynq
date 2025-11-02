import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../../services/postService';

const initialState = {
  posts: [],
  currentPage: 1,
  hasMore: true,
  isLoading: false,
  isRefreshing: false,
  error: null,
  totalPosts: 0,
};

// Async thunks
export const fetchFeed = createAsyncThunk(
  'posts/fetchFeed',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await postService.getFeed(page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshFeed = createAsyncThunk(
  'posts/refreshFeed',
  async ({ limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await postService.getFeed(1, limit);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleLikePost = createAsyncThunk(
  'posts/toggleLike',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await postService.toggleLike(postId);
      return { postId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    updatePostLikes: (state, action) => {
      const { postId, liked, likesCount } = action.payload;
      const post = state.posts.find(p => p._id === postId);
      if (post) {
        post.liked = liked;
        post.likesCount = likesCount;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Feed
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        const newPosts = action.payload.data || [];
        
        // Append new posts, avoid duplicates
        const existingIds = new Set(state.posts.map(p => p._id));
        const uniqueNewPosts = newPosts.filter(p => !existingIds.has(p._id));
        
        state.posts = [...state.posts, ...uniqueNewPosts];
        state.currentPage = action.payload.pagination?.page || state.currentPage;
        state.totalPosts = action.payload.pagination?.totalPosts || state.totalPosts;
        state.hasMore = state.posts.length < state.totalPosts;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Refresh Feed
      .addCase(refreshFeed.pending, (state) => {
        state.isRefreshing = true;
        state.error = null;
      })
      .addCase(refreshFeed.fulfilled, (state, action) => {
        state.isRefreshing = false;
        state.posts = action.payload.data || [];
        state.currentPage = 1;
        state.totalPosts = action.payload.pagination?.totalPosts || 0;
        state.hasMore = true;
      })
      .addCase(refreshFeed.rejected, (state, action) => {
        state.isRefreshing = false;
        state.error = action.payload;
      })
      // Create Post
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts = [action.payload.data, ...state.posts];
      })
      // Toggle Like
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p._id === action.payload.postId);
        if (post) {
          post.likesCount = action.payload.likesCount;
          post.liked = action.payload.liked;
        }
      });
  },
});

export const { clearPosts, updatePostLikes } = postsSlice.actions;
export default postsSlice.reducer;
