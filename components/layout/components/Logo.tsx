'use client';

// Essentials
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setLoungeFilter, setLoungeTrigger } from '@services/redux/reducers/loungeReducer';

// Styling
import logoStyles from '@styles/layout/Logo.module.css';

const Logo = () => {
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Status handling
  const [status, setStatus] = useState('default');
  const handleMouseDown = () => setStatus('pressed');
  const handleMouseUp = () => setStatus('hover');
  const handleMouseEnter = () => setStatus('hover');
  const handleMouseLeave = () => setStatus('default');

  const statusMap = [
    {
      status: 'default',
      outerDiamondStyle: logoStyles.outerDiamondDefault,
      innerDiamondStyle: logoStyles.innerDiamondDefault
    },
    {
      status: 'hover',
      outerDiamondStyle: logoStyles.outerDiamondHover,
      innerDiamondStyle: logoStyles.innerDiamondHover
    },
    {
      status: 'pressed',
      outerDiamondStyle: logoStyles.outerDiamondPressed,
      innerDiamondStyle: logoStyles.innerDiamondPressed
    }
  ];

  const getStatus = () => {
    const result = statusMap.find(statusItem => statusItem.status === status);
    return result ? result : statusMap[0];
  };

  // Navigation handling
  const onClick = () => {
    dispatch(setLoungeFilter('discover'));
    dispatch(setLoungeTrigger(!loungeTrigger));
    router.push('/');
  };

  return (
    <div className={logoStyles.container}>
      <div
        className={`${logoStyles.outerDiamond} ${getStatus().outerDiamondStyle}`}
        onClick={onClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`${logoStyles.innerDiamond} ${getStatus().innerDiamondStyle}`} />
      </div>
    </div>
  );
};

export default Logo;