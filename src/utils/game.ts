export const checkValid = (board: string, constraints: string) => {
  for (const cell of 'OX') {
    for (let i = 0; i < 6; i++) {
      let rowCount = 0;
      let colCount = 0;

      for (let j = 0; j < 6; j++) {
        if (board[i * 6 + j] === '.') return false

        if (board[i * 6 + j] === cell) rowCount++
        if (board[j * 6 + i] === cell) colCount++
      }

      if (rowCount > 3) return false
      if (colCount > 3) return false
    }
  }

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 6; j++) {
      if (constraints[36 + i * 6 + j] === '=' && board[i * 6 + j] !== board[i * 6 + j + 1]) return false
      if (constraints[36 + i * 6 + j] === 'x' && board[i * 6 + j] === board[i * 6 + j + 1]) return false
      if (constraints[72 + i * 6 + j] === '=' && board[i * 6 + j] !== board[(i + 1) * 6 + j]) return false
      if (constraints[72 + i * 6 + j] === 'x' && board[i * 6 + j] === board[(i + 1) * 6 + j]) return false
    }
  }

  return true
}
