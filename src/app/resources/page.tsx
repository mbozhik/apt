export const metadata = {
  title: 'Ресурсы',

  robots: {
    index: false,
    follow: false,
  },
}

import {getCollections, getTires} from '@/sanity/lib/requests'
import {IS_DEV} from '@/lib/constants'
import Link from 'next/link'

import {H4} from '~/UI/Typography'

export default async function ResourcesPage() {
  const collections = await getCollections()
  const tires = await getTires()

  const baseUrl = IS_DEV ? 'localhost:3000' : 'catalog.aptire.ru'

  return (
    <main className="relative z-[9999] grid place-items-center w-full min-h-screen bg-black">
      <div className="flex flex-col gap-8 items-center text-center sm:mx-3">
        <div className="space-y-4">
          <H4>Коллекции</H4>

          <div className="space-y-2">
            {collections.map((collection, idx) => {
              const url = `${baseUrl}/collection/${collection.slug.current}`

              return (
                <Link key={idx} href={IS_DEV ? `/collection/${collection.slug.current}` : `https://${url}`} className="block px-3 sm:px-1 py-2.5 bg-white/15 rounded-lg hover:bg-white/25 transition-colors">
                  {url}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          <H4>Шины</H4>

          <div className="grid grid-cols-3 sm:grid-cols-1 gap-2">
            {tires.map((tire, idx) => {
              const url = `${baseUrl}/tire/${tire.token.current.toLowerCase()}`

              return (
                <Link key={idx} href={IS_DEV ? `/tire/${tire.token.current.toLowerCase()}` : `https://${url}`} className="block px-3 sm:px-1 py-2.5 bg-white/5 rounded-lg hover:bg-white/15 transition-colors">
                  {url}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </main>
  )
}
