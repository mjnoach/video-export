import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import logo from '../../public/logo.svg'

export const Nav = () => {
  return (
    <div
      className={cn(
        'container flex flex-col from-white via-white dark:from-black dark:via-black',
        // mobile
        '/h-48 items-center justify-end bg-gradient-to-t pb-6 pt-12',
        // , desktop
        'lg:items-start lg:bg-gradient-to-b lg:pb-0 lg:pl-24 lg:pt-12'
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
