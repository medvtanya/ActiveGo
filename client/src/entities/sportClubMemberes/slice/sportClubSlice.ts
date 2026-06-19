import { createSlice } from "@reduxjs/toolkit";
import { initialState } from "../model";
import {
  getAllSportClubMembersThunk,
  getOneSportClubMemberThunk,
  createSportClubMemberThunk,
  updateSportClubMemberThunk,
  deleteSportClubMemberThunk,
} from "../api/sportClubMemberesApi";

const sportClubMemberSlice = createSlice({
  name: "sportClubMember",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getAllSportClubMembersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSportClubMembersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubMembers = action.payload;
      })
      .addCase(getAllSportClubMembersThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(getOneSportClubMemberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneSportClubMemberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentSportClubMember = action.payload;
      })
      .addCase(getOneSportClubMemberThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createSportClubMemberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSportClubMemberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const existingIndex = state.sportClubMembers.findIndex(
          (member) =>
            member.sportClub_id === action.payload.sportClub_id &&
            member.user_id === action.payload.user_id
        );
        if (existingIndex === -1) {
          state.sportClubMembers.push(action.payload);
        } else {
          state.sportClubMembers[existingIndex] = action.payload;
        }
      })
      .addCase(createSportClubMemberThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateSportClubMemberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSportClubMemberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubMembers = state.sportClubMembers.map((sportClubMember) =>
          sportClubMember.id === action.payload.id
            ? action.payload
            : sportClubMember
        );
      })
      .addCase(updateSportClubMemberThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteSportClubMemberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSportClubMemberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.sportClubMembers = state.sportClubMembers.filter(
          (sportClubMember) => sportClubMember.id !== action.payload
        );
      })
      .addCase(deleteSportClubMemberThunk.rejected, (state) => {
        state.loading = false;
        state.error = null;
      }),
});

export const sportClubMemberReducer = sportClubMemberSlice.reducer;
