// Essentials
import { createContext } from 'react';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface LoungeContextITF {
  // Modal handling
  setTemplateIdx: Dispatch<SetStateAction<number>>;
  open: () => void, close: () => void;
};

const LoungeContext = createContext<LoungeContextITF>({
  setTemplateIdx: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  open: () => {}, close: () => {}
});

export default LoungeContext;