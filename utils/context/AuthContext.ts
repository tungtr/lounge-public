// Essentials
import { createContext } from 'react';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface AuthContextITF {
  opened: boolean, close: () => void,
  setTemplateIdx: Dispatch<SetStateAction<number>>,
  type: { id: number, title: string },
  isLoading: boolean, setIsLoading: Dispatch<SetStateAction<boolean>>
};

const AuthContext = createContext<AuthContextITF>({
  opened: false, close: () => {},
  setTemplateIdx: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  type: { id: 0, title: 'Login' },
  isLoading: false, setIsLoading: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); }
});

export default AuthContext;