import { useEffect, useState } from 'react'

export function usePersistentState<T>(
  key: string,
  initialState: T
): [T, (newState: T) => void] {
  const [state, setInternalState] = useState<T>(initialState)

  useEffect(() => {
    const storage = localStorage.getItem(key)
    const value = storage ? (JSON.parse(storage) as T) : null
    if (value) setInternalState(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const setState = (newState: T) => {
    localStorage.setItem(key, JSON.stringify(newState))
    setInternalState(newState)
  }

  return [state, setState]
}
