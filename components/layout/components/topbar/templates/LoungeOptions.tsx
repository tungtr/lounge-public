'use client';

// Essentials
import { useContext } from 'react';

// Assets
import { LuInfo } from 'react-icons/lu';
// Components - Mantine
import { ActionIcon } from '@mantine/core';

// Utility
import LoungeContext from '@utils/context/LoungeContext';

const LoungeOptions = () => {
  const lounge = useContext(LoungeContext);

  // Options handling
  const onShowLoungeDetails = () => {
    lounge.setTemplateIdx(1);
    lounge.open();
  };

  return (
    <>
      <ActionIcon
        color='purple' variant='filled'
        radius='xl'
        onClick={onShowLoungeDetails}
      >
        <LuInfo />
      </ActionIcon>
    </>
  );
};

export default LoungeOptions;