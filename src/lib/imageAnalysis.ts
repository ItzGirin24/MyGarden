export const analyzeImage = async (file: File): Promise<{
  commodity: string;
  confidence: number;
  estimatedPrice: {
    buy: number;
    sell: number;
    unit: string;
  };
  marketAverage?: number;
  priceRange: {
    min: number;
    max: number;
  };
}> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Convert file to base64
    const base64Data = await getFileAsBase64(file);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this agricultural product image and provide detailed price analysis. Return a JSON response with the following format:
{
  "commodity": "name of the agricultural commodity in Indonesian",
  "confidence": confidence_score_between_0_and_1,
  "estimatedPrice": {
    "buy": estimated_buy_price_per_kg_in_rupiah,
    "sell": estimated_sell_price_per_kg_in_rupiah,
    "unit": "kg"
  },
  "marketAverage": average_market_price_per_kg_in_rupiah,
  "priceRange": {
    "min": minimum_market_price_per_kg_in_rupiah,
    "max": maximum_market_price_per_kg_in_rupiah
  }
}

Common Indonesian agricultural commodities: padi (rice), jagung (corn), cabai (chili), bawang merah (shallot), tomat (tomato), kentang (potato), kubis (cabbage), wortel (carrot), dll.

Provide realistic market prices based on current Indonesian market conditions. Buy price should be lower than sell price. Market average should be between min and max range. Be conservative with confidence scores - only return high confidence (0.8+) if you're very sure about the identification.`
              },
              {
                inlineData: {
                  mimeType: file.type,
                  data: base64Data
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 512,
        }
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('No response from Gemini API');
    }

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate the response
    if (!result.commodity || typeof result.confidence !== 'number' || !result.estimatedPrice) {
      throw new Error('Invalid response structure');
    }

    // Ensure price ranges are reasonable
    const buyPrice = Math.max(1000, Math.min(50000, result.estimatedPrice.buy || 5000));
    const sellPrice = Math.max(buyPrice + 1000, Math.min(100000, result.estimatedPrice.sell || 8000));
    const marketAvg = result.marketAverage || Math.round((buyPrice + sellPrice) / 2);
    const minPrice = Math.max(1000, result.priceRange?.min || buyPrice - 2000);
    const maxPrice = Math.max(sellPrice + 2000, result.priceRange?.max || sellPrice + 5000);

    return {
      commodity: result.commodity,
      confidence: Math.max(0, Math.min(1, result.confidence)),
      estimatedPrice: {
        buy: buyPrice,
        sell: sellPrice,
        unit: result.estimatedPrice.unit || 'kg'
      },
      marketAverage: marketAvg,
      priceRange: {
        min: minPrice,
        max: maxPrice
      }
    };

  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

const getFileAsBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (data:image/jpeg;base64,)
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
