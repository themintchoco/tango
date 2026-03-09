import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@mantine/core/styles.css'
import { createTheme, MantineProvider } from '@mantine/core'

import './styles.css'
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
