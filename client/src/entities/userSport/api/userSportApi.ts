import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";
import type { UserSportType, UserSportArrayType } from "../model";
import { createAsyncThunk } from "@reduxjs/toolkit";

export enum USER_SPORT_THUNK_TYPES {
  GET_ALL = "userSport/getAllUserSports",
  GET_ONE = "userSport/getOneUserSport",
  CREATE = "userSport/createUserSport",
  UPDATE = "userSport/updateUserSport",
  DELETE = "userSport/deleteUserSport",
}

export enum USER_SPORT_API_URLS {
  GET_ALL_OR_CREATE_USER_SPORTS = "/usersport",
  GET_ONE_OR_DELETE_OR_EPDATE_USER_SPORT = "/usersport/:id",
}

export const getAllUserSportsThunk = createAsyncThunk<
  UserSportArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(USER_SPORT_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<UserSportArrayType>
    >(USER_SPORT_API_URLS.GET_ALL_OR_CREATE_USER_SPORTS);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneUserSportThunk = createAsyncThunk<
  UserSportType,
  //void
  number,
  { rejectValue: ServerResponseType<null> }
>(USER_SPORT_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<UserSportType>>(
      USER_SPORT_API_URLS.GET_ONE_OR_DELETE_OR_EPDATE_USER_SPORT.replace(
        ":id",
        id.toString()
      )
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createUserSportThunk = createAsyncThunk<
  UserSportType,
  Omit<UserSportType, "id" | "createdAt" | "updatedAt">,
  { rejectValue: ServerResponseType<null> }
>(USER_SPORT_THUNK_TYPES.CREATE, async (userSportData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<UserSportType>
    >(USER_SPORT_API_URLS.GET_ALL_OR_CREATE_USER_SPORTS, userSportData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteUserSportThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(USER_SPORT_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.delete<ServerResponseType<number>>(
      USER_SPORT_API_URLS.GET_ONE_OR_DELETE_OR_EPDATE_USER_SPORT.replace(
        ":id",
        id.toString()
      )
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateUserSportThunk = createAsyncThunk<
  UserSportType,
  UserSportType,
  { rejectValue: ServerResponseType<null> }
>(USER_SPORT_THUNK_TYPES.UPDATE, async (newData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<UserSportType>>(
      USER_SPORT_API_URLS.GET_ONE_OR_DELETE_OR_EPDATE_USER_SPORT.replace(
        ":id",
        newData.id.toString()
      ),
      newData
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
