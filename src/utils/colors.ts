export const colors = {
  black: '#1B211A',
  cream: '#FFF7EB',
  blush: '#F9F0E0',
  sage: '#82A284',
  rose: '#CC3A63',
  peach: '#FCB7C7'
} as const;

export const palette = {
  text: colors.black,
  page: colors.cream,
  card: colors.blush,
  accent: colors.sage,
  primary: colors.rose,
  secondary: colors.peach
} as const;
