import { MersenneTwister } from 'random-seedable'

type EmptyValue = '.'
type CellValue = 'X' | 'O'
type RelationValue = '=' | 'x' | CellValue

type Cell = [number, number]
type Constraint = [number, RelationValue]

const CELL_VALUES: CellValue[] = ['X', 'O']
const DIRECTIONS = [0, 1, 0, -1, 0]

export const generateBoard = (seed: string) => {
  const random = new MersenneTwister(Number.parseInt(seed, 36))
  const board: (RelationValue | EmptyValue)[] = Array(108).fill('.')

  const cells = Array.from({ length: 36 }, (_, i) => [Math.floor(i / 6), i % 6] as Cell)
  random.shuffle(cells)

  const trySet = (cell: Cell, value: CellValue) => {
    const [row, col] = cell
    board[row * 6 + col] = value

    let countRow = 0, countCol = 0
    for (let i = 0; i < 6; i++) {
      if (board[row * 6 + i] === value) countRow++
      if (board[i * 6 + col] === value) countCol++

      if (i < 2) continue

      if (
        countRow > 3 ||
        countCol > 3 ||
        board[row * 6 + i] === value && board[row * 6 + (i - 1)] === value && board[row * 6 + (i - 2)] === value ||
        board[i * 6 + col] === value && board[(i - 1) * 6 + col] === value && board[(i - 2) * 6 + col] === value
      ) {
        board[row * 6 + col] = '.'
        return false
      }
    }

    return true
  }

  const unset = (cell: Cell) => {
    const [row, col] = cell
    board[row * 6 + col] = '.'
  }

  const generateConstraints = () => {
    if (!cells.length) return []

    const cell = cells.pop()!
    const candidates: [CellValue, Constraint[]][] = []

    for (const value of CELL_VALUES) {
      if (!trySet(cell, value)) continue
      const constraints = generateConstraints()
      unset(cell)

      if (constraints === null) continue
      candidates.push([value, constraints])
    }

    cells.push(cell)

    if (!candidates.length) return null
    if (candidates.length === 1) return candidates[0][1]

    const [value, constraints] = random.choice(candidates)

    const pinningConstraints: Constraint[] = [[cell[0] * 6 + cell[1], value]]
    for (let i = 1; i < DIRECTIONS.length; i++) {
      const row = cell[0] + DIRECTIONS[i - 1]
      const col = cell[1] + DIRECTIONS[i]
      if (row < 0 || row >= 6 || col < 0 || col >= 6 || board[row * 6 + col] === '.') continue

      pinningConstraints.push([Math.min(cell[0] * 6 + cell[1], row * 6 + col) + (row === cell[0] ? 36 : 72), board[row * 6 + col] === value ? '=' : 'x'])
    }

    return [...constraints, random.choice(pinningConstraints)]
  }

  const constraints = generateConstraints()
  if (!constraints) throw new Error('Failed to generate board')
  for (const [index, value] of constraints) {
    board[index] = value
  }

  return board.join('')
}

export const checkValid = (board: string, constraints: string) => {
  const count = Array(7).fill(0)

  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const cell = board[row * 6 + col] as CellValue | EmptyValue
      if (cell === '.') return false

      if (cell === 'X') {
        count[0]++
        count[col + 1]++
      }

      if (count[0] > 3) return false
      if (col >= 2 && board[row * 6 + (col - 1)] === cell && board[row * 6 + (col - 2)] === cell) return false
      if (row >= 2 && board[(row - 1) * 6 + col] === cell && board[(row - 2) * 6 + col] === cell) return false
      if (constraints[36 + row * 6 + col] === '=' && board[row * 6 + col] !== board[row * 6 + (col + 1)]) return false
      if (constraints[36 + row * 6 + col] === 'x' && board[row * 6 + col] === board[row * 6 + (col + 1)]) return false
      if (constraints[72 + row * 6 + col] === '=' && board[row * 6 + col] !== board[(row + 1) * 6 + col]) return false
      if (constraints[72 + row * 6 + col] === 'x' && board[row * 6 + col] === board[(row + 1) * 6 + col]) return false
    }

    if (count[0] !== 3) return false
    count[0] = 0
  }

  for (let col = 0; col < 6; col++) {
    if (count[col + 1] !== 3) return false
  }

  return true
}
