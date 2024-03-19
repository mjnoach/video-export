import { downloadClip } from './download'
import { NotFound } from './errors'
import { taskManager } from './task-manager'

import { Hono } from 'hono'
import { stream } from 'hono/streaming'

const app = new Hono()

// app.get('/', (c) => {
//   console.log('🚀 ~ app.get')
//   return c.text('Hono!')
// })

app.post('/export', async (c) => {
  const data = await c.req.json()
  console.log('🚀 ~ POST ~ data:', data)
  const { id } = taskManager.initializeTask()
  downloadClip(id, data)
  return c.json(id)
})

app.get('/export/:id', (c) =>
  stream(
    c,
    async (stream) => {
      const id = c.req.param('id')
      console.log('🚀 ~ GET ~ id:', id)
      const task = taskManager.getTask(id)
      if (!task) throw new NotFound(id)
      task.callbacks = {
        onProgress: (progress) => {
          stream.write(progress)
        },
        onFinish: (obj) => {
          stream.write(`data:${JSON.stringify(obj)}`)
          stream.close()
        },
        onError: () => {
          stream.close()
        },
      }
    },
    async (err, stream) => {
      stream.writeln('An error occurred!')
      console.error(err)
    }
  )
)

export default app
