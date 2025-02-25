import { useCallback, useEffect, useState } from 'react'

import '@mantine/core/styles.css'
import { Anchor, Button, Container, Paper, Stack, Text, Title } from '@mantine/core'
import { useListState } from '@mantine/hooks'
import { IconReload } from '@tabler/icons-react'

import Game from './components/Game'
import useHash from './hooks/useHash'
import { newHash } from './utils/hash'


function App() {
  const [hash, setHash] = useHash()
  const [currentHash, setCurrentHash] = useState('')
  const [seeds, { append: appendSeed, shift: shiftSeeds, setItem: setSeeds }] = useListState<string>()

  useEffect(() => {
    if (seeds.length) {
      setHash(seeds[0])
      setCurrentHash(seeds[0])
    }

    if (seeds.length >= 2) return
    appendSeed(newHash())
  }, [seeds, setHash, setCurrentHash, appendSeed])

  useEffect(() => {
    if (hash === currentHash) return
    if (!hash) {
      shiftSeeds()
      return
    }

    setSeeds(0, hash)
  }, [hash, currentHash, setCurrentHash, shiftSeeds, setSeeds])

  const handleNext = useCallback(() => {
    shiftSeeds()
  }, [shiftSeeds])

  return (
    <Container size="xs" mt="xl">
      <Stack align="center" ta="center">
        <Title order={1}>Tango Unlimited</Title>
        <Game seeds={seeds} onNext={handleNext} />
        <Text size="lg" fw={700}>Tango, now truly unlimited!</Text>
        <Text>All boards are randomly generated - no two are the same! To return to this board, save the link.</Text>
        <Paper withBorder px="lg" py="xs">{location.href}</Paper>
        <Button variant="filled" onClick={handleNext} leftSection={<IconReload size={14} />}>Generate another</Button>
        <Text size="xs" mt="xl" mb="md">Inspired by the LinkedIn game Tango. Tango Unlimited is an independent product and is not affiliated with, nor has been authorized, sponsored, or otherwise approved by LinkedIn Corporation. Play the original game <Anchor href="https://www.linkedin.com/games/tango" target="_blank">here</Anchor>.</Text>
      </Stack>
    </Container>
  )
}

export default App
