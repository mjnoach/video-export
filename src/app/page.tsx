import Image from 'next/image'

import logo from '../../public/logo.svg'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-between p-24">
      <BackgroundShapes />
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white lg:static lg:h-auto lg:w-auto lg:bg-none dark:from-black dark:via-black">
          <a
            href="#"
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            rel="noopener noreferrer"
          >
            <Image
              src={logo}
              alt="Logo"
              className="max-w-16 invert dark:invert"
              priority
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="group flex flex-col gap-6 rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
          <div>
            <h2 className={`mb-3 text-2xl font-semibold`}>
              Paste & Go{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-md text-sm opacity-50`}>
              Paste a YouTube video link and jump into the editor!
            </p>
          </div>

          <div>
            <div className="mb-6">
              <label
                htmlFor="success"
                className="mb-2 block text-sm font-medium text-green-700 dark:text-green-500"
              >
                Your name
              </label>
              <input
                type="text"
                id="success"
                className="block w-full rounded-lg border border-green-500 bg-green-50 p-2.5 text-sm text-green-900 placeholder-green-700 focus:border-green-500 focus:ring-green-500 dark:border-green-500 dark:bg-gray-700 dark:text-green-400 dark:placeholder-green-500"
                placeholder="Success input"
              />
              <p className="mt-2 text-sm text-green-600 dark:text-green-500">
                <span className="font-medium">Well done!</span> Some success
                message.
              </p>
            </div>
            <div>
              <label
                htmlFor="error"
                className="mb-2 block text-sm font-medium text-red-700 dark:text-red-500"
              >
                Your name
              </label>
              <input
                type="text"
                id="error"
                className="block w-full rounded-lg border border-red-500 bg-red-50 p-2.5 text-sm text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-red-500 dark:border-red-500 dark:bg-gray-700 dark:text-red-500 dark:placeholder-red-500"
                placeholder="Error input"
              />
              <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                <span className="font-medium">Oh, snapp!</span> Some error
                message.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        {/*  */}
      </div>
    </main>
  )
}

const BackgroundShapes = () => (
  <div className="absolute inset-x-[45%] inset-y-1/2 -z-10">
    <div className="relative z-[-1] flex scale-[175%] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40">
      <div className="relative z-[-1] flex scale-[175%] place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-rose-100 after:via-red-300 after:blur-2xl after:content-[''] sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-red-400 before:dark:opacity-10 after:dark:from-rose-800 after:dark:via-red-500 after:dark:opacity-40">
        {/*  */}
      </div>
    </div>
  </div>
)
