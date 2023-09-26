// Essentials
import { createContext } from 'react';

// Interfaces
import { MessageITF, ReplyITF } from '@interfaces/MessageITF';

// Types
import type { Dispatch, SetStateAction } from 'react';

export interface MessageContextITF {
  setReply: Dispatch<SetStateAction<MessageITF | null>>;
  onReplyClick: (reply: ReplyITF) => void;
};

const MessageContext = createContext<MessageContextITF>({
  setReply: (setStateAction: SetStateAction<any>) => { (value: any) => setStateAction(value); },
  onReplyClick: () => {}
});

export default MessageContext;