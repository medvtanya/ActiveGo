import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type { CityType } from "../model";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";

export enum CITY_THUNK_TYPES {
  GET_ALL = "city/getAllCities",
  GET_ONE = "city/getOneCity",
  CREATE = "city/createCity",
}

export enum CITY_API_URLS {
  GET_ALL = "/city/cities",
  GET_ONE_AND_CREATE = "/city/cities/",
}

export const getAllCitiesThunk = createAsyncThunk<
  CityType[],
  void,
  { rejectValue: ServerResponseType<null> }
>(CITY_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<CityType[]>>(
      CITY_API_URLS.GET_ALL
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneCityThunk = createAsyncThunk<
  CityType,
  number,
  { rejectValue: ServerResponseType<null> }
>(CITY_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<CityType>>(
      CITY_API_URLS.GET_ONE_AND_CREATE + id
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createCityThunk = createAsyncThunk<
  CityType,
  { city: string },
  { rejectValue: ServerResponseType<null> }
>(CITY_THUNK_TYPES.CREATE, async (payload, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<CityType>>(
      CITY_API_URLS.GET_ONE_AND_CREATE,
      payload
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
