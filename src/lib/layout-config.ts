import type {Metadata} from 'next'

import {Manrope} from 'next/font/google'

export const metadata: Metadata = {
  title: {
    template: '%s — APT',
    default: 'APT',
  },
  description: 'Надежные шины для вашего бизнеса',
}

export const manrope = Manrope({
  variable: '--font-manrope',
  preload: true,
  subsets: ['cyrillic'],
})
