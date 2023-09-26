// Essentials
import { createContext } from 'react';

// Interfaces
import { UserITF } from '@interfaces/UserITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface ProfileContextITF {
  setUser: Dispatch<SetStateAction<UserITF | null>>,
  setFrom: Dispatch<SetStateAction<string>>,
  setTemplateIdx: Dispatch<SetStateAction<number>>,
  open: () => void, close: () => void,
  setCloseOption: Dispatch<SetStateAction<{ action: () => void }>>
};

const ProfileContext = createContext<ProfileContextITF>({
  setUser: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  setFrom: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  setTemplateIdx: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  open: () => {}, close: () => {},
  setCloseOption: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); }
});

export default ProfileContext;