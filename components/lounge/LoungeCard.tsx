'use client';

// Essentials
import { useContext } from 'react';
import { useRouter } from 'next/navigation';
import { EqualHeightElement } from 'react-equal-height/clean';

// Assets
import { LuUsers } from 'react-icons/lu';

// Components - Common
import Link from '@components/common/Link';
// Components - Mantine
import { Badge, Flex, Group, Space, Stack, Text, Tooltip } from '@mantine/core';

// Interfaces
import { LoungeITF } from '@interfaces/LoungeITF';

// Services
import { loungeCardTooltip } from '@utils/constants/styles/Transitions';
import { getImageUrl } from '@services/imageService';
import { joinLounge } from '@services/loungeService';
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setLoungeTrigger } from '@services/redux/reducers/loungeReducer';

// Utility
import LoaderContext from '@utils/context/LoaderContext';
import LoungeContext from '@utils/context/LoungeContext';
import QuestionContext from '@utils/context/QuestionContext';

const LoungeCard = ({
  lounge,
  isMember
}: {
  lounge: LoungeITF,
  isMember: boolean
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const loungeCtx = useContext(LoungeContext);
  const question = useContext(QuestionContext);
  const loader = useContext(LoaderContext);

  // Select Lounge handling
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const onSelectLounge = async () => {
    if (isMember) {
      loader.setIsLoading(true);
      router.push(`/lounge/${lounge.id}`);
    } else {
      const optionList = [
        {
          label: 'Yes',
          color: 'purple', variant: 'filled',
          action: async () => {
            question.setIsLoading(true);
            await joinLounge({ joinCode: lounge.joinCode }, loungeCtx, router);
            
            question.setIsLoading(false);
            question.close();
          }
        },
        {
          label: 'No',
          color: 'purple', variant: 'light',
          action: question.close
        }
      ];
      question.setQuestion(`Do you want to join ${lounge.name}?`);
      question.setOptionList(optionList);
      question.open();
    }
  };

  return (
    <div className='card-container' onClick={onSelectLounge}>
      <Tooltip
        color='purple'
        label={`Click to ${isMember ? 'enter' : 'join'}`}
        position='right-start' offset={-116 + (isMember ? 0 : 12)}
        transitionProps={{ duration: 200, transition: loungeCardTooltip }}
      >
        <div className='card'>
          <div className='card-cover-container'>
            <div className='card-cover-overflow'>
              <img className='card-cover' src={getImageUrl(lounge.cover, 'cover')} alt='Cover image' />
            </div>
          </div>
          <Stack className='card-content' align='flex-start' spacing={8}>
            <img className='card-avatar' src={getImageUrl(lounge.avatar, 'profile')} alt='Avatar image' />
            <div className='overflow-text-container'>
              <Text className='overflow-text type-label-3'>
                {lounge.name}
              </Text>
            </div>
            <Group spacing={4}>
              <Badge>{lounge.subject.name}</Badge>
              {lounge.visibility !== 'public' &&
                <Badge color='neutral'>{lounge.visibility}</Badge>
              }
            </Group>
            <EqualHeightElement name='lounge-description'>
              <Text className='type-body-2' color='neutral.5'>
                {lounge.description}
              </Text>
            </EqualHeightElement>
            <Space h='8' />
            <Stack spacing={8}>
              <Text className='type-body-3' color='neutral.3'>
                <Group spacing={8}>
                  <LuUsers />
                  <span>{lounge.memberCount} member{lounge.memberCount === 1 ? '' : 's'}</span>
                </Group>
              </Text>
              <Text className='type-body-3' color='neutral.3'>
                <span>Created by <Link onClick={() => {}}>{lounge.admin.username}</Link></span>
              </Text>
            </Stack>
          </Stack>
        </div>
      </Tooltip>
    </div>
  );
};

export default LoungeCard;