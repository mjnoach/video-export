import { useEffect, useState } from 'react'

export function useSessionState<T>(
  key: string,
  initialState: T
): [T, (newState: T) => void] {
  const [state, setInternalState] = useState<T>(initialState)

  useEffect(() => {
    const value = sessionStorage.getItem(key)
    const storage = value ? (JSON.parse(value) as T) : null
    if (storage) setInternalState(storage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setState = (newState: T) => {
    sessionStorage.setItem(key, JSON.stringify(newState))
    setInternalState(newState)
  }

  return [state, setState]
}
