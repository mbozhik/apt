'use client'

import {PROJECT_CONTAINER} from '@/lib/constants'
import {cn} from '@/lib/utils'

import Hero from '~~/index/Hero'

export default function Home() {
  return (
    <main className={cn(PROJECT_CONTAINER, 'relative grid grid-cols-2 sm:grid-cols-1 sm:gap-12')}>
      <Hero />

      <div className="w-full sm:w-20 h-[50vh] col-start-2 sm:col-start-auto bg-orange"></div>
    </main>
  )
}
