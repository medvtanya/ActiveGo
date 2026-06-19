import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../model";
import {
  createSportThunk,
  deleteSportThunk,
  getAllSportsThunk,
  getOneSportThunk,
  updateSportThunk,
} from "../api/sportApi";

const sportSlice = createSlice({
  name: "sport",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllSportsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllSportsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.sports = action.payload;
      })
      .addCase(getAllSportsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOneSportThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOneSportThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.sport = action.payload;
      })
      .addCase(getOneSportThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createSportThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSportThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.sport = action.payload;
        if (state.sports) {
          state.sports.push(action.payload);
        } else {
          state.sports = [action.payload];
        }
      })
      .addCase(createSportThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateSportThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSportThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.sport = action.payload;
        if (state.sports) {
          state.sports = state.sports.map((sport) =>
            sport.id === action.payload.id ? action.payload : sport
          );
        }
      })
      .addCase(updateSportThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteSportThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSportThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.sport = null;
        if (state.sports) {
          state.sports = state.sports.filter(
            (sport) => sport.id !== action.payload
          );
        }
      })
      .addCase(deleteSportThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      }),
});
export const sportReducer = sportSlice.reducer;
