'use-client';

// Essentials
import { useState, useEffect, useContext } from 'react';

// Components - Mantine
import { Badge, Button, Flex, Group, Text } from '@mantine/core';

// Interfaces
import { MemberITF } from '@interfaces/LoungeITF';

// Services
import { getImageUrl } from '@services/imageService';
import { updateMember } from '@services/loungeService';
import { getUser } from '@services/userService';
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';

// Styling
import memberItemStyles from '@styles/lounge/MemberItem.module.css';

// Types
import type { Dispatch, SetStateAction } from 'react';

// Utility
import LoungeContext from '@utils/context/LoungeContext';
import ProfileContext from '@utils/context/ProfileContext';
import QuestionContext from '@utils/context/QuestionContext';

const MemberItem = ({
  member,
  role,
  idx,
  activeIdx,
  setActiveIdx,
  isAdmin
}: {
  member: MemberITF,
  role: string,
  idx: number
  activeIdx: number,
  setActiveIdx: Dispatch<SetStateAction<number>>,
  isAdmin: boolean
}) => {
  const loungeCtx = useContext(LoungeContext);
  const profile = useContext(ProfileContext);
  const question = useContext(QuestionContext);
  const dispatch = useAppDispatch();
  const lounge = useAppSelector(state => state.lounge.lounge);
  const isActive = idx === activeIdx;

  // Toggle handling
  const onClick = () => {
    if (isAdmin) {
      if (idx === activeIdx) setActiveIdx(-1);
      else setActiveIdx(idx);
    }
  };

  // Options handling
  const onViewProfile = async () => {
    const user = await getUser({ email: member.email }, dispatch);
    if (!user) return;

    profile.setUser(user);
    profile.setTemplateIdx(0);
    profile.setCloseOption({ action: () => setTimeout(() => loungeCtx.open(), 200) });
    setTimeout(() => profile.open(), 200);
    loungeCtx.close();
  };
  const onUpdateMember = async (type: string) => {
    const newRole = role === 'mod' ? 'Member' : 'Moderator';
    
    const optionList = [
      {
        label: 'Yes',
        color: 'purple', variant: 'filled',
        action: async () => {
          question.setIsLoading(true);
          
          if (lounge) {
            await updateMember({ loungeId: lounge.id, userId: member._id, type }, dispatch);
          }
          
          question.setIsLoading(false);
          setTimeout(() => { loungeCtx.open() }, 200);
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
    question.setQuestion(
      type === 'switch' ? `Do you want to switch ${member.username}'s role to ${newRole}?`
      : `Do you want to kick ${member.username}?`
    );
    question.setOptionList(optionList);
    question.setCloseOption({ action: () => setTimeout(() => { loungeCtx.open() }, 200) });
    setTimeout(() => question.open(), 200);
    loungeCtx.close();
  };

  const [optionList, setOptionList] = useState<any[]>([
    { label: 'View Profile', onClick: onViewProfile, color: 'purple' }
  ]);
  useEffect(() => {
    if (!isAdmin || role === 'admin') return;
    setOptionList([
      { label: 'View Profile', onClick: onViewProfile, color: 'purple' },
      { label: 'Switch role', onClick: () => onUpdateMember('switch'), color: 'purple' },
      { label: 'Kick', onClick: () => onUpdateMember('kick'), color: 'red' }
    ]);
  }, [member]);

  return (
    <div className={`${memberItemStyles.masterContainer} ${isActive ? memberItemStyles.active : ''}`}>
      <div onClick={isAdmin ? onClick : onViewProfile}>
        <Flex className={memberItemStyles.container} gap={16}>
          <div className={memberItemStyles.avatarContainer}>
            <img className={memberItemStyles.avatar}
              src={getImageUrl(member.avatar, 'avatar')}
            />
          </div>
          <div className={`overflow-text-container ${memberItemStyles.content}`}>
            <Text className={`overflow-text type-label-3 ${memberItemStyles.username}`}>
              {member.username}
            </Text>
            <Badge
              className={memberItemStyles.badge}
              color={role === 'admin' ? 'purple' : role === 'mod' ? 'pink' : 'neutral.3'}
            >
              {role}
            </Badge>
          </div>
        </Flex>
      </div>
      <div className={`${memberItemStyles.optionsContainer} ${isActive ? memberItemStyles.show : ''}`}>
        <Group spacing={8} grow>
          {optionList.map((option, index) => (
            <Button key={index} compact
              onClick={option.onClick}
              color={option.color} variant='light'
            >
              {option.label}
            </Button>
          ))}
        </Group>
      </div>
    </div>
  );
};

export default MemberItem;