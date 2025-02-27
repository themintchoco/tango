import { useEffect, useState } from 'react'

import { Group, Paper, Text } from '@mantine/core'
import { useInterval } from '@mantine/hooks'
import { IconAlarm } from '@tabler/icons-react'

interface TimerProps {
  active: boolean
  onStart?: (value: number, handlers: { reset: () => void }) => void
  onStop?: (value: number, handlers: { reset: () => void }) => void
}

const Timer = ({ active, onStart, onStop } : TimerProps) => {
  const [reference, setReference] = useState(+new Date())
  const [value, setValue] = useState(0)
  const { start, stop, active: currentlyActive } = useInterval(() => setValue((+new Date() - reference) / 1000), 1000)

  useEffect(() => {
    const reset = () => {
      setValue(0)
      setReference(+new Date())
    }

    if (active && !currentlyActive) {
      start()
      onStart?.(value, { reset })
    }

    if (!active && currentlyActive) {
      stop()
      onStop?.(value, { reset })
    }

    return () => stop()
  }, [active, currentlyActive, value, start, stop, onStart, onStop])

  const minutes = Math.floor(value / 60)
  const seconds = Math.floor(value % 60)

  return (
    <Paper radius="xl" withBorder mt="lg">
      <Group justify="space-around" px="md" py="xs">
        <IconAlarm />
        <Text>{`${minutes}:${seconds.toString().padStart(2, '0')}`}</Text>
      </Group>
    </Paper>
  )
}

export default Timer
