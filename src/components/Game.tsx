import { useState, useEffect, useCallback } from 'react'

import { Button, Modal, Group } from '@mantine/core'
import { useListState } from '@mantine/hooks'

import Board from './Board'
import useMap from '../hooks/useMap'
import { ToggleDirection } from '@/types/ToggleDirection'
import { Move } from '@/types/Move'

interface GameProps {
  seeds: string[]
  onNext?: () => void
}

const Game = ({ seeds, onNext } : GameProps) => {
  const boards = useMap<string, string>()
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState(() => '.'.repeat(36))
  const [moves, { append: pushMove, pop: popMove, setState: setMoves }] = useListState<Move>()
  const [constraints, setConstraints] = useState(() => '.'.repeat(108))
  const [modalMessage, setMessage] = useState('')
  const [modalShowButtons, setModalShowButtons] = useState(false)

  useEffect(() => {
    if (!seeds.length) return

    for (const seed of seeds) {
      if (boards.has(seed)) continue
      boards.set(seed, '')

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
        .catch(console.error)
    }
  }, [seeds, boards, constraints])

  useEffect(() => {
    setLoading(true)

    if (!boards.has(seeds[0])) return

    const newBoard = boards.get(seeds[0])
    if (!newBoard) return

    setLoading(false)

    if (newBoard === constraints) return

    if (newBoard === 'error') {
      setMessage('Temporarily unable to generate a new board for you. Please try again later.')
      setModalShowButtons(false)
      return
    }

    setBoard(newBoard.slice(0, 36))
    setConstraints(newBoard)
  }, [boards, constraints, seeds])

  useEffect(() => {
    if (board.includes('.')) return

    fetch(`/api/validate?board_data=${board}${constraints.slice(36)}`)
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          setMessage('Complete!')
          setModalShowButtons(true)
        }
      })
  }, [board, constraints, setMessage])

  const updateBoard = useCallback((i: number, direction: ToggleDirection) => {
    const cells = "OX."
    setBoard(board => board.slice(0, i) + cells[(cells.indexOf(board[i]) + direction + cells.length) % cells.length] + board.slice(i+1))
  }, [setBoard])

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
  }, [constraints, setBoard, setMoves])

  const handleShare = useCallback(() => {
    navigator.share({ url: location.href })
  }, [])

  const handlePlayAgain = useCallback(() => {
    onNext?.()
    setMessage('')
  }, [onNext])

  return (
    <>
      <Board board={board} constraints={constraints} loading={loading} onToggle={handleToggle} />
      <Group my="lg">
        <Button variant="default" onClick={handleUndo} disabled={!moves.length}>Undo</Button>
        <Button variant="default" onClick={handleClear}>Clear</Button>
      </Group>
      <Modal opened={!!modalMessage} onClose={() => setMessage('')} title={modalMessage} centered>
        {
          modalShowButtons && (
            <Group>
              <Button variant="filled" onClick={handleShare}>Share</Button>
              <Button variant="default" onClick={handlePlayAgain}>Play another</Button>
            </Group>
          )
        }
      </Modal>
    </>
  )
}

export default Game
