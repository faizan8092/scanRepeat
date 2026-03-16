import { configureStore, createSlice } from '@reduxjs/toolkit';

// Simple slice for demonstration
const appSlice = createSlice({
  name: 'app',
  initialState: {
    isReady: false,
  },
  reducers: {
    setReady: (state, action) => {
      state.isReady = action.payload;
    },
  },
});

export const { setReady } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
