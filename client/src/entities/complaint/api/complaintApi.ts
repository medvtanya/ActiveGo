import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/shared/lib/axiosInstance";
import type { ServerResponseType } from "@/shared/types";
import { handleAxiosError } from "@/shared/utils/handleAxiosError";
import {
  type ComplaintArrayType,
  type ComplaintType,
  type CreateComplaintDto,
} from "../model";

enum COMPLAINT_THUNK_TYPES {
  GET_ALL = "complaint/allComplaints",
  GET_ONE = "complaint/oneComplaint",
  POST = "complaint/createComplaint",
  PUT = "complaint/updateComplaint",
  DELETE = "complaint/deleteComplaint",
}

enum COMPLAINT_API_URLS {
  GET_ALL_AND_POST = "/complaint",
  GET_ONE_PUT_DELETE = "/complaint/",
}

export const getAllComplaintsThunk = createAsyncThunk<
  ComplaintArrayType,
  void,
  { rejectValue: ServerResponseType<null> }
>(COMPLAINT_THUNK_TYPES.GET_ALL, async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<
      ServerResponseType<ComplaintArrayType>
    >(COMPLAINT_API_URLS.GET_ALL_AND_POST);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const getOneComplaintThunk = createAsyncThunk<
  ComplaintType,
  number,
  { rejectValue: ServerResponseType<null> }
>(COMPLAINT_THUNK_TYPES.GET_ONE, async (id, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get<ServerResponseType<ComplaintType>>(
      `${COMPLAINT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const createComplaintThunk = createAsyncThunk<
  ComplaintType,
  CreateComplaintDto,
  { rejectValue: ServerResponseType<null> }
>(COMPLAINT_THUNK_TYPES.POST, async (complaintData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<ComplaintType>
    >(COMPLAINT_API_URLS.GET_ALL_AND_POST, complaintData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateComplaintThunk = createAsyncThunk<
  ComplaintType,
  { id: number; data: Partial<ComplaintType> },
  { rejectValue: ServerResponseType<null> }
>(COMPLAINT_THUNK_TYPES.PUT, async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.put<ServerResponseType<ComplaintType>>(
      `${COMPLAINT_API_URLS.GET_ONE_PUT_DELETE}${id}`,
      data
    );
    return response.data.data;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteComplaintThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(COMPLAINT_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete<ServerResponseType<null>>(
      `${COMPLAINT_API_URLS.GET_ONE_PUT_DELETE}${id}`
    );
    return id;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});
