import { createSlice } from "@reduxjs/toolkit";
import type { CityType } from "../model";
import {
  getAllCitiesThunk,
  getOneCityThunk,
  createCityThunk,
} from "../api/cityApi";

interface CityState {
  cities: CityType[];
  currentCity: CityType | null;
  loading: boolean;
  error: string | null;
}

const initialState: CityState = {
  cities: [],
  currentCity: null,
  loading: false,
  error: null,
};

const citySlice = createSlice({
  name: "city",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCitiesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCitiesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(getAllCitiesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })
      .addCase(getOneCityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneCityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCity = action.payload;
      })
      .addCase(getOneCityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })
      .addCase(createCityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCityThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action.payload);
      })
      .addCase(createCityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      });
  },
});

export const cityReducer = citySlice.reducer;
