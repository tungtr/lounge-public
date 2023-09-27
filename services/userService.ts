// Essentials
import axios from 'axios';
import { signIn } from 'next-auth/react';

// Interfaces
import { LoginITF, SignUpITF } from '@interfaces/AuthITF';
import { ProfileContextITF } from '@utils/context/ProfileContext';
import { ChangePasswordITF, GetUserITF, GetLoungeUserITF, UpdateProfileITF, UserITF } from '@interfaces/UserITF';
import { GetListITF } from '@interfaces/MiscITF';

// Services
import { setLoungeFilter, setLoungeTrigger } from '@services/redux/reducers/loungeReducer';
import { setLoungeUser, setIsLoungeUserLoaded, setUser, setUserList } from '@services/redux/reducers/userReducer';

// Type
import { AuthContextITF } from '@utils/context/AuthContext';
import type { AppDispatch } from '@services/redux/store';
import type { Session } from 'next-auth';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { showNotification } from '@utils/helpers/notification';

// -- AUTHENTICATION ----------------------------------------------------------
export const login = async (data: LoginITF, auth: AuthContextITF, dispatch: AppDispatch, session: Session | null) => {
  if (auth.isLoading) return;
  const loginData = { ...data, redirect: false };
  auth.setIsLoading(true);

  const response = await signIn('credentials', loginData);

  if (response) {
    if (!response.error) {
      showNotification({
        title: auth.type.title,
        message: 'Login successful!',
        status: 'success'
      });
      auth.close();
    } else if (response.error === 'InvalidCredentials') {
      showNotification({
        title: auth.type.title,
        message: 'Invalid credentials',
        status: 'error'
      });
    } else if (response.error === 'UnverifiedUser') {
      showNotification({
        title: auth.type.title,
        message: 'Your account is not verified',
        status: 'error'
      });
    } else {
      showNotification({
        title: auth.type.title,
        message: 'Unknown error during login',
        status: 'error'
      });
    }
  }

  auth.setIsLoading(false);
};

export const signUp = async (data: SignUpITF, auth: AuthContextITF) => {
  if (auth.isLoading) return;
  auth.setIsLoading(true);

  try {
    const apiResponse = await axios.post(`${NEXT_PUBLIC_CLIENT_HOST}/api/auth/signup`, data);

    if (apiResponse.data.status === HttpStatusCodes.CREATED) {
      showNotification({
        title: auth.type.title,
        message: 'Sign-up successful. Please check your email for verification',
        status: 'success'
      });
      auth.setTemplateIdx(0);
    } else {
      showNotification({
        title: auth.type.title,
        message: 'Sign-up failed',
        status: 'error'
      });
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.CONFLICT) {
      showNotification({
        title: auth.type.title,
        message: 'Email is already in use',
        status: 'error'
      });
    } else {
      showNotification({
        title: auth.type.title,
        message: 'Unknown error during Sign-up',
        status: 'error'
      });
    }
  }

  auth.setIsLoading(false);
};

export const sendForgotPasswordEmail = async (data: { email: string }, auth: AuthContextITF) => {
  if (auth.isLoading) return;
    auth.setIsLoading(true);

    try {
      const apiResponse = await axios.post(`${NEXT_PUBLIC_CLIENT_HOST}/api/auth/password/forgot/send`, data);

      if (apiResponse.data.status === HttpStatusCodes.OK) {
        showNotification({
          title: auth.type.title,
          message: 'An email for password reset has been sent',
          status: 'default'
        });
        auth.setTemplateIdx(0);
      }
    } catch (error: any) {
      if (error.response.status === HttpStatusCodes.NOT_FOUND) {
        showNotification({
          title: auth.type.title,
          message: 'Your account does not exist',
          status: 'error'
        });
      } else {
        showNotification({
          title: auth.type.title,
          message: 'Unknown error while sending email for password reset',
          status: 'error'
        });
      }
    }

    auth.setIsLoading(false);
};

export const sendVerifyEmail = async (data: { email: string }, auth: AuthContextITF) => {
  if (auth.isLoading) return;
    auth.setIsLoading(true);

    try {
      const apiResponse = await axios.post(`${NEXT_PUBLIC_CLIENT_HOST}/api/auth/verify/send`, data);

      if (apiResponse.data.status === HttpStatusCodes.OK) {
        showNotification({
          title: auth.type.title,
          message: 'A verification email has been sent',
          status: 'default'
        });
      }
    } catch (error: any) {
      if (error.response.status === HttpStatusCodes.NOT_FOUND) {
        showNotification({
          title: auth.type.title,
          message: 'Your account does not exist',
          status: 'error'
        });
      } else if (error.response.status === HttpStatusCodes.CONFLICT) {
        showNotification({
          title: auth.type.title,
          message: 'Your account is already verified',
          status: 'error'
        });
      } else {
        showNotification({
          title: auth.type.title,
          message: 'Unknown error while sending verification email',
          status: 'error'
        });
      }
    }

    auth.setIsLoading(false);
};

// -- PROFILE OPTIONS ---------------------------------------------------------
export const updateProfile = async (data: UpdateProfileITF, user: UserITF, profile: ProfileContextITF, dispatch: AppDispatch) => {
  const title = 'Update Profile';
  const localUser = localStorage.getItem('lounge-user');
  if (!localUser || JSON.parse(localUser).email !== user.email) {
    showNotification({
      title,
      message: 'Unauthorized action!',
      status: 'error'
    });
  }

  try {
    // Data preparation
    const email = user.email;
    const { username, avatar } = data;

    const apiResponse = await axios.patch( `${NEXT_PUBLIC_CLIENT_HOST}/api/profile`, { email, username, avatar });
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      showNotification({
        title,
        message: 'Updated profile successfully!',
        status: 'success'
      });
    
      const user = apiResponse.data.user;
      localStorage.setItem('lounge-user', JSON.stringify(user));
      profile.setUser(user);
      profile.setTemplateIdx(0);

      dispatch(setLoungeUser(user));
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to update your profile',
        status: 'error'
      });
    } else  if (error.response.status === HttpStatusCodes.NOT_FOUND) {
      showNotification({
        title,
        message: 'Your account does not exist',
        status: 'error'
      });
    }
  }
};

export const changePassword = async (data: ChangePasswordITF, user: UserITF, profile: ProfileContextITF) => {
  const title = 'Change Password';
  const localUser = localStorage.getItem('lounge-user');
  if (!localUser || JSON.parse(localUser).email !== user.email) {
    showNotification({
      title,
      message: 'Unauthorized action!',
      status: 'error'
    });
  }


  try {
    const email = user.email;
    const apiResponse = await axios.post(
      `${NEXT_PUBLIC_CLIENT_HOST}/api/auth/password/change`,
      { email, oldPassword: data.old, newPassword: data.password }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      showNotification({
        title,
        message: 'Changed password successfully!',
        status: 'success'
      });
      profile.setTemplateIdx(0);
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to change password',
        status: 'error'
      });
    } else  if (error.response.status === HttpStatusCodes.BAD_REQUEST) {
      showNotification({
        title,
        message: 'Incorrect old password',
        status: 'error'
      });
    }
  }
};

// -- GENERAL USER HANDLING ---------------------------------------------------
export const getLoungeUser = async (data: GetLoungeUserITF, dispatch: AppDispatch, session: Session | null) => {
  let user = null;
  const localUser = localStorage.getItem('lounge-user');
  if (localUser) {
    user = JSON.parse(localUser);
    dispatch(setLoungeUser(JSON.parse(localUser)));
  } else if (session) {
    const apiResponse = await axios.get(`${NEXT_PUBLIC_CLIENT_HOST}/api/user`, { params: { email: session!.user!.email } });
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      user = apiResponse.data.user;
      dispatch(setLoungeUser(user));

      localStorage.setItem('lounge-user', JSON.stringify(user));
    }
  }

  // Get Lounge list
  const { loungeTrigger } = data;
  dispatch(setLoungeFilter('discover'));
  dispatch(setLoungeTrigger(!loungeTrigger));
  dispatch(setIsLoungeUserLoaded(true));
  return user;
};

export const getUser = async (data: GetUserITF, dispatch: AppDispatch) => {
  let user = null;
  const { email } = data;
  const apiResponse = await axios.get(`${NEXT_PUBLIC_CLIENT_HOST}/api/user`, { params: { email } });
  if (apiResponse.data.status === HttpStatusCodes.OK) {
    user = apiResponse.data.user;
    dispatch(setUser(user));
  }
  return user;
};

export const getUserList = async (data: GetListITF, dispatch: AppDispatch) => {
  try {
    const apiResponse = await axios.get(
      `${NEXT_PUBLIC_CLIENT_HOST}/api/user-list`,
      { params: data }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      const userList = apiResponse.data.resultList;
      dispatch(setUserList(userList));
    }
  } catch (error: any) {
    console.log(error);
  }
};