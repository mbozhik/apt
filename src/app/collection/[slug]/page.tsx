import type {Metadata} from 'next'

import {PROJECT_CONTAINER} from '@/lib/constants'

import {getCollectionItem} from '@/sanity/lib/requests'
import {cn} from '@/lib/utils'

import {Suspense} from 'react'

import Hero from '~~/collection/Hero'
import Catalog from '~~/collection/Catalog'
import Skeleton from '~/UI/Skeleton'

type Props = {
  params: Promise<{slug: string}>
}

function CollectionSkeleton() {
  return (
    <main className={cn(PROJECT_CONTAINER, 'relative grid grid-cols-2 sm:grid-cols-1 sm:gap-6')}>
      <div className="space-y-6 pt-36 sm:pt-24 sm:px-0">
        <Skeleton className="h-12 w-3/4 rounded-md bg-white/5" />
        <Skeleton className="h-6 w-1/2 rounded-md bg-white/5" />
      </div>

      <div className="col-start-2 sm:col-start-auto space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-44 xl:p-6 sm:p-3.5 bg-white/5 rounded-md space-y-6"></div>
        ))}
      </div>
    </main>
  )
}

async function CollectionContent({params}: Props) {
  const slug = (await params).slug
  const collection = await getCollectionItem(slug)

  return (
    <main className={cn(PROJECT_CONTAINER, 'relative grid grid-cols-2 sm:grid-cols-1 sm:gap-6')}>
      <Hero title={collection?.title} />

      <Catalog className="col-start-2 sm:col-start-auto" data={collection} />
    </main>
  )
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const collection = await getCollectionItem(slug).catch(() => null)

  return {
    title: collection?.title,
  }
}

export default function CollectionItemPage({params}: Props) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionContent params={params} />
    </Suspense>
  )
}
