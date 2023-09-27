// Essentials
import axios from 'axios';

// Interfaces
import { UpdateHistoryITF } from '@interfaces/HistoryITF';

// Services
import { getLoungeList } from '@services/loungeService';

// Types
import type { AppDispatch } from '@services/redux/store';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';

export const updateHistory = async (data: UpdateHistoryITF, dispatch: AppDispatch) => {
  try {
    const apiResponse = await axios.patch(
      `${NEXT_PUBLIC_CLIENT_HOST}/api/history`,
      data
    );
    if (['kick', 'leave'].includes(data.type) && apiResponse.data.status === HttpStatusCodes.OK) {
      getLoungeList({ filter: 'recent', loungeUserId: data.userId, skip: null, limit: null, search: '' }, dispatch);
    }
  } catch (error: any) {
    console.log(error);
  }
};