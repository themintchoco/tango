/* eslint-disable react-hooks/exhaustive-deps -- v is used as additional dependency to signal map update */
import { useCallback, useRef, useState } from 'react'

const useMap = <K, V>(initialState?: Iterable<readonly [K, V]>) => {
  const [v, setV] = useState(0)
  const mapRef = useRef(new Map<K, V>(initialState))

  const get = useCallback((key: K) => {
    return mapRef.current.get(key)
  }, [v])

  const set = useCallback((key: K, value: V) => {
    mapRef.current.set(key, value)
    setV(v => v + 1)
  }, [v, setV])

  const has = useCallback((key: K) => {
    return mapRef.current.has(key)
  }, [v])

  return { get, set, has } as const
}

export default useMap
