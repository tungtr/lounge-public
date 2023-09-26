// Types
import type { IconType } from 'react-icons/lib';

export interface GetListITF {
  skip: number | null;
  limit: number | null;
  search: string;
};

export interface OptionITF {
  icon: IconType,
  label: string,
  onClick: () => void
};