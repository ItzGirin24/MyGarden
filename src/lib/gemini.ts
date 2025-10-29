// Helper function for retrying with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 5,
  baseDelay: number = 500
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Retry on rate limits (429), service unavailable (503), or internal errors (500)
      if (error instanceof Error && (
        error.message.includes('429') ||
        error.message.includes('503') ||
        error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('504')
      )) {
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000; // Exponential backoff with jitter
          console.log(`Retrying Gemini API call in ${delay}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }

      // For other errors, don't retry
      throw error;
    }
  }

  throw lastError!;
};

// Rate limiting helper
class RateLimiter {
  private requests: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) { // 10 requests per minute
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async waitForSlot(): Promise<void> {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = Math.min(...this.requests);
      const waitTime = this.windowMs - (now - oldestRequest);
      console.log(`Rate limit reached, waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      return this.waitForSlot(); // Recheck after waiting
    }

    this.requests.push(now);
  }
}

const rateLimiter = new RateLimiter(10, 60000); // 10 requests per minute

export const getAIResponse = async (message: string, userName?: string): Promise<string> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key tidak ditemukan di environment variable');
    }

    // Wait for rate limit slot
    await rateLimiter.waitForSlot();

    const apiCall = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      try {
        const userContext = userName ? `Anda sedang berbicara dengan ${userName}.` : '';
        const prompt = `You are MyGardenAssisten, a friendly and interactive AI assistant specializing in agriculture and gardening. Respond in Indonesian naturally, like you're chatting with a friend. Be direct, conversational, and to the point - no markdown formatting, no bold text, no asterisks. Keep responses engaging but concise. ${userContext} User question: ${message}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024,
                topP: 0.8,
                topK: 40,
              },
              safetySettings: [
                {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                },
                {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
                }
              ],
            }),
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errText = await response.text();
          console.error("Gemini API Error:", errText);
          throw new Error(`Request gagal: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          ?? "⚠️ Tidak ada respons dari MyGardenAssisten.";
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    };

    return await retryWithBackoff(apiCall, 5, 500);
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    if (err instanceof Error && err.name === 'AbortError') {
      return "⏱️ Respons AI timeout. Silakan coba lagi.";
    }
    return "❌ Terjadi kesalahan saat menghubungi Gemini API. Silakan coba lagi.";
  }
};
