import Image from 'next/image'
import Link from 'next/link'

import logo from '../../public/logo.svg'

export const Nav = () => (
  <div className="container z-10 items-center justify-between text-sm lg:flex lg:px-24 lg:py-12">
    <div className="fixed bottom-12 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
      <Link
        href="/"
        className="pointer-events-none flex place-items-center lg:pointer-events-auto lg:p-0"
      >
        <Image src={logo} alt="Logo" className="max-w-16" priority />
      </Link>
    </div>
  </div>
)
