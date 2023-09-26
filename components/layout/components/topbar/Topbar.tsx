'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';

// Components - Relative
import SidebarItem from '@components/layout/components/sidebar/SidebarItem';
import GeneralTitle from '@components/layout/components/topbar/templates/GeneralTitle';
import LoungeTitle from '@components/layout/components/topbar/templates/LoungeTitle';
import GeneralOptions from '@components/layout/components/topbar/templates/GeneralOptions';
import LoungeOptions from '@components/layout/components/topbar/templates/LoungeOptions';
// Components - Mantine
import { Burger, Group, Flex } from '@mantine/core';

// Services
import { useAppSelector } from '@services/redux/hooks';

// Styling
import topbarStyles from '@styles/layout/Topbar.module.css';

// Utility
import ResponsiveContext from '@utils/context/ResponsiveContext';
import SidebarContext from '@utils/context/SidebarContext';

const Topbar = ({
  activeIdx
}: {
  activeIdx: number
}) => {

  return (
    <Flex
      className={topbarStyles.topbar}
      align='center' justify='space-between'
      gap={32}
    >
      <TitleSection activeIdx={activeIdx} />
      <Group spacing={8}>
        <OptionsSection activeIdx={activeIdx} />
      </Group>
    </Flex>
  );
};

// -- TITLE SECTION -----------------------------------------------------------
const TitleSection = ({
  activeIdx
}: {
  activeIdx: number
}) => {
  const responsive = useContext(ResponsiveContext);
  const [opened, { toggle }] = useDisclosure(false);
  
  // Title handling
  const lounge = useAppSelector(state => state.lounge.lounge);
  let [title, setTitle] = useState('');
  useEffect(() => {
    switch (activeIdx) {
      case 0: setTitle('Lounges'); break;
      case 1: setTitle('Users'); break;
      default: setTitle('');
    }
  }, [activeIdx]);

  return (
    <>
      {!responsive.isMobile ?
        <div style={{ flex: '1', width: '1px' }}>
          {!lounge ?  <GeneralTitle title={title} /> : <LoungeTitle lounge={lounge} />}
        </div>
        :
        <Burger style={{ zIndex: '501' }} opened={opened} onClick={toggle} />
      }
      <SidebarMenu activeIdx={activeIdx} opened={opened} />
    </>
  );
};
  const SidebarMenu = ({
    activeIdx,
    opened
  }: {
    activeIdx: number,
    opened: boolean
  }) => {
    const sidebar = useContext(SidebarContext);

    return (
      <div className={`${topbarStyles.sidebar} ${opened ? topbarStyles.opened : topbarStyles.closed}`}>
        {sidebar.data.menu.map((item, index) => (
          <SidebarItem
            key={index}
            isActive={index === activeIdx}
            sidebarItemData={item}
          />
        ))}
      </div>
    );
  };

// -- OPTIONS SECTION ---------------------------------------------------------
const OptionsSection = ({
  activeIdx
}: {
  activeIdx: number
}) => {
  const lounge = useAppSelector(state => state.lounge.lounge);

  return (
    <>
      {!lounge ? <GeneralOptions activeIdx={activeIdx} /> : <LoungeOptions />}
    </>
  );
};

export default Topbar;