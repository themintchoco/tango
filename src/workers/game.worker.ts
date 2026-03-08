import { checkValid, generateBoard } from '../utils/game'

export enum Function {
  checkValid,
  generateBoard,
}

self.addEventListener('message', (event) => {
  const [id, f, ...args] = event.data as [string, Function, ...unknown[]]

  try {
    let result: unknown
    switch (f) {
      case Function.checkValid:
        result = checkValid(...args as [string, string])
        break
      case Function.generateBoard:
        result = generateBoard(...args as [string])
        break
    }
    self.postMessage([id, true, result])
  } catch (error) {
    self.postMessage([id, false, error])
  }
})
