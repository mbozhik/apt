import {cn} from '@/lib/utils'
import {PROJECT_CONTAINER} from '@/lib/constants'

export default function Hero() {
  return (
    <section data-section="hero-index" className={cn(PROJECT_CONTAINER, 'w-fit fixed sm:static inset-0 z-0', 'min-h-screen sm:min-h-auto pt-36 sm:pt-24 sm:px-0', 'space-y-20 xl:space-y-12 sm:space-y-8')}>
      <h1 className="text-8xl xl:text-7xl sm:text-[44px]">
        Для тех, кто <br />
        любит порядок
      </h1>

      <p className="text-5xl xl:text-3xl sm:text-xl max-w-[30ch]">АРТ – это новая марка шин, созданная командой экспертов АгроПромШина (АПШ) как ответ на вызовы рынка</p>
    </section>
  )
}
