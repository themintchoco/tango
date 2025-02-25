import { ReactNode, useCallback } from 'react'

import { Center, Text, ThemeIcon } from '@mantine/core'
import { IconCircleFilled, IconMoonFilled } from '@tabler/icons-react'

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
    <Center className={styles.container} onClick={handleClick} onContextMenu={handleClick}>
      <ThemeIcon variant="white" bg={canToggle ? 'white' : 'gray.0'} color={children === 'O' ? 'yellow' : 'indigo'} size="xl">
        { 
          children === 'O' ? (
            <IconCircleFilled />
          ) : children === 'X' ? (
            <IconMoonFilled />
          ) : null
        }
      </ThemeIcon>
      <Text className={styles.right}>{ right }</Text>
      <Text className={styles.bottom}>{ bottom }</Text>
    </Center>
  )
}

export default Cell
