import OpenAI from 'openai';

/**
 * Initializes the OpenAI client with the API key from environment variables.
 * Configured for GPT-5 with optimal settings for message personalization.
 * @returns {OpenAI} Configured OpenAI client instance.
 */
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage in React
});

export default openai;