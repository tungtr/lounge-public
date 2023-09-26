'use client';

// Components - Mantine
import { Avatar, Text } from '@mantine/core';

// Interfaces
import { LoungeITF } from '@interfaces/LoungeITF';

// Services
import { getImageUrl } from '@services/imageService';

const LoungeTitle = ({
  lounge
}: {
  lounge: LoungeITF
}) => {

  return (
    <div
      className='overflow-text-container'
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {lounge && <Avatar size='lg' src={getImageUrl(lounge.avatar, 'profile')} mr={16} />}
      <Text className='overflow-text type-heading-3' color='purple'>
        {lounge.name}
      </Text>
    </div>
  );
};

export default LoungeTitle;