import { useQuery } from '@tanstack/react-query'
import ky from 'ky'

const api = {
  export: async (data: Clip) =>
    ky
      .post('/api/export', {
        json: data,
      })
      .json<ExportedObj>(),
}

export const useExport = (data: Clip) => {
  return useQuery({
    queryKey: ['export'],
    queryFn: () => api.export(data),
    // TODO
    // change to mutation and delete this
    enabled: false,
    refetchOnWindowFocus: false,
  })
}
