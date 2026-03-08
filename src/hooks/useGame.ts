import { RefObject, useCallback, useEffect, useRef } from 'react'

import { Function } from '../workers/game.worker'

const useGame = () => {
  const game: RefObject<Worker | null> = useRef(null)
  const callbacks: RefObject<Record<string, { resolve: (value: unknown) => void, reject: (reason?: unknown) => void }>> = useRef({})

  if (game.current === null) {
    game.current = new Worker(new URL('../workers/game.worker.ts', import.meta.url), { type: 'module' })

    game.current.onmessage = (event: MessageEvent) => {
      const [id, success, result] = event.data as [string, boolean, unknown]
      if (success) callbacks.current[id]?.resolve(result)
      else callbacks.current[id]?.reject(result)
      delete callbacks.current[id]
    }
  }

  useEffect(() => () => game.current?.terminate(), [])

  const post = useCallback((f: Function, ...args: unknown[]) => {
    const id = crypto.randomUUID()
    const promise = new Promise((resolve, reject) => {
      callbacks.current[id] = { resolve, reject }
    })

    game.current?.postMessage([id, f, ...args])
    return promise
  }, [])

  const checkValid = useCallback((board: string, constraints: string) => {
    return post(Function.checkValid, board, constraints) as Promise<boolean>
  }, [post])

  const generateBoard = useCallback((seed: string) => {
    return post(Function.generateBoard, seed) as Promise<string>
  }, [post])

  return {
    checkValid,
    generateBoard,
  }
}

export default useGame
