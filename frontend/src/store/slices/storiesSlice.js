import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import storyService from '../../services/storyService';

const initialState = {
  stories: [], // Grouped by author
  currentStory: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchStories = createAsyncThunk(
  'stories/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await storyService.getStories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createStory = createAsyncThunk(
  'stories/createStory',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await storyService.createStory(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStory = createAsyncThunk(
  'stories/deleteStory',
  async (storyId, { rejectWithValue }) => {
    try {
      await storyService.deleteStory(storyId);
      return storyId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const viewStory = createAsyncThunk(
  'stories/viewStory',
  async (storyId, { rejectWithValue }) => {
    try {
      const response = await storyService.viewStory(storyId);
      return { storyId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    setCurrentStory: (state, action) => {
      state.currentStory = action.payload;
    },
    clearCurrentStory: (state) => {
      state.currentStory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stories = action.payload.data || [];
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create Story
      .addCase(createStory.fulfilled, (state, action) => {
        // Add new story to the beginning
        const newStory = action.payload.data;
        const existingGroup = state.stories.find(
          (group) => group.author._id === newStory.author._id
        );
        
        if (existingGroup) {
          existingGroup.stories.unshift(newStory);
        } else {
          state.stories.unshift({
            author: newStory.author,
            stories: [newStory],
          });
        }
      })
      // Delete Story
      .addCase(deleteStory.fulfilled, (state, action) => {
        const storyId = action.payload;
        state.stories = state.stories.map((group) => ({
          ...group,
          stories: group.stories.filter((story) => story._id !== storyId),
        })).filter((group) => group.stories.length > 0);
      });
  },
});

export const { setCurrentStory, clearCurrentStory } = storiesSlice.actions;
export default storiesSlice.reducer;
