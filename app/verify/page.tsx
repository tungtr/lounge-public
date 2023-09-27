'use client';

// Essentials
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Components - Mantine
import { Button, Card, Stack } from '@mantine/core';

// Utility
import HttpStatusCodes from '@utils/constants/global/HttpStatusCodes';
import { showNotification } from '@utils/helpers/notification';

const Verify = ({
  searchParams: { token }
}: {
  searchParams: { token: string }
}) => {
  const title = 'Account verification';
  const router = useRouter();
  const [status, setStatus] = useState('pending');
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const verifyAccount = async () => {
    try {
      const apiResponse = await axios.post(`/api/auth/verify`, { token });
      if (apiResponse.data.status === HttpStatusCodes.OK) {
        setStatus('success');
      }
    } catch (error: any) {
      setStatus('error');
    }
  };

  useEffect(() => {
    verifyAccount();
  }, []);

  const resendVerificationEmail = async () => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);

    const { user }: any = jwt_decode(token);
    try {
      const apiResponse = await axios.post(`/api/auth/verify/send`, { email: user.email });
      if (apiResponse.data.status === HttpStatusCodes.OK) {
        showNotification({
          title,
          message: 'A new verification email has been sent',
          status: 'default'
        });
      }
    } catch (error: any) {
      if (error.response.status === HttpStatusCodes.INTERNAL_SERVER_ERROR) {
        showNotification({
          title,
          message: 'Failed to resend verification email',
          status: 'error'
        });
      }
    }

    setIsButtonLoading(false);
  };

  return (
    <div className='common-bg'>
      <Card radius='lg' padding='xl'>
        <Stack
          align='center' justify='center'
          spacing={16}
        >
          <div className='type-heading-3'>
            {status === 'pending' ? 'Verification pending...'
              : status === 'success' ? 'Email verificication successful'
              : 'Email verification expired'
            }
          </div>
          {status === 'success' &&
            <Button onClick={() => router.push('/')}>
              Return to Home page
            </Button>
          }
          {status === 'error' &&
            <Button onClick={resendVerificationEmail} loading={isButtonLoading}>
              Resend verification email
            </Button>
          }
        </Stack>
      </Card>
    </div>
  );
};

export default Verify;