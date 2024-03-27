// export const TranscodingException = (e: any) => {
//   const status = 500
//   const message = 'Transcoding failed'
//   return new HTTPException(status, {
//     message,
//     cause: e,
//   })
// }

// export const ExportSourceException = (e: any) => {
//   const status = 500
//   return new HTTPException(status, {
//     message: e.message,
//     cause: e,
//   })
// }

// export const TaskNotFoundException = (id: string) => {
//   const status = 404
//   const message = `Task for export '${id}' not found`
//   return new HTTPException(status, {
//     message,
//   })
// }
