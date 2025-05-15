import type {TIRE_ITEM_QUERYResult} from '@/sanity/lib/requests'
import {PROJECT_PADDING} from '@/lib/constants'

import {urlFor} from '@/sanity/lib/image'
import {cn} from '@/lib/utils'

export default function Details({data}: {data: TIRE_ITEM_QUERYResult}) {
  return (
    <section data-section="details-tire" className="grid grid-cols-2 sm:grid-cols-1 sm:gap-6">
      <div className={cn(PROJECT_PADDING, '')}>
        <h4 className="text-4xl font-medium">Особенности:</h4>
      </div>

      {data?.image && <img src={urlFor(data?.image).url()} alt={data?.naming} />}
    </section>
  )
}
