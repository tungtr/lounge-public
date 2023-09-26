// Components - Mantine
import { Group } from '@mantine/core';

// Types
import type { IconType } from 'react-icons/lib';

const OptionButton = ({
  icon,
  text,
  onClick
}: {
  icon: IconType,
  text: string,
  onClick: () => void
}) => {
  const Icon = icon;

  return (
    <div
      className='option-button'
      onClick={onClick}
    >
      <Group spacing={8}>
        <Icon />
        {text}
      </Group>
    </div>
  );
};

export default OptionButton;