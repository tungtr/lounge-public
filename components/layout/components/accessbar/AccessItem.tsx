'use client';

// Essentials
import { useRouter } from 'next/navigation';

// Components - Mantine
import { Tooltip } from '@mantine/core';

// Interfaces
import { LoungeITF } from '@interfaces/LoungeITF';

// Styling
import accessbarStyles from '@styles/layout/Accessbar.module.css';

// Services
import { getImageUrl } from '@services/imageService';

// Utility
import { accessItemTooltip } from '@utils/constants/styles/Transitions';

const AccessItem = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const router = useRouter();

  const onSelectLounge = () => {
    router.push(`/lounge/${lounge.id}`);
  };

  return (
    <Tooltip
      label={lounge.name}
      position='left'
      transitionProps={{ duration: 200, transition: accessItemTooltip }}
    >
      <div className={accessbarStyles.itemContainer}
        onClick={onSelectLounge}
      >
        <div className={accessbarStyles.item}>
          <div className={accessbarStyles.imageContainer}>
            <img className={accessbarStyles.image}
              src={getImageUrl(lounge.avatar, 'profile')}
            />
          </div>
          <div className={accessbarStyles.indicator} />
        </div>
      </div>
    </Tooltip>
  );
};

export default AccessItem;