// Assets
import { LuCheck, LuX } from 'react-icons/lu';

// Components - Mantine
import { Group, Text } from '@mantine/core';

const Requirement = ({
  children,
  condition
}: {
  children: React.ReactNode,
  condition: boolean
}) => {
  return (
    <Text color={condition ? 'green' : 'neutral.3'}>
      <Group spacing={8}>
        {condition ?
          <LuCheck />
          :
          <LuX />
        }
        {children}
      </Group>
    </Text>
  );
};

export default Requirement;