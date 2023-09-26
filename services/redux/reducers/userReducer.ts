// Essentials
import { createSlice } from '@reduxjs/toolkit';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

interface UserStateITF {
  loungeUser: UserITF | null;
  isLoungeUserLoaded: boolean;

  user: UserITF | null;
  userList: {
    list: UserITF[],
    total: number
  };
  userSearch: string;
  userTrigger: boolean;
};

const initialState: UserStateITF = {
  loungeUser: null,
  isLoungeUserLoaded: false,

  user: null,
  userList: {
    list: [],
    total: 0
  },
  userSearch: '',
  userTrigger: false,
};

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoungeUser: (state, action) => {
      state.loungeUser = action.payload;
      localStorage.setItem('lounge-user', JSON.stringify(action.payload));
    },
    setIsLoungeUserLoaded: (state, action) => {
      state.isLoungeUserLoaded = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setUserSearch: (state, action) => {
      state.userSearch = action.payload;
    },
    setUserTrigger: (state, action) => {
      state.userTrigger = action.payload;
    }
  }
});

export const {
  setLoungeUser, setIsLoungeUserLoaded,
  setUser, setUserList, setUserSearch, setUserTrigger
} = userReducer.actions;

export default userReducer.reducer;