'use client';

// Essentials
import { useState, useContext } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';

// Components - Common
import ModalHeader from '@components/common/ModalHeader';
import PasswordValidator from '@components/common/PasswordValidator';
// Components - Mantine
import { Button, PasswordInput, Stack } from '@mantine/core';

// Interfaces
import { ChangePasswordITF } from '@interfaces/UserITF';
import { UserITF } from '@interfaces/UserITF';

// Services
import { changePassword } from '@services/userService';

// Utility
import ProfileContext from '@utils/context/ProfileContext';

const ChangePasswordTemplate = ({
  user
}: {
  user: UserITF
}) => {
  const title = 'Change Password';
  const profile = useContext(ProfileContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Form validation handling
  const form = useForm({
    initialValues: {
      old: '',
      password: '',
      confirm: ''
    },
    validate: {
      old: (value) => (value.length === 0 ? 'Old password is required' : null),
      password: (value) => (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$&+,:;=?@#|'<>.^*()%!-])[A-Za-z\d$&+,:;=?@#|'<>.^*()%!-]{8,}$/.test(value) ? null : 'New password must meet the requirements below'),
      confirm: (value, values) => value === values.password ? null : 'Passwords do not match'
    }
  });

  // Change password handling
  const onChangePassword = async (data: ChangePasswordITF) => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);
    
    await changePassword(data, user, profile);

    setIsButtonLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit((data) => onChangePassword(data))}>
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={() => profile.setTemplateIdx(0)} close={profile.close}
        />
        <PasswordInput
          disabled={isButtonLoading}
          label='Old Password'
          placeholder='Password'
          radius='md' size='md'
          {...form.getInputProps('old')}
        />
        <PasswordInput
          disabled={isButtonLoading}
          label='New Password'
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
          Change Password
        </Button>
      </Stack>
    </form>
  );
};

export default ChangePasswordTemplate;