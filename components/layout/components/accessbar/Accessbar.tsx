'use client';

// Essentials
import { useEffect } from 'react';

// Components
import AccessItem from '@components/layout/components/accessbar/AccessItem';

// Services
import { useAppDispatch, useAppSelector } from '@services/redux/hooks';
import { getLoungeList } from '@services/loungeService';

// Styling
import accessbarStyles from '@styles/layout/Accessbar.module.css';

const Accessbar = () => {
  const dispatch = useAppDispatch();
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const accessList = useAppSelector(state => state.lounge.accessList);
  const onGetLoungeList = async () => {
    if (!loungeUser) return;
    await getLoungeList({ filter: 'recent', loungeUserId: loungeUser._id, skip: null, limit: null, search: '' }, dispatch);
  };
  useEffect(() => {
    onGetLoungeList();
  }, [loungeUser]);

  return (
    <>
      {loungeUser && accessList.length > 0 && 
        <div className={accessbarStyles.accessbar}>
          {accessList.map((lounge, index) => (
            <AccessItem key={index} lounge={lounge} />
          ))}
        </div>
      }
    </>
  );
};

export default Accessbar;