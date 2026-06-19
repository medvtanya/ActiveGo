import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../model";
import {
  getAllSportClubsThunk,
  getOneSportClubThunk,
  createSportClubThunk,
  updateSportClubThunk,
  deleteSportClubThunk,
} from "../api/sportClubApi";

const sportClubSlice = createSlice({
  name: "sportClub",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllSportClubsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSportClubsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubs = action.payload;
      })
      .addCase(getAllSportClubsThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getOneSportClubThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneSportClubThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentSportClub = action.payload;
      })
      .addCase(getOneSportClubThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSportClubThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSportClubThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubs.push(action.payload);
      })
      .addCase(createSportClubThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSportClubThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSportClubThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubs = state.sportClubs.map((sportClub) =>
          sportClub.id === action.payload.id ? action.payload : sportClub
        );
      })
      .addCase(updateSportClubThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSportClubThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSportClubThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubs = state.sportClubs.filter(
          (sportClub) => sportClub.id !== action.payload
        );
      })
      .addCase(deleteSportClubThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }),
});

export const sportClubReducer = sportClubSlice.reducer;
