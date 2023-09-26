// Essentials
import { createSlice } from '@reduxjs/toolkit';

// Interfaces
import { MessageITF } from '@interfaces/MessageITF';

interface MessageStateITF {
  messageList: MessageITF[];
  messageListTotal: number;
  messageListOffset: number;
  messageListOffsetLater: number;

  // Reply navigation handling
  naviReplyOrder: number;
  naviReplyTrigger: boolean;
};

const initialState: MessageStateITF = {
  messageList: [],
  messageListTotal: 0,
  messageListOffset: 0,
  messageListOffsetLater: 0,

  naviReplyOrder: -1,
  naviReplyTrigger: false
};

export const messageReducer = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setMessageList: (state, action) => {
      state.messageList = action.payload;
    },
    setMessageListTotal: (state, action) => {
      state.messageListTotal = action.payload;
    },
    setMessageListOffset: (state, action) => {
      state.messageListOffset = action.payload;
    },
    setMessageListOffsetLater: (state, action) => {
      state.messageListOffsetLater = action.payload;
    },
    setNaviReplyOrder: (state, action) => {
      state.naviReplyOrder = action.payload;
    },
    setNaviReplyTrigger: (state, action) => {
      state.naviReplyTrigger = action.payload;
    },
  }
});

export const {
  setMessageList, setMessageListTotal, setMessageListOffset, setMessageListOffsetLater,
  setNaviReplyOrder, setNaviReplyTrigger
} = messageReducer.actions;

export default messageReducer.reducer;