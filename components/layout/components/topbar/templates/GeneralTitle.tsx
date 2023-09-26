'use client';

// Components - Mantine
import { Group, Text } from '@mantine/core';

const GeneralTitle = ({
  title
}: {
  title: string
}) => {
  return (
    <Group spacing={16} style={{ width: '100%' }}>
      <div className='overflow-text-container'>
        <Text className='overflow-text type-heading-3' color='purple'>
          {title}
        </Text>
      </div>
    </Group>
  );
};

export default GeneralTitle;