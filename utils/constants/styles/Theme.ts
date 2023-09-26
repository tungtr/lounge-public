// Essentials
import type { MantineThemeOverride } from '@mantine/styles/lib/theme/types';

// Styling
import { modalProps } from '@utils/constants/styles/Styles';

export const theme: MantineThemeOverride = {
  // Theme
  fontFamily: 'Noto Sans',

  colors: {
    purple: ['#F3EFFF', '#E5DEF8', '#BBA7F5', '#926FF7', '#7A4FF6', '#6D3CF8', '#5C2FDB', '#3C218B', '#2F215B', '#17102C'],
    neutral: ['#E7E4EB', '#E7E4EB', '#C9C3D2', '#B2AEB8', '#95909C', '#7B7684', '#615D69', '#46424D', '#302D34', '#19181B']
  },
  primaryColor: 'purple', primaryShade: 5,

  // Breakpoints
  breakpoints: {
    xs: '520px',
    sm: '720px',
    md: '993px'
  },

  // Components
  components: {
    ActionIcon: {
      defaultProps: {
        radius: 'md',
        size: 'lg'
      }
    },
    Avatar: {
      defaultProps: {
        color: 'purple',
        radius: 'xl',
        variant: 'filled'
      }
    },
    Badge: {
      defaultProps: {
        variant: 'filled'
      }
    },
    Button: {
      defaultProps: {
        radius: 'md',
        size: 'md'
      }
    },
    Card: {
      defaultProps: {
        padding: 'xl',
        radius: 'md'
      }
    },
    Chip: {
      defaultProps: {
        radius: 'md',
        size: 'sm',
        type: 'checkbox',
        variant: 'filled'
      }
    },
    FileInput: {
      defaultProps: {
        size: 'md',
        radius: 'md'
      }
    },
    LoadingOverlay: {
      defaultProps: {
        overlayBlur: 1,
        transitionDuration: 500
      }
    },
    Modal: {
      defaultProps: {
        centered: true,
        overlayProps: modalProps,
        padding: 'xl',
        radius: 'lg',
        withCloseButton: false
      }
    },
    Pagination: {
      defaultProps: {
        boundaries: 2,
        radius: 'md',
        size: 'lg'
      }
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
        withAsterisk: true
      }
    },
    Select: {
      defaultProps: {
        size: 'md',
        radius: 'md',
        withAsterisk: true
      }
    },
    SegmentedControl: {
      defaultProps: {
        color: 'purple',
        radius: 'md'
      }
    },
    Textarea: {
      defaultProps: {
        size: 'md',
        radius: 'md',
        withAsterisk: true
      }
    },
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
        withAsterisk: true
      }
    },
    Tooltip: {
      defaultProps: {
        radius: 'md'
      }
    }
  }
};