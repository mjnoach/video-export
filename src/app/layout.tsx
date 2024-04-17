import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Background } from '@/components/background'
import { Nav } from '@/components/nav'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Video Editor',
  description: 'Clip and export videos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-w-[670px] grow flex-col-reverse sm:flex-col">
            <Nav />
            {children}
          </div>
          <Background />
        </Providers>
      </body>
    </html>
  )
}
