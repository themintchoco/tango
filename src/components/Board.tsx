
import { AspectRatio, Center, Loader, Paper, SimpleGrid } from '@mantine/core'

import styles from './Board.module.css'
import Cell from './Cell'
import { ToggleDirection } from '@/types/ToggleDirection'

interface BoardProps {
  board: string
  constraints: string
  loading?: boolean
  onToggle?: (i: number, direction: ToggleDirection) => void
}

const Board = ({ board, constraints, loading, onToggle } : BoardProps) => {
  return (
    <>
      <Paper className={styles.container} shadow="md" radius="xl" p="sm">
        <Paper className={styles.innerContainer} shadow="0" radius="lg">
          <AspectRatio ratio={1} pos="relative">
            <Center>
              { loading && <Loader className={styles.loader} /> }
              <SimpleGrid className={styles.grid} cols={6} spacing={1} bg="gray.2" style={{ visibility: loading ? 'hidden' : undefined }}>
                {
                  board.split('').map((cell, i) => (
                    <Cell
                      key={i}
                      right={constraints[i+36] === '.' ? '' : constraints[i+36]}
                      bottom={constraints[i+72] === '.' ? '' : constraints[i+72]}
                      canToggle={constraints[i] === '.'}
                      onToggle={direction => onToggle?.(i, direction)}>{ cell }</Cell>
                  ))
                }
              </SimpleGrid>
            </Center>
          </AspectRatio>
        </Paper>
      </Paper>
    </>
  )
}

export default Board
