import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../model";
import {
  createEventThunk,
  deleteEventThunk,
  getAllEventsThunk,
  getEventsWithComplaintsThunk,
  getOneEventThunk,
  updateEventThunk,
  getMyActiveEventsThunk,
} from "../api/eventApi";

const eventSlice = createSlice({
  name: "event",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllEventsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.events = action.payload;
      })
      .addCase(getAllEventsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getEventsWithComplaintsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getEventsWithComplaintsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.events = action.payload;
      })
      .addCase(getEventsWithComplaintsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOneEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOneEventThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.event = action.payload;
      })
      .addCase(getOneEventThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createEventThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.event = action.payload;
      })
      .addCase(createEventThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateEventThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.event = action.payload;
        if (state.events) {
          state.events = state.events.map((event) =>
            event.id === action.payload.id ? action.payload : event
          );
        }
      })
      .addCase(updateEventThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteEventThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteEventThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.event = null;
        if (state.events) {
          state.events = state.events.filter(
            (event) => event.id !== action.payload
          );
        }
      })
      .addCase(deleteEventThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getMyActiveEventsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyActiveEventsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.myActiveEvents = action.payload;
      })
      .addCase(getMyActiveEventsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      }),
});
export const eventReducer = eventSlice.reducer;
