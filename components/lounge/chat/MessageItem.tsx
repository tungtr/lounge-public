'use client';

// Essentials
import { useState, useEffect, useRef, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';
import moment from 'moment';
import { GiphyFetch } from '@giphy/js-fetch-api';

// Assets
import { LuSmile, LuReply } from 'react-icons/lu';

// Components - Relative
import { Gif } from '@giphy/react-components';
import EmojiPicker from 'emoji-picker-react';
import { EmojiStyle } from 'emoji-picker-react';
// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { ActionIcon, Avatar, Button, Flex, Group, Modal, Stack, Text, Tooltip } from '@mantine/core';

// Interfaces
import { MessageITF, ReactionITF, NewReactionITF } from '@interfaces/MessageITF';

// Services
import { getImageUrl } from '@services/imageService';
import { getUser } from '@services/userService';
import { reactToMessage } from '@services/messageService';
import { useAppSelector, useAppDispatch } from '@services/redux/hooks';
import { setMessageList, setNaviReplyOrder, setNaviReplyTrigger } from '@services/redux/reducers/messageReducer';
import { pusherClient } from '@services/third-party/pusher';

// Styling
import messageStyles from '@styles/message/Message.module.css';

// Types
import { IGif } from "@giphy/js-types";
import type { EmojiClickData } from 'emoji-picker-react';

// Utility
import { showNotification } from '@utils/helpers/notification';
import MessageContext from '@utils/context/MessageContext';
import ProfileContext from '@utils/context/ProfileContext';

const MessageItem = ({
  message,
  role
}: {
  message: MessageITF,
  role: string
}) => {
  const dispatch = useAppDispatch();
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const lounge = useAppSelector(state => state.lounge.lounge);
  const messageCtx = useContext(MessageContext);
  const profile = useContext(ProfileContext);
  const [isLoungeUser, setIsLoungeUser] = useState(false);
  useEffect(() => {
    if (!loungeUser) return;
    setIsLoungeUser(loungeUser._id === message.user._id);
  }, [loungeUser, message]);

  const onGetUser = async () => {
    const user = await getUser({ email: message.user.email }, dispatch);
    if (user) {
      profile.setUser(user);
      profile.setTemplateIdx(0);
      profile.open();
    }
  };

  // Gif handling
  const bubbleRef = useRef<HTMLDivElement>(null);
  const [gifWidth, setGifWidth] = useState(0);
  useEffect(() => {
    if (!bubbleRef || !bubbleRef.current) return;
    setGifWidth(bubbleRef.current.offsetWidth);
  }, [bubbleRef]);
  const giphyFetch = new GiphyFetch(`${process.env.GIPHY_KEY}`);
  const [gif, setGif] = useState<IGif | null>(null);
  const onGetGif = async () => {
    if (!message.gifKey) {
      setGif(null);
      return;
    }
    const { data } = await giphyFetch.gif(message.gifKey);
    setGif(data);
  };
  useEffect(() => {
    onGetGif();
  }, [message]);

  // Reply navigation handling
  const naviReplyTrigger = useAppSelector(state => state.message.naviReplyTrigger);
  const onReplyClick = () => {
    if (!message.reply) return;
    messageCtx.onReplyClick(message.reply);
    dispatch(setNaviReplyOrder(message.reply.order));
    dispatch(setNaviReplyTrigger(!naviReplyTrigger));
  }
  
  // Real-time handling
  const [reactionList, setReactionList] = useState<ReactionITF[]>([]);
  const messageList = useAppSelector(state => state.message.messageList);
  useEffect(() => {
    setReactionList(message.reactionList);
  }, [message, messageList]);
  useEffect(() => {
    if (!lounge) return;
    pusherClient.subscribe(lounge.id);

    pusherClient.bind('incoming-reaction', (newReaction: NewReactionITF) => {
      if (message.order !== newReaction.order) return;

      const reaction = reactionList.find(reaction => reaction.name === newReaction.reaction.name);
      const user = newReaction.reaction.user;
      
      // If the reaction already exists
      let newReactionList = [];
      if (reaction) {
        const idx = reactionList.map(reaction => reaction.name).indexOf(reaction.name);
        const memberList = reactionList[idx].memberList;

        // Remove the user if they have already reacted
        if (memberList.find(member => member.email === user.email)) {
          const userIdx = memberList.map(member => member.email).indexOf(user.email);
          newReactionList = memberList.length === 1 ?
          // If it's only the user who reacts
            [
              ...reactionList.slice(0, idx),
              ...reactionList.slice(idx + 1)
            ] :
          // If there are still other users
            [
              ...reactionList.slice(0, idx),
              {
                name: reactionList[idx].name,
                url: reactionList[idx].url,
                memberList: [...memberList.slice(0, userIdx), ...memberList.slice(userIdx + 1)]
              },
              ...reactionList.slice(idx + 1)
            ];
        }
        // New member
        else {
          newReactionList = [
            ...reactionList.slice(0, idx),
            {
              name: reactionList[idx].name,
              url: reactionList[idx].url,
              memberList: [...memberList, user]
            },
            ...reactionList.slice(idx + 1)
          ]
        }
      } else {
        newReactionList = [
          ...reactionList,
          {
            name: newReaction.reaction.name,
            url: newReaction.reaction.url,
            memberList: [newReaction.reaction.user]
          }
        ]
      }
      setReactionList(newReactionList);
      if (messageList) {
        const messageIdx = messageList.map(msg => msg.order).indexOf(message.order);
        dispatch(setMessageList([
          ...messageList.slice(0, messageIdx),
          { ...message, reactionList: newReactionList },
          ...messageList.slice(messageIdx + 1)
        ]));
      }
    });

    return () => {
      pusherClient.unsubscribe(lounge.id);
    };
  }, [lounge, message, messageList, reactionList]);

  return (
    <Flex
      align='flex-start'
      direction={`row${isLoungeUser ? '-reverse' : ''}`}
      gap={16}
    >
      <Avatar
        src={getImageUrl(message.user.avatar, 'avatar')}
        size='lg'
      />
      <div
        className={`${messageStyles.bubble} ${isLoungeUser ? messageStyles.loungeUser : ''}`}
        ref={bubbleRef}
      >
        <Stack spacing={8}>
          <Group spacing={8}>
            <Text
              className={`type-label-3 ${messageStyles.username} ${isLoungeUser ? messageStyles.loungeUser : ''}`}
              onClick={onGetUser}
            >
              {message.user.username}
            </Text>
            <Text
              className='type-body-3' color={isLoungeUser ? 'neutral.2' : 'neutral.3'}
              lineClamp={2}
            >
              {moment(message.createdAt).format('DD/MM/YYYY hh:mm:ss')}
            </Text>
          </Group>
          {message.reply &&
            <Text
              className={`type-body-3 ${messageStyles.reply}`} color={isLoungeUser ? 'neutral.2' : 'neutral.3'} fs='italic'
              lineClamp={2}
              onClick={onReplyClick}
            >
              {`| ${message.reply.username}: ${message.reply.content}`}
            </Text>
          }
          {message.content.length > 0 &&
            <Text className='type-body-2' color={isLoungeUser ? 'neutral.1' : 'dark.9'}>
              {message.content}
            </Text>
          }
          {message.image &&
            <img
              className={messageStyles.image}
              src={getImageUrl(message.image, '')}
            />
          }
          {gif &&
            <Gif gif={gif}
              borderRadius={8} width={gifWidth}
              noLink={true} hideAttribution={true}
            />
          }
          {reactionList.length > 0 && 
            <Group className={messageStyles.reactionGroup} spacing={4}>
              {reactionList.map((reaction, index) => (
                <Tooltip key={index}
                  label={
                    <div>
                      {reaction.memberList.map((member, index) => <div key={index}>{member.username}</div>)}
                    </div>
                  }
                >
                  <Button
                    size='sm' radius='md'
                    variant='light'
                    compact
                    onClick={() => {
                      if (!lounge || !loungeUser) return;
                      reactToMessage({
                        loungeId: lounge.id,
                        order: message.order,
                        newReaction: {
                          name: reaction.name,
                          url: reaction.url,
                          user: {
                            email: loungeUser.email,
                            username: loungeUser.username
                          }
                        }
                      })
                    }}
                  >
                    <Group align='center' spacing={4} h='100%'>
                      <img
                        src={reaction.url}
                        height='80%'
                      />
                      <Text>
                        {reaction.memberList.length}
                      </Text>
                    </Group>
                  </Button>
                </Tooltip>
              ))}
            </Group>
          }
        </Stack>
        <ChatOptions message={message} role={role} />
      </div>
    </Flex>
  );
};

const ChatOptions = ({
  message,
  role
}: {
  message: MessageITF,
  role: string
}) => {
  const messageCtx = useContext(MessageContext);

  // Emoji handling
  const [emojiOpened, { open: emojiOpen, close: emojiClose }] = useDisclosure(false);

  return (
    <Group className={messageStyles.option} spacing={4}>
      <ActionIcon
        onClick={emojiOpen}
      >
        <LuSmile />
      </ActionIcon>
      <ActionIcon
        onClick={() => messageCtx.setReply(message)}
      >
        <LuReply />
      </ActionIcon>
      <EmojiModal message={message} opened={emojiOpened} close={emojiClose} />
    </Group>
  );
};

const EmojiModal = ({
  message,
  opened, close
}: {
  message: MessageITF,
  opened: boolean, close: () => void
}) => {
  const lounge = useAppSelector(state => state.lounge.lounge);
  const loungeUser = useAppSelector(state => state.user.loungeUser);

  const onSelectEmoji = async (emoji: EmojiClickData) => {
    if (!lounge || !loungeUser) {
      showNotification({
        title: 'React to Message',
        message: 'Something went wrong. Try reloading the page.',
        status: 'error'
      });
      return;
    }
    
    reactToMessage({
      loungeId: lounge.id,
      order: message.order,
      newReaction: {
        name: emoji.names[0],
        url: emoji.imageUrl,
        user: {
          email: loungeUser.email,
          username: loungeUser.username
        }
      }
    });
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
    >
      <Stack spacing={16}>
        <ModalHeader
          title='React to message'
          back={null} close={close}
        />
        <EmojiPicker
          emojiStyle={EmojiStyle.FACEBOOK}
          onEmojiClick={(emoji) => onSelectEmoji(emoji)}
          lazyLoadEmojis={true}
          width='100%'
        />
      </Stack>
    </Modal>
  );
};

export default MessageItem;