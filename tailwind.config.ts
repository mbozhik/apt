import type {Config} from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    screens: {
      xl: {max: '1780px'},
      sm: {max: '500px'},
    },
    fontFamily: {
      manrope: ['var(--font-manrope)', ...defaultTheme.fontFamily.sans],
    },
    colors: {
      white: '#ffffff',
      black: '#0F0F0F',
      gray: '#303030',

      orange: '#B6482D',

      transparent: 'transparent',
    },
    extend: {},
  },
  plugins: [],
} satisfies Config
