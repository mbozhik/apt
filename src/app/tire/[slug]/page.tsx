import type {Metadata} from 'next'
import {Suspense} from 'react'

import {PROJECT_CONTAINER} from '@/lib/constants'
import {getTireItem} from '@/sanity/lib/requests'

import {cn} from '@/lib/utils'
import Details from '~~/tire/Details'
import Sheet from '~~/tire/Sheet'
import SheetSkeleton from '~~/tire/SheetSkeleton'
import Skeleton from '~/UI/Skeleton'

type Props = {
  params: Promise<{slug: string}>
}

function TireSkeleton() {
  return (
    <main className={cn(PROJECT_CONTAINER, 'space-y-20 sm:space-y-14')}>
      <section className="grid grid-cols-8 sm:flex sm:flex-col-reverse gap-20 xl:gap-10 sm:gap-8">
        <div className="col-span-5 pt-28 xl:pt-24 sm:pt-0 space-y-8 xl:space-y-6 sm:space-y-4">
          <Skeleton className="h-8 w-32 rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />

          <div className="sm:px-2 grid grid-cols-2 gap-6 sm:grid-cols-1 sm:gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="relative flex gap-3">
                <div className="min-w-0.5 bg-orange h-16" />
                <Skeleton className="h-16 flex-1 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-3 sm:mt-24">
          <div className="p-10 xl:p-6 sm:p-3.5 sm:pb-6 bg-white rounded-md space-y-8 sm:space-y-6">
            <div className="flex flex-col gap-10 xl:gap-12 sm:gap-4">
              <div className="space-y-3 sm:space-y-2">
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-8 w-48 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="self-center size-[30rem] xl:size-[27rem] sm:size-[20rem] rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <SheetSkeleton />
    </main>
  )
}

async function TireContent({params}: Props) {
  const slug = (await params).slug
  const tire = await getTireItem(slug)

  return (
    <main className={cn(PROJECT_CONTAINER, 'space-y-20 sm:space-y-14')}>
      <Details data={tire} />

      <Suspense fallback={<SheetSkeleton />}>
        <Sheet token={tire?.token.current as string} />
      </Suspense>
    </main>
  )
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const tire = await getTireItem(slug).catch(() => null)

  return {
    title: tire?.naming,
    description: tire?.description,
  }
}

export default function TireItemPage({params}: Props) {
  return (
    <Suspense fallback={<TireSkeleton />}>
      <TireContent params={params} />
    </Suspense>
  )
}
