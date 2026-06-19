import { createSlice } from '@reduxjs/toolkit';
import { initialState } from '../model';
import {
  getAllUserSportsThunk,
  getOneUserSportThunk,
  createUserSportThunk,
  updateUserSportThunk,
  deleteUserSportThunk,
} from '../api/userSportApi';

const userSportSlice = createSlice({
  name: 'userSport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(getAllUserSportsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserSportsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userSports = action.payload;
        state.error = null;
        state.isInizialized = true;
      })
      .addCase(getAllUserSportsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(getOneUserSportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneUserSportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userSport = action.payload;
        state.error = null;
        state.isInizialized = true;
      })
      .addCase(getOneUserSportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(createUserSportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserSportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userSport = action.payload;
        state.error = null;
        state.isInizialized = true;
      })
      .addCase(createUserSportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(deleteUserSportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserSportThunk.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userSport) {
          state.userSport.id = action.payload;
        }
        state.error = null;
        state.isInizialized = true;
      })
      .addCase(deleteUserSportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(updateUserSportThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserSportThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userSport = action.payload;
        state.error = null;
        state.isInizialized = true;
      })
      .addCase(updateUserSportThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      });
  },
});

export const userSportReducer = userSportSlice.reducer;
