// Helper function for retrying with exponential backoff
const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Only retry on 503 Service Unavailable (model overloaded)
      if (error instanceof Error && error.message.includes('503')) {
        if (attempt < maxRetries) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
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

export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key tidak ditemukan di environment variable');
    }

    const apiCall = async () => {
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
                    text: `You are MyGardenAssisten, a professional AI assistant specializing in agriculture and gardening. Respond in Indonesian. User question: ${message}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini API Error:", errText);
        throw new Error(`Request gagal: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
        ?? "⚠️ Tidak ada respons dari model Gemini.";
    };

    return await retryWithBackoff(apiCall, 3, 1000);
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return "❌ Terjadi kesalahan saat menghubungi Gemini API.";
  }
};
