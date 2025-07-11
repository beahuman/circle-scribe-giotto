// Layout and spacing configuration
export const layout = {
  container: {
    center: true,
    padding: '2rem',
    screens: {
      '2xl': '1400px'
    }
  },
  borderRadius: {
    sm: 'var(--radius-sm)',      /* 4px - micro/utility */
    md: 'var(--radius-md)',      /* 8px - default UI components */
    lg: 'var(--radius-lg)',      /* 16px - modals, large cards */
    xl: 'var(--radius-xl)',      /* 24px - hero elements */
    '2xl': 'calc(var(--radius-xl) + 0.5rem)', /* 32px - special cases */
    full: '9999px'               /* circular icons, avatars, toggles */
  },
  spacing: {
    '1': 'var(--space-1)',
    '2': 'var(--space-2)',
    '3': 'var(--space-3)',
    '4': 'var(--space-4)',
    '5': 'var(--space-5)',
    '6': 'var(--space-6)',
    '8': 'var(--space-8)',
    '10': 'var(--space-10)',
    '12': 'var(--space-12)',
    '16': 'var(--space-16)',
    '20': 'var(--space-20)',
    '24': 'var(--space-24)'
  }
};