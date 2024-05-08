import { useEffect } from 'react'

import ky from 'ky'

export function useWakeUpServer() {
  useEffect(() => {
    ky.get(`${process.env.NEXT_PUBLIC_API_URL}`).catch((e) => {})
  }, [])
}
