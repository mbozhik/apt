import type {TIRE_ITEM_QUERYResult} from '@/sanity/lib/requests'

import {cn} from '@/lib/utils'

import {H4, P} from '~/UI/Typography'
import {CatalogCard} from '~~/collection/Catalog'

export default function Details({data}: {data: TIRE_ITEM_QUERYResult}) {
  return (
    <section data-section="details-tire" className="grid grid-cols-8 sm:flex sm:flex-col-reverse gap-20 xl:gap-10 sm:gap-8">
      <div className={cn('col-span-5', 'pt-28 xl:pt-24 sm:pt-0', 'space-y-8 xl:space-y-6 sm:space-y-4')}>
        <H4>Особенности:</H4>

        {data?.decoding && <P className="font-black">{data?.decoding}</P>}

        <div className="sm:px-2 grid grid-cols-2 gap-6 sm:grid-cols-1 sm:gap-4">
          {data?.descriptors?.map((item, idx) => (
            <div key={idx} className="relative flex gap-3">
              <div className="min-w-0.5 bg-orange h-full" />

              <P className="flex-1">{item}</P>
            </div>
          ))}
        </div>
      </div>

      <CatalogCard className={cn('col-span-3', 'sm:mt-24')} data={data} view="compact" />
    </section>
  )
}
