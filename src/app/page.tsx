import Image from 'next/image'

import { VideoLinkForm } from '@/components/VideoLinkForm'

import logo from '../../public/logo.svg'

export default function Home() {
  return (
    <div>
      <Background />
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

const Background = () => (
  <div className="absolute bottom-0 left-0 right-0 top-0 overflow-x-hidden">
    <div className="absolute inset-x-[45%] inset-y-1/2 -z-10">
      <div className="relative z-[-1] flex scale-[150%] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
        <div className="relative z-[-1] flex scale-[150%] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-rose-100 after:via-red-300 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-red-400 before:dark:opacity-10 after:dark:from-rose-800 after:dark:via-red-500 after:dark:opacity-40">
          {/*  */}
        </div>
      </div>
    </div>
  </div>
)
