import { createSlice } from '@reduxjs/toolkit';
import type { UserType } from '../model';
import {
  registerUserThunk,
  loginUserThunk,
  logoutUserThunk,
  telegramRegisterThunk,
  telegramRegisterInitialThunk,
  telegramLoginThunk,
  updateUserThunk,
  deleteUserThunk,
  refreshTokenThunk,
} from '../api/userApi';

interface UserState {
  user: UserType | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isAuth: boolean;
  hasPassword: boolean;
}

const getInitialState = (): UserState => {
  const storedToken = localStorage.getItem('accessToken');
  return {
    user: null,
    accessToken: storedToken,
    loading: false,
    error: null,
    isAuth: !!storedToken,
    hasPassword: false,
  };
};

const initialState: UserState = getInitialState();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserError(state) {
      state.error = null;
    },
    setHasPassword(state, action) {
      state.hasPassword = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');

        console.log(
          'userSlice - loginUserThunk.fulfilled - action.payload:',
          action.payload
        );
        console.log(
          'userSlice - loginUserThunk.fulfilled - action.payload.isAdmin:',
          action.payload?.isAdmin
        );
        console.log(
          'userSlice - loginUserThunk.fulfilled - typeof action.payload.isAdmin:',
          typeof action.payload?.isAdmin
        );
        console.log(
          'userSlice - loginUserThunk.fulfilled - state после обновления:',
          {
            user: state.user,
            isAuth: state.isAuth,
            userIsAdmin: state.user?.isAdmin,
          }
        );
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.hasPassword = false;
        state.isAuth = false;
      })

      .addCase(telegramRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(telegramRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');
      })
      .addCase(telegramRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(telegramRegisterInitialThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(telegramRegisterInitialThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;

        state.accessToken = localStorage.getItem('accessToken');
      })
      .addCase(telegramRegisterInitialThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(telegramLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(telegramLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');
      })
      .addCase(telegramLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.error = null;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? action.payload?.error ?? null;
      })
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.hasPassword = false;
        state.isAuth = false;
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error ?? null;
      })
      .addCase(refreshTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
        state.hasPassword = action.payload?.hasPassword || false;
        state.isAuth = true;

        state.accessToken = localStorage.getItem('accessToken');

        console.log(
          'userSlice - refreshTokenThunk.fulfilled - action.payload:',
          action.payload
        );
        console.log(
          'userSlice - refreshTokenThunk.fulfilled - action.payload.isAdmin:',
          action.payload?.isAdmin
        );
        console.log(
          'userSlice - refreshTokenThunk.fulfilled - typeof action.payload.isAdmin:',
          typeof action.payload?.isAdmin
        );
      })
      .addCase(refreshTokenThunk.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.isAuth = false;
        state.hasPassword = false;
      });
  },
});

export const { resetUserError, setHasPassword } = userSlice.actions;
export const userReducer = userSlice.reducer;
