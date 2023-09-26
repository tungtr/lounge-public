'use client';

// Essentials
import { useState } from 'react';

// Components - Mantine
import { Stack, Text } from '@mantine/core';

// Services
import { useAppSelector } from '@services/redux/hooks';

export const Empty = ({
  text,
  src
}: {
  text: string,
  src: string
}) => {
  const loungeSearch = useAppSelector(state => state.lounge.loungeSearch);

  // Text visibility handling
  const [showText, setShowText] = useState(false);

  return (
    <Stack  spacing={32} align='center'>
      <img
        src={src} onLoad={() => setShowText(true)}
        style={{ maxHeight: '440px', userSelect: 'none' }}
      />
      {showText &&
        <Text className='type-label-1'>
          {loungeSearch.length === 0 ? text : 'No result for your search'}
        </Text>
      }
    </Stack>
  );
};

export default Empty;