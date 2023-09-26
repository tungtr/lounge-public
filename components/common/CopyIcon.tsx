'use client';

// Assets
import { LuCheck, LuCopy } from 'react-icons/lu';

// Components - Mantine
import { ActionIcon, CopyButton, Tooltip } from '@mantine/core';

export const CopyIcon = ({
  value,
  tip
}: {
  value: string,
  tip: string
}) => {
  return (
    <CopyButton value={value} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? 'Copied' : tip} position='top'>
          <ActionIcon
            color={copied ? 'green' : 'purple'}
            onClick={copy}
            variant={copied ? 'filled' : 'light'}
          >
            {copied ? <LuCheck /> : <LuCopy />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

export default CopyIcon;