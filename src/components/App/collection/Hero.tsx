import {cn} from '@/lib/utils'
import {PROJECT_CONTAINER} from '@/lib/constants'

import {H1, H2} from '~/UI/Typography'

export default function Hero({title}: {title: string | undefined}) {
  return (
    <section data-section="hero-index" className={cn(PROJECT_CONTAINER, 'w-fit fixed sm:static inset-0 z-0', 'min-h-screen sm:min-h-auto pt-36 sm:pt-24 sm:px-0', 'space-y-20 xl:space-y-12 sm:space-y-8')}>
      <H1 className="max-w-[13ch]">{title}</H1>

      <H2 className="max-w-[30ch]">АРТ – это новая марка шин, созданная командой экспертов АгроПромШина (АПШ) как ответ на вызовы рынка</H2>
    </section>
  )
}
