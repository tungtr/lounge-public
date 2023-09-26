import { IconType } from 'react-icons/lib';

export interface SidebarItemDataITF {
  icon: IconType;
  label: string;
  onClick: () => void;
};

export interface SidebarDataITF {
  menu: SidebarItemDataITF[];
  options: SidebarItemDataITF[];
};