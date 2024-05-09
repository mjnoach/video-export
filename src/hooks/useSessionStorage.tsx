import { useEffect, useState } from 'react'

export function useSessionStorage<T>(
  key: string,
  initialState: T
): [T, (newState: T) => void, (data: Partial<T>) => void] {
  const [state, setInternalState] = useState<T>(initialState)

  useEffect(() => {
    const storage = getStorage()
    if (storage) setInternalState(storage)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getStorage = () => {
    const value = sessionStorage.getItem(key)
    const storage = value ? (JSON.parse(value) as T) : ({} as T)
    return storage
  }

  const setState = (newState: T) => {
    sessionStorage.setItem(key, JSON.stringify(newState))
    setInternalState(newState)
  }

  const updateState = (data: Partial<T>) => {
    const storage = getStorage()
    const newState = {
      ...storage,
      ...data,
    } as T
    sessionStorage.setItem(key, JSON.stringify(newState))
    setInternalState(newState)
  }

  return [state, setState, updateState]
}
