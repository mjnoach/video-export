import { useMutation } from '@tanstack/react-query'
import ky from 'ky'

const api = {
  export: async (data: Clip) =>
    ky
      .post('/api/export', {
        json: data,
      })
      .json<ExportedObj>(),
}

export const useExport = () => {
  return useMutation({
    mutationFn: (data: Clip) => api.export(data),
  })
}
