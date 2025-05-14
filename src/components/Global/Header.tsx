import LogoImage from '$/logo.svg'

import {PROJECT_CONTAINER, PROJECT_PATHS} from '@/lib/constants'
import {cn} from '@/lib/utils'

import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className={cn(PROJECT_CONTAINER, 'fixed top-0 left-0 right-0 z-[99]', 'sm:bg-black')}>
      <nav className="w-[40%] xl:w-[45%] sm:w-full flex gap-20 sm:gap-6 justify-between items-center">
        <Link href={PROJECT_PATHS.root}>
          <Image src={LogoImage} alt="Логотип APT" />
        </Link>

        <div className="flex w-full justify-around">
          {Object.entries(PROJECT_PATHS).map(([key, path]) => {
            if (key === 'root') return null

            return (
              <Link href={path} className="hover:underline text-lg sm:text-base" key={key}>
                {key === 'main' ? 'Главная' : key === 'catalog' ? 'Каталог' : key === 'contacts' ? 'Контакты' : ''}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
