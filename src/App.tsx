import { useState, useRef } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  CircularProgress,
  Paper
} from '@mui/material'
import { getApiUrl } from './utils/api'
import DarkModeToggle from './components/DarkModeToggle'
import './App.scss'

function App() {
  const [chips, setChips] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState('')
  const [hasStartedSearch, setHasStartedSearch] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const parseMultipleWords = (text: string): string[] => {
    return text
      .split(/[,\n]+/)
      .map(word => word.trim())
      .filter(word => word.length > 0)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    
    // Check if user typed a valid delimiter (comma or newline)
    if (value.match(/[,\n]$/)) {
      const textToProcess = value.slice(0, -1)
      
      // Parse all words from the input (handles pasted comma-separated lists)
      const newWords = parseMultipleWords(textToProcess)
      const uniqueNewWords = newWords.filter(word => !chips.includes(word))
      
      if (uniqueNewWords.length > 0) {
        setChips(prev => [...prev, ...uniqueNewWords])
      }
      setInputValue('')
    } else {
      setInputValue(value)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      setChips(prev => prev.slice(0, -1))
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // Parse all words from the input (handles pasted comma-separated lists)
      const newWords = parseMultipleWords(inputValue)
      const uniqueNewWords = newWords.filter(word => !chips.includes(word))
      
      if (uniqueNewWords.length > 0) {
        setChips(prev => [...prev, ...uniqueNewWords])
      }
      setInputValue('')
    }
  }

  const removeChip = (chipToRemove: string) => {
    setChips(prev => prev.filter(chip => chip !== chipToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (chips.length === 0) {
      return // Don't submit if no ingredients
    }
    
    setIsLoading(true)
    setRecipes('') // Clear previous recipes
    setHasStartedSearch(true) // Show the results box
    
    try {
      const itemsParam = chips.join(',')
      const url = getApiUrl(`/api/recipes?items=${encodeURIComponent(itemsParam)}`)
      
      const eventSource = new EventSource(url, {
        withCredentials: false
      })

      eventSource.onmessage = (event) => {
        // Handle completion signal
        if (event.data === "[DONE]") {
          eventSource.close();
          setIsLoading(false)
          return;
        }
        
        try {
          const data = JSON.parse(event.data)
          // Live update the recipes as data streams in
          setRecipes(prev => prev + (data.response || ""))
        } catch (parseError) {
          console.warn('Non-JSON SSE data received:', event.data)
          // Live update with raw data
          setRecipes(prev => prev + event.data)
        }
      }
      
      eventSource.onerror = (error) => {
        console.error('SSE error:', error)
        eventSource.close()
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error setting up recipe stream:', error)
      setIsLoading(false)
    }
  }

  return (
    <>
      <DarkModeToggle />
      <Container maxWidth="md" className="app-container">
        <Box className="form-container">
        <Typography variant="h5" className="form-title">
          What can we cook with? 🍕🥗
        </Typography>
        
        <Typography variant="body1" className="description">
          Got random leftovers cluttering up your fridge? Don't let that lonely carrot and mysterious cheese go to waste! 
          Add your ingredients below and let's get creative with some delicious recipes 🧑‍🍳✨
        </Typography>
        
        <form onSubmit={handleSubmit} className="word-form">
          <Box className="chip-input-wrapper">
            <Box className="chip-input-label">Enter ingredients</Box>
            <Box className="chips-and-input">
              {chips.map((chip, index) => (
                <Chip
                  key={`${chip}-${index}`}
                  label={chip}
                  onDelete={() => removeChip(chip)}
                  size="small"
                  className="inline-chip"
                />
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                ref={inputRef}
                className="inline-input"
              />
            </Box>
          </Box>
          
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            className="submit-button"
            disabled={isLoading || chips.length === 0}
          >
            {isLoading ? 'Finding Recipes...' : 'Find Recipes'}
          </Button>
        </form>

        {/* Recipe results - shows once search starts */}
        {hasStartedSearch && (
          <Paper className="recipe-results" elevation={2}>
            <Typography variant="h6" className="results-title">
              Recipe Suggestions
            </Typography>
            <Box className="recipe-content">
              {isLoading && recipes === '' ? (
                <Box className="loading-container">
                  <CircularProgress size={32} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Finding delicious recipes for you...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body1" component="pre" className="recipe-text">
                  {recipes}
                  {isLoading && (
                    <Box component="span" className="typing-indicator">
                      <CircularProgress size={16} sx={{ ml: 1 }} />
                    </Box>
                  )}
                </Typography>
              )}
            </Box>
          </Paper>
        )}
        </Box>
      </Container>
    </>
  )
}

export default App