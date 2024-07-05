import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Background } from '@/components/background'
import { Nav } from '@/components/nav'

import { cn } from '@/lib/utils'

import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Video Trim & Export Tool',
  description: 'Trim and export videos straight in the browser',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>
        <Providers>
          <div className="relative flex min-w-[770px] grow flex-col overflow-x-hidden">
            <Nav />
            {children}
            <Background />
          </div>
        </Providers>
      </body>
    </html>
  )
}
