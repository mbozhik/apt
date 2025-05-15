import type {Metadata} from 'next'

import {PROJECT_CONTAINER} from '@/lib/constants'
import {getTireItem} from '@/sanity/lib/requests'

import {cn} from '@/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const tire = await getTireItem(slug).catch(() => null)

  return {
    title: tire?.naming,
  }
}

export default async function TireItemPage({params}: Props) {
  const slug = (await params).slug
  const tire = await getTireItem(slug)

  return <main className={cn(PROJECT_CONTAINER)}>{tire?.naming}</main>
}
