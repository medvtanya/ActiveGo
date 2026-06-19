import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../model";
import {
  createComplaintThunk,
  deleteComplaintThunk,
  getAllComplaintsThunk,
  getOneComplaintThunk,
  updateComplaintThunk,
} from "../api/complaintApi";

const complaintSlice = createSlice({
  name: "complaint",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllComplaintsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllComplaintsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.complains = action.payload;
      })
      .addCase(getAllComplaintsThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(getOneComplaintThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOneComplaintThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.complain = action.payload;
      })
      .addCase(getOneComplaintThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(createComplaintThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createComplaintThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.complain = action.payload;
        if (state.complains) {
          state.complains.push(action.payload);
        } else {
          state.complains = [action.payload];
        }
      })
      .addCase(createComplaintThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(updateComplaintThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateComplaintThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.complain = action.payload;
        if (state.complains) {
          state.complains = state.complains.map((complain) =>
            complain.id === action.payload.id ? action.payload : complain
          );
        }
      })
      .addCase(updateComplaintThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(deleteComplaintThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteComplaintThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.complain = null;
        if (state.complains) {
          state.complains = state.complains.filter(
            (complain) => complain.id !== action.payload
          );
        }
      })
      .addCase(deleteComplaintThunk.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      }),
});
export const complaintReducer = complaintSlice.reducer;
