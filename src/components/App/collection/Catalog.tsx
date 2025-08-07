'use client'

import type {TIRE_QUERYResult, TIRE_ITEM_QUERYResult, COLLECTION_ITEM_QUERYResult} from '@/sanity/lib/requests'

import {motion} from 'motion/react'

import {cn} from '@/lib/utils'
import {urlFor} from '@/sanity/lib/image'

import Link from 'next/link'
import Image from 'next/image'
import {H3, P, SPAN, EM, typoClasses} from '~/UI/Typography'

function CardTag({tag, isFull}: {tag: string | undefined; isFull: boolean}) {
  return (
    <div className={cn(isFull && '!-mb-2 sm:!mb-0', 'w-fit px-3 py-1', 'bg-orange text-white')}>
      <EM className="">{tag}</EM>
    </div>
  )
}

export function CatalogCard({data, view, className}: {data: TIRE_QUERYResult[number] | TIRE_ITEM_QUERYResult; view: 'full' | 'compact'; className?: string}) {
  const isFull = view === 'full'

  return (
    <div data-block="card-catalog-index" className={cn('p-10 xl:p-6 sm:p-3.5 sm:pb-6 flex flex-col gap-8 sm:gap-6', 'bg-white text-black', className)}>
      <div className={cn(isFull ? 'flex justify-between sm:flex-col sm:gap-4' : 'flex flex-col gap-10 xl:gap-12 sm:gap-4')}>
        <div className={cn('flex flex-col', isFull ? 'gap-6 sm:gap-3' : 'gap-3 sm:gap-2')}>
          {isFull && <CardTag tag={data?.tag} isFull={isFull} />}

          {!isFull && (
            <SPAN className="block" offset={0}>
              ДЛЯ ТЕХ, КТО ЛЮБИТ ПОРЯДОК
            </SPAN>
          )}

          <H3 className="text-orange">{data?.naming}</H3>

          {!isFull && <CardTag tag={data?.tag} isFull={isFull} />}

          {isFull && <SPAN className="max-w-[55ch] xl:max-w-[35ch]">{data?.description}</SPAN>}

          {isFull && (
            <Link href={`/tire/${data?.slug?.current}`} className={cn('w-fit flex items-center gap-2', typoClasses.h5, 'pb-0.5 border-b-2 border-b-black', 'group')}>
              Характеристики
              <span className="duration-300 group-hover:translate-x-1">→</span>
            </Link>
          )}
        </div>

        <div className={cn('relative size-48 sm:size-full xl:aspect-square', isFull ? 'size-48' : 'self-center size-[30rem] xl:size-[27rem] sm:size-[20rem]')}>{data?.image && <Image className="object-contain" src={urlFor(data?.image).url()} alt={data?.naming} fill />} </div>
      </div>
    </div>
  )
}

export default function Catalog({data, className}: {data: COLLECTION_ITEM_QUERYResult; className?: string}) {
  return (
    <section data-section="catalog-index" className={cn(className)}>
      <div className={cn('px-6 xl:px-0', 'space-y-8 xl:space-y-6')}>
        {data?.tires?.length ? (
          data.tires.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{opacity: 0, y: idx === 0 ? 0 : 50}} // first not moving
              whileInView={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: idx * 0.1}}
              viewport={{once: true}}
            >
              <CatalogCard data={item} view="full" />
            </motion.div>
          ))
        ) : (
          <div className={cn('grid place-items-center', 'min-h-screen sm:min-h-[50vh]', 'bg-white/1 text-orange')}>
            <P offset={0}>Пока шины не добавлены</P>
          </div>
        )}
      </div>
    </section>
  )
}
