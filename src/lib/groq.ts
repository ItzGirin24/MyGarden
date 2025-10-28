export const getAIResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are MyGardenAssisten, a professional AI assistant specializing in agriculture and gardening. Respond in Indonesian with professional, structured, and interactive language. Use emojis appropriately, format information with bullet points, numbered lists, and bold text for clarity. Provide practical, evidence-based advice. Structure responses with clear sections when appropriate. Be helpful, accurate, and engaging.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content.trim();
    }

    return "Maaf, saya tidak dapat memproses pertanyaan Anda saat ini. Silakan coba lagi.";
  } catch (error) {
    console.error('Error calling Groq API:', error);

    // Enhanced rule-based responses with more intelligence
    const lowerMessage = message.toLowerCase();

    // Advanced pattern matching for agricultural questions
    if ((lowerMessage.includes('jagung') || lowerMessage.includes('corn')) &&
        (lowerMessage.includes('tanam') || lowerMessage.includes('plant'))) {
      return "Untuk menanam jagung di Indonesia, perhatikan hal berikut:\n\n🌱 **Waktu Tanam Optimal:**\n- Musim hujan: Oktober-Februari\n- Musim kemarau: April-Juni\n\n🌿 **Persiapan Tanah:**\n- pH tanah: 5.5-7.0\n- Drainase baik, hindari genangan\n- Tambahkan pupuk kandang 2-3 ton/ha\n\n📏 **Jarak Tanam:**\n- 75cm antar baris\n- 25cm antar tanaman\n- Kedalaman: 3-5cm\n\n💧 **Irigasi:**\n- Fase vegetatif: 2-3 hari sekali\n- Fase generatif: setiap hari\n\nPilih varietas unggul seperti Bisi-2 atau NK-33 untuk hasil maksimal.";
    }

    if ((lowerMessage.includes('harga') || lowerMessage.includes('price')) &&
        (lowerMessage.includes('cabai') || lowerMessage.includes('chili'))) {
      return "Informasi harga cabai di Indonesia (perkiraan):\n\n🌶️ **Cabai Merah Besar:**\n- Jakarta: Rp 25.000-45.000/kg\n- Surabaya: Rp 30.000-50.000/kg\n- Bandung: Rp 28.000-48.000/kg\n\n🌶️ **Cabai Rawit:**\n- Jakarta: Rp 35.000-55.000/kg\n- Surabaya: Rp 40.000-60.000/kg\n- Bandung: Rp 38.000-58.000/kg\n\n📈 **Faktor yang Mempengaruhi Harga:**\n- Musim panen\n- Kondisi cuaca\n- Permintaan pasar\n- Biaya transportasi\n\n💡 **Tips untuk Petani:**\n- Panen saat harga tinggi\n- Diversifikasi komoditas\n- Manfaatkan program asuransi pertanian";
    }

    if ((lowerMessage.includes('hama') || lowerMessage.includes('pest')) &&
        (lowerMessage.includes('padi') || lowerMessage.includes('rice'))) {
      return "Pengendalian hama wereng pada padi:\n\n🐛 **Identifikasi Hama:**\n- Wereng coklat: tubuh coklat, sayap transparan\n- Wereng hijau: tubuh hijau, aktif siang hari\n- Wereng putih: tubuh putih kekuningan\n\n🛡️ **Strategi Pengendalian:**\n\n1. **Pengendalian Kultur Teknis:**\n   - Sistem tanam legowo 2:1\n   - Penggunaan varietas tahan (Inpari-32, Ciherang)\n   - Pengaturan populasi tanaman\n\n2. **Pengendalian Hayati:**\n   - Lepaskan parasitoid Anagrus spp.\n   - Gunakan jamur Metarhizium anisopliae\n   - Dorong populasi predator alami\n\n3. **Pengendalian Kimiawi:**\n   - Insektisida sistemik (imidakloprid)\n   - Insektisida kontak (lambda-sihalotrin)\n   - Aplikasi tepat waktu saat populasi ≤ 5 ekor/tanaman\n\n📊 **Ambang Pengendalian:**\n- Wereng coklat: 25 ekor/tanaman\n- Wereng hijau: 50 ekor/tanaman\n\n⚠️ **Pencegahan:**\n- Rotasi tanaman\n- Pembersihan lahan\n- Pemupukan berimbang";
    }

    if (lowerMessage.includes('cuaca') || lowerMessage.includes('weather') ||
        lowerMessage.includes('prakiraan') || lowerMessage.includes('forecast')) {
      return "Informasi cuaca untuk pertanian di Indonesia:\n\n🌧️ **Musim Hujan (Oktober-Maret):**\n- Curah hujan tinggi: 200-400mm/bulan\n- Kelembaban udara: 70-90%\n- Suhu: 25-32°C\n- Cocok untuk: Padi, jagung, kedelai\n\n☀️ **Musim Kemarau (April-September):**\n- Curah hujan rendah: 50-150mm/bulan\n- Kelembaban udara: 60-80%\n- Suhu: 28-35°C\n- Cocok untuk: Kacang tanah, ubi kayu, cabai\n\n📱 **Sumber Informasi Cuaca:**\n- BMKG (Badan Meteorologi Klimatologi Geofisika)\n- Aplikasi: Info BMKG, Cuaca Indonesia\n- Website: bmkg.go.id\n\n💡 **Tips Memanfaatkan Cuaca:**\n- Tanam sesuai musim untuk hasil optimal\n- Gunakan sistem irigasi saat kemarau\n- Persiapkan drainase saat hujan\n- Monitor prakiraan cuaca harian";
    }

    if (lowerMessage.includes('pupuk') || lowerMessage.includes('fertilizer')) {
      return "Panduan pemupukan untuk tanaman:\n\n🌱 **Jenis Pupuk:**\n\n1. **Pupuk Organik:**\n   - Kompos: 2-3 ton/ha\n   - Pupuk kandang: 1-2 ton/ha\n   - Keunggulan: Meningkatkan struktur tanah\n\n2. **Pupuk Anorganik:**\n   - Urea (N): 200-300 kg/ha\n   - SP-36 (P): 100-150 kg/ha\n   - KCl (K): 100-200 kg/ha\n\n📅 **Waktu Pemupukan:**\n- Basal: Saat tanam (50%)\n- Susulan: 2-4 minggu setelah tanam (25%)\n- Top dressing: Saat pembungaan (25%)\n\n🧪 **Analisis Tanah:**\n- Lakukan tes pH tanah\n- Uji kandungan hara\n- Sesuaikan dosis berdasarkan hasil\n\n💡 **Tips Efektif:**\n- Jangan berlebihan (dapat merusak tanah)\n- Kombinasikan organik + anorganik\n- Perhatikan kondisi cuaca saat pemupukan";
    }

    if (lowerMessage.includes('irigasi') || lowerMessage.includes('watering') ||
        lowerMessage.includes('pengairan')) {
      return "Sistem irigasi yang efisien untuk pertanian:\n\n💧 **Jenis Sistem Irigasi:**\n\n1. **Irigasi Permukaan:**\n   - Banjir: Sederhana, cocok padi\n   - Alur: Efisien air, cocok jagung\n   - Ciprat: Hemat air, cocok sayuran\n\n2. **Irigasi Bawah Permukaan:**\n   - Drip irrigation: Presisi tinggi\n   - Sprinkler: Seragam, cocok lahan luas\n   - Pivot: Otomatis, efisien\n\n📏 **Kebutuhan Air Tanaman:**\n- Padi: 1.200-1.500 mm/musim\n- Jagung: 500-800 mm/musim\n- Cabai: 600-800 mm/musim\n\n⏰ **Jadwal Irigasi:**\n- Pagi hari: 05.00-08.00\n- Sore hari: 16.00-18.00\n- Hindari siang hari (penguapan tinggi)\n\n💡 **Teknologi Modern:**\n- Sensor kelembaban tanah\n- Irigasi otomatis\n- Aplikasi monitoring cuaca\n\n⚠️ **Masalah Umum:**\n- Genangan air berlebih\n- Kekeringan ekstrem\n- Kualitas air buruk";
    }

    // General agricultural assistant response
    return "**MyGardenAssisten - Asisten AI Pertanian Profesional**\n\nSelamat datang! Saya siap membantu Anda dengan berbagai aspek pertanian dan berkebun.\n\n🌾 **Layanan yang Tersedia:**\n\n**Budidaya Tanaman:**\n• Waktu tanam optimal berdasarkan musim\n• Teknik penanaman yang efisien\n• Perawatan tanaman komprehensif\n\n**Pengendalian Hama & Penyakit:**\n• Identifikasi hama penyakit yang akurat\n• Strategi pengendalian terintegrasi\n• Metode pencegahan efektif\n\n**Informasi Pasar:**\n• Analisis harga komoditas terkini\n• Tren pasar dan proyeksi\n• Strategi pemasaran optimal\n\n**Cuaca & Iklim:**\n• Prakiraan cuaca terkini\n• Dampak perubahan iklim\n• Rekomendasi adaptasi\n\n**Pupuk & Irigasi:**\n• Panduan pemupukan berimbang\n• Sistem irigasi efisien\n• Konservasi sumber daya air\n\nSilakan ajukan pertanyaan spesifik tentang pertanian, dan saya akan berikan rekomendasi praktis berdasarkan praktik pertanian modern dan berkelanjutan.";
  }
};
