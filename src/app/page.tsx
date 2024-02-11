import Image from 'next/image'

import { VideoLinkForm } from '@/components/VideoLinkForm'

import logo from '../../public/logo.svg'

export default function Home() {
  return (
    <div>
      <main className="relative flex h-screen flex-col items-center justify-between p-12">
        <Nav />
        <div className="mt-40 flex grow">
          <VideoLinkForm />
        </div>
        <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
          {/*  */}
        </div>
      </main>
    </div>
  )
}

const Nav = () => (
  <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
    <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
      <a
        href="#"
        className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
        rel="noopener noreferrer"
      >
        <Image src={logo} alt="Logo" className="max-w-16" priority />
      </a>
    </div>
  </div>
)
