/**
 * Get the base URL for API requests
 * In development, uses BASE_URL from environment or fallback
 * In production, uses relative URLs
 */
export const getBaseUrl = (): string => {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_BASE_URL || 'https://cleanfridge.xyz'
  }
  return ''
}

/**
 * Get the full API URL for a given endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = getBaseUrl()
  return `${baseUrl}${endpoint}`
}