'use client'

import {PROJECT_CONTAINER} from '@/lib/constants'
import {cn} from '@/lib/utils'

import Hero from '~~/index/Hero'
import Catalog from '~~/index/Catalog'

export default function Home() {
  return (
    <main className={cn(PROJECT_CONTAINER, 'relative grid grid-cols-2 sm:grid-cols-1 sm:gap-6')}>
      <Hero />

      <Catalog className="col-start-2 sm:col-start-auto" />
    </main>
  )
}
