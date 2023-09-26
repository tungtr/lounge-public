'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';

// Assets
import { LuUsers, LuLogOut, LuArchive } from 'react-icons/lu';

// Components - Common
import CopyIcon from '@components/common/CopyIcon';
import Divider from '@components/common/Divider';
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Badge, Button, Flex, Group, NavLink, Stack, Text } from '@mantine/core';

// Interfaces
import { LoungeITF } from '@interfaces/LoungeITF';
import { OptionITF } from '@interfaces/MiscITF';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { getImageUrl } from '@services/imageService';
import { getLoungeList, updateMember } from '@services/loungeService';

// Utility
import LoungeContext from '@utils/context/LoungeContext';
import QuestionContext from '@utils/context/QuestionContext';

const ViewTemplate = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const loungeCtx = useContext(LoungeContext);

  return (
    <Stack spacing={16}>
      <ModalHeader
        title='Lounge Details'
        back={null} close={loungeCtx.close}
      />
      <HeaderSection lounge={lounge} />
      <ContentSection lounge={lounge} />
      <OptionSection lounge={lounge} />
    </Stack>
  );
};

const HeaderSection = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const loungeCtx = useContext(LoungeContext);
  const loungeUser = useAppSelector(state => state.user.loungeUser);

  return (
    <Flex
      align='center' justify='space-between'
      gap={16}
    >
      <img
        className='avatar image'
        src={getImageUrl(lounge.avatar, 'profile')}
        alt='Avatar Image'
      />
      {loungeUser && loungeUser._id === lounge.admin._id &&
        <Stack align='flex-end'>
          <Button onClick={() => loungeCtx.setTemplateIdx(3)}>
            Update Lounge
          </Button>
          <Group spacing={8}>
            <Text className='type-label-3' color='neutral.3'>
              Join code:
            </Text>
            <Text className='type-label-3' color='purple'>
              {lounge.joinCode}
            </Text>
            <CopyIcon value={lounge.joinCode} tip={'Copy join code'} />
          </Group>
        </Stack>
      }
      
    </Flex>
  );
};

const ContentSection = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const loungeCtx = useContext(LoungeContext);
  
  return (
    <Stack spacing={8} align='flex-start'>
      <div style={{ maxWidth: '100%' }}>
        <div className='overflow-text-container'>
          <Text className={`overflow-text type-label-1`}>
            {lounge.name}
          </Text>
        </div>
      </div>
      <Group spacing={4}>
        <Badge>{lounge.subject.name}</Badge>
        <Badge color='neutral'>{lounge.visibility}</Badge>
      </Group>
      <Text className='type-body-2' color='neutral'>
        {lounge.description}
      </Text>
    </Stack>
  );
};

const OptionSection = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const question = useContext(QuestionContext);
  const loungeCtx = useContext(LoungeContext);

  const [optionList, setOptionList] = useState<OptionITF[]>([]);
  useEffect(() => {
    if (!loungeUser) return;
    let initOptionList = [
      {
        icon: LuUsers,
        label: 'View Member List',
        onClick: () => { loungeCtx.setTemplateIdx(4); }
      }
    ];
    
    // Member's options
    let roleOptionList = [
      {
        icon: LuLogOut,
        label: 'Leave lounge',
        onClick: () => {
          question.setCloseOption({ action: () => setTimeout(() => loungeCtx.open(), 200) });
          const questionOptionList = [
            {
              label: 'Yes',
              color: 'purple', variant: 'filled',
              action: async () => {
                question.setIsLoading(true);
                await updateMember({ loungeId: lounge.id, userId: loungeUser._id, type: 'leave' }, dispatch);
                router.push('/');
                getLoungeList({ filter: 'recent', loungeUserId: loungeUser._id, skip: null, limit: null, search: '' }, dispatch);

                question.setIsLoading(false);
                question.close();
              }
            },
            {
              label: 'No',
              color: 'purple', variant: 'light',
              action: () => {
                setTimeout(() => { loungeCtx.open() }, 200);
                question.close();
              }
            }
          ];
          question.setQuestion(`Do you want to leave ${lounge.name}?`);
          question.setOptionList(questionOptionList);
          setTimeout(() => question.open(), 200);
          loungeCtx.close();
        }
      }
    ];
    if (lounge.admin._id === loungeUser._id) {
      roleOptionList = [
        {
          icon: LuArchive,
          label: 'Archive Lounge',
          onClick: () => {}
        }
      ]
    }
    initOptionList = [
      ...initOptionList,
      ...roleOptionList
    ];

    setOptionList(initOptionList);
  }, [loungeUser]);

  return (
    <Stack spacing={16}>
      <Divider />
      <Stack spacing={8}>
        <Text className='type-body-2'>
          Options
        </Text>
        <div>
          {optionList.map((option, index) => (
            <NavLink
              className='navlink'
              key={index}
              label={option.label}
              icon={<option.icon />}
              onClick={option.onClick}
            />
          ))}
        </div>
      </Stack>
    </Stack>
  );
};

export default ViewTemplate;