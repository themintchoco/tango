import { useCallback, useEffect, useMemo, useState } from 'react'

import format from 'format-duration'
import Confetti from 'react-confetti'
import { Button, Group, Modal, Slider, Stack, Text, useMantineTheme, useMatches } from '@mantine/core'
import { IconArrowNarrowRight, IconReload, IconShare3 } from '@tabler/icons-react'

import Board from './Board'
import { Move } from '@/types/Move'

interface GameCompleteModalProps {
  show: boolean
  time: number
  gameBoard?: string
  gameConstraints?: string
  gameMoves?: Move[]
  onReplay: () => void
  onNext: () => void
  onShare: () => void
}

const GameCompleteModal = ({ show, time, gameBoard, gameConstraints, gameMoves, onReplay, onNext, onShare } : GameCompleteModalProps) => {
  const theme = useMantineTheme()
  const fullScreen = useMatches({
    base: true,
    lg: false,
  })

  const colors = useMemo(() => Object.values(theme.colors).flat(), [theme.colors])
  const [showing, setShowing] = useState(false)
  const [displayedGameBoard, setDisplayedGameBoard] = useState(gameBoard)
  const [displayedGameConstraints, setDisplayedGameConstraints] = useState(gameConstraints)
  const [displayedMoves, setDisplayedMoves] = useState(gameMoves)
  const [sliderValue, setSliderValue] = useState(0)

  const showBoardAtMove = useCallback((position: number) => {
    if (!displayedMoves) return
    const cells = 'OX.'

    setDisplayedGameBoard(gameConstraints?.slice(0, 36))
    for (let i = 0; i < position; i++) {
      const [p, d] = [displayedMoves[i].position, displayedMoves[i].direction]
      setDisplayedGameBoard(board => board && board.slice(0, p) + cells[(cells.indexOf(board[p]) + d + cells.length) % cells.length] + board.slice(p + 1))
    }
  }, [displayedMoves, gameConstraints])

  const handleSliderChange = useCallback((value: number) => {
    showBoardAtMove(value)
    setSliderValue(value)
  }, [showBoardAtMove])

  useEffect(() => {
    if (!show) {
      setShowing(false)
      return
    }

    if (showing) return

    setShowing(true)
    setDisplayedGameBoard(gameMoves ? gameConstraints?.slice(0, 36) : gameBoard)
    setDisplayedGameConstraints(gameConstraints)
    setDisplayedMoves(gameMoves)
    setSliderValue(0)
  }, [show, showing, gameBoard, gameConstraints, gameMoves])

  useEffect(() => {
    if (!displayedMoves) return

    const interval = setInterval(() => {
      setSliderValue((value: number) => {
        if (value >= displayedMoves.length) {
          clearInterval(interval)
          return value
        }

        showBoardAtMove(value + 1)
        return value + 1
      })
    }, 50)

    return () => clearInterval(interval)
  }, [displayedMoves, showBoardAtMove])

  return (
    <Modal opened={show} onClose={onNext} withCloseButton={false} size="lg" radius="xl" fullScreen={fullScreen} overlayProps={{ blur: 3 }} transitionProps={{ duration: 200, transition: 'fade-up' }} padding={0} centered>
      <Stack bg="teal.6" c="white" p="xl" justify="space-around" h={ fullScreen ? '100dvh' : undefined }>
        <Stack align="center" gap={0}>
          <Text size="xl" fw={700} tt="uppercase">Board Complete</Text>
          <Text fz="4em" fw={900}>{ format(time * 1000) }</Text>
        </Stack>

        {
          displayedGameBoard && displayedGameConstraints && (
            <Board board={displayedGameBoard} constraints={displayedGameConstraints} />
          )
        }

        {
          displayedMoves && (
            <Slider value={sliderValue} size="lg" label={null} max={displayedMoves.length} onChange={handleSliderChange} />
          )
        }

        <Group mt="xl">
          <Button variant="white" radius="lg" size="md" onClick={onReplay}><IconReload /></Button>
          <Button variant="white" radius="lg" size="md" flex="1" rightSection={<IconArrowNarrowRight size={14} />} onClick={onNext} data-autofocus>Play Next</Button>
          <Button variant="white" radius="lg" size="md" onClick={onShare}><IconShare3 /></Button>
        </Group>
      </Stack>

      <Confetti recycle={false} colors={colors} numberOfPieces={400} gravity={0.25} />
    </Modal>
  )
}

export default GameCompleteModal
