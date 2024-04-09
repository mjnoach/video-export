import { useEffect, useState } from 'react'

export function usePersistentState<T>(
  key: string,
  initialState: T
): [T, (newState: T) => void] {
  const [state, setInternalState] = useState<T>(initialState)

  useEffect(() => {
    const storage = getStorage()
    if (storage) setInternalState(storage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStorage = () => {
    const value = localStorage.getItem(key)
    const storage = value ? (JSON.parse(value) as T) : null
    return storage
  }

  const setState = (newState: T) => {
    localStorage.setItem(key, JSON.stringify(newState))
    setInternalState(newState)
  }

  return [state, setState]
}
