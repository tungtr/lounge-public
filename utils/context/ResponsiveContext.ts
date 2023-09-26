// Essentials
import { createContext } from 'react';

interface ResponsiveContextITF {
  isTablet: boolean,
  isMobile: boolean
};

const ResponsiveContext = createContext<ResponsiveContextITF>({
  isTablet: false,
  isMobile: false
});

export default ResponsiveContext;