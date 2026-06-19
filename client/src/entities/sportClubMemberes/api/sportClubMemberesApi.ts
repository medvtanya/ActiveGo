import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type { SportClubMemberArrayType, SportClubMemberType } from "../model";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";

enum SPORT_CLUB_MEMBERS_THUNK_TYPES {
  GET_ALL = "sportClubMemberes/allSportClubMembers",
  GET_ONE = "sportClubMemberes/oneSportClubMember",
  CREATE = "sportClubMemberes/createSportClubMember",
  UPDATE = "sportClubMemberes/updateSportClubMember",
  DELETE = "sportClubMemberes/deleteSportClubMember",
}

enum SPORT_CLUB_MEMBERS_API_URLS {
  BASE = "/sportClubMemberes",
}

export const getAllSportClubMembersThunk = createAsyncThunk<
  SportClubMemberArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_MEMBERS_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<SportClubMemberArrayType>
    >(SPORT_CLUB_MEMBERS_API_URLS.BASE);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneSportClubMemberThunk = createAsyncThunk<
  SportClubMemberType,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_MEMBERS_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<SportClubMemberType>
    >(`${SPORT_CLUB_MEMBERS_API_URLS.BASE}/${id}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createSportClubMemberThunk = createAsyncThunk<
  SportClubMemberType,
  { sportClub_id: number; user_id: number; access?: boolean },
  { rejectValue: ServerResponseType<null> }
>(
  SPORT_CLUB_MEMBERS_THUNK_TYPES.CREATE,
  async (sportClubData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<
        ServerResponseType<SportClubMemberType>
      >(SPORT_CLUB_MEMBERS_API_URLS.BASE, sportClubData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const updateSportClubMemberThunk = createAsyncThunk<
  SportClubMemberType,
  { id: number; data: Partial<SportClubMemberType> },
  { rejectValue: ServerResponseType<null> }
>(
  SPORT_CLUB_MEMBERS_THUNK_TYPES.UPDATE,
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put<
        ServerResponseType<SportClubMemberType>
      >(`${SPORT_CLUB_MEMBERS_API_URLS.BASE}/${id}`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const deleteSportClubMemberThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_MEMBERS_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ServerResponseType<number>>(
      `${SPORT_CLUB_MEMBERS_API_URLS.BASE}/${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
