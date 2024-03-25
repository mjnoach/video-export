import { downloadClip } from './download.js'
import { InitException, NotFoundException } from './exceptions.js'
import { taskManager } from './task-manager.js'

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { streamText } from 'hono/streaming'
import { AddressInfo } from 'net'

const { EXPORT_DIR } = process.env

const app = new Hono()
app.use(logger())

// app.onError((err, c) => {
//   console.log('🚀 ~ app.onError ~ c:', c)
//   console.log('🚀 ~ app.onError ~ err:', err)
//   if (err instanceof HTTPException) {
//     // Get the custom response
//     return err.getResponse()
//   }
// })

app.get('/', (c) => {
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
  `${EXPORT_DIR}/*`,
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, `${EXPORT_DIR}`),
  })
)

serve(
  {
    fetch: app.fetch,
    port: 3001,
    // hostname: 'localhost',
    // keyFile: process.env.SSL_KEY_FILE || './key.pem',
    // certFile: process.env.SSL_CERTIFICATE_FILE || './cert.pem',
  },
  (info: AddressInfo) => {
    console.log(`🚀 Server ready!\n`)
    console.log(`${info.address}:${info.port}`)
  }
)

// serve(
//   {
//     createServer,
//     serverOptions: {
//       key: readFileSync(`${process.env.CERT_KEY}`),
//       cert: readFileSync(`${process.env.CERT}`),
//     },
//   }
// )
