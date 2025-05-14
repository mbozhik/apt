export {metadata} from '@/lib/layout-config'
import {manrope} from '@/lib/layout-config'

import './globals.css'

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
      </body>
    </html>
  )
}
