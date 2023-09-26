// Essentials
import { useContext } from 'react';
import AuthContext from '@utils/context/AuthContext';
import { useForm } from '@mantine/form';
import axios from 'axios';

// Components - Mantine
import { Button, TextInput, Stack, Text } from '@mantine/core';
// Components - Common
import ModalHeader from '@components/common/ModalHeader';

// Services
import { sendForgotPasswordEmail } from '@services/userService';

const ForgotPasswordTemplate = () => {
  const auth = useContext(AuthContext);

  // Form validation handling
  const form = useForm({
    initialValues: {
      email: ''
    },
    validate: {
      email: (value) => (
        value.length === 0 ? 'Email is required' :
        !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) ? 'Invalid email' : null
      )
    }
  });

  // Send forgot password email handling
  const onSendForgotPasswordEmail = async (data: { email: string }) => {
    await sendForgotPasswordEmail(data, auth);
  };

  return (
    <form onSubmit={form.onSubmit((data) => onSendForgotPasswordEmail(data))}>
      <Stack spacing={16}>
        <ModalHeader
          title={auth.type.title}
          back={() => auth.setTemplateIdx(2)} close={auth.close}
        />
        <Text color='neutral' className='type-body-3'>
          Enter your email so you can reset your password
        </Text>
        <TextInput
          disabled={auth.isLoading}
          label='Email'
          placeholder='example@mail.com'
          {...form.getInputProps('email')}
        />
        <Button type='submit'>
          Send email
        </Button>
      </Stack>
    </form>
  );
};

export default ForgotPasswordTemplate;