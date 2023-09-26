'use client';

// Essentials
import { useContext } from 'react';

// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, Grid, LoadingOverlay, Modal, Stack, Text } from '@mantine/core';

// Interfaces
import { OptionITF } from '@interfaces/QuestionITF';

// Utility
import QuestionContext from '@utils/context/QuestionContext';

const QuestionModal = ({
  isLoading,
  question,
  optionList,
  opened
}: {
  isLoading: boolean,
  question: string,
  optionList: OptionITF[],
  opened: boolean
}) => {
  const questionCtx = useContext(QuestionContext);

  return (
    <Modal
      opened={opened}
      onClose={questionCtx.close}
      zIndex={510}
    >
      <LoadingOverlay visible={isLoading} />
      <Stack spacing={16}>
        <ModalHeader
          title='Question'
          back={null} close={questionCtx.close}
        />
        <Text className='type-label-3'>
          {question}
        </Text>
        <Grid mt={4}>
          {optionList.map((option, index) => (
            <Grid.Col key={index} span={optionList.length === 2 ? 6 : 12}>
              <Button
                disabled={isLoading}
                color={option.color} variant={option.variant}
                onClick={option.action}
                fullWidth
              >
                {option.label}
              </Button>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </Modal>
  );
};

export default QuestionModal;