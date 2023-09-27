// Essentials
import axios from 'axios';

// Interfaces
import { CreateLoungeITF, GetLoungeITF, GetLoungeListITF, GetLoungeMemberListITF, IsMemberITF, JoinLoungeITF, UpdateLoungeITF, UpdateMemberITF } from '@interfaces/LoungeITF';
import { LoungeContextITF } from '@utils/context/LoungeContext';

// Services
import { setLounge, setLoungeList, setAccessList, setLoungeFilter, setLoungeTrigger, setMemberCollection } from '@services/redux/reducers/loungeReducer';
import { updateHistory } from '@services/historyService';

// Type
import type { AppDispatch } from '@services/redux/store';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { showNotification } from '@utils/helpers/notification';

export const getLounge = async (data: GetLoungeITF, dispatch: AppDispatch, router: AppRouterInstance) => {
  try {
    const { id, userId } = data;

    const isMember = await checkIsMember(data);
    if (!isMember) {
      router.push('/');
      showNotification({
        title: 'Lounge',
        message: 'You\'re not allowed to enter this lounge',
        status: 'error'
      });
      return;
    }

    const apiResponse = await axios.get(
      `/api/lounge`,
      { params: {
        id
      }}
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      dispatch(setLounge(apiResponse.data.result));
      updateHistory({ userId, loungeId: id, type: '' }, dispatch);
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const getLoungeList = async (data: GetLoungeListITF, dispatch: AppDispatch) => {
  try {
    const apiResponse = await axios.get(
      `/api/lounge-list`,
      { params: data }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      const loungeList = apiResponse.data.resultList;
      if (data.filter === 'recent') dispatch(setAccessList(loungeList.list));
      else dispatch(setLoungeList(loungeList));
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const getMemberCollection = async (data: GetLoungeMemberListITF, dispatch: AppDispatch) => {
  try {
    const { loungeId } = data;

    const apiResponse = await axios.get(
      `/api/lounge/member-list`,
      { params: {
        loungeId
      }}
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      dispatch(setMemberCollection(apiResponse.data.memberCollection));
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const createLounge = async (data: CreateLoungeITF, lounge: LoungeContextITF, dispatch: AppDispatch) => {
  const title = 'Create Lounge';

  try {
    // Data preparation
    const { name, subjectId, visibility, description, loungeTrigger } = data;
    const localUser = localStorage.getItem('lounge-user');
    if (!localUser) {
      showNotification({
        title,
        message: 'Failed to create lounge as you are not logged in',
        status: 'error'
      });
    } else {
      const adminId = JSON.parse(localUser)._id;

      const apiResponse = await axios.post(
          `/api/lounge`,
          { name, subjectId, visibility, description, adminId }
        );
      if (apiResponse.data.status === HttpStatusCodes.CREATED) {
        showNotification({
          title,
          message: 'Created lounge successfully',
          status: 'success'
        });
      }
      dispatch(setLoungeFilter('my'));
      dispatch(setLoungeTrigger(!loungeTrigger));
      lounge.close();
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to create lounge',
        status: 'error'
      });
    }
  }
};

export const joinLounge = async (data: JoinLoungeITF, lounge: LoungeContextITF, router: AppRouterInstance) => {
  const title = 'Join Lounge';

  try {
    const { joinCode } = data;
    const localUser = localStorage.getItem('lounge-user');
    if (!localUser) {
      showNotification({
        title,
        message: 'You need to log in to join lounges',
        status: 'error'
      });
      return false;
    }
    const userId = JSON.parse(localUser)._id;

    const apiResponse = await axios.post(
      `/api/lounge/join`,
      { joinCode, userId }
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      showNotification({
        title,
        message: 'Joined lounge successfully',
        status: 'success'
      });
      router.push(`/lounge/${apiResponse.data.loungeId}`)
      lounge.close();
      return true;
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to join lounge',
        status: 'error'
      });
    } else if (error.response.status === HttpStatusCodes.CONFLICT) {
      showNotification({
        title,
        message: 'You\'ve already joined this lounge',
        status: 'error'
      });
    } else if (error.response.status === HttpStatusCodes.NOT_FOUND) {
      showNotification({
        title,
        message: 'Cannot find the lounge you\'re looking for',
        status: 'error'
      });
    }
    return false;
  }
};

export const updateLounge = async (data: UpdateLoungeITF, lounge: LoungeContextITF, dispatch: AppDispatch, router: AppRouterInstance) => {
  const title = 'Update Lounge';

  try {
    // Data preparation
    const { id } = data;
    const localUser = localStorage.getItem('lounge-user');
    if (!localUser) {
      showNotification({
        title,
        message: 'Failed to update lounge as you are not logged in',
        status: 'error'
      });
    } else {
      const apiResponse = await axios.patch(
        `/api/lounge`,
        data
      );
      if (apiResponse.data.status === HttpStatusCodes.OK) {
        showNotification({
          title,
          message: 'Updated lounge successfully',
          status: 'success'
        });
      }
      getLounge({ id, userId: JSON.parse(localUser)._id }, dispatch, router);
      lounge.close();
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: 'Failed to create lounge',
        status: 'error'
      });
    } else if (error.response.status === HttpStatusCodes.NOT_FOUND) {
      showNotification({
        title,
        message: 'Lounge cannot be found',
        status: 'error'
      });
    }
  }
};

export const checkIsMember = async (data: IsMemberITF) => {
  try {
    const { id, userId } = data;

    const apiResponse = await axios.get(
      `/api/lounge/member/is-member`,
      { params: {
        id, userId
      }}
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      return apiResponse.data.userExists;
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const getRole = async (data: IsMemberITF) => {
  try {
    const { id, userId } = data;

    const apiResponse = await axios.get(
      `/api/lounge/member/role`,
      { params: {
        id, userId
      }}
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      return apiResponse.data.result;
    }
  } catch (error: any) {
    console.log(error);
  }
};

export const updateMember = async (data: UpdateMemberITF, dispatch: AppDispatch) => {
  let title = ''; let message = ''; let errorMessage = '';
  switch (data.type) {
    case 'switch':
      title = 'Switch Role';
      message = 'Switched member\'s role successfully';
      errorMessage = 'Failed to switch member\'s role';
      break;
    case 'kick':
      title = 'Kick Member';
      message = 'Kicked member successfully';
      errorMessage = 'Failed to kick member';
      break;
    case 'leave':
      title = 'Leave lounge';
      message = 'Left lounge successfully';
      errorMessage = 'Failed to leave lounge';
      break;
  }

  try {
    const apiResponse = await axios.patch(
      `/api/lounge/member`,
      data
    );
    if (apiResponse.data.status === HttpStatusCodes.OK) {
      showNotification({
        title,
        message,
        status: 'success'
      });
      updateHistory(data, dispatch);
    }
  } catch (error: any) {
    if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
      showNotification({
        title,
        message: errorMessage,
        status: 'error'
      });
    } else if (error.response.status === HttpStatusCodes.NOT_FOUND) {
      showNotification({
        title,
        message: error.response.type + ' cannot be found',
        status: 'error'
      });
    }
  }
};