'use client';

// Essentials
import { useContext } from 'react';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';

// Components - Common
import Link from '@components/common/Link';
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, Flex, Group, PasswordInput, TextInput, Stack, Text } from '@mantine/core';

// Interfaces
import { LoginITF } from '@interfaces/AuthITF';

// Services
import { useAppDispatch } from '@services/redux/hooks';
import { login } from '@services/userService';

// Utility
import AuthContext from '@utils/context/AuthContext';

const LoginTemplate = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const auth = useContext(AuthContext);

  // Form validation handling
  const form = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (
        value.length === 0 ? 'Email is required' :
        !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) ? 'Invalid email' : null
      ),
      password: (value) => (value.length > 0 ? null : 'Password is required')
    }
  });

  // Login handling
  const onLogin = async (data: LoginITF) => {
    await login(data, auth, dispatch, session);
  };

  return (
    <form onSubmit={form.onSubmit((data) => onLogin(data))}>
      <Stack spacing={16}>
        <ModalHeader
          title={auth.type.title}
          back={null} close={auth.close}
        />
        <TextInput
          disabled={auth.isLoading}
          label='Email'
          placeholder='example@mail.com'
          {...form.getInputProps('email')}
        />
        <PasswordInput
          disabled={auth.isLoading}
          label='Password'
          placeholder='Password'
          {...form.getInputProps('password')}
        />
        <Flex align='center' justify='flex-end'>
          <Link onClick={() => auth.setTemplateIdx(2)}>
            Need help with login?
          </Link>
        </Flex>
        <Button type='submit'>
          Login
        </Button>
        <Flex align='center' justify='center'>
          <Group spacing={4}>
            <Text color='neutral' className='type-body-3'>Don't have an account?</Text>
            <Link onClick={() => auth.setTemplateIdx(1)}>Sign-up</Link>
          </Group>
        </Flex>
      </Stack>
    </form>
  );
};

export default LoginTemplate;