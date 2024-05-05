import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

import logo from '../../public/logo.svg'

export const Nav = () => {
  return (
    <div
      className={cn(
        'container flex flex-col bg-transparent',
        'items-start pb-0 pl-24 pt-12'
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
