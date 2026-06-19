import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type { SportClubArrayType, SportClubType } from "../model";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";

enum SPORT_CLUB_THUNK_TYPES {
  GET_ALL = "sportClub/allSportClubs",
  GET_ONE = "sportClub/oneSportClub",
  CREATE = "sportclub/createSportClub",
  UPDATE = "sportClub/updateSportClub",
  DELETE = "sportClub/deleteSportClub",
}

enum SPORT_CLUB_API_URLS {
  GET_ALL_SPORT_CLUBS = "/sportClub",
  GET_ONE_SPORT_CLUB = "/sportClub/",
  CREATE_SPORT_CLUB = "/sportclub",
  UPDATE_SPORT_CLUB = "/sportClub/update/",
  DELETE_SPORT_CLUB = "/sportClub/delete/",
}

export const getAllSportClubsThunk = createAsyncThunk<
  SportClubArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<SportClubArrayType>
    >(SPORT_CLUB_API_URLS.GET_ALL_SPORT_CLUBS);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneSportClubThunk = createAsyncThunk<
  SportClubType,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<SportClubType>>(
      `${SPORT_CLUB_API_URLS.GET_ONE_SPORT_CLUB}${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createSportClubThunk = createAsyncThunk<
  SportClubType,
  FormData,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_THUNK_TYPES.CREATE, async (sportClubData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<SportClubType>
    >(SPORT_CLUB_API_URLS.CREATE_SPORT_CLUB, sportClubData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateSportClubThunk = createAsyncThunk<
  SportClubType,
  { id: number; data: FormData },
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_THUNK_TYPES.UPDATE, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<SportClubType>>(
      `${SPORT_CLUB_API_URLS.UPDATE_SPORT_CLUB}${id}`,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteSportClubThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_CLUB_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ServerResponseType<number>>(
      `${SPORT_CLUB_API_URLS.DELETE_SPORT_CLUB}${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
