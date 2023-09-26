'use client';

// Essentials
import { useContext } from 'react';

// Components - Relative
import ViewTemplate from '@components/profile/templates/ViewTemplate';
import UpdateTemplate from '@components/profile/templates/UpdateTemplate';
import ChangePasswordTemplate from '@components/profile/templates/ChangePasswordTemplate';
// Components - Mantine
import { Modal } from '@mantine/core';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

// Utility
import LoungeContext from '@utils/context/LoungeContext';
import ProfileContext from '@utils/context/ProfileContext';

const ProfileModal = ({
  opened,
  user,
  templateIdx,
  from // from which the profile modal is opened
}: {
  opened: boolean,
  user: UserITF | null,
  templateIdx: number,
  from: string
}) => {
  const lounge = useContext(LoungeContext);
  const profile = useContext(ProfileContext);

  return (
    <Modal
      opened={opened} 
      onClose={profile.close}
      zIndex={505}
    >
      {user &&
        <>
          {templateIdx === 0 && <ViewTemplate user={user} />}
          {templateIdx === 1 && <UpdateTemplate user={user} />}
          {templateIdx === 2 && <ChangePasswordTemplate user={user}  />}
        </>
      }
    </Modal>
  );
};

export default ProfileModal;