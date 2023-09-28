'use client';

// Essentials
import { useState, useEffect, useRef, useContext } from 'react';

// Assets
import EmptyLounge from '@public/images/empty-lounge.svg';

// Components - Relative
import MessageItem from '@components/lounge/chat/MessageItem';
// Components - Common
import Empty from '@components/common/Empty';
// Components - Mantine
import { Flex } from '@mantine/core';

// Interfaces
import { MessageITF } from '@interfaces/MessageITF';

// Services
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setMessageList, setMessageListOffset, setNaviReplyTrigger } from '@services/redux/reducers/messageReducer';
import { getMessageList, getMessageListTotal } from '@services/messageService';
import { pusherClient } from '@services/third-party/pusher';
import { getRole } from '@services/loungeService';

// Styling
import messageStyles from '@styles/message/Message.module.css';

// Utility
import Globals from '@utils/constants/global/Miscellaneous';
import LoaderContext from '@utils/context/LoaderContext';

const Chatbox = () => {
  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);
  const lounge = useAppSelector(state => state.lounge.lounge);

  const messageList = useAppSelector(state => state.message.messageList);
  const messageListTotal = useAppSelector(state => state.message.messageListTotal);
  const messageListOffset = useAppSelector(state => state.message.messageListOffset);
  const messageListOffsetLater = useAppSelector(state => state.message.messageListOffsetLater);
  const naviReplyTrigger = useAppSelector(state => state.message.naviReplyTrigger);
  const [reversedList, setReversedList] = useState<MessageITF[]>([]); // For display

  const onGetMessageList = async (isPrior: boolean) => {
    if (!lounge) return;
    await getMessageListTotal({ loungeId: lounge.id }, dispatch);
    const offset = isPrior ? messageListOffset : messageListOffsetLater;
    await getMessageList({
      loungeId: lounge.id,
      offset,
      messageList,
      messageListOffset: offset,
      isPrior
    }, dispatch);

    loader.setIsLoading(false);
  };

  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      dispatch(setMessageList([]));
      dispatch(setMessageListOffset(0));
      first.current = false;
      return;
    }
    setReversedList([]);
    onGetMessageList(true);
  }, [lounge]);

  // Reversed list
  const onAutoLoadMore = async () => {
    if (messageListTotal > Globals.DEFAULT_MESSAGE_LIST_LIMIT && messageList.length < Globals.DEFAULT_MESSAGE_LIST_LIMIT) {
      await onGetMessageList(false);
      dispatch(setNaviReplyTrigger(!naviReplyTrigger));
    }
  }
  useEffect(() => {
    if (messageList.length === 0) return;
    const list = [...messageList];
    setReversedList(list.reverse());
    onAutoLoadMore();
  }, [messageList]);

  // Load on scroll handling
  const boxRef = useRef<HTMLDivElement>(null);
  const [loadMore, setLoadMore] = useState(false);
  const [isLoadMorePrior, setIsLoadMorePrior] = useState(true);
  const onScroll = () => {
    if (!boxRef || !boxRef.current || loadMore) return; 
    const box = boxRef.current;
    if ((reversedList.length > 0 && reversedList[reversedList.length - 1].order > 0) &&
    (box.scrollHeight - box.clientHeight) - Math.abs(Math.ceil(box.scrollTop)) < 16) {
      setIsLoadMorePrior(true);
      setLoadMore(true);
    }
    if (reversedList.length > 0 && reversedList[0].order < messageListTotal - 1 && Math.abs(Math.ceil(box.scrollTop)) === 0) {
      setIsLoadMorePrior(false);
      setLoadMore(true);
    }
  };
  const onLoadMore = async (isPrior: boolean) => {
    await onGetMessageList(isPrior);
    setLoadMore(false);
    if (isPrior || !boxRef || !boxRef.current) return;
    boxRef.current.scrollTop = -32;
  };
  useEffect(() => {
    if (!loadMore) return;
    onLoadMore(isLoadMorePrior);
  }, [loadMore]);

  // Role handling
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const [role, setRole] = useState('member');
  const onGetRole = async () => {
    if (!lounge || !loungeUser) return;
    const result = await getRole({ id: lounge.id, userId: loungeUser._id });
    setRole(result);
  };
  useEffect(() => {
    onGetRole();
  }, [loungeUser, lounge]);

  // Reply navigation handling
  const replyRef = useRef<HTMLDivElement>(null);
  const naviReplyOrder = useAppSelector(state => state.message.naviReplyOrder);
  useEffect(() => {
    setTimeout(() => {
      if (!replyRef || !replyRef.current || !messageList.map(message => message.order).includes(naviReplyOrder)) return;
      replyRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [naviReplyTrigger]);
  
  // Real-time handling
  useEffect(() => {
    if (!lounge) return;
    pusherClient.subscribe(lounge.id);

    pusherClient.bind('incoming-message', (newMessage: MessageITF) => {
      if (messageList.length === 0 || (messageList.length > 0 && messageList.map(message => message.order).includes(newMessage.order - 1))) {
        dispatch(setMessageList([...messageList, newMessage]));
      }
    });

    return () => {
      pusherClient.unsubscribe(lounge.id);
    };
  }, [lounge, messageList]);

  return (
      <Flex
        className={messageStyles.boxContainer}
        direction='column-reverse' gap={16}
        onScroll={onScroll}
        ref={boxRef}
      >
        {!loader.getIsLoading() &&
          <>
            {reversedList.length > 0 && reversedList.map((message, index) => (
              <div key={index}
                ref={naviReplyOrder === message.order ? replyRef : undefined}
              >
                <MessageItem
                  message={message}
                  role={role}
                />
              </div>
            ))}
            {reversedList.length === 0 &&
              <Empty
                text={`Welcome to ${lounge ? lounge.name : 'the lounge'}. Say hello!`}
                src={EmptyLounge.src}
              />
            }
          </>
        }
      </Flex>
  );
};

export default Chatbox;