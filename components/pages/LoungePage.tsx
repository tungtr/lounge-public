'use client';

// Essentials
import { useState, useRef } from 'react';

// Components - Relative
import Chatbox from '@components/lounge/chat/Chatbox';
import Chatbar from '@components/lounge/chat/Chatbar';

// Interfaces
import { MessageITF, ReplyITF } from '@interfaces/MessageITF';

// Styling
import messageStyles from '@styles/message/Message.module.css';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setMessageList, setMessageListOffset, setMessageListOffsetLater } from '@services/redux/reducers/messageReducer';
import { getMessageList, getMessageListTotal } from '@services/messageService';

// Utility
import Globals from '@utils/constants/global/Miscellaneous';
import MessageContext from '@utils/context/MessageContext';

const LoungePage = () => {
  const dispatch = useAppDispatch();
  const lounge = useAppSelector(state => state.lounge.lounge);
  const messageList = useAppSelector(state => state.message.messageList);
  const messageListTotal = useAppSelector(state => state.message.messageListTotal);
  const messageListOffset = useAppSelector(state => state.message.messageListOffset);

  const [currentReply, setCurrentReply] = useState<MessageITF | null>(null); // Current reply on chat bar
  const onReplyClick = async (reply: ReplyITF) => { // Scroll to reply on click
    if (!lounge) return;
    if (!messageList.map(message => message.order).includes(reply.order)) {
      const limit = Globals.DEFAULT_MESSAGE_LIST_LIMIT;
      const offsetMutiplier = Math.floor((messageListTotal - reply.order - 1) / limit);
      const offset = (offsetMutiplier * limit) + ((messageListTotal - 1 - reply.order) % limit);
      // const offset = offsetMutiplier * limit;
      dispatch(setMessageList([]));
      dispatch(setMessageListOffset(offset));
      dispatch(setMessageListOffsetLater(offset - limit));
      await getMessageList({ loungeId: lounge.id, offset, messageList: [], messageListOffset: offset, isPrior: true }, dispatch);
    }
  };

  return (
    <div className={messageStyles.layout}>
      <MessageContext.Provider value={{ setReply: setCurrentReply, onReplyClick }}>
        <Chatbox />
        <Chatbar reply={currentReply} />
      </MessageContext.Provider>
    </div>
  );
};

export default LoungePage;