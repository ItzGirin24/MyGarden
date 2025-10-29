export const analyzeImage = async (file: File): Promise<{
  commodity: string;
  confidence: number;
  estimatedWeight?: {
    amount: number;
    unit: string;
    confidence: number;
  };
  estimatedPrice: {
    buy: number;
    sell: number;
    unit: string;
  };
  totalPrice?: {
    buy: number;
    sell: number;
  };
  marketAverage?: number;
  priceRange: {
    min: number;
    max: number;
  };
}> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your_gemini_api_key_here') {
      throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in your .env file.');
    }

    // Convert file to base64
    const base64Data = await getFileAsBase64(file);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Analyze this agricultural product image and provide detailed price analysis including weight estimation. Return a JSON response with the following format:
{
  "commodity": "name of the agricultural commodity in Indonesian",
  "confidence": confidence_score_between_0_and_1,
  "estimatedWeight": {
    "amount": estimated_weight_in_kg,
    "unit": "kg",
    "confidence": weight_estimation_confidence_0_to_1
  },
  "estimatedPrice": {
    "buy": estimated_buy_price_per_kg_in_rupiah,
    "sell": estimated_sell_price_per_kg_in_rupiah,
    "unit": "kg"
  },
  "totalPrice": {
    "buy": estimated_buy_price_for_total_weight,
    "sell": estimated_sell_price_for_total_weight
  },
  "marketAverage": average_market_price_per_kg_in_rupiah,
  "priceRange": {
    "min": minimum_market_price_per_kg_in_rupiah,
    "max": maximum_market_price_per_kg_in_rupiah
  }
}

Common Indonesian agricultural commodities: padi (rice), jagung (corn), cabai (chili), bawang merah (shallot), tomat (tomato), kentang (potato), kubis (cabbage), wortel (carrot), dll.

IMPORTANT: Estimate the weight of the product shown in the image. For example:
- If you see a regular sack/bag (karungan biasa) of agricultural products like rice, corn, etc., estimate around 50kg (not 500kg)
- If you see smaller sacks/bags, estimate 25kg or 10kg based on size
- If you see loose produce, estimate based on visible quantity (e.g., a handful might be 1-2kg, a pile might be 5-10kg)
- If you see packaged goods, estimate based on standard packaging sizes
- For large industrial sacks, estimate 50-100kg maximum

Calculate totalPrice by multiplying estimatedPrice by estimatedWeight.amount.

Provide ACCURATE and CURRENT market prices based on the latest Indonesian market data as of 2024. Use REAL market data and be extremely precise with pricing. Here are current approximate prices for common commodities (update these with latest data):

- Beras (Rice): Buy Rp 9,000-12,000/kg, Sell Rp 10,000-14,000/kg
- Jagung (Corn): Buy Rp 4,000-6,000/kg, Sell Rp 5,000-7,000/kg
- Cabai Merah (Red Chili): Buy Rp 25,000-40,000/kg, Sell Rp 30,000-50,000/kg
- Bawang Merah (Shallot): Buy Rp 15,000-25,000/kg, Sell Rp 18,000-30,000/kg
- Tomat (Tomato): Buy Rp 8,000-15,000/kg, Sell Rp 10,000-18,000/kg
- Kentang (Potato): Buy Rp 6,000-10,000/kg, Sell Rp 8,000-12,000/kg
- Kubis (Cabbage): Buy Rp 5,000-8,000/kg, Sell Rp 6,000-10,000/kg
- Wortel (Carrot): Buy Rp 8,000-12,000/kg, Sell Rp 10,000-15,000/kg

Consider multiple factors for accuracy:
- Current season and harvest conditions
- Regional price variations across Indonesia (Java vs outer islands)
- Supply and demand dynamics
- Transportation costs
- Quality of the produce (freshness, size, grade)
- Recent market trends and economic factors
- Wholesale vs retail pricing differences

Buy price should be lower than sell price (typically 10-20% difference). Market average should be between min and max range. Be conservative with confidence scores - only return high confidence (0.8+) if you're very sure about the identification. Prioritize accuracy over speculation.`
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

    // Calculate total prices if weight is estimated
    let totalPrice;
    if (result.estimatedWeight && result.estimatedWeight.amount > 0) {
      totalPrice = {
        buy: Math.round(buyPrice * result.estimatedWeight.amount),
        sell: Math.round(sellPrice * result.estimatedWeight.amount)
      };
    }

    return {
      commodity: result.commodity,
      confidence: Math.max(0, Math.min(1, result.confidence)),
      estimatedWeight: result.estimatedWeight ? {
        amount: Math.max(0.1, Math.min(1000, result.estimatedWeight.amount || 1)),
        unit: result.estimatedWeight.unit || 'kg',
        confidence: Math.max(0, Math.min(1, result.estimatedWeight.confidence || 0.5))
      } : undefined,
      estimatedPrice: {
        buy: buyPrice,
        sell: sellPrice,
        unit: result.estimatedPrice.unit || 'kg'
      },
      totalPrice,
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
