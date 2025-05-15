import type {TIRE_ITEM_QUERYResult} from '@/sanity/lib/requests'
import {PROJECT_PADDING} from '@/lib/constants'

import {cn} from '@/lib/utils'

import {CatalogCard} from '~~/index/Catalog'

export default function Details({data}: {data: TIRE_ITEM_QUERYResult}) {
  return (
    <section data-section="details-tire" className="grid grid-cols-8 sm:grid-cols-1 sm:gap-6">
      <div className={cn(PROJECT_PADDING, 'col-span-5')}>
        <h4 className="text-4xl font-medium">Особенности:</h4>
      </div>

      <CatalogCard className="col-span-3" data={data} view="compact" />
    </section>
  )
}
