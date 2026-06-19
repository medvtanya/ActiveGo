import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import type { EventArrayType, EventType } from "../model";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";
import { AxiosError } from "axios";
import { CLIENT_ROUTES } from "@/shared/enums/clientRoutes";

enum EVENT_THUNK_TYPES {
  GET_ALL = "event/allEvents",
  GET_ONE = "event/oneEvent",
  POST = "event/createEvent",
  PUT = "event/updateEvent",
  DELETE = "event/deleteEvent",
}

enum EVENT_API_URLS {
  GET_ALL_AND_POST = "/event",
  GET_ONE_PUT_DELETE = "/event/",
}

export const getAllEventsThunk = createAsyncThunk<
  EventArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(EVENT_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<EventArrayType>
    >(EVENT_API_URLS.GET_ALL_AND_POST);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getEventsWithComplaintsThunk = createAsyncThunk<
  EventArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>("event/eventsWithComplaints", async (_, { rejectWithValue }) => {
  try {
    console.log("getEventsWithComplaintsThunk - отправляем запрос...");

    const currentToken = localStorage.getItem("accessToken");
    console.log("getEventsWithComplaintsThunk - текущий токен:", {
      hasToken: !!currentToken,
      tokenLength: currentToken?.length || 0,
    });

    const response = await axiosInstance.get<
      ServerResponseType<EventArrayType>
    >(`${EVENT_API_URLS.GET_ALL_AND_POST}/with-complaints`);
    console.log(
      "getEventsWithComplaintsThunk - успешный ответ:",
      response.data
    );
    return response.data.data;
  } catch (error) {
    console.log("getEventsWithComplaintsThunk - ошибка:", error);
    if (error instanceof AxiosError && error.response?.status === 403) {
      window.location.href = CLIENT_ROUTES.HOME;
      return rejectWithValue({
        statusCode: 403,
        message: "Доступ запрещен. Требуются права администратора",
        data: null,
        error: "Forbidden",
      });
    }
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneEventThunk = createAsyncThunk<
  EventType,
  number,
  { rejectValue: ServerResponseType<null> }
>(EVENT_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<EventType>>(
      `${EVENT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createEventThunk = createAsyncThunk<
  EventType,
  FormData,
  { rejectValue: ServerResponseType<null> }
>(EVENT_THUNK_TYPES.POST, async (formData, { rejectWithValue }) => {
  try {
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    const response = await axiosInstance.post<ServerResponseType<EventType>>(
      EVENT_API_URLS.GET_ALL_AND_POST,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  } catch (error) {
    console.error("Ошибка при создании события:", error);
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateEventThunk = createAsyncThunk<
  EventType,
  { id: number; data: Partial<EventType> | FormData },
  { rejectValue: ServerResponseType<null> }
>(EVENT_THUNK_TYPES.PUT, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<EventType>>(
      `${EVENT_API_URLS.GET_ONE_PUT_DELETE}${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteEventThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(EVENT_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete<ServerResponseType<null>>(
      `${EVENT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return id;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const joinEventThunk = createAsyncThunk<
  EventType,
  { eventId: number },
  { rejectValue: ServerResponseType<null> }
>("event/join", async ({ eventId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<EventType>>(
      `/event/${eventId}/join`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const leaveEventThunk = createAsyncThunk<
  EventType,
  { eventId: number },
  { rejectValue: ServerResponseType<null> }
>("event/leave", async ({ eventId }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<ServerResponseType<EventType>>(
      `/event/${eventId}/leave`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getMyActiveEventsThunk = createAsyncThunk<
  EventArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>("event/myActive", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<EventArrayType>
    >("/event/my-active");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
