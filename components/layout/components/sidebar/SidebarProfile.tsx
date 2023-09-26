'use client';

// Essentials
import { useContext } from 'react';

// Components - Mantine
import { Avatar, Group, Text, Tooltip } from '@mantine/core';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

// Services
import { getImageUrl } from '@services/imageService';

// Styling
import sidebarStyles from '@styles/layout/Sidebar.module.css';

// Utility
import { slideRight } from '@utils/constants/styles/Transitions';
import ProfileContext from '@utils/context/ProfileContext';
import ResponsiveContext from '@utils/context/ResponsiveContext';
import SidebarContext from '@utils/context/SidebarContext';

const SidebarProfile = ({
  user
}: {
  user: UserITF
}) => {
  const profile = useContext(ProfileContext);
  const responsive = useContext(ResponsiveContext);
  const sidebar = useContext(SidebarContext);
  const statusStyle = sidebarStyles.itemStatic;
  
  return (
    <>
      <Tooltip
        disabled={!(sidebar.isCollapsed || responsive.isTablet)}
        label={'Your profile'}
        position='right'
        transitionProps={{ duration: 200, transition: slideRight }}
      >
        <div
          className={`${sidebarStyles.item} ${statusStyle} ${sidebarStyles.profile}`}
          onClick={() => { profile.setUser(user); profile.setTemplateIdx(0); profile.open(); }}
        >
          {user &&
            <Group className={sidebarStyles.group} spacing={16} noWrap>
              <div className={sidebarStyles.iconContainer}>
                <Avatar src={getImageUrl(user.avatar, 'avatar')} />
              </div>
              {!(sidebar.isCollapsed || responsive.isTablet) &&
                <div className='overflow-text-container'>
                <Text className={`overflow-text type-label-3 ${sidebarStyles.label}`}>
                  {user.username}
                </Text>
                </div>
              }
            </Group>
          }
        </div>
      </Tooltip>
    </>
  );
};

export default SidebarProfile;