// Essentials
import { createContext } from 'react';

// Interfaces
import { OptionITF } from '@interfaces/QuestionITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface QuestionContextITF {
  setIsLoading: Dispatch<SetStateAction<boolean>>,
  setQuestion: Dispatch<SetStateAction<string>>,
  setOptionList: Dispatch<SetStateAction<OptionITF[]>>,
  open: () => void, close: () => void,
  setCloseOption: Dispatch<SetStateAction<{ action: () => void }>>
};

const SidebarContext = createContext<QuestionContextITF>({
  setIsLoading: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  setQuestion: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  setOptionList: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  open: () => {}, close: () => {},
  setCloseOption: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); }
});

export default SidebarContext;