import { useState, useEffect, useCallback } from 'react'

import { Button, Group } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { modals } from '@mantine/modals'

import Board from './Board'
import GameCompleteModal from './GameCompleteModal'
import Timer from './Timer'
import useGame from '../hooks/useGame'
import useMap from '../hooks/useMap'
import { ToggleDirection } from '@/types/ToggleDirection'
import { Move } from '@/types/Move'

interface GameProps {
  seeds: string[]
  onNext?: () => void
}

const Game = ({ seeds, onNext } : GameProps) => {
  const game = useGame()
  const boards = useMap<string, string>()
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState(false)
  const [lastTime, setLastTime] = useState(0)
  const [board, setBoard] = useState(() => '.'.repeat(36))
  const [moves, { append: pushMove, pop: popMove, setState: setMoves }] = useListState<Move>()
  const [constraints, setConstraints] = useState(() => '.'.repeat(108))
  const [completed, setCompleted] = useState(false)

  useEffect(() => {
    if (!seeds.length) return

    for (const seed of seeds) {
      if (boards.has(seed)) continue
      boards.set(seed, '')

      // Use server-generated (legacy) boards for old seeds to preserve existing links
      // Old seeds were defined to be exactly 10 chars long
      if (seed.length === 10) {
        fetch(`/api/random/${seed}`)
          .then(response => {
            if (!response.ok) {
              boards.set(seed, 'error')
              return
            }

            return response.json()
          })
          .then(data => {
            boards.set(seed, data.board)
          })
          .catch(() => {
            boards.set(seed, 'error')
          })
      } else {
        game.generateBoard(seed)
          .then(board => {
            boards.set(seed, board)
          })
          .catch(() => {
            boards.set(seed, 'error')
          })
      }
    }
  }, [seeds, boards, constraints, game])

  useEffect(() => {
    setLoading(true)

    if (!boards.has(seeds[0])) return

    const newBoard = boards.get(seeds[0])
    if (!newBoard) return

    setLoading(false)

    if (newBoard === constraints) return

    if (newBoard === 'error') {
      modals.open({
        title: 'Error',
        children: 'Temporarily unable to generate a new board for you. Please try again later.',
      })
      return
    }

    setBoard(newBoard.slice(0, 36))
    setConstraints(newBoard)
    setMoves([])
  }, [seeds, boards, constraints, setMoves])

  useEffect(() => {
    game.checkValid(board, constraints)
      .then(valid => {
        if (valid) {
          setActive(false)
          setCompleted(true)
        } else {
          setActive(true)
          setCompleted(false)
        }
      })
  }, [board, constraints, game, lastTime])

  const updateBoard = useCallback((i: number, direction: ToggleDirection) => {
    const cells = 'OX.'
    setBoard(board => board.slice(0, i) + cells[(cells.indexOf(board[i]) + direction + cells.length) % cells.length] + board.slice(i+1))
  }, [])

  const handleToggle = useCallback((position: number, direction: ToggleDirection) => {
    updateBoard(position, direction)
    pushMove({ position, direction })
  }, [updateBoard, pushMove])

  const handleUndo = useCallback(() => {
    if (!moves.length) return
    const move = moves[moves.length - 1]
    popMove()
    updateBoard(move.position, -move.direction)
  }, [moves, popMove, updateBoard])

  const handleClear = useCallback(() => {
    setBoard(constraints.slice(0, 36))
    setMoves([])
  }, [constraints, setMoves])

  const handleShare = useCallback(() => {
    navigator.share({ text: `I completed a Tango Unlimited board in ${lastTime.toFixed(2)} seconds! Challenge me at ${location.href}` })
  }, [lastTime])

  const handlePlayAgain = useCallback(() => {
    onNext?.()
  }, [onNext])

  return (
    <>
      <Board board={board} constraints={constraints} loading={loading} onToggle={handleToggle} />
      <Timer active={active} onStart={(_, { reset }) => reset()} onStop={value => setLastTime(value)} />
      <Group mb="lg">
        <Button variant="default" onClick={handleUndo} disabled={!moves.length}>Undo</Button>
        <Button variant="default" onClick={handleClear}>Clear</Button>
      </Group>
      <GameCompleteModal show={completed} time={lastTime} gameBoard={board} gameConstraints={constraints} gameMoves={moves} onReplay={handleClear} onNext={handlePlayAgain} onShare={handleShare} />
    </>
  )
}

export default Game
