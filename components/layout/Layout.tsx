'use client';

// Essentials
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDisclosure } from '@mantine/hooks';
import dynamic from 'next/dynamic';
import { Provider } from 'react-redux';
import store from '@services/redux/store';

// Assets
import { LuSofa, LuUsers, LuBell, LuChevronsLeft, LuChevronsRight, LuUser } from 'react-icons/lu';

// Components - Relative
import Sidebar from '@components/layout/components/sidebar/Sidebar';
const Topbar = dynamic(() => import('@components/layout/components/topbar/Topbar'), { ssr: false });
import Accessbar from '@components/layout/components/accessbar/Accessbar';
import AuthModal from '@components/authentication/AuthModal';
import LoungeModal from '@components/lounge/modal/LoungeModal';
import ProfileModal from '@components/profile/ProfileModal';
// Components - Common
import Loader from '@components/common/Loader';
import QuestionModal from '@components/common/QuestionModal';
// Components - Mantine
import { Flex, LoadingOverlay, Stack } from '@mantine/core';

// Interfaces
import { OptionITF } from '@interfaces/QuestionITF';
import { UserITF } from '@interfaces/UserITF';

// Styling
import layoutStyles from '@styles/layout/Layout.module.css';

// Utility
import { useMediaQuery } from '@mantine/hooks';
import LoaderContext from '@utils/context/LoaderContext';
import LoungeContext from '@utils/context/LoungeContext';
import ProfileContext from '@utils/context/ProfileContext';
import QuestionContext from '@utils/context/QuestionContext';
import ResponsiveContext from '@utils/context/ResponsiveContext';
import SidebarContext from '@utils/context/SidebarContext';

const Layout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const exceptions = [
    '/forgot-password',
    '/verify'
  ];

  // Breakpoints - Tablet
  const tabletMediaQuery = useMediaQuery('(max-width: 992px)', true, { getInitialValueInEffect: false });
  const [isTablet, setIsTablet] = useState(false);
  useEffect(() => {
    setIsTablet(tabletMediaQuery);
  }, [tabletMediaQuery]);
  // Breakpoints - Mobile
  const mobileMediaQuery = useMediaQuery('(max-width: 520px)', true, { getInitialValueInEffect: false });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(mobileMediaQuery);
  }, [mobileMediaQuery]);

  // AuthModal handling
  const [authOpened, { open: authOpen, close: authClose }] = useDisclosure(false); // Modal
  const authTemplate = [
    { id: 0, title: 'Login' },
    { id: 1, title: 'Sign-up' },
    { id: 2, title: 'Login Help' },
    { id: 3, title: 'Forgot Password' },
    { id: 4, title: 'Account Verification' }
  ];
  const [authTemplateIdx, setAuthTemplateIdx] = useState(0);

  // LoungeModal handling
  const [loungeOpened, { open: loungeOpen, close: loungeClose }] = useDisclosure(false); // Modal
  const [loungeTemplateIdx, setLoungeTemplateIdx] = useState(0);

  // ProfileModal handling
  const [user, setUser] = useState<UserITF | null>(null);
  const [profileOpened, { open: profileOpen, close: profileClose }] = useDisclosure(false); // Modal
  const [profileCloseOption, setProfileCloseOption] = useState<{ action: () => void }>({ action: () => {} });
  const [profileTemplateIdx, setProfileTemplateIdx] = useState(0);
  const [profileFrom, setProfileFrom] = useState('');

  // QuestionModal handling
  const [questionIsLoading, questionSetIsLoading] = useState(false);
  const [questionOpened, { open: questionOpen, close: questionClose }] = useDisclosure(false); // Modal
  const [questionCloseOption, setQuestionCloseOption] = useState<{ action: () => void }>({ action: () => {} });
  const [question, setQuestion] = useState('');
  const [optionList, setOptionList] = useState<OptionITF[]>([]);

  // Sidebar handling
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const sidebarData = {
    menu: [
      { icon: LuSofa, label: 'Lounges', onClick: () => router.push('/'), path: '/' },
      { icon: LuUsers, label: 'Users', onClick: () => router.push('/users'), path: '/users' }
    ],
    options: [
      { icon: LuChevronsLeft, label: 'Collapse', onClick: () => { setIsCollapsed(true); }, path: '' },
      { icon: LuChevronsRight, label: 'Expand', onClick: () => { setIsCollapsed(false); }, path: '' },
      { icon: LuUser, label: authTemplate[authTemplateIdx].title, onClick: authOpen, path: '' }
    ]
  };
  useEffect(() => {
    const menu = sidebarData.menu;
    const item = menu.find(menuItem => menuItem.path === pathname);
    setActiveIdx(item ? menu.indexOf(item) : -1);
  }, [pathname]);

  // Master Loader handling
  const [isLoading, setIsLoading] = useState(true);
  const getIsLoading = () => { return isLoading; };

  return (
    <Provider store={store}>
      {pathname && !exceptions.includes(pathname) ?
        <>
          <Flex
            gap={0}
          >
            <LoadingOverlay loader={<Loader />} visible={isLoading} />
            <ResponsiveContext.Provider value={{ isTablet, isMobile }}>
              <QuestionContext.Provider value={{
                setIsLoading: questionSetIsLoading,
                setQuestion, setOptionList,
                open: questionOpen,
                close: () => { questionCloseOption.action(); questionClose(); setQuestionCloseOption({ action: () => {} }); },
                setCloseOption: setQuestionCloseOption
              }}>
                <LoungeContext.Provider value={{
                  setTemplateIdx: setLoungeTemplateIdx,
                  open: loungeOpen, close: loungeClose
                }}>
                  <ProfileContext.Provider value={{
                    setUser, setTemplateIdx: setProfileTemplateIdx,
                    setFrom: setProfileFrom,
                    open: profileOpen,
                    close: () => { profileCloseOption.action(); profileClose(); setProfileCloseOption({ action: () => {} }); },
                    setCloseOption: setProfileCloseOption
                  }}>
                    <SidebarContext.Provider value={{ data: sidebarData, setActiveIdx, isCollapsed }}>
                      <Sidebar activeIdx={activeIdx} />
                        <Stack className={layoutStyles.main} spacing={0}>
                          <LoaderContext.Provider value={{ getIsLoading, setIsLoading }}>
                            <Topbar activeIdx={activeIdx} />
                            <div className={layoutStyles.workspace}>
                              {children}
                            </div>
                          </LoaderContext.Provider>
                        </Stack>
                      <Accessbar />
                    </SidebarContext.Provider>
                    <LoungeModal
                      opened={loungeOpened}
                      templateIdx={loungeTemplateIdx}
                    />
                    <QuestionModal
                      question={question} isLoading={questionIsLoading}
                      optionList={optionList}
                      opened={questionOpened}
                    />
                    <ProfileModal
                      opened={profileOpened}
                      user={user}
                      templateIdx={profileTemplateIdx}
                      from={profileFrom}
                    />
                  </ProfileContext.Provider>
                </LoungeContext.Provider>
              </QuestionContext.Provider>
            </ResponsiveContext.Provider>
          </Flex>
          <AuthModal
            opened={authOpened} close={authClose}
            setTemplateIdx={setAuthTemplateIdx}
            type={authTemplate[authTemplateIdx]}
          />
        </>
        :
        <>
          {children}
        </>
      }
      
    </Provider>
  );
};

export default Layout;