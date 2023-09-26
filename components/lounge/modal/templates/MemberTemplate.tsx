'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';

// Assets
import { LuSearch } from 'react-icons/lu';

// Components - Relative
import MemberItem from '@components/lounge/modal/components/MemberItem';
// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { Stack, TextInput } from '@mantine/core';

// Interfaces
import { LoungeITF } from '@interfaces/LoungeITF';

// Services
import { useAppDispatch, useAppSelector } from '@services/redux/hooks';
import { getMemberCollection } from '@services/loungeService';

// Utility
import LoungeContext from '@utils/context/LoungeContext';

const MemberTemplate = ({
  lounge
}: {
  lounge: LoungeITF
}) => {
  const title = 'Lounge Members';
  const dispatch = useAppDispatch();
  const loungeCtx = useContext(LoungeContext);

  // Member list handling
  const memberCollection = useAppSelector(state => state.lounge.memberCollection);
  useEffect(() => {
    getMemberCollection({ loungeId: lounge.id }, dispatch);
  }, [lounge]);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Check if Lounge User if admin
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!loungeUser) return;
    setIsAdmin(lounge.admin._id === loungeUser._id);
  }, [loungeUser]);

  return (
      <Stack spacing={16}>
        <ModalHeader
          title={title}
          back={() => loungeCtx.setTemplateIdx(1)} close={loungeCtx.close}
        />
        <TextInput
          icon={<LuSearch />}
          placeholder='Search member'
        />
        {memberCollection &&
          <Stack spacing={0}>
            <MemberItem
              member={memberCollection.admin} role='admin'
              idx={0}
              activeIdx={activeIdx} setActiveIdx={setActiveIdx}
              isAdmin={isAdmin}
            />
            {memberCollection.modList.map((mod, index) => (
              <MemberItem key={index}
                member={mod} role='mod'
                idx={1 + index}
                activeIdx={activeIdx} setActiveIdx={setActiveIdx}
                isAdmin={isAdmin}
              />
            ))}
            {memberCollection.memberList.map((member, index) => (
              <MemberItem key={index}
                member={member} role='member'
                idx={1 + memberCollection.memberList.length + index}
                activeIdx={activeIdx} setActiveIdx={setActiveIdx}
                isAdmin={isAdmin}
              />
            ))}
          </Stack>
        }
      </Stack>
  );
};

export default MemberTemplate;