# Build a React Recipe Finder App with SSE Streaming

Create a React + Vite application with TypeScript and SCSS that helps users find recipes based on ingredients. The app should have the following specifications:

## Tech Stack
- React 18 + Vite + TypeScript
- Material-UI (MUI) for components
- SCSS for styling
- Server-Sent Events (SSE) for real-time streaming

## Project Setup
1. Bootstrap with React + Vite + TypeScript template
2. Add Material-UI (@mui/material, @emotion/react, @emotion/styled, @mui/icons-material)
3. Add SCSS support (sass package)
4. Configure for Cloudflare Pages deployment with wrangler.toml

## Typography
- Title font: Domine (serif)
- All other text: Montserrat (sans-serif)
- Import fonts from Google Fonts
- Consistent color scheme using #4a4a4a for text

## UI Layout

### Page Structure
- Centered container with max-width
- Title: "What can we cook with? 🍕🥗"
- Description: Light-hearted 2-3 lines about using fridge leftovers creatively
- Main form with ingredient input and submit button

### Ingredient Input System
- Custom chip-based input field with MUI styling
- Users can type ingredients separated by commas, spaces, or newlines
- Each ingredient appears as a deletable chip inside the input box
- Chips wrap to new lines and input box expands vertically
- Input cursor appears inline next to chips (not separate input field)
- Parse multiple comma-separated words when pasting
- Enter key and comma/space create new chips
- Backspace on empty input removes last chip

### Submit Button
- "Find Recipes" button that's disabled when no ingredients
- Shows "Finding Recipes..." when loading

## Core Functionality

### API Integration
- Create utils/api.ts with environment-aware base URL helper
- Development: Route to production worker at cleanfridge.xyz
- Production: Use relative URLs
- Use VITE_BASE_URL environment variable from .env file

### SSE Streaming
- Make GET request to `/api/recipes?items=comma,separated,ingredients`
- Use EventSource for Server-Sent Events
- Handle JSON parsing of streaming data (data.response field)
- Handle "[DONE]" completion signal
- Include CORS configuration for cross-origin requests

### Real-time Results Display
- Results box hidden until first search
- Show loading spinner initially
- Stream recipe text in real-time as data arrives
- Small typing indicator while streaming
- Remove loading states when complete

## Styling Requirements
- Clean, modern design with proper spacing
- Consistent Montserrat font throughout (except title)
- Proper focus states and hover effects
- Mobile-responsive layout
- Bordered results box with scrollable content
- Chips with full-size text (no truncation)
- Input field with proper label positioning

## State Management
- Ingredient chips array
- Input value for current typing
- Loading state for streaming
- Recipe content that accumulates during streaming
- Flag to track if search has started (for showing results box)

## Error Handling
- Graceful JSON parsing fallbacks
- SSE connection error handling
- Empty ingredient validation
- Non-JSON SSE data handling

## File Structure
- Clean component organization
- SCSS files for styling
- Utils folder for API helpers
- Environment configuration with .env
- Proper TypeScript types throughout

## Key Features to Implement
1. Real-time ingredient chip management
2. SSE streaming with live text updates
3. Responsive design that works on all screen sizes
4. Environment-aware API routing
5. Professional food/cooking app aesthetic
6. Error handling and loading states
7. Accessibility considerations

The final app should feel like a modern, professional recipe discovery tool with real-time streaming capabilities and an intuitive ingredient input system.