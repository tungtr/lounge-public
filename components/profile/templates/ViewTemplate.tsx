'use client';

// Essentials
import { createContext, useContext } from 'react';
import { signOut } from 'next-auth/react';
import moment from 'moment';

// Assets
import { LuCalendar, LuLogOut, LuMail, LuLock } from 'react-icons/lu';

// Components - Common
import Divider from '@components/common/Divider';
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Badge, Button, Flex, Group, NavLink, Stack, Text } from '@mantine/core';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

// Services
import { getImageUrl } from '@services/imageService';
import { useAppSelector } from '@services/redux/hooks';

// Types
import type { SignOutParams } from 'next-auth/react';

// Utility
import ProfileContext from '@utils/context/ProfileContext';

const UserContext = createContext<UserITF>({
  _id: '',
  _v: 0,
  email: '',
  username: '',
  avatar: { url: '', path: '' },
  createdAt: new Date(),
  updatedAt: new Date()
});

const ViewTemplate = ({
  user
}: {
  user: UserITF
}) => {
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const profile = useContext(ProfileContext);

  return (
    <UserContext.Provider value={user}>
      <Stack spacing={16}>
        <ModalHeader
          title={`${(loungeUser && loungeUser._id === user._id) ? 'Your' :  'User'} Profile`}
          back={null} close={profile.close}
        />
        <Stack spacing={8}>
          <HeaderSection user={user} />
          <ContentSection />
        </Stack>
        {loungeUser && loungeUser._id === user._id &&
          <OptionSection />
        }
      </Stack>
    </UserContext.Provider>
  );
};

const HeaderSection = ({
  user
}: {
  user: UserITF
}) => {
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const profile = useContext(ProfileContext);

  return (
    <Flex
      align='center' justify='space-between'
      gap={16}
    >
      <img
        className='avatar image'
        src={getImageUrl(user.avatar, 'avatar')}
        alt='Avatar Image'
      />
      {loungeUser && loungeUser._id === user._id &&
        <Button onClick={() => profile.setTemplateIdx(1)}>
          Update Profile
        </Button>
      }
    </Flex>
  );
};

const ContentSection = () => {
  const user = useContext(UserContext);
  
  return (
    <Stack spacing={8}>
      <Group spacing={12}>
        <span style={{ maxWidth: '78%' }}>
          <span className='overflow-text-container'>
            <Text className={`overflow-text type-heading-3`}>
              {user.username}
            </Text>
          </span>
        </span>
        <Badge color='green' style={{ marginTop: '4px' }}>
          Online
        </Badge>
      </Group>
      <Text className='type-body-2' color='neutral'>
        <Stack spacing={4}>
          <Group spacing={8}>
            <LuMail /> {user.email}
          </Group>
          <Group spacing={8}>
            <LuCalendar /> Joined on {moment(user.createdAt).format('DD/MM/YYYY')}
          </Group>
        </Stack>
      </Text>
    </Stack>
  );
};

const OptionSection = () => {
  const profile = useContext(ProfileContext);

  const options = [
    {
      icon: LuLock,
      label: 'Change password',
      onClick: () => profile.setTemplateIdx(2)
    },
    {
      icon: LuLogOut,
      label: 'Logout',
      onClick: () => {
        localStorage.removeItem('lounge-user');
        signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_CLIENT_HOST}/` });
      }
    }
  ];

  return (
    <Stack spacing={16}>
      <Divider />
      <Stack spacing={8}>
        <Text className='type-body-2'>
          Options
        </Text>
        <div>
          {options.map((option, index) => (
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