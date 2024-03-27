import { NextResponse } from 'next/server'

import type { HTTPError } from 'ky'

export async function handleServerErrors(
  e: any | HTTPError,
  message = 'Internal Server Error',
  status = 500
) {
  if (e instanceof Error) {
    console.error(e.name, e.message)
    console.error(e.cause)
  }
  if (e.name === 'HTTPError') {
    const text = await e.response.text()
    message = text ? text : message
    console.error(message)
    return new NextResponse(message, { status })
  }
  return new NextResponse(message, { status })
}

export const msgExportInitError = (source: string) =>
  `Error initializing export from source ${source}`

export const msgExportStreamingError = (id: string) =>
  `Failed streaming data for export ${id}`
