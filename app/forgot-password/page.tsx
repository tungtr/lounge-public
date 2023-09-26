'use client';

// Essentials
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from '@mantine/form';
import axios from 'axios';

// Components - Mantine
import { Button, Card, PasswordInput, Stack } from '@mantine/core';
// Components - Common
import ModalHeader from '@components/common/ModalHeader';
import PasswordValidator from '@components/common/PasswordValidator';

// Interfaces
import { ResetPasswordITF } from '@interfaces/AuthITF';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { showNotification } from '@utils/helpers/notification';

const ForgotPassword = ({
  searchParams: { token }
}: {
  searchParams: { token: string }
}) => {
  const title = 'Reset password';
  const router = useRouter();
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);
  
  // Form validation handling
  const form = useForm({
    initialValues: {
      password: '',
      confirm: ''
    },
    validate: {
      password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,}$/.test(value) ? null : 'Password must meet the requirements below'),
      confirm: (value, values) => value === values.password ? null : 'Passwords do not match'
    }
  });

  // Reset password handling
  const onResetPassword = async (data: ResetPasswordITF) => {
    if (isReset || isButtonLoading) return;
    setIsButtonLoading(true);

    try {
      const apiResponse = await axios.post(`${process.env.NEXT_PUBLIC_CLIENT_HOST}/api/auth/password/reset`, { token, password: data.password });
      if (apiResponse.data.status === HttpStatusCodes.OK) {
        showNotification({
          title,
          message: 'Reset password successfully!',
          status: 'success'
        });
        setIsReset(true);
      }
    } catch (error: any) {
      if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
        showNotification({
          title,
          message: 'Failed to reset password due to expired token. Try requesting a new email',
          status: 'error'
        });
      }
    }

    setIsButtonLoading(false);
  };

  return (
    <div className='common-bg'>
      <Card radius='lg' padding='xl' style={{ width: '520px' }}>
        {!isReset ? 
          <form onSubmit={form.onSubmit((data) => onResetPassword(data))}>
            <Stack spacing={16}>
              <ModalHeader
                title='Reset Password'
                back={null} close={null}
              />
              <PasswordInput
                disabled={isButtonLoading}
                label='Password'
                placeholder='Password'
                radius='md' size='md'
                {...form.getInputProps('password')}
              />
              <PasswordInput
                disabled={isButtonLoading}
                label='Confirm Password'
                placeholder='Confirm Password'
                radius='md' size='md'
                {...form.getInputProps('confirm')}
              />
              <PasswordValidator form={form} />
              <Button type='submit' loading={isButtonLoading}>
                Reset Password
              </Button>
            </Stack>
          </form>
        :
          <Stack
            align='center' justify='center'
            spacing={16}
          >
            <div className='type-heading-3'>
              Reset password successful!
            </div>
            <Button onClick={() => router.push('/')}>
              Return to Home page
            </Button>
          </Stack>
        }
      </Card>
    </div>
  );
};

export default ForgotPassword;