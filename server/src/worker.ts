import { exportService } from './export-service.js'

import workerpool from 'workerpool'

workerpool.worker({
  start: exportService.start,
})
