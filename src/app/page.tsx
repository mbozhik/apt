'use client'

import {IS_DEV} from '@/lib/constants'
import {PROJECT_PATHS} from '@/lib/constants'

import {redirect} from 'next/navigation'

import {P} from '~/UI/Typography'

export default function IndexPage() {
  redirect(IS_DEV ? '/resources' : PROJECT_PATHS.main)

  return (
    <main className="grid place-items-center w-full h-screen">
      <P>редирект на {PROJECT_PATHS.main}</P>
    </main>
  )
}
