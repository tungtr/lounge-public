'use client';

// Essentials
import { useState, useContext, useRef } from 'react';
import { useForm } from '@mantine/form';

// Components - Common
import ImageInput from '@components/common/ImageInput';
import Divider from '@components/common/Divider';
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, Stack, TextInput } from '@mantine/core';

// Interfaces
import { UpdateProfileInitITF } from '@interfaces/UserITF';
import { UserITF } from '@interfaces/UserITF';

// Services
import { useAppDispatch } from '@services/redux/hooks';
import { uploadImage, getBase64Image } from '@services/imageService';
import { updateProfile } from '@services/userService';

// Utility
import ProfileContext from '@utils/context/ProfileContext';

const UpdateTemplate = ({
  user
}: {
  user: UserITF
}) => {
  const title = 'Update Profile';
  const dispatch = useAppDispatch();
  const profile = useContext(ProfileContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Form validation handling
  const form = useForm({
    initialValues: {
      email: user.email,
      username: user.username
    },
    validate: {
      username: (value) => (value.length === 0 ? 'Username is required' : null)
    }
  });

  // Avatar handling
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const avatarRef = useRef<HTMLButtonElement>(null);
  const onChangeAvatar = (image: File | null) => {
    if (!image) return;
    getBase64Image(image, setAvatar);
    setAvatarFile(image);
  };
  const onRemoveAvatar = () => {
    setAvatar(null);
    setAvatarFile(null);
  };

  // Update profile handling
  const onUpdateProfile = async (initData: UpdateProfileInitITF) => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);

    let avatar = { url: '', path: '' };
    if (avatarFile) avatar = await uploadImage(avatarFile, 'avatar', user.avatar);

    const { email, username } = initData;
    const data = {
      avatar,
      email,
      username
    };

    await updateProfile(data, user, profile, dispatch);

    setIsButtonLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit((initData) => onUpdateProfile(initData))}>
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={() => profile.setTemplateIdx(0)} close={profile.close}
        />
        <TextInput
          disabled
          label='Email'
          description='Your email cannot be changed'
          {...form.getInputProps('email')}
        />
        <TextInput
          disabled={isButtonLoading}
          label='Username'
          placeholder='Username'
          {...form.getInputProps('username')}
        />

        <Divider />
        
        <ImageInput
          image={avatar} imageFile={avatarFile} imageRef={avatarRef}
          isButtonLoading={isButtonLoading}
          onChangeImage={onChangeAvatar} onRemoveImage={onRemoveAvatar}
          type='Avatar'
        />
        <Button type='submit' loading={isButtonLoading}>
          Save changes
        </Button>
      </Stack>
    </form>
  );
};

export default UpdateTemplate;