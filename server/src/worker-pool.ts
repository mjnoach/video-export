import { getAbsolutePath } from './utils.js'

import workerpool from 'workerpool'

export const workerPool = workerpool.pool(getAbsolutePath('../dist/worker.js'))
