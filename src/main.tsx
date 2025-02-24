import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { createTheme, MantineProvider } from '@mantine/core'

import App from './App.tsx'

const theme = createTheme({
  primaryColor: 'indigo',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </StrictMode>,
)
