// Essentials
import { createContext } from 'react';

// Interfaces
import { SidebarDataITF } from '@interfaces/LayoutITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

interface SidebarContextITF {
  data: SidebarDataITF,
  setActiveIdx: Dispatch<SetStateAction<number>>,
  isCollapsed: boolean
};

const SidebarContext = createContext<SidebarContextITF>({
  data: { menu: [], options: [] },
  setActiveIdx: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  isCollapsed: false
});

export default SidebarContext;