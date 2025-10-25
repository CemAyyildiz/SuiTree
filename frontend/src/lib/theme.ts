export const theme = {
  colors: {
    // Background colors
    background: {
      dark: '#0D0D0F',
      light: '#F9FAFB',
      card: {
        dark: '#18181B',
        light: '#FFFFFF',
      },
    },
    
    // Text colors
    text: {
      primary: {
        dark: '#E4E4E7',
        light: '#1F2937',
      },
      secondary: {
        dark: '#A1A1AA',
        light: '#6B7280',
      },
      muted: {
        dark: '#71717A',
        light: '#9CA3AF',
      },
    },
    
    // Accent colors
    accent: {
      primary: '#4B9EFF',
      primaryHover: '#3B82F6',
      secondary: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
    },
    
    // Border colors
    border: {
      dark: '#27272A',
      light: '#E5E7EB',
    },
    
    // Gradient colors
    gradients: {
      primary: 'linear-gradient(135deg, #4B9EFF 0%, #3B82F6 100%)',
      secondary: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      background: {
        dark: 'linear-gradient(135deg, #0D0D0F 0%, #18181B 100%)',
        light: 'linear-gradient(135deg, #F9FAFB 0%, #FFFFFF 100%)',
      },
    },
  },
  
  // Typography
  typography: {
    fontFamily: {
      primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'JetBrains Mono, "Fira Code", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  // Border radius
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  
  // Animation durations
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof theme;