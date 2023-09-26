// Essentials
import { useContext } from 'react';
import { useForm } from '@mantine/form';

// Components - Mantine
import { Button, Flex, Group, PasswordInput, Stack, Text, TextInput } from '@mantine/core';
// Components - Common
import Link from '@components/common/Link';
import ModalHeader from '@components/common/ModalHeader';
import PasswordValidator from '@components/common/PasswordValidator';

// Interfaces
import { SignUpITF } from '@interfaces/AuthITF';

// Services
import { signUp } from '@services/userService';

// Utility
import AuthContext from '@utils/context/AuthContext';

const SignUpTemplate = () => {
  const auth = useContext(AuthContext);

  // Form validation handling
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: ''
    },
    validate: {
      email: (value) => (
        value.length === 0 ? 'Email is required' :
        !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)) ? 'Invalid email' : null
      ),
      username: (value) => (
        value.length === 0 ? 'Username is required' :
        value.length < 4 ? 'Username must include at least 4 characters' : null
      ),
      password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,}$/.test(value) ? null : 'Password must meet the requirements below')
    }
  });

  // Sign-up handling
  const onSignUp = async (data: SignUpITF) => {
    await signUp(data, auth);
  };

  return (
    <form onSubmit={form.onSubmit((data) => onSignUp(data))}>
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
        <TextInput
          disabled={auth.isLoading}
          label='Username'
          placeholder='Username'
          {...form.getInputProps('username')}
        />
        <PasswordInput
          disabled={auth.isLoading}
          label='Password'
          placeholder='Password'
          {...form.getInputProps('password')}
        />
        <PasswordValidator form={form} />
        <Button type='submit'>
          Sign-up
        </Button>
        <Flex align='center' justify='center'>
          <Group spacing={4}>
            <Text className='type-body-3' color='neutral'>Already have an account?</Text>
            <Link onClick={() => auth.setTemplateIdx(0)}>Login</Link>
          </Group>
        </Flex>
      </Stack>
    </form>
  );
};

export default SignUpTemplate;