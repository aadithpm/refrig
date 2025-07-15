import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeContextProvider, useTheme } from './contexts/ThemeContext'
import App from './App.tsx'
import './index.scss'

const AppWithTheme: React.FC = () => {
  const { isDarkMode } = useTheme()

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode ? '#90caf9' : '#1976d2',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <AppWithTheme />
    </ThemeContextProvider>
  </React.StrictMode>,
)