import { exportService } from './export-service.js'

import { fileURLToPath } from 'url'

export const workerPath = fileURLToPath(import.meta.url)

export default async function start({ id, clip }: any) {
  return exportService.start(id, clip)
}
