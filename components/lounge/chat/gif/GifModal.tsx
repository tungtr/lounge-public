'use client';

// Essentials
import { useState, useEffect, useRef, useContext } from 'react';
import { Gif } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

// Assets
import { LuSearch } from 'react-icons/lu';

// Components - Common
import ModalHeader from '@components/common/ModalHeader';
// Components - Mantine
import { ActionIcon, Group, Modal, Stack, TextInput } from '@mantine/core';

// Interfaces
import { MessageITF } from '@interfaces/MessageITF';

// Services
import { sendMessage } from '@services/messageService';
import { useAppSelector } from '@services/redux/hooks';

// Styling
import messageStyles from '@styles/message/Message.module.css';

// Types
import { IGif } from "@giphy/js-types";

// Utility
import MessageContext from '@utils/context/MessageContext';

const GifModal = ({
  reply,
  opened, close
}: {
  reply: MessageITF | null,
  opened: boolean, close: () => void
}) => {
  const messageCtx = useContext(MessageContext);

  const giphyFetch = new GiphyFetch(`${process.env.GIPHY_KEY}`);
  const [gifList, setGifList] = useState<IGif[]>([]);
  const [search, setSearch] = useState('');
  const onSearch = async () => {
    const { data } = await giphyFetch.search(
      search,
      { sort: 'relevant', lang: 'en', limit: 10 }
    );
    setGifList(data);
  };

  const lounge = useAppSelector(state => state.lounge.lounge);
  const onGifClick = (event: any, gif: IGif) => {
    if (!lounge) return;
    sendMessage({
      loungeId: lounge.id,
      content: '',
      image: null,
      gifKey: gif.id.toString(),
      reply: reply || null
    });
    messageCtx.setReply(null);
    close();

    event.stopPropagation();
  };

  // Width handling
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Reset on close
  useEffect(() => {
    if (!opened) return;
    setSearch('');
    setGifList([]);
  }, [opened]);

  return (
    <Modal
      opened={opened}
      onClose={close}
    >
      <Stack spacing={16}
        ref={containerRef}
      >
        <ModalHeader
          title='GIF'
          back={null} close={close}
        />
        <TextInput
          placeholder='Search for GIFs'
          rightSection={
            <ActionIcon
              color='purple' variant='light'
              onClick={onSearch}
            >
              <LuSearch />
            </ActionIcon>
          }
          onKeyDown={(event) => { if (event.key === 'Enter') onSearch(); }}
          onChange={(event) => setSearch(event.target.value)}
          value={search}
        />
        <Group align='flex-start' spacing={8}>
          {gifList.length > 0 && gifList.map((gif, index) => (
            <div
              key={index}
              className={messageStyles.gifContainer}
              onClick={(event) => onGifClick(event, gif)}
            >
              <Gif gif={gif}
                noLink={true} hideAttribution={true}
                width={(containerRef && containerRef.current) ? (containerRef.current.offsetWidth - 16) / 2 : 0}
              />
            </div>
          ))}
        </Group>
      </Stack>
    </Modal>
  );
};

export default GifModal;