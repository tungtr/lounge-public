'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { useForm } from '@mantine/form';
import axios from 'axios';

// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Button, SegmentedControl, Select, Stack, Text, Textarea, TextInput } from '@mantine/core';

// Interfaces
import { CreateLoungeITF } from '@interfaces/LoungeITF';
import { SubjectITF } from '@interfaces/SubjectITF';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { createLounge } from '@services/loungeService';

// Utility
import LoungeContext from '@utils/context/LoungeContext';
import { selectTransition } from '@utils/constants/styles/Transitions';

const CreateTemplate = () => {
  const title = 'Create Lounge';
  const dispatch = useAppDispatch();
  const lounge = useContext(LoungeContext);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  // Form validation handling
  const form = useForm({
    initialValues: {
      name: '',
      subjectId: '',
      visibility: 'public',
      description: ''
    },
    validate: {
      name: (value) => (value.length === 0 ? 'Username is required' : null),
      subjectId: (value) => (value.length === 0 ? 'Subject is required' : null)
    }
  });

  // Form data handling
  const [subjectList, setSubjectList] = useState<SubjectITF[]>([]);
  const getSubjectList = async () => {
    try {
      const apiResponse = await axios.get(`${NEXT_PUBLIC_CLIENT_HOST}/api/subject`);
      setSubjectList(apiResponse.data.subjectList);
    } catch (error: any) {
      console.log(error);
    }
  };
  useEffect(() => {
    getSubjectList();
  }, []);

  // Create lounge handling
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const onCreateLounge = async (data: CreateLoungeITF) => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);

    await createLounge(data, lounge, dispatch);
    
    setIsButtonLoading(false);
  };

  return (
    <form onSubmit={form.onSubmit((data) => onCreateLounge({ ...data, loungeTrigger }))}>
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={null} close={lounge.close}
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
        <Button type='submit' loading={isButtonLoading}>
          Create Lounge
        </Button>
      </Stack>
    </form>
  );
};

export default CreateTemplate;