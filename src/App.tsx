import { useEffect } from 'react'

import '@mantine/core/styles.css'
import { Anchor, Button, Container, Paper, Stack, Text, Title } from '@mantine/core'

import Board from './components/Board'
import useHash from './hooks/useHash'
import { IconReload } from '@tabler/icons-react'

function App() {
  const [hash, setHash] = useHash()

  useEffect(() => {
    if (!hash) setHash([...Array(10)].map(() => (Math.random()+1).toString(36)[2]).join(''))
  }, [hash, setHash])

  return (
    <Container size="xs" mt="xl">
      <Stack align="center" ta="center">
        <Title order={1}>Tango Unlimited</Title>
        <Board hash={hash} />
        <Text size="lg" fw={700}>Tango, now truly unlimited!</Text>
        <Text>All boards are randomly generated - no two are the same! To return to this board, save the link.</Text>
        <Paper withBorder px="lg" py="xs">{location.href}</Paper>
        <Button variant="filled" onClick={() => setHash('')} leftSection={<IconReload size={14} />}>Generate another</Button>
        <Text size="xs" mt="xl" mb="md">Inspired by the LinkedIn game Tango. Tango Unlimited is an independent product and is not affiliated with, nor has been authorized, sponsored, or otherwise approved by LinkedIn Corporation. Play the original game <Anchor href="https://www.linkedin.com/games/tango" target="_blank">here</Anchor>.</Text>
      </Stack>
    </Container>
  )
}

export default App
