'use client';

// Essentials
import { useState, useEffect, useContext } from 'react';
import { EqualHeight } from 'react-equal-height/clean';

// Assets
import EmptySofa from '@public/images/empty-sofa.svg';

// Components - Relative
import UserCard from '@components/user/UserCard';
// Components - Common
import Empty from '@components/common/Empty';
// Components - Mantine
import { Flex, Grid, Pagination, Stack } from '@mantine/core';

// Services
import { useAppDispatch, useAppSelector } from '@services/redux/hooks';
import { setLounge } from '@services/redux/reducers/loungeReducer';
import { getUserList } from '@services/userService';

// Styling
import layoutStyles from '@styles/layout/Layout.module.css';

// Utility
import LoaderContext from '@utils/context/LoaderContext';

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);

  // Initialization handling
  useEffect(() => {
    dispatch(setLounge(null));
  }, []);

  // Chip handling
  const loungeUser = useAppSelector(state => state.user.loungeUser);
  const isLoungeUserLoaded = useAppSelector(state => state.user.isLoungeUserLoaded);

  // User list
  const userList = useAppSelector(state => state.user.userList);
  const userSearch = useAppSelector(state => state.user.userSearch);
  const userTrigger = useAppSelector(state => state.user.userTrigger);
  const limit = 16;
  const [page, setPage] = useState(0);
  const onGetUserList = async () => {
    if (!isLoungeUserLoaded) return;
    loader.setIsLoading(true);

    await getUserList(
      {
        skip: page * limit, limit,
        search: userSearch
      },
      dispatch
    );

    loader.setIsLoading(false);
  };
  useEffect(() => {
    onGetUserList();
  }, [page, isLoungeUserLoaded, loungeUser, userTrigger]);

  return (
    <Stack spacing={24}
      className={layoutStyles.home}
      style={userList.list.length > 0 ? {} : { maxHeight: '100%' }}
    >
      {!loader.getIsLoading() &&
        <>
        {userList.list.length > 0 ?
          <Grid>
            <EqualHeight>
              {userList.list.map((user, index) => (
                <Grid.Col key={index}
                  sm={6} xl={3}
                >
                  <UserCard user={user}  />
                </Grid.Col>
              ))}
            </EqualHeight>
          </Grid>
          :
          <Empty text='No user found' src={EmptySofa.src} />
        }
        </>
      }
      {Math.ceil(userList.total / limit) > 1 &&
        <Flex justify='center'>
          <Pagination
            total={Math.ceil(userList.total / limit)}
            onChange={value => setPage(value - 1)}
          />
        </Flex>
      }
    </Stack>
  );
};

export default UsersPage;