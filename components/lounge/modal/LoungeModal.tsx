'use client';

// Essentials
import { useContext } from 'react';

// Components - Relative
import CreateTemplate from '@components/lounge/modal/templates/CreateTemplate';
import ViewTemplate from '@components/lounge/modal/templates/ViewTemplate';
import JoinTemplate from '@components/lounge/modal/templates/JoinTemplate';
import UpdateTemplate from '@components/lounge/modal/templates/UpdateTemplate';
import MemberTemplate from '@components/lounge/modal/templates/MemberTemplate';
// Components - Mantine
import { Modal } from '@mantine/core';

// Services
import { useAppSelector } from '@services/redux/hooks';

// Utility
import LoungeContext from '@utils/context/LoungeContext';

const LoungeModal = ({
  opened,
  templateIdx
}: {
  opened: boolean,
  templateIdx: number
}) => {
  const loungeCtx = useContext(LoungeContext);
  const lounge = useAppSelector(state => state.lounge.lounge);

  return (
    <Modal
      opened={opened}
      onClose={loungeCtx.close}
    >
      {templateIdx === 0 && <CreateTemplate />}
      {lounge && templateIdx === 1 && <ViewTemplate lounge={lounge} />}
      {templateIdx === 2 && <JoinTemplate />}
      {lounge && templateIdx === 3 && <UpdateTemplate lounge={lounge} />}
      {lounge && templateIdx === 4 && <MemberTemplate lounge={lounge} />}
    </Modal>
  );
};

export default LoungeModal;