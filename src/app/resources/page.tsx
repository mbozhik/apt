export const metadata = {
  title: 'Ресурсы',

  robots: {
    index: false,
    follow: false,
  },
}

import {getCollections, getTires} from '@/sanity/lib/requests'

import {H4} from '~/UI/Typography'

export default async function ResourcesPage() {
  const collections = await getCollections()
  const tires = await getTires()

  return (
    <main className="relative z-[9999] grid place-items-center w-full min-h-screen bg-black">
      <div className="flex flex-col gap-8 items-center text-center sm:mx-3">
        <div className="space-y-2">
          <H4>Коллекции</H4>
          {collections.map((collection, idx) => (
            <div className="px-3 sm:px-1 py-2.5 bg-white/15 rounded-lg" key={idx}>
              {`catalog.aptire.ru/collection/${collection.slug.current}`}
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <H4>Шины</H4>
          {tires.map((tire, idx) => (
            <div className="px-3 sm:px-1 py-2.5 bg-white/5 rounded-lg" key={idx}>
              {/* {`catalog.aptire.ru/tire/${tire.slug.current}`} */}

              <div> {`catalog.aptire.ru/tire/${tire.token.current.toLowerCase()}`}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
