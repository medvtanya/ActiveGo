import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";
import type { SportArrayType, SportType } from "../model";

enum SPORT_THUNK_TYPES {
  GET_ALL = "sport/allSports",
  GET_ONE = "sport/oneSport",
  POST = "sport/createSport",
  PUT = "sport/updateSport",
  DELETE = "sport/deleteSport",
}

enum SPORT_API_URLS {
  GET_ALL_AND_POST = "/sport",
  GET_ONE_PUT_DELETE = "/sport/",
}

export const getAllSportsThunk = createAsyncThunk<
  SportArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(SPORT_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<SportArrayType>
    >(SPORT_API_URLS.GET_ALL_AND_POST);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneSportThunk = createAsyncThunk<
  SportType,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<SportType>>(
      `${SPORT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createSportThunk = createAsyncThunk<
  SportType,
  Omit<SportType, "id" | "createdAt" | "updatedAt">,
  { rejectValue: ServerResponseType<null> }
>(SPORT_THUNK_TYPES.POST, async (sportData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<SportType>>(
      SPORT_API_URLS.GET_ALL_AND_POST,
      sportData
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateSportThunk = createAsyncThunk<
  SportType,
  { id: number; data: Partial<SportType> },
  { rejectValue: ServerResponseType<null> }
>(SPORT_THUNK_TYPES.PUT, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<SportType>>(
      `${SPORT_API_URLS.GET_ONE_PUT_DELETE}${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteSportThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(SPORT_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete<ServerResponseType<null>>(
      `${SPORT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return id;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
