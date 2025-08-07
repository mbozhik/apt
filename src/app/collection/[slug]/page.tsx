import type {Metadata} from 'next'

import {PROJECT_CONTAINER} from '@/lib/constants'
import {getCollectionItem} from '@/sanity/lib/requests'

import {cn} from '@/lib/utils'

import Hero from '~~/collection/Hero'
import Catalog from '~~/collection/Catalog'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const collection = await getCollectionItem(slug).catch(() => null)

  return {
    title: collection?.title,
  }
}

export default async function CollectionItemPage({params}: Props) {
  const slug = (await params).slug
  const collection = await getCollectionItem(slug)

  return (
    <main className={cn(PROJECT_CONTAINER, 'relative grid grid-cols-2 sm:grid-cols-1 sm:gap-6')}>
      <Hero title={collection?.title} />

      <Catalog className="col-start-2 sm:col-start-auto" data={collection} />
    </main>
  )
}
