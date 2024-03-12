import ky from 'ky'

export const api = {
  exportQuery: (data: Clip) => ({
    queryKey: ['export'],
    queryFn: async () =>
      ky
        .post('/api/export', {
          json: data,
        })
        .json<ExportedObj>(),
  }),
}
