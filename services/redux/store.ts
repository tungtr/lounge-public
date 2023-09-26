// Essentials
import { configureStore } from '@reduxjs/toolkit';

// Servicess
import messageReducer from '@services/redux/reducers/messageReducer';
import loungeReducer from '@services/redux/reducers/loungeReducer';
import userReducer from '@services/redux/reducers/userReducer';

const store = configureStore({
  reducer: {
    message: messageReducer,
    lounge: loungeReducer,
    user: userReducer
  }
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;