// Essentials
import { createContext } from 'react';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface LoaderContextITF {
  getIsLoading: () => boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>
};

const LoaderContext = createContext<LoaderContextITF>({
  getIsLoading: () => false,
  setIsLoading: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); }
});

export default LoaderContext;