import { downloadClip } from './download.js'
import { ProcessingException, TaskNotFoundException } from './exceptions.js'
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

app.get('/', (c) => {
  return c.text('Hono!')
})

app.post('/export', async (c) => {
  let clip: Clip
  const formData = await c.req.formData()
  if (formData) {
    clip = JSON.parse(formData.get('clip') as string)
    const file = formData.get('file') as File
    console.log('🚀 ~ app.post ~ clip:', clip)
    console.log('🚀 ~ app.post ~ file:', file)
  } else {
    clip = await c.req.json<Clip>()
  }
  const { id } = taskManager.initializeTask()
  downloadClip(id, clip)
  return c.json(id)
})

app.get('/export/:id', (c) =>
  streamText(c, async (stream) => {
    const id = c.req.param('id')
    return new Promise<void>((resolve, reject) => {
      c.header('Access-Control-Allow-Origin', 'https://localhost:3000')

      const task = taskManager.getTask(id)
      if (!task) throw TaskNotFoundException(id)

      task.callbacks = {
        onProgress: (progress) => {
          stream.write(progress)
        },
        onFinish: (obj) => {
          stream.write(`data:${JSON.stringify(obj)}`)
          stream.close()
          resolve()
        },
        onError: (err) => {
          throw ProcessingException(err)
        },
      }
    })
  })
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
