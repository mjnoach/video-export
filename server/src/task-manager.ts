import { nanoid } from 'nanoid'

type ExportCallbacks = {
  onProgress: (progress: string) => void
  onFinish: (obj: ExportedObj) => void
  onError: (err: any) => Error
}

type Task = {
  callbacks: ExportCallbacks | null
  obj: ExportedObj | null
  // status: null | 'started' | 'complete' | 'failed'
}

const tasks: {
  [id: string]: Task
} = {}

export const taskManager = {
  initializeTask: () => {
    const OBJ_ID_LENGTH = 8
    const id = nanoid(OBJ_ID_LENGTH)
    tasks[id] = {
      callbacks: null,
      obj: null,
      // status: null,
    }
    return { id }
  },
  startTask: (id: string) => {
    const task = tasks[id]
    // task.status = 'started'
  },
  completeTask: (id: string, obj: ExportedObj) => {
    const task = tasks[id]
    // task.status = 'complete'
    task.callbacks?.onFinish(obj)
    task.obj = obj
  },
  getTask: (id: string) => {
    return tasks[id]
  },
}
