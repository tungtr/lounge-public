'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';

// Components - Relative
import SidebarItem from '@components/layout/components/sidebar/SidebarItem';
import SidebarProfile from '@components/layout/components/sidebar/SidebarProfile';
// Components - Common
import Divider from '@components/common/Divider';
// Components - Mantine
import { Stack } from '@mantine/core';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { getLoungeUser } from '@services/userService';

// Styling
import sidebarStyles from '@styles/layout/Sidebar.module.css';

// Utility
import ResponsiveContext from '@utils/context/ResponsiveContext';
import SidebarContext from '@utils/context/SidebarContext';

const SidebarMenu = ({
  activeIdx
}: {
  activeIdx: number
}) => {
  const dispatch = useAppDispatch();
  const responsive = useContext(ResponsiveContext);
  const sidebar = useContext(SidebarContext);
  const { data: session } = useSession();

  // Render handling
  const [isLoaded, setIsLoaded] = useState(false);

  // User handling
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const onGetUser = async () => {
    const data = { loungeTrigger };
    await getLoungeUser(data, dispatch, session);
    setIsLoaded(true);
  };

  useEffect(() => {
    if (loungeUser) return;
    onGetUser();
  }, [session]);

  return (
    <div className={sidebarStyles.menu}>
      {isLoaded &&
        <>
          <Stack spacing={0}>
            {sidebar.data.menu.map((sidebarItemData, index) => (
              <SidebarItem
                key={index}
                isActive={index === activeIdx}
                sidebarItemData={sidebarItemData}
              />
            ))}
          </Stack>

          <Stack spacing={8}>
            {!responsive.isTablet &&
              <>
                <SidebarItem
                  isActive={false}
                  sidebarItemData={sidebar.data.options[!sidebar.isCollapsed ? 0 : 1]}
                />
                <Divider />
              </>
            }
            {loungeUser ?
              <SidebarProfile user={loungeUser} />
              :
              <SidebarItem
                isActive={false}
                sidebarItemData={sidebar.data.options[2]}
              />
            }
          </Stack>
        </>
      }
    </div>
  );
};

export default SidebarMenu;