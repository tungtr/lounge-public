// Components - Common
import UtilityButton from '@components/common/UtilityButton';
import Divider from '@components/common/Divider';
// Components - Mantine
import { Flex, Group, Stack } from '@mantine/core';

const ModalHeader = ({
  title,
  back,
  close
}: {
  title: string,
  back: (() => void) | null,
  close: (() => void) | null
}) => {
  return (
    <Stack spacing={16}>
      <Flex align='center' justify={close ? 'space-between' : 'flex-start'}>
        <Group spacing={8}>
          {back && <UtilityButton type='back' onClick={back} />}
          <span className='type-label-3'>
            {title}
          </span>
        </Group>
        {close && <UtilityButton type='close' onClick={close} />}
      </Flex>
      <Divider />
    </Stack>
  );
};

export default ModalHeader;