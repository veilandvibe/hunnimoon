/**
 * OpenAI client initialization and configuration
 */

import OpenAI from 'openai'

// Validate environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set in environment variables')
}

// Initialize OpenAI client (server-side only)
export const openai = new OpenAI({
  apiKey: apiKey,
})
