// Essentials
import axios from 'axios';

// Interfaces
import { GetMessageListITF, GetMessageListTotalITF, SendMessageITF, ReactToMessageITF } from '@interfaces/MessageITF';

// Services
import { setMessageList, setMessageListTotal, setMessageListOffset, setMessageListOffsetLater } from '@services/redux/reducers/messageReducer';

// Type
import type { AppDispatch } from '@services/redux/store';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import Miscellaneous from '@utils/constants/global/Miscellaneous';
import { showNotification } from '@utils/helpers/notification';

export const getMessageList = async (data: GetMessageListITF, dispatch: AppDispatch) => {
  try {
    const apiResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/lounge/message`,
      { params: { loungeId: data.loungeId, offset: data.offset, isPrior: data.isPrior } }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      dispatch(setMessageList(data.isPrior ?
        [...apiResponse.data.resultList, ...data.messageList] :
        [...data.messageList, ...apiResponse.data.resultList]
      ));
      if (data.isPrior) dispatch(setMessageListOffset(data.messageListOffset + Miscellaneous.DEFAULT_MESSAGE_LIST_LIMIT));
      else dispatch(setMessageListOffsetLater(data.messageListOffset - Miscellaneous.DEFAULT_MESSAGE_LIST_LIMIT));
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const getMessageListTotal = async (data: GetMessageListTotalITF, dispatch: AppDispatch) => {
  try {
    const apiResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/lounge/message/total`,
      { params: data }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      dispatch(setMessageListTotal(apiResponse.data.result));
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const sendMessage = async (data: SendMessageITF) => {
  const title = 'Send Message';

  try {
    const localUser = localStorage.getItem('lounge-user');
    if (!localUser) {
      showNotification({
        title,
        message: 'Failed to send message as you are not logged in',
        status: 'error'
      });
    } else {
      await axios.post(
        `${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/lounge/message`,
        { ...data, userId: JSON.parse(localUser)._id }
      );
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to send message',
        status: 'error'
      });
    }
  }
}

export const reactToMessage = async (data: ReactToMessageITF) => {
  const title = 'React to Message';

  try {
    const localUser = localStorage.getItem('lounge-user');
    if (localUser) {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/lounge/message/react`,
        data
      );
    }
  } catch (error: any) {
    console.log(error);
  }
}