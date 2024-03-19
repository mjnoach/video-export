import { nanoid } from 'nanoid'

type ExportCallbacks = {
  onProgress: (progress: string) => void
  onFinish: (obj: ExportedObj) => void
  onError: (err: any) => void
}

type Task = {
  callbacks: ExportCallbacks | null
  obj: ExportedObj | null
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
    }
    return { id }
  },
  completeTask: (id: string, obj: ExportedObj) => {
    const task = tasks[id]
    task.callbacks?.onFinish(obj)
    task.obj = obj
  },
  getTask: (id: string) => {
    return tasks[id]
  },
}
