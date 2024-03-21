import { downloadClip } from './download'
import { InitException, NotFoundException } from './exceptions'
import { taskManager } from './task-manager'

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { streamText } from 'hono/streaming'

const app = new Hono()

// app.onError((err, c) => {
//   console.log('🚀 ~ app.onError ~ c:', c)
//   console.log('🚀 ~ app.onError ~ err:', err)
//   if (err instanceof HTTPException) {
//     // Get the custom response
//     return err.getResponse()
//   }
// })

app.get('/', (c) => {
  console.log('🚀 ~ app.get')
  return c.text('Hono!')
})

app.get('/streamText', (c) => {
  return streamText(c, async (stream) => {
    await stream.writeln('Hello')
    await stream.sleep(1000)
    await stream.write(`Hono!`)
  })
})

app.post('/export', async (c) => {
  const data = await c.req.json<Clip>()
  console.log('🚀 ~ POST /export ~ data:', data)
  try {
    const { id } = taskManager.initializeTask()
    downloadClip(id, data)
    return c.json(id)
  } catch (e) {
    throw InitException(e, data.sourceVideo.url)
  }
})

app.get('/export/:id', (c) =>
  streamText(
    c,
    async (stream) => {
      const id = c.req.param('id')
      console.log('🚀 ~ GET /export/:id ~ id:', id)
      return new Promise<void>((resolve, reject) => {
        c.header('Access-Control-Allow-Origin', 'https://localhost:3000')

        const task = taskManager.getTask(id)

        if (!task) {
          stream.close()
          throw NotFoundException(id)
        }

        task.callbacks = {
          onProgress: (progress) => {
            stream.write(progress)
          },
          onFinish: (obj) => {
            stream.write(`data:${JSON.stringify(obj)}`)
            stream.close()
            resolve()
          },
          onError: () => {
            console.log('🚀 ~ Error:')
            stream.close()
            reject()
          },
        }
      })
    },
    async (e, stream) => {
      console.log('🚀 ~ e:', e)
      // throw UndefinedException(e)
    }
  )
)

app.get(
  `/static/*`,
  serveStatic({
    root: './',
    // rewriteRequestPath: (path) => path.replace(/^\/static/, `/${STATIC_PATH}`),
  })
)

serve({
  fetch: app.fetch,
  port: 3001,
  // hostname: 'localhost',
})

// serve(
//   {
//     createServer,
//     serverOptions: {
//       key: readFileSync(`${process.env.CERT_KEY}`),
//       cert: readFileSync(`${process.env.CERT}`),
//     },
//   },
//   (info: AddressInfo) => {
//     console.log(`Server ready!`, info)
//   }
// )
