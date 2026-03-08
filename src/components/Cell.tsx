import { ReactNode, useCallback } from 'react'

import { Center, ThemeIcon } from '@mantine/core'
import { IconCircleFilled, IconEqual, IconMoonFilled, IconX } from '@tabler/icons-react'

import styles from './Cell.module.css'
import { ToggleDirection } from '@/types/ToggleDirection'

interface CellProps {
  canToggle?: boolean
  onToggle?: (direction: ToggleDirection) => void
  right?: string
  bottom?: string
  children?: ReactNode
}

const Cell = ({ canToggle = true, onToggle, right, bottom, children } : CellProps) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!canToggle) return

    if (e.type === 'contextmenu') {
      onToggle?.(ToggleDirection.Backward)
    } else {
      onToggle?.(ToggleDirection.Forward)
    }
  }, [canToggle, onToggle])

  return (
    <Center className={styles.container} onClick={handleClick} onContextMenu={handleClick} c="dark.3">
      <ThemeIcon variant="white" bg={canToggle ? 'white' : 'gray.0'} color={children === 'O' ? 'yellow' : 'indigo'} size="100%">
        { 
          children === 'O' ? (
            <IconCircleFilled size="45%" />
          ) : children === 'X' ? (
            <IconMoonFilled size="45%" />
          ) : null
        }
      </ThemeIcon>

      {
        right && (
          right === '=' ? <IconEqual size="35%" className={styles.right} /> : <IconX size="35%" className={styles.right} />
        )
      }

      {
        bottom && (
          bottom === '=' ? <IconEqual size="35%" className={styles.bottom} /> : <IconX size="35%" className={styles.bottom} />
        )
      }
    </Center>
  )
}

export default Cell
