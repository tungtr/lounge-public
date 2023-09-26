'use client';

// Essentials
import { useContext } from 'react';
import dynamic from 'next/dynamic';

// Components - Relative
import Logo from '@components/layout/components/Logo';
const SidebarMenu = dynamic(() => import('@components/layout/components/sidebar/SidebarMenu'), { ssr: false });
// Components - Mantine
import { Stack } from '@mantine/core';

// Styling
import sidebarStyles from '@styles/layout/Sidebar.module.css';

// Utility
import SidebarContext from '@utils/context/SidebarContext';

const Sidebar = ({
  activeIdx
}: {
  activeIdx: number
}) => {
  const sidebar = useContext(SidebarContext);
  
  return (
    <div className={`${sidebar.isCollapsed ? `${sidebarStyles.collapsed} ${sidebarStyles.sidebarCollapsed}` : ''} ${sidebarStyles.sidebar}`}>
      <Stack spacing={32} style={{ height: '100%' }}>
        <Logo />
        <SidebarMenu activeIdx={activeIdx} />
      </Stack>
    </div>
  );
};

export default Sidebar;