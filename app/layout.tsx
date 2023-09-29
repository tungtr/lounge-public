// Components - Relative
import SessionProvider from '@utils/context/Provider';
import RootStyleRegistry from './emotion';
import Layout from '@components/layout/Layout';

// Styling
import '@styles/theme/globals.css';
import '@styles/common/common.css';
import '@styles/common/card.css';
import '@styles/layout/scrollbar.css';
import '@styles/theme/typography.css';

export const metadata = {
  title: 'Lounge',
  description: 'Join lounges and have a chat',
  icons: {
    icon: '/favicon.ico'
  }
};

const RootLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang='en-UK'>
      <head />
      <body>
        <SessionProvider>
          <main>
            <RootStyleRegistry>
              <Layout>
                {children}
              </Layout>
            </RootStyleRegistry>
          </main>
        </SessionProvider>
      </body>
    </html>
  );
};

export default RootLayout;