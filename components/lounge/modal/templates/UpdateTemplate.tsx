'use client';

// Essentials
import { useState, useEffect, useContext, useRef } from 'react';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Components - Common
import ImageInput from '@components/common/ImageInput';
import Divider from '@components/common/Divider';
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, SegmentedControl, Select, Stack, Text, Textarea, TextInput } from '@mantine/core';

// Interfaces
import { LoungeITF, UpdateLoungeInitITF } from '@interfaces/LoungeITF';
import { SubjectITF } from '@interfaces/SubjectITF';

// Services
import { useAppDispatch } from '@services/redux/hooks';
import { updateLounge } from '@services/loungeService';
import { uploadImage, getBase64Image } from '@services/imageService';

// Utility
import LoungeContext from '@utils/context/LoungeContext';
import { selectTransition } from '@utils/constants/styles/Transitions';

const UpdateTemplate = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const title = 'Update Lounge';
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loungeCtx = useContext(LoungeContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Form validation handling
  const form = useForm({
    initialValues: {
      name: lounge.name,
      subjectId: lounge.subject.id,
      visibility: lounge.visibility,
      description: lounge.description
    },
    validate: {
      name: (value) => (value.length === 0 ? 'Username is required' : null),
      subjectId: (value) => (value.length === 0 ? 'Subject is required' : null)
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

  // Cover handling
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const coverRef = useRef<HTMLButtonElement>(null);
  const onChangeCover = (image: File | null) => {
    if (!image) return;
    getBase64Image(image, setCover);
    setCoverFile(image);
  };
  const onRemoveCover = () => {
    setCover(null);
    setCoverFile(null);
  };

  // Subject handling
  const [subjectList, setSubjectList] = useState<SubjectITF[]>([{
    _id: lounge.subject.id,
    name: lounge.subject.name,
    loungeCount: 0
  }]);
  const getSubjectList = async () => {
    try {
      const apiResponse = await axios.get(`/api/subject`);
      setSubjectList(apiResponse.data.subjectList);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubjectList();
  }, []);

  // Update lounge handling
  const onUpdateLounge = async (initData: UpdateLoungeInitITF) => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);

    let avatar = { url: '', path: '' };
    if (avatarFile) avatar = await uploadImage(avatarFile, 'avatar', lounge.avatar);
    let cover = { url: '', path: '' };
    if (coverFile) cover = await uploadImage(coverFile, 'cover', lounge.cover);

    const { name, subjectId, visibility, description } = initData;
    const data = {
      id: lounge.id,
      name,
      subjectId,
      visibility,
      description,
      avatar,
      cover
    };
    await updateLounge(data, loungeCtx, dispatch, router);
    
    setIsButtonLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit((initData) => onUpdateLounge(initData))}>
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={() => loungeCtx.setTemplateIdx(1)} close={loungeCtx.close}
        />
        <TextInput
          disabled={isButtonLoading}
          label='Name'
          placeholder='Lounge name'
          {...form.getInputProps('name')}
        />
        <Select
          data={subjectList.map((subject, _) => { return { value: subject._id, label: subject.name }; })}
          disabled={isButtonLoading}
          dropdownPosition='bottom'
          label='Subject'
          maxDropdownHeight={146}
          placeholder='Select the main subject of your lounge'
          searchable nothingFound='No corresponding subject'
          transitionProps={selectTransition}
          {...form.getInputProps('subjectId')}
        />
        <Stack spacing={4} align='flex-start'>
          <Text fw={500}>Visibility</Text>
          <SegmentedControl
            data={[
              { label: 'Public', value: 'public' },
              { label: 'Private', value: 'private' }
            ]}
            {...form.getInputProps('visibility')}
          />
        </Stack>
        <Textarea
          disabled={isButtonLoading}
          label='Description'
          placeholder={`What's the lounge about?`}
          withAsterisk={false}
          {...form.getInputProps('description')}
        />

        <Divider />

        <ImageInput
          image={avatar} imageFile={avatarFile} imageRef={avatarRef}
          isButtonLoading={isButtonLoading}
          onChangeImage={onChangeAvatar} onRemoveImage={onRemoveAvatar}
          type='Avatar'
        />
        <ImageInput
          image={cover} imageFile={coverFile} imageRef={coverRef}
          isButtonLoading={isButtonLoading}
          onChangeImage={onChangeCover} onRemoveImage={onRemoveCover}
          type='Cover'
        />
        
        <Button type='submit' loading={isButtonLoading}>
          Save changes
        </Button>
      </Stack>
    </form>
  );
};

export default UpdateTemplate;