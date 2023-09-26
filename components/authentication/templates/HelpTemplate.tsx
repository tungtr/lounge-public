'use client';

// Essentials
import { useContext } from 'react';
import AuthContext from '@utils/context/AuthContext';

// Assets
import { LuLock, LuShieldAlert } from 'react-icons/lu';

// Components - Mantine
import { Stack } from '@mantine/core';
// Components - Common
import ModalHeader from '@components/common/ModalHeader';
import OptionButton from '@components/common/OptionButton';

const HelpTemplate = () => {
  const auth = useContext(AuthContext);

  return (
    <form>
      <Stack spacing={16}>
        <ModalHeader
          title={auth.type.title}
          back={() => auth.setTemplateIdx(0)} close={auth.close}
        />
        <Stack spacing={8}>
          <OptionButton
            icon={LuLock}
            text='I forgot my password'
            onClick={() => auth.setTemplateIdx(3)}
          />
          <OptionButton
            icon={LuShieldAlert}
            text='My email has not been verified'
            onClick={() => auth.setTemplateIdx(4)}
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default HelpTemplate;