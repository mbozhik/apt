import type {Metadata} from 'next'

import {Manrope} from 'next/font/google'

export const metadata: Metadata = {
  title: 'APT',
}

export const manrope = Manrope({
  variable: '--font-manrope',
  preload: true,
  subsets: ['cyrillic'],
})
