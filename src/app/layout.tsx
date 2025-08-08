export {metadata} from '@/lib/layout-config'
import {manrope} from '@/lib/layout-config'
import {Suspense} from 'react'

import '@/app/globals.css'

import {SanityLive} from '@/sanity/lib/live'
import YandexMetrika from '~/Global/Analytics'

import Header from '~/Global/Header'

function HeaderSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[99] px-14 py-11 xl:px-11 sm:px-2 sm:py-3 sm:bg-black">
      <nav className="w-[40%] xl:w-[45%] sm:w-full flex justify-between items-center gap-20 sm:gap-24">
        <div className="w-16 h-8 bg-white/20 rounded animate-pulse" />
        <div className="flex w-full justify-around gap-4">
          <div className="w-16 h-6 bg-white/20 rounded animate-pulse" />
          <div className="w-16 h-6 bg-white/20 rounded animate-pulse" />
          <div className="w-16 h-6 bg-white/20 rounded animate-pulse" />
        </div>
      </nav>
    </header>
  )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} bg-black text-white font-manrope antialiased`}>
        <Suspense fallback={<HeaderSkeleton />}>
          <Header />
        </Suspense>

        {children}

        <SanityLive />
        {process.env.NODE_ENV === 'production' && <YandexMetrika />}
      </body>
    </html>
  )
}
