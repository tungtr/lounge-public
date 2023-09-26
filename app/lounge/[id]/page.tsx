'use client';

// Essentials
import { useEffect, useContext } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Components
import LoungePage from '@components/pages/LoungePage';

// Services
import { getLounge } from '@services/loungeService';
import { useAppDispatch, useAppSelector } from '@services/redux/hooks';

// Utility
import LoaderContext from '@utils/context/LoaderContext';
import { showNotification } from '@utils/helpers/notification';

const LoungeDetails = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loader = useContext(LoaderContext);
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const { id } = useParams();

  const onGetLounge = async () => {
    if (!loungeUser || typeof id !== 'string') return;
    loader.setIsLoading(true);

    await getLounge({ id, userId: loungeUser._id }, dispatch, router);
  };
  useEffect(() => {
    onGetLounge();
  }, [loungeUser]);

  return (
    <LoungePage />
  );
};

export default LoungeDetails;