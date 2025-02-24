import { ReactNode } from 'react'

import { Center, Text, ThemeIcon } from '@mantine/core'
import { IconCircleFilled, IconMoonFilled } from '@tabler/icons-react'

import styles from './Cell.module.css'

interface CellProps {
  canToggle?: boolean
  onToggle?: () => void
  right?: string
  bottom?: string
  children?: ReactNode
}

const Cell = ({ canToggle = true, onToggle, right, bottom, children } : CellProps) => {
  return (
    <Center className={styles.container} onClick={canToggle ? onToggle : undefined}>
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
