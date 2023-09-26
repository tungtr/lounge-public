'use client';

// Essentials
import { useEffect, useContext, useRef } from 'react';

// Assets
import { LuSearch, LuPlus, LuLogIn } from 'react-icons/lu';
// Components - Mantine
import { ActionIcon, Button, TextInput } from '@mantine/core';

// Constants
import Globals from '@utils/constants/global/Miscellaneous';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setLoungeSearch, setLoungeTrigger } from '@services/redux/reducers/loungeReducer';
import { setUserSearch, setUserTrigger } from '@services/redux/reducers/userReducer';

// Types
import { ChangeEvent, KeyboardEvent } from 'react';

// Utility
import { showNotification } from '@utils/helpers/notification';
import LoungeContext from '@utils/context/LoungeContext';
import ResponsiveContext from '@utils/context/ResponsiveContext';

const GeneralOptions = ({
  activeIdx
}: {
  activeIdx: number
}) => {
  const dispatch = useAppDispatch();
  const loungeSearch = useAppSelector(state => state.lounge.loungeSearch);
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const userSearch = useAppSelector(state => state.user.userSearch);
  const userTrigger = useAppSelector(state => state.user.userTrigger);
  const lounge = useContext(LoungeContext);
  const responsive = useContext(ResponsiveContext);

  const openLoungeModal = (type: string) => {
    if (!localStorage.getItem('lounge-user')) {
      let title = '';
      let message = 'You need to log in to ';
      switch (type) {
        case 'create':
          title = 'Create Lounge'
          message += 'create lounges'
          break;
        case 'join':
          title = 'Join Lounge'
          message += 'join lounges';
          break;
      }

      showNotification({
        title,
        message,
        status: 'error'
      });
      return;
    }

    switch (type) {
      case 'create':
        lounge.setTemplateIdx(0); lounge.open();
        break;
      case 'join':
        lounge.setTemplateIdx(2); lounge.open();
        break;
    }
  };

  // Search handling
  const searchPlaceholderList = [ 'lounges', 'users' ];
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (loungeSearch.length === 0) dispatch(setLoungeTrigger(!loungeTrigger));
  }, [loungeSearch]);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (userSearch.length === 0) dispatch(setUserTrigger(!userTrigger));
  }, [userSearch]);
  const onSearch = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(activeIdx === 0 ? setLoungeSearch(event.target.value) : setUserSearch(event.target.value));
  };
  const onTrigger = () => {
    dispatch(activeIdx === 0 ? setLoungeTrigger(!loungeTrigger) : setUserTrigger(!userTrigger));
  };

  return (
    <>
      {!responsive.isTablet ?
        <>
          <TextInput
            placeholder={`Search for ${searchPlaceholderList[activeIdx]}`}
            variant='filled'
            onChange={(event) => onSearch(event)}
            onKeyDown={(event) => { if (event.key === 'Enter') onTrigger(); }}
            rightSection={
              <ActionIcon
                color='purple' variant='light'
                onClick={onTrigger}
              >
                <LuSearch />
              </ActionIcon>
            }
            w={Globals.SEARCHBAR_WIDTH}
          />
          {activeIdx === 0 &&
            <>
              <Button
                leftIcon={<LuLogIn />}
                onClick={() => openLoungeModal('join')}
              >
                Join
              </Button>
              <Button
                leftIcon={<LuPlus />}
                onClick={() => openLoungeModal('create')}
                variant='light'
              >
                Create
              </Button>
            </>
          }
        </>
        :
        <>
          <ActionIcon
            color='purple' variant='light'
          >
            <LuSearch />
          </ActionIcon>
          {activeIdx === 0 &&
            <>
              <ActionIcon
                color='purple' variant='filled'
                onClick={() => openLoungeModal('join')}
              >
                <LuLogIn />
              </ActionIcon>
              <ActionIcon
                color='purple' variant='light'
                onClick={() => openLoungeModal('create')}
              >
                <LuPlus />
              </ActionIcon>
            </>
          }
        </>
      }
    </>
  );
};

export default GeneralOptions;