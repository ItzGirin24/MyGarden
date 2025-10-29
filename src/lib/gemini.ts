export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    // ✅ Gunakan endpoint publik yang aktif & valid
    const GEMINI_MODEL = "gemini-1.5-flash-8b";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are MyGardenAssisten, a professional AI assistant specializing in agriculture and gardening. Respond in Indonesian with professional, structured, and interactive language. Use emojis appropriately, format information with bullet points, numbered lists, and bold text for clarity. Provide practical, evidence-based advice. Structure responses with clear sections when appropriate. Be helpful, accurate, and engaging.

User question: ${message}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    // 🔍 Tambahkan log error yang informatif
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      // Jika model tidak ditemukan
      if (response.status === 404) {
        throw new Error(
          "Model tidak ditemukan. Pastikan model menggunakan 'gemini-1.5-flash' atau 'gemini-1.5-flash-8b'."
        );
      }

      // Jika rate limit
      if (response.status === 429) {
        throw new Error(
          "Terlalu banyak permintaan ke Gemini API. Silakan tunggu beberapa saat dan coba lagi."
        );
      }

      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // ✅ Ambil hasil AI jika ada
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (textResponse) return textResponse;

    return "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);

    // ===== Fallback intelligent responses =====
    const lowerMessage = message.toLowerCase();

    if (
      (lowerMessage.includes("jagung") || lowerMessage.includes("corn")) &&
      (lowerMessage.includes("tanam") || lowerMessage.includes("plant"))
    ) {
      return "🌽 **Panduan Menanam Jagung di Indonesia:**\n\n🌦️ **Waktu Tanam Optimal:** Musim hujan (Okt–Feb) atau awal kemarau (Apr–Jun)\n🌿 **Persiapan Tanah:** pH 5.5–7.0, drainase baik, pupuk kandang 2–3 ton/ha\n📏 **Jarak Tanam:** 75×25cm, kedalaman 3–5cm\n💧 **Irigasi:** vegetatif 2–3 hari sekali, generatif tiap hari\n\nVarietas unggul: Bisi-2, NK-33.";
    }

    if (
      (lowerMessage.includes("harga") || lowerMessage.includes("price")) &&
      (lowerMessage.includes("cabai") || lowerMessage.includes("chili"))
    ) {
      return "🌶️ **Harga Cabai Terkini (perkiraan):**\n- Jakarta: Rp25–45 ribu/kg\n- Surabaya: Rp30–50 ribu/kg\n- Bandung: Rp28–48 ribu/kg\n\n📈 **Faktor:** musim, cuaca, permintaan pasar, transportasi.";
    }

    if (
      (lowerMessage.includes("hama") || lowerMessage.includes("pest")) &&
      (lowerMessage.includes("padi") || lowerMessage.includes("rice"))
    ) {
      return "🐛 **Hama Wereng Padi:**\n- Jenis: coklat, hijau, putih\n- Pengendalian: tanam legowo, varietas tahan, insektisida sistemik & hayati.\n- Ambang kendali: >25 ekor/tanaman.";
    }

    if (
      lowerMessage.includes("cuaca") ||
      lowerMessage.includes("weather") ||
      lowerMessage.includes("prakiraan")
    ) {
      return "🌦️ **Musim Hujan (Okt–Mar):** 200–400mm/bulan, cocok padi & jagung.\n☀️ **Musim Kemarau (Apr–Sep):** 50–150mm/bulan, cocok cabai & kacang tanah.";
    }

    if (lowerMessage.includes("pupuk") || lowerMessage.includes("fertilizer")) {
      return "🧪 **Panduan Pemupukan:**\n- Organik: 2–3 ton/ha\n- Urea: 200–300 kg/ha\n- SP-36: 100–150 kg/ha\n- KCl: 100–200 kg/ha\n\n⏱️ **Waktu:** tanam (50%), susulan (25%), pembungaan (25%).";
    }

    if (
      lowerMessage.includes("irigasi") ||
      lowerMessage.includes("watering") ||
      lowerMessage.includes("pengairan")
    ) {
      return "💧 **Sistem Irigasi:**\n- Permukaan: cocok padi\n- Drip: efisien untuk sayur\n- Sprinkler: lahan luas\n\n📏 Kebutuhan air: padi 1200–1500 mm/musim, cabai 600–800 mm/musim.";
    }

    // Default fallback
    return "🌾 **MyGardenAssisten** siap membantu pertanian & berkebun Anda!\n\nTanyakan tentang tanaman, cuaca, hama, pupuk, atau harga pasar untuk rekomendasi berbasis praktik terbaik pertanian modern.";
  }
};
