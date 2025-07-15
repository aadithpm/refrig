import { useState, useRef } from 'react'
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Chip, 
  OutlinedInput,
  InputLabel,
  FormControl
} from '@mui/material'
import './App.scss'

function App() {
  const [chips, setChips] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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
    // Handle backspace when input is empty to remove last chip
    if (e.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      setChips(prev => prev.slice(0, -1))
    }
    // Handle Enter key
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
    
    try {
      // Simulate API call with 5 second delay
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      // Log all ingredients
      console.log('Ingredients for recipe search:', chips)
      
      // Here you would typically make an actual API call
      // const recipes = await fetchRecipes(chips)
      
    } catch (error) {
      console.error('Error finding recipes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          <FormControl fullWidth variant="outlined" className="chip-input-container">
            <InputLabel>Enter ingredients</InputLabel>
            <OutlinedInput
              label="Enter words"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              className="chip-input"
              startAdornment={
                <Box className="chips-in-input">
                  {chips.map((chip, index) => (
                    <Chip
                      key={`${chip}-${index}`}
                      label={chip}
                      onDelete={() => removeChip(chip)}
                      size="small"
                      className="inline-chip"
                    />
                  ))}
                </Box>
              }
            />
          </FormControl>
          
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
      </Box>
    </Container>
  )
}

export default App