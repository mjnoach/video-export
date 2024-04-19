import { exportService } from './export-service.js'

import { fileURLToPath } from 'url'

export const workerPath = fileURLToPath(import.meta.url)

type Data = Parameters<typeof exportService.start>

export default async function start([id, clip, port]: Data) {
  return exportService.start(id, clip, port)
}
