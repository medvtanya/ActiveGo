import { createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance, setAccessToken } from '@/shared/lib/axiosInstance';
import type { ServerResponseType } from '@/shared/types';
import { handleAxiosError } from '@/shared/utils/handleAxiosError';
import type { AxiosError } from 'axios';
import type {
  UserType,
  UserResponsType,
  LoginUserType,
  RegisterUserType,
  TelegramLoginType,
  TelegramRegisterType,
} from '../model';

export enum USER_THUNK_TYPES {
  REGISTER = 'user/registerUser',
  LOGIN = 'user/loginUser',
  LOGOUT = 'user/logoutUser',
  TELEGRAM_REGISTER = 'user/telegramRegisterUser',
  TELEGRAM_LOGIN = 'user/telegramLoginUser',
  UPDATE = 'user/updateUser',
  DELETE = 'user/deleteUser',
  REFRESH = 'user/refreshToken',
}

export enum USER_API_URLS {
  REGISTER = '/auth/register',
  LOGIN = '/auth/login',
  LOGOUT = '/auth/logout',
  TELEGRAM_REGISTER = '/auth/telegram/register',
  TELEGRAM_LOGIN = '/auth/telegram/login',
  USER = '/user/',
  REFRESH = '/auth/refresh',
}

export const registerUserThunk = createAsyncThunk<
  UserType,
  RegisterUserType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.REGISTER, async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<UserResponsType>
    >(USER_API_URLS.REGISTER, userData);
    setAccessToken(response.data.data.accessToken);
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const loginUserThunk = createAsyncThunk<
  UserType,
  LoginUserType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.LOGIN, async (loginData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<UserResponsType>
    >(USER_API_URLS.LOGIN, loginData);

    const accessToken = response.data.data.accessToken;
    console.log('loginUserThunk - получен токен:', {
      tokenLength: accessToken.length,
      tokenPreview: accessToken.substring(0, 20) + '...',
    });

    setAccessToken(accessToken);

    localStorage.setItem('accessToken', accessToken);

    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const telegramRegisterThunk = createAsyncThunk<
  UserType,
  TelegramRegisterType,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.TELEGRAM_REGISTER, async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<UserResponsType>
    >(USER_API_URLS.TELEGRAM_REGISTER, userData);

    const accessToken = response.data.data.accessToken;
    console.log('telegramRegisterThunk - получен токен:', {
      tokenLength: accessToken.length,
      tokenPreview: accessToken.substring(0, 20) + '...',
    });

    setAccessToken(accessToken);
    localStorage.setItem('accessToken', accessToken);

    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const telegramRegisterInitialThunk = createAsyncThunk<
  UserType,
  TelegramRegisterType,
  { rejectValue: ServerResponseType<null> }
>('user/telegramRegisterInitial', async (userData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post<
      ServerResponseType<UserResponsType>
    >(USER_API_URLS.TELEGRAM_REGISTER, userData);

 
  

    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const telegramLoginThunk = createAsyncThunk<
  UserType,
  TelegramLoginType,
  { rejectValue: ServerResponseType<null> }
>(
  USER_THUNK_TYPES.TELEGRAM_LOGIN,
  async (telegramData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<
        ServerResponseType<UserResponsType>
      >(USER_API_URLS.TELEGRAM_LOGIN, telegramData);
      setAccessToken(response.data.data.accessToken);
      return response.data.data.user;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.LOGOUT, async (_, { rejectWithValue }) => {
  try {
    await axiosInstance.get(USER_API_URLS.LOGOUT);
    setAccessToken('');

    localStorage.removeItem('accessToken');
    return;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const updateUserThunk = createAsyncThunk<
  UserType,
  {
    id: number;
    data: Partial<UserType>;
    files?: { photo?: File; telegram_photo?: File };
  },
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.UPDATE, async ({ id, data, files }, { rejectWithValue }) => {
  try {
    let response;
    if (files?.photo || files?.telegram_photo) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });
      if (files.photo) formData.append('photo', files.photo);
      if (files.telegram_photo)
        formData.append('telegram_photo', files.telegram_photo);
      response = await axiosInstance.put<
        ServerResponseType<{ newUser: UserType }>
      >(USER_API_URLS.USER + id, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      response = await axiosInstance.put<
        ServerResponseType<{ newUser: UserType }>
      >(USER_API_URLS.USER + id, data);
    }
    const newUser = response.data.data?.newUser;
    if (!newUser) {
      throw new Error('Не удалось получить пользователя из ответа сервера');
    }

    return newUser;
  } catch (error) {
    return rejectWithValue(handleAxiosError(error));
  }
});

export const deleteUserThunk = createAsyncThunk<
  number,
  number,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.DELETE, async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete<ServerResponseType<null>>(
      USER_API_URLS.USER + id
    );
    return id;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response?.status === 404) {
      console.log(
        'deleteUserThunk - пользователь не найден, считаем удаленным'
      );
      return id;
    }
    return rejectWithValue(handleAxiosError(error));
  }
});

export const refreshTokenThunk = createAsyncThunk<
  UserType,
  void,
  { rejectValue: ServerResponseType<null> }
>(USER_THUNK_TYPES.REFRESH, async (_, { rejectWithValue }) => {
  try {
    console.log(
      'refreshTokenThunk - отправляем запрос на обновление токена...'
    );
    const response = await axiosInstance.get<
      ServerResponseType<UserResponsType>
    >(USER_API_URLS.REFRESH);

    const accessToken = response.data.data.accessToken;
    console.log('refreshTokenThunk - получен новый токен:', {
      tokenLength: accessToken.length,
      tokenPreview: accessToken.substring(0, 20) + '...',
    });

    setAccessToken(accessToken);

    localStorage.setItem('accessToken', accessToken);

    return response.data.data.user;
  } catch (error) {
    console.log('refreshTokenThunk - ошибка:', error);

    localStorage.removeItem('accessToken');
    return rejectWithValue(handleAxiosError(error));
  }
});
