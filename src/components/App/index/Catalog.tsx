import MockImage from '$/logo.svg'

import {cn} from '@/lib/utils'
import {motion} from 'motion/react'

import Image from 'next/image'

function Card() {
  return (
    <div data-block="card-catalog-index" className={cn('p-10 xl:p-6 sm:p-3.5 sm:pb-6 flex flex-col gap-8 sm:gap-6', 'bg-white text-black')}>
      <div className="flex sm:flex-col sm:gap-4 justify-between">
        <div className="space-y-8 sm:space-y-3">
          <h3 className="text-4xl sm:text-3xl font-bold text-orange">
            APT TIRES NON MARKING
            <br />
            WITH APERTURE
          </h3>

          <div className={cn('w-fit flex items-center gap-2', 'text-2xl xl:text-xl', 'pb-0.5 border-b-2 border-b-black', 'group')}>
            Характеристики
            <span className="group-hover:translate-x-2 duration-200">→</span>
          </div>
        </div>

        <div className="size-48 sm:size-full xl:aspect-square relative bg-black">
          <Image className="object-contain" src={MockImage} alt="Catalog Item" fill />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-1 gap-6 sm:gap-4">
        {['Прогрессивная конструкция гарантирует эффективную работу даже в самых экстремальных условиях в режиме 24/7', 'Особая прочность позволяет шине оставаться без повреждений в тех случаях, когда обычная пневматическая покрышка требует срочного ремонта', 'Специальная строение шины дает повышенную устойчивость и идеальное распределение веса при работе, а как следствие, наибольшую безопасность для оператора при рузных и других работах', 'Увеличенная глубина протектора обеспечивает ресурс в 5-6 раза выше, чем у пневматической шины'].map((item, index) => (
          <div key={index} className="relative flex gap-4 sm:gap-3">
            <div className="min-w-0.5 bg-orange h-full" />

            <p className="flex-1 text-base xl:text-sm sm:text-base leading-[1.3] text-black/50">{item}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Catalog({className}: {className?: string}) {
  return (
    <section data-section="catalog-index" className={cn(className)}>
      <div className={cn('px-6 xl:px-0', 'space-y-8 xl:space-y-6')}>
        {[1, 2, 3, 4].map((item, index) => (
          <motion.div
            key={item}
            initial={{opacity: 0, y: index === 0 ? 0 : 50}} // first not moving
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: index * 0.1}}
            viewport={{once: true}}
          >
            <Card />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
