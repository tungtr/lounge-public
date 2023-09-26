'use client';

// Essentials
import { useState, useRef, useContext } from 'react';
import { useDisclosure } from '@mantine/hooks';

// Assets
import { LuSendHorizonal, LuImage} from 'react-icons/lu';
import { PiGifBold } from 'react-icons/pi';

// Components - Relative
import GifModal from '@components/lounge/chat/gif/GifModal';
// Components - Mantine
import { ActionIcon, Flex, FileInput, Stack, Text, TextInput, Tooltip } from '@mantine/core';

// Interfaces
import { MessageITF } from '@interfaces/MessageITF';

// Services
import { useAppSelector } from '@services/redux/hooks';
import { sendMessage } from '@services/messageService';
import { uploadImage, getBase64Image } from '@services/imageService';

// Styling
import messageStyles from '@styles/message/Message.module.css';

// Utility
import MessageContext from '@utils/context/MessageContext';

const Chatbar = ({
  reply
}: {
  reply: MessageITF | null
}) => {
  const lounge = useAppSelector(state => state.lounge.lounge);
  const messageCtx = useContext(MessageContext);

  // Image handling
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const imageRef = useRef<HTMLButtonElement>(null);
  const onChangeImage = (image: File | null) => {
    if (!image) return;
    getBase64Image(image, setImage);
    setImageFile(image);
  };
  const onRemoveImage = () => {
    setImage(null);
    setImageFile(null);
  };

  // Message handling
  const [message, setMessage] = useState('');
  const onSendMessage = async () => {
    setMessage('');
    onRemoveImage();
    if (!lounge || (!imageFile && message.length === 0)) return;

    let image = { url: '', path: '' };
    if (imageFile) image = await uploadImage(imageFile, 'message', null);

    await sendMessage({
      loungeId: lounge.id,
      content: message,
      image,
      gifKey: null,
      reply: reply || null
    });
    messageCtx.setReply(null);
  };

  // GIF handling
  const [gifOpened, { open: gifOpen, close: gifClose }] = useDisclosure(false); // Modal

  return (
    <>
      <Stack className={messageStyles.barContainer} spacing={8}>
        {reply && 
          <Text className={`type-body-3 ${messageStyles.replyContainer}`} color='neutral.5'>
            Replying to <span style={{ fontWeight: '600' }}>{reply.user.username}</span>:{' '}
            <span>
              {reply.content.length > 0 ? `"${reply.content}"`
                : `${reply.user.username} sent ${reply.image ? 'an image' : ''} ${reply.gifKey ? 'a GIF' : ''}`
              }
            </span>
          </Text>
        }
        <Flex gap={8} align='center'>
          <TextInput
            className={messageStyles.textInput}
            placeholder='Send a message'
            rightSection={
              <ActionIcon
                color='purple' variant='light'
                onClick={onSendMessage}
              >
                <LuSendHorizonal />
              </ActionIcon>
            }
            value={message}
            onChange={event => setMessage(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') onSendMessage(); }}
          />
          {!image ?
            <ActionIcon
              color='purple' variant='filled' size='lg'
              onClick={() => {
                if (imageRef && imageRef.current) imageRef.current.click();
              }}
            >
              <LuImage />
            </ActionIcon>
            :
            <Tooltip
              label='Click to remove'
              position='top'
            >
              <div
                className={messageStyles.imagePreviewContainer}
                onClick={onRemoveImage}
              >
                <img
                  className={messageStyles.imagePreview}
                  src={image}
                />
              </div>
            </Tooltip>
          }
          <ActionIcon
            color='purple' variant='filled' size='lg'
            onClick={gifOpen}
          >
            <PiGifBold />
          </ActionIcon>
          <FileInput
            accept='image/png,image/jpeg'
            style={{ display: 'none' }}
            onChange={(image) => { onChangeImage(image); }}
            ref={imageRef}
            value={imageFile}
          />
        </Flex>
      </Stack>
      <GifModal reply={reply} opened={gifOpened} close={gifClose} />
    </>
  );
};

export default Chatbar;