'use client';

// Essentials
import { useContext } from 'react';

// Components
import { Group, Tooltip } from '@mantine/core';

// Interfaces
import { SidebarItemDataITF } from '@interfaces/LayoutITF';

// Styling
import sidebarStyles from '@styles/layout/Sidebar.module.css';

// Utility
import { slideRight } from '@utils/constants/styles/Transitions';
import ResponsiveContext from '@utils/context/ResponsiveContext';
import SidebarContext from '@utils/context/SidebarContext';

const SidebarItem = ({
  isActive=false,
  sidebarItemData
}: {
  isActive: boolean,
  sidebarItemData: SidebarItemDataITF
}) => {
  const responsive = useContext(ResponsiveContext);
  const sidebar = useContext(SidebarContext);
  const statusStyle = !isActive ? sidebarStyles.itemStatic : sidebarStyles.itemActive;
  
  return (
    <Tooltip
      disabled={!(sidebar.isCollapsed || responsive.isTablet) || responsive.isMobile}
      label={sidebarItemData.label}
      position='right'
      transitionProps={{ duration: 200, transition: slideRight }}
    >
      <div
        className={`${sidebarStyles.item} ${statusStyle}`}
        onClick={sidebarItemData.onClick}
      >
        <Group spacing={16} noWrap>
          <div className={sidebarStyles.iconContainer}>
            <sidebarItemData.icon className={sidebarStyles.icon} />
          </div>
          <div className={`type-label-3 ${sidebarStyles.label}`}>{sidebarItemData.label}</div>
        </Group>
      </div>
    </Tooltip>
  );
};

export default SidebarItem;