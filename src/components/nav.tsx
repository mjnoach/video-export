import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import logo from '../../public/logo.svg'

export const Nav = () => {
  return (
    <div
      className={cn(
        // 'from-white via-white dark:from-black dark:via-black',
        'container flex flex-col bg-transparent',
        '/bg-gradient-to-t items-center justify-end pb-6 pt-12',
        '/sm:bg-gradient-to-b sm:items-start sm:pb-0 sm:pl-24 sm:pt-12'
      )}
    >
      <Link href="/">
        <Image
          src={logo}
          alt="Logo"
          className="max-w-12 select-none opacity-75"
          priority
        />
      </Link>
    </div>
  )
}
