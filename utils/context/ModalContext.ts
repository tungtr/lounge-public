// Essentials
import { createContext } from 'react';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface ModalContextITF {
  getPath: () => string[],
  setPath: Dispatch<SetStateAction<string[]>>,
};

const ModalContext = createContext<ModalContextITF>({
  getPath: () => { return []; },
  setPath: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
});

export default ModalContext;