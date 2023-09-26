'use client';

// Essentials
import { useState } from 'react';

// Components - Relative
import LoginTemplate from '@components/authentication/templates/LoginTemplate';
import SignUpTemplate from '@components/authentication/templates/SignUpTemplate';
import HelpTemplate from '@components/authentication/templates/HelpTemplate';
import ForgotPasswordTemplate from '@components/authentication/templates/ForgotPasswordTemplate';
import VerifyTemplate from '@components/authentication/templates/VerifyTemplate';
// Components - Mantine
import { Modal, LoadingOverlay } from '@mantine/core';

// Interface
import { AuthModalDataITF } from '@interfaces/AuthITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

// Utility
import AuthContext from '@utils/context/AuthContext';

const AuthModal = ({
  opened, close,
  setTemplateIdx,
  type
}: {
  opened: boolean, close: () => void,
  setTemplateIdx: Dispatch<SetStateAction<number>>,
  type: AuthModalDataITF
}) => {
  // Modal handling
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal
      closeOnClickOutside={false}
      opened={opened}
      onClose={close}
    >
      <LoadingOverlay visible={isLoading} />
      <AuthContext.Provider value={{ opened, close, setTemplateIdx, type, isLoading, setIsLoading }}>
        {type.id === 0 && <LoginTemplate />}
        {type.id === 1 && <SignUpTemplate /> }
        {type.id === 2 && <HelpTemplate /> }
        {type.id === 3 && <ForgotPasswordTemplate /> }
        {type.id === 4 && <VerifyTemplate /> }
      </AuthContext.Provider>
    </Modal>
  );
}

export default AuthModal;