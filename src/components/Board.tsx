import { useCallback, useEffect, useState } from 'react'

import { AspectRatio, Button, Center, Group, Loader, Modal, Paper, SimpleGrid } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import Cell from './Cell'
import styles from './Board.module.css'

interface BoardProps {
  hash: string
}

const Board = ({ hash } : BoardProps) => {
  const [loading, setLoading] = useState(true)
  const [board, setBoard] = useState(() => '.'.repeat(36))
  const [constraints, setConstraints] = useState(() => '.'.repeat(108))
  const [modalOpened, { open: modelOpen, close: modalClose }] = useDisclosure(false);

  useEffect(() => {
    if (!hash) return

    setLoading(true)
    fetch(`/api/random/${hash.slice(1)}`)
      .then(response => response.text())
      .then(data => {
        setBoard(data.slice(0, 36))
        setConstraints(data)
      })
      .finally(() => setLoading(false))

  }, [hash, setBoard, setConstraints, setLoading])

  useEffect(() => {
    if (board.includes('.')) return

    fetch(`/api/validate?board_data=${board}${constraints.slice(36)}`)
      .then(response => response.json())
      .then(data => {
        if (data.valid) {
          modelOpen()
        }
      })
  }, [board, constraints, modelOpen])

  const handleClear = useCallback(() => {
    setBoard(constraints.slice(0, 36))
  }, [constraints, setBoard])

  const handleShare = useCallback(() => {
    navigator.share({ url: location.href })
  }, [])

  const handlePlayAgain = useCallback(() => {
    window.location.hash = ''
    modalClose()
  }, [modalClose])

  return (
    <>
      <Paper shadow="md" radius="xl" p="xl" onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}>
        <AspectRatio ratio={1} pos="relative">
          <Center>
            { loading && <Loader className={styles.loader} /> }
            <SimpleGrid cols={6} spacing={1} bg="gray.2" style={{ visibility: loading ? 'hidden' : undefined }}>
              {
                board.split('').map((cell, i) => (
                  <Cell
                    key={i}
                    right={constraints[i+36] === '.' ? '' : constraints[i+36]}
                    bottom={constraints[i+72] === '.' ? '' : constraints[i+72]}
                    canToggle={constraints[i] === '.'}
                    onToggle={() => setBoard(board => board.slice(0, i) + (board[i] === 'O' ? 'X' : board[i] === 'X' ? '.' : 'O') + board.slice(i+1))}>{ cell }</Cell>
                ))
              }
            </SimpleGrid>
          </Center>
        </AspectRatio>
      </Paper>
      <Button variant="default" my="lg" onClick={handleClear}>Clear</Button>
      <Modal opened={modalOpened} onClose={modalClose} title="Complete!" centered>
        <Group>
          <Button variant="filled" onClick={handleShare}>Share</Button>
          <Button variant="default" onClick={handlePlayAgain}>Play another</Button>
        </Group>
      </Modal>
    </>
  )
}

export default Board
