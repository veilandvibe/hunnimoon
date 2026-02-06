/**
 * OpenAI client initialization and configuration
 */

import OpenAI from 'openai'

// Initialize with a dummy key if not set (for build time)
// The actual key check happens at runtime in the API route
const apiKey = process.env.OPENAI_API_KEY || 'dummy-key-for-build'

// Initialize OpenAI client (server-side only)
export const openai = new OpenAI({
  apiKey: apiKey,
})
