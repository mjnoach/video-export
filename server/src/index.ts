import { ExportException, NotFoundException } from './exceptions.js'
import { exportManager } from './export-manager.js'

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
//   console.log('🚀 ~ app.onError ~ err:', err)
//   return c.text('Custom Error Message', 500)
// })

// app.notFound((c) => {
//   return c.text('Custom 404 Message', 404)
// })

app.get('/', (c) => {
  return c.text('Hono!')
})

app.post('/export', async (c) => {
  let clip: Clip
  if (c.req.header('Content-Type')?.includes('multipart/form-data')) {
    const formData = await c.req.formData()
    clip = JSON.parse(formData.get('clip') as string) as Clip
    const file = formData.get('file') as File
    clip.file = file
  } else {
    clip = await c.req.json<Clip>()
  }
  const { id } = exportManager.init()
  exportManager.start(id, clip)
  return c.json(id, 200)
})

app.get('/export/:id', (c) =>
  streamText(
    c,
    async (stream) => {
      const id = c.req.param('id')
      return new Promise<void>(async (resolve, reject) => {
        c.header('Access-Control-Allow-Origin', 'https://localhost:3000')

        const task = exportManager.get(id)
        if (!task) reject(new NotFoundException(id))
        if (task.status === 'failed') reject(new ExportException(id))

        task.onProgress = (percent) => {
          console.log(`Processing ${id} ${percent}%`)
          stream.writeln(percent)
        }
        task.onFinish = (obj) => {
          stream.writeln(`data:${JSON.stringify(obj)}`)
          resolve()
        }
        task.onError = (err) => {
          reject(err)
        }
      })
    },
    async (err, stream) => {
      // await stream.write(`error:${err.message}`)
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
    console.info(`🚀 Server ready!\n`)
    console.info(`${info.address}:${info.port}`)
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
