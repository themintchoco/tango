import { useCallback, useEffect, useState } from 'react'

import { Group, Paper, Text } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { IconAlarm } from '@tabler/icons-react'

import styles from './Timer.module.css'

interface TimerProps {
  active: boolean
  onStart?: (value: number, handlers: { reset: () => void }) => void
  onStop?: (value: number, handlers: { reset: () => void }) => void
}

const Timer = ({ active, onStart, onStop } : TimerProps) => {
  const [reference, setReference] = useState(+new Date())
  const [value, setValue] = useState(0)
  const { start, stop, active: currentlyActive } = useInterval(() => setValue((+new Date() - reference) / 1000), 1000)

  const reset = useCallback(() => {
    setValue(0)
    setReference(+new Date())
  }, [])

  useEffect(() => {
    if (active && !currentlyActive) {
      start()
      onStart?.((+new Date() - reference) / 1000, { reset })
    }

    if (!active && currentlyActive) {
      stop()
      onStop?.((+new Date() - reference) / 1000, { reset })
    }

    return () => stop()
  }, [active, currentlyActive, reference, start, stop, onStart, onStop, reset])

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  return (
    <Paper radius="xl" withBorder mt="lg">
      <Group justify="space-around" px="md" py="xs">
        <IconAlarm />
        <Text className={styles.timer}>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</Text>
      </Group>
    </Paper>
  )
}

export default Timer
