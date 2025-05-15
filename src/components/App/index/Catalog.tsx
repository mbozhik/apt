'use client'

import type {TIRE_QUERYResult} from '@/sanity/lib/requests'

import {cn} from '@/lib/utils'
import {motion} from 'motion/react'

import Link from 'next/link'
import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'

function Card({data}: {data: TIRE_QUERYResult[number]}) {
  return (
    <div data-block="card-catalog-index" className={cn('p-10 xl:p-6 sm:p-3.5 sm:pb-6 flex flex-col gap-8 sm:gap-6', 'bg-white text-black')}>
      <div className="flex justify-between sm:flex-col sm:gap-4">
        <div className="space-y-8 sm:space-y-3">
          <h3 className="text-4xl font-bold sm:text-3xl text-orange">{data.naming}</h3>

          <Link href={`/tire/${data.slug?.current}`} className={cn('w-fit flex items-center gap-2', 'text-2xl xl:text-xl', 'pb-0.5 border-b-2 border-b-black', 'group')}>
            Характеристики
            <span className="duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        <div className="relative size-48 sm:size-full xl:aspect-square">{data.image && <Image className="object-contain" src={urlFor(data.image).url()} alt={data.naming} fill />} </div>
      </div>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 sm:gap-4">
        {data.descriptors?.map((item, index) => (
          <div key={index} className="relative flex gap-4 sm:gap-3">
            <div className="min-w-0.5 bg-orange h-full" />

            <p className="flex-1 text-base xl:text-sm sm:text-base leading-[1.3] text-black/50">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Catalog({items, className}: {items: TIRE_QUERYResult; className?: string}) {
  return (
    <section data-section="catalog-index" className={cn(className)}>
      <div className={cn('px-6 xl:px-0', 'space-y-8 xl:space-y-6')}>
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{opacity: 0, y: idx === 0 ? 0 : 50}} // first not moving
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: idx * 0.1}}
            viewport={{once: true}}
          >
            <Card data={item} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
