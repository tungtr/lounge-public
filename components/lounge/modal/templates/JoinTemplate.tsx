'use client';

// Essentials
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';

// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, PinInput, Stack, Text } from '@mantine/core';

// Services
import { joinLounge } from '@services/loungeService';

// Utility
import LoungeContext from '@utils/context/LoungeContext';

const JoinTemplate = () => {
  const title = 'Join Lounge';
  const router = useRouter();
  const lounge = useContext(LoungeContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Form validation handling
  const [joinCode, setJoinCode] = useState('');
  const form = useForm({
    initialValues: {
      joinCode: ''
    },
    validate: {
      joinCode: () => (joinCode.length === 0 ? 'Join code is required' : joinCode.length < 8 ? 'Join code must contain 8 characters' : null)
    }
  });

  // Join lounge handling
  const onChange = (event: string) => {
    setJoinCode(event.toUpperCase());
    form.clearFieldError('joinCode');
  };
  const onJoinLounge = async () => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);

    await joinLounge({ joinCode }, lounge, router);
    
    setIsButtonLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit(() => onJoinLounge())}>
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={null} close={lounge.close}
        />
        <Stack align='center'>
          <Text className='type-body-2' color='neutral'>
            Enter the code of the lounge you want to join
          </Text>
          <PinInput
            disabled={isButtonLoading}
            length={8}
            type={/^[a-zA-Z0-9]*$/}
            {...form.getInputProps('joinCode')}
            value={joinCode}
            onChange={(event) => { onChange(event); }}
          />
          {form.errors.joinCode &&
            <Text className='type-body-3' color='red'>
              {form.errors.joinCode}
            </Text>
          }
        </Stack>
        <Button type='submit' loading={isButtonLoading}>
          Join Lounge
        </Button>
      </Stack>
    </form>
  );
};

export default JoinTemplate;