import { ExportException, NotFoundException } from './exceptions.js'
import { exportService } from './export-service.js'
import { clearTempData } from './utils.js'
import { workerPath } from './worker.js'

import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import dotenv from 'dotenv'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { streamText } from 'hono/streaming'
import { AddressInfo } from 'net'
import { Piscina as Pool } from 'piscina'
import { TransferListItem } from 'worker_threads'

dotenv.config()
const { CLIENT_URL, EXPORT_DIR } = process.env

export const pool = new Pool({
  filename: workerPath,
})

const app = new Hono()

app.use(logger())

app.use(
  '*',
  cors({
    origin: `${CLIENT_URL}`,
  })
)

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

  const { id } = await exportService.init(clip)

  const { port1, port2 } = new MessageChannel()
  port1.onmessage = (percent) => exportService.report(id, percent.data)

  pool
    .run([id, clip, port2], {
      transferList: [port2 as unknown as TransferListItem],
    })
    .catch((e) => {
      exportService.fail(id, e)
    })
    .then((exportData) => {
      exportService.complete(id, exportData)
    })
    .finally(() => {
      if (clip.isLocal) clearTempData(id)
    })

  exportService.get(id).status = 'started'

  return c.json(id, 202)
})

app.get('/export/:id', (c) =>
  streamText(
    c,
    async (stream) => {
      const id = c.req.param('id')
      return new Promise<void>(async (resolve, reject) => {
        const task = exportService.get(id)
        if (!task) reject(new NotFoundException(id))
        if (task.status === 'failed') reject(new ExportException(id))

        task.onProgress = (percent) => {
          stream.writeln(percent)
        }
        task.onFinish = (exportData) => {
          stream.writeln(`data:${JSON.stringify(exportData)}`)
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
  `/${EXPORT_DIR}/*`,
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, `/${EXPORT_DIR}`),
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
    console.info(`http://localhost:${info.port}`, '\n')
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
