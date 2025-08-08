export const metadata = {
  title: 'Ресурсы',

  robots: {
    index: false,
    follow: false,
  },
}

import {IS_DEV} from '@/lib/constants'

import {getCollections, getTires} from '@/sanity/lib/requests'

import {Suspense} from 'react'

import Link from 'next/link'
import {H4} from '~/UI/Typography'
import Skeleton from '~/UI/Skeleton'

function ResourcesSkeleton() {
  return (
    <main className="relative z-[9999] grid place-items-center w-full min-h-screen">
      <div className="flex flex-col gap-8 items-center text-center sm:mx-3">
        <div className="space-y-4">
          <Skeleton className="h-8 w-32 mx-auto rounded-md bg-white/10" />

          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-80 sm:w-60 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-8 w-32 mx-auto rounded-md bg-white/10" />

          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2">
            {[...Array(9)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-60 sm:w-60 bg-white/5 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

async function ResourcesData() {
  const collections = await getCollections()
  const tires = await getTires()

  const baseUrl = IS_DEV ? 'localhost:3000' : 'catalog.aptire.ru'

  return (
    <main className="relative z-[9999] grid place-items-center w-full min-h-screen">
      <div className="flex flex-col gap-8 items-center text-center sm:mx-3">
        <div className="space-y-4">
          <H4>Коллекции</H4>

          <div className="space-y-2">
            {collections.map((collection, idx) => {
              const url = `${baseUrl}/collection/${collection.slug.current}`

              return (
                <Link key={idx} href={IS_DEV ? `/collection/${collection.slug.current}` : `https://${url}`} className="block px-3 sm:px-1 py-2.5 bg-white/15 rounded-lg hover:bg-white/25 transition-colors">
                  {url}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <H4>Шины</H4>

          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2">
            {tires.map((tire, idx) => {
              const url = `${baseUrl}/tire/${tire.token.current.toLowerCase()}`

              return (
                <Link key={idx} href={IS_DEV ? `/tire/${tire.token.current.toLowerCase()}` : `https://${url}`} className="block px-3 sm:px-1 py-2.5 bg-white/5 rounded-lg hover:bg-white/15 transition-colors">
                  {url}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function ResourcesPage() {
  return (
    <Suspense fallback={<ResourcesSkeleton />}>
      <ResourcesData />
    </Suspense>
  )
}
