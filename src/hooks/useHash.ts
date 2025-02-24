import { useCallback, useEffect, useState } from "react"

const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash)

  const onHashChange = useCallback(() => {
    setHash(window.location.hash)
  }, [setHash])

  useEffect(() => {
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  })

  const _setHash = useCallback((newHash: string) => {
    window.location.hash = newHash
  }, [])

  return [hash, _setHash] as const
}

export default useHash
