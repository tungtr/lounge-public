'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { EqualHeight } from 'react-equal-height/clean';

// Assets
import EmptySofa from '@public/images/empty-sofa.svg';
import EmptyTeam from '@public/images/empty-team.svg';
import EmptyTalk from '@public/images/empty-talk.svg';

// Components - Relative
import LoungeCard from '@components/lounge/LoungeCard';
// Components - Common
import Chip from '@components/common/Chip';
import Empty from '@components/common/Empty';
// Components - Mantine
import { Flex, Grid, Group, Pagination, Stack } from '@mantine/core';

// Services
import { useAppDispatch, useAppSelector } from '@services/redux/hooks';
import { setLounge, setLoungeTrigger } from '@services/redux/reducers/loungeReducer';
import { getLoungeList } from '@services/loungeService';

// Styling
import layoutStyles from '@styles/layout/Layout.module.css';

// Utility
import Globals from '@utils/constants/global/Miscellaneous';
import LoaderContext from '@utils/context/LoaderContext';

const HomePage = () => {
  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

  // Initialization handling
  useEffect(() => {
    dispatch(setLounge(null));
  }, []);

  // Chip handling
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const isLoungeUserLoaded = useAppSelector(state => state.user.isLoungeUserLoaded);
  const loungeFilter = useAppSelector(state => state.lounge.loungeFilter);
  const loungeSearch = useAppSelector(state => state.lounge.loungeSearch);
  const loungeTrigger = useAppSelector(state => state.lounge.loungeTrigger);
  const chipList = [
    { 
      value: 'discover', label: 'Discover', 
      emptyText: loungeUser ? 'It seems you have discovered all the lounges' : 'There are no lounges for you to discover',
      emptySrc: EmptySofa.src
    },
    {
      value: 'my', label: 'My lounges',
      emptyText: loungeUser ? 'You have not created any lounge' : 'Log in to create your own lounge',
      emptySrc: EmptyTeam.src
    },
    {
      value: 'joined', label: 'Joined',
      emptyText: loungeUser ? 'You have not joined any lounge' : 'Log in to join lounges and chat',
      emptySrc: EmptyTalk.src
    }
  ];
  const [activeChipIdx, setActiveChipIdx] = useState(0);
  useEffect(() => {  dispatch(setLoungeTrigger(!loungeTrigger)); }, [activeChipIdx]);
  useEffect(() => {
    const targetChip = chipList.find(chip => chip.value === loungeFilter);
    if (targetChip) setActiveChipIdx(chipList.indexOf(targetChip));
  }, [loungeFilter]);

  // Lounge list
  const loungeList = useAppSelector(state => state.lounge.loungeList);
  const [page, setPage] = useState(0);
  const onGetLoungeList = async () => {
    if (!isLoungeUserLoaded) return;
    loader.setIsLoading(true);

    await getLoungeList(
      {
        filter: chipList[activeChipIdx].value,
        loungeUserId: loungeUser ? loungeUser._id : null,
        skip: page * Globals.DEFAULT_LIMIT, limit: Globals.DEFAULT_LIMIT,
        search: loungeSearch
      },
      dispatch
      );

    loader.setIsLoading(false);
  };
  useEffect(() => {
    onGetLoungeList();
  }, [page, isLoungeUserLoaded, loungeUser, loungeTrigger]);

  return (
    <Stack spacing={24}
      className={layoutStyles.home}
      style={loungeList.list.length > 0 ? {} : { maxHeight: '100%' }}
    >
      <Group spacing={8}>
        {chipList.map((chip, index) => (
          <Chip key={index}
            isActive={index === activeChipIdx}
            onClick={() => setActiveChipIdx(index)}
          >
            {chip.label}
          </Chip>
        ))}
      </Group>
      {!loader.getIsLoading() &&
        <>
        {loungeList.list.length > 0 ?
          <Grid>
            <EqualHeight>
              {loungeList.list.map((lounge, index) => (
                <Grid.Col key={index}
                  sm={6} xl={4}
                >
                  <LoungeCard lounge={lounge} isMember={activeChipIdx !== null && activeChipIdx > 0} />
                </Grid.Col>
              ))}
            </EqualHeight>
          </Grid>
          :
          <Empty text={chipList[activeChipIdx].emptyText} src={chipList[activeChipIdx].emptySrc} />
        }
        </>
      }
      {Math.ceil(loungeList.total / Globals.DEFAULT_LIMIT) > 1 &&
        <Flex justify='center'>
          <Pagination
            total={Math.ceil(loungeList.total / Globals.DEFAULT_LIMIT)}
            onChange={value => setPage(value - 1)}
          />
        </Flex>
      }
    </Stack>
  );
};

export default HomePage;