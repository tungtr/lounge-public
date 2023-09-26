'use client';

// Essentials
import { useContext } from 'react';

// Components - Mantine
import { Flex, Stack, Text } from '@mantine/core';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

// Services
import { getImageUrl } from '@services/imageService';
import { useAppDispatch } from '@services/redux/hooks';

// Utility
import ProfileContext from '@utils/context/ProfileContext';

const UserCard = ({
  user
}: {
  user: UserITF
}) => {
  const dispatch = useAppDispatch();
  const profile = useContext(ProfileContext);

  // Select user handling
  const onSelectUser = () => {
    profile.setUser(user);
    profile.setTemplateIdx(0);
    profile.open();
  };

  return (
    <div className='card-container' onClick={onSelectUser}>
      <div className='card'>
        <Flex align='center' direction='column' className='card-content' gap={16}>
          <img className='card-avatar' src={getImageUrl(user.avatar, 'avatar')} alt='Avatar image' />
          <Stack align='flex-start' spacing={8}>
            <div className='overflow-text-container'>
              <Text className='overflow-text type-label-3'>
                {user.username}
              </Text>
            </div>
          </Stack>
        </Flex>
      </div>
    </div>
  );
};

export default UserCard;