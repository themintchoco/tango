import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import clsx from 'clsx'
import format from 'format-duration'
import Confetti from 'react-confetti'
import { Badge, Button, Group, Modal, Slider, Stack, Text, useMantineTheme, useMatches } from '@mantine/core'
import { IconArrowNarrowRight, IconReload, IconShare3 } from '@tabler/icons-react'

import styles from './GameCompleteModal.module.css'
import Board from './Board'
import { Move } from '@/types/Move'

interface GameCompleteModalProps {
  show: boolean
  flawless: boolean
  time: number
  gameBoard?: string
  gameConstraints?: string
  gameMoves?: Move[]
  onReplay: () => void
  onNext: () => void
  onShare: () => void
}

const GameCompleteModal = ({ show, flawless, time, gameBoard, gameConstraints, gameMoves, onReplay, onNext, onShare } : GameCompleteModalProps) => {
  const theme = useMantineTheme()
  const fullScreen = useMatches({
    base: true,
    sm: false,
  })
  const compactButtons = useMatches({
    base: true,
    xs: false,
  })

  const ref = useRef<HTMLDivElement>(null)
  const colors = useMemo(() => Object.values(theme.colors).flat(), [theme.colors])
  const [showing, setShowing] = useState(false)
  const [displayedFlawless, setDisplayedFlawless] = useState(flawless)
  const [displayedGameBoard, setDisplayedGameBoard] = useState(gameBoard)
  const [displayedGameConstraints, setDisplayedGameConstraints] = useState(gameConstraints)
  const [displayedMoves, setDisplayedMoves] = useState(gameMoves)
  const [sliderValue, setSliderValue] = useState(0)

  const showBoardAtMove = useCallback((position: number) => {
    if (!displayedMoves || !gameConstraints) return
    const newBoard = gameConstraints.split('').slice(0, 36)
    const cells = 'OX.'

    for (let i = 0; i < position; i++) {
      const [p, d] = [displayedMoves[i].position, displayedMoves[i].direction]
      newBoard[p] = cells[(cells.indexOf(newBoard[p]) + d + cells.length) % cells.length]
    }

    setDisplayedGameBoard(newBoard.join(''))
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
    setDisplayedFlawless(flawless)
    setDisplayedGameBoard(gameMoves ? gameConstraints?.slice(0, 36) : gameBoard)
    setDisplayedGameConstraints(gameConstraints)
    setDisplayedMoves(gameMoves)
    setSliderValue(0)
  }, [show, showing, flawless, gameBoard, gameConstraints, gameMoves])

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

  useEffect(() => {
    if (show && fullScreen) {
      document.body.style.backgroundColor = theme.colors.teal[6]
    } else {
      document.body.style.backgroundColor = ''
    }

    return () => {
      document.body.style.backgroundColor = ''
    }
  }, [show, fullScreen, theme])

  return (
    <Modal
      opened={show}
      onClose={onNext}
      withCloseButton={false}
      size="md"
      radius="xl"
      fullScreen={fullScreen}
      overlayProps={ fullScreen ? { fixed: false, color: theme.colors.teal[6], backgroundOpacity: 1 } : { blur: 3 }}
      transitionProps={{ duration: 200, transition: 'fade-up' }}
      padding={0}
      centered>
      <Stack ref={ref} bg="teal.6" c="white" p="xl" justify="space-around" mih={ fullScreen ? '100dvh' : undefined }>
        <Stack align="center" gap={0}>
          {
            displayedFlawless ? (
              <Badge color="yellow" size="lg">Flawless</Badge>
            ) : (
              <Text size="xl" fw={700} tt="uppercase">Board Complete</Text>
            )
          }

          <Text fz="6em" fw={900} lh="normal">{ format(time * 1000) }</Text>
        </Stack>

        {
          displayedGameBoard && displayedGameConstraints && (
            <Stack>
              <Board board={displayedGameBoard} constraints={displayedGameConstraints} />

              {
                displayedMoves && (
                  <Slider className={styles.slider} value={sliderValue} size="lg" label={null} max={displayedMoves.length} onChange={handleSliderChange} />
                )
              }
            </Stack>
          )
        }

        <Group className={clsx(styles.buttons, compactButtons && styles.compact)} mt="lg">
          <Button variant="white" radius="lg" size="md" onClick={onReplay} ><IconReload /></Button>
          <Button variant="white" radius="lg" size="md" rightSection={<IconArrowNarrowRight />} onClick={onNext} data-autofocus>Play Next</Button>
          <Button variant="white" radius="lg" size="md" onClick={onShare}><IconShare3 /></Button>
        </Group>
      </Stack>

      <Confetti width={ref.current?.clientWidth} height={ref.current?.clientHeight} recycle={false} colors={colors} numberOfPieces={400} gravity={0.25} />
    </Modal>
  )
}

export default GameCompleteModal
