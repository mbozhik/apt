export {metadata} from '@/lib/layout-config'
import {manrope} from '@/lib/layout-config'

import '@/app/globals.css'

import {SanityLive} from '@/sanity/lib/live'
import YandexMetrika from '~/Global/Analytics'

import Header from '~/Global/Header'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} bg-black text-white font-manrope antialiased`}>
        <Header />

        {children}

        <SanityLive />
        {process.env.NODE_ENV === 'production' && <YandexMetrika />}
      </body>
    </html>
  )
}
