import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets, MapPin, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const WeatherForecast = () => {
  const [currentWeather, setCurrentWeather] = useState({
    location: "Mendeteksi lokasi...",
    temperature: "--",
    condition: "Memuat...",
    humidity: "--",
    windSpeed: "--",
    rainChance: "--",
    lastUpdated: null
  });

  const [forecast, setForecast] = useState([
    { day: "Senin", temp: "--", condition: "--", rain: "--%", icon: Sun },
    { day: "Selasa", temp: "--", condition: "--", rain: "--%", icon: Cloud },
    { day: "Rabu", temp: "--", condition: "--", rain: "--%", icon: CloudRain },
    { day: "Kamis", temp: "--", condition: "--", rain: "--%", icon: CloudRain },
    { day: "Jumat", temp: "--", condition: "--", rain: "--%", icon: Cloud },
    { day: "Sabtu", temp: "--", condition: "--", rain: "--%", icon: Sun },
    { day: "Minggu", temp: "--", condition: "--", rain: "--%", icon: Sun },
  ]);

  const [alerts, setAlerts] = useState([
    {
      title: "Periode Ideal Penjemuran",
      description: "Cuaca cerah diprediksi pada Sabtu-Minggu. Waktu yang tepat untuk penjemuran panen.",
      type: "success"
    },
    {
      title: "Perhatian: Kelembaban Tinggi",
      description: "Rabu-Kamis: Kelembaban tinggi dapat meningkatkan risiko serangan jamur. Pertimbangkan penyemprotan preventif.",
      type: "warning"
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);

  // Get user's location and fetch weather
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentWeather(prev => ({
            ...prev,
            location: "Lokasi tidak dapat dideteksi. Menggunakan Bogor sebagai default."
          }));
          // Fallback to Bogor coordinates
          fetchWeatherData(-6.5963, 106.7972);
        }
      );
    } else {
      setCurrentWeather(prev => ({
        ...prev,
        location: "Geolocation tidak didukung browser. Menggunakan Bogor sebagai default."
      }));
      fetchWeatherData(-6.5963, 106.7972);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    setIsLoading(true);
    try {
      // Using OpenWeatherMap API (free tier) - more accurate with additional parameters
      const API_KEY = 'bd5e378503939ddaee76f12ad7a97608'; // Free API key

      // Get current weather with more details
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );

      if (!response.ok) {
        throw new Error(`Weather API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Get 5-day forecast for better accuracy
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=id`
      );

      let forecastData = null;
      if (forecastResponse.ok) {
        forecastData = await forecastResponse.json();
      }

      // Get precise location name using reverse geocoding
      const locationResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      const locationData = await locationResponse.json();
      const locationName = locationData[0] ?
        `${locationData[0].name}${locationData[0].state ? ', ' + locationData[0].state : ''}, ${locationData[0].country}` :
        `Koordinat: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;

      // More accurate weather condition mapping
      const weatherId = data.weather[0].id;
      const weatherMain = data.weather[0].main.toLowerCase();
      const weatherDescription = data.weather[0].description.toLowerCase();

      let condition = 'Cerah';
      let icon = Sun;

      // More precise weather condition mapping
      if (weatherId >= 200 && weatherId < 300) {
        condition = 'Badai Petir';
        icon = CloudRain;
      } else if (weatherId >= 300 && weatherId < 400) {
        condition = 'Gerimis';
        icon = CloudRain;
      } else if (weatherId >= 500 && weatherId < 600) {
        if (weatherId >= 520) {
          condition = 'Hujan Lebat';
        } else {
          condition = 'Hujan';
        }
        icon = CloudRain;
      } else if (weatherId >= 600 && weatherId < 700) {
        condition = 'Salju';
        icon = Cloud;
      } else if (weatherId >= 700 && weatherId < 800) {
        condition = 'Kabut';
        icon = Cloud;
      } else if (weatherId === 800) {
        condition = 'Cerah';
        icon = Sun;
      } else if (weatherId > 800 && weatherId < 900) {
        if (weatherId === 801) {
          condition = 'Sedikit Berawan';
        } else if (weatherId === 802) {
          condition = 'Berawan Sebagian';
        } else {
          condition = 'Berawan';
        }
        icon = Cloud;
      }

      // Calculate more accurate rain chance from forecast data
      let rainChance = '0%';
      if (forecastData && forecastData.list) {
        const next24Hours = forecastData.list.slice(0, 8); // Next 24 hours (3-hour intervals)
        const rainCount = next24Hours.filter(item =>
          item.weather[0].main.toLowerCase().includes('rain') ||
          (item.rain && item.rain['3h'] > 0)
        ).length;
        const calculatedRainChance = Math.round((rainCount / next24Hours.length) * 100);
        rainChance = `${calculatedRainChance}%`;
      } else {
        // Fallback to current rain data
        rainChance = data.rain ? `${Math.round(data.rain['1h'] || 0)}%` : '0%';
      }

      setCurrentWeather({
        location: locationName,
        temperature: `${Math.round(data.main.temp)}°C`,
        condition: condition,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${Math.round(data.wind.speed * 3.6)} km/h`,
        rainChance: rainChance,
        lastUpdated: new Date()
      });

      // Update forecast if available
      if (forecastData && forecastData.list) {
        updateForecast(forecastData);
      }

      // Generate agricultural alerts based on current weather
      generateAlerts(data, forecastData);

    } catch (error) {
      console.error('Error fetching weather:', error);
      setCurrentWeather(prev => ({
        ...prev,
        location: "Error mengambil data cuaca. Menggunakan data default.",
        temperature: "--°C",
        condition: "--",
        humidity: "--%",
        windSpeed: "--/h",
        rainChance: "--%"
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const updateForecast = (forecastData) => {
    const dailyForecasts = [];
    const today = new Date();

    // Group forecast by day
    const dailyData = {};
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayKey = date.toDateString();

      if (!dailyData[dayKey]) {
        dailyData[dayKey] = {
          temps: [],
          conditions: [],
          rains: [],
          date: date
        };
      }

      dailyData[dayKey].temps.push(item.main.temp);
      dailyData[dayKey].conditions.push(item.weather[0]);
      if (item.rain && item.rain['3h']) {
        dailyData[dayKey].rains.push(item.rain['3h']);
      }
    });

    // Create 7-day forecast
    Object.keys(dailyData).slice(0, 7).forEach((dayKey, index) => {
      const dayData = dailyData[dayKey];
      const avgTemp = dayData.temps.reduce((a, b) => a + b, 0) / dayData.temps.length;
      const mainCondition = dayData.conditions[0]; // Use first condition as representative

      // Map condition to icon
      let icon = Sun;
      const weatherId = mainCondition.id;
      if (weatherId >= 200 && weatherId < 600) {
        icon = CloudRain;
      } else if (weatherId >= 600 && weatherId < 800) {
        icon = Cloud;
      } else if (weatherId >= 800) {
        icon = Cloud;
      }

      // Calculate rain probability
      const rainProbability = dayData.rains.length > 0 ?
        Math.round((dayData.rains.length / dayData.conditions.length) * 100) : 0;

      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = index === 0 ? 'Hari Ini' : dayNames[dayData.date.getDay()];

      dailyForecasts.push({
        day: dayName,
        temp: `${Math.round(avgTemp)}°C`,
        condition: mainCondition.description,
        rain: `${rainProbability}%`,
        icon: icon
      });
    });

    setForecast(dailyForecasts);
  };

  const generateAlerts = (weatherData, forecastData = null) => {
    const newAlerts = [];
    const humidity = weatherData.main.humidity;
    const temp = weatherData.main.temp;
    const windSpeed = weatherData.wind.speed;
    const pressure = weatherData.main.pressure;
    const visibility = weatherData.visibility || 10000; // Default 10km if not available
    const rain = weatherData.rain ? weatherData.rain['1h'] || 0 : 0;

    // Advanced humidity analysis
    if (humidity > 85) {
      newAlerts.push({
        title: "Bahaya: Kelembaban Sangat Tinggi",
        description: `Kelembaban ${humidity}% meningkatkan risiko serangan jamur, busuk buah, dan penyakit bakteri. Segera semprot fungisida sistemik dan pastikan sirkulasi udara baik.`,
        type: "warning"
      });
    } else if (humidity > 75) {
      newAlerts.push({
        title: "Perhatian: Kelembaban Tinggi",
        description: `Kelembaban ${humidity}% dapat meningkatkan risiko serangan jamur. Monitor tanaman secara berkala dan siapkan fungisida preventif.`,
        type: "warning"
      });
    }

    // Advanced rain analysis
    if (rain > 10) {
      newAlerts.push({
        title: "Peringatan: Hujan Lebat",
        description: `Curah hujan ${rain}mm/jam dapat menyebabkan genangan dan erosi tanah. Pastikan sistem drainase berfungsi dan lindungi tanaman muda.`,
        type: "warning"
      });
    } else if (rain > 2) {
      newAlerts.push({
        title: "Hujan Ringan",
        description: `Curah hujan ${rain}mm/jam. Baik untuk irigasi alami, tapi monitor drainase untuk mencegah genangan.`,
        type: "info"
      });
    }

    // Temperature stress analysis
    if (temp > 38) {
      newAlerts.push({
        title: "Bahaya: Suhu Ekstrem Tinggi",
        description: `Suhu ${Math.round(temp)}°C dapat menyebabkan heat stress fatal pada tanaman. Segera berikan naungan dan irigasi tambahan.`,
        type: "warning"
      });
    } else if (temp > 35) {
      newAlerts.push({
        title: "Peringatan: Suhu Tinggi",
        description: `Suhu ${Math.round(temp)}°C dapat menyebabkan stres tanaman. Pastikan irigasi cukup dan pertimbangkan naungan siang hari.`,
        type: "warning"
      });
    } else if (temp < 15) {
      newAlerts.push({
        title: "Peringatan: Suhu Rendah",
        description: `Suhu ${Math.round(temp)}°C dapat memperlambat pertumbuhan tanaman. Lindungi tanaman muda dari dingin.`,
        type: "warning"
      });
    }

    // Wind analysis
    if (windSpeed > 15) {
      newAlerts.push({
        title: "Peringatan: Angin Kencang",
        description: `Kecepatan angin ${Math.round(windSpeed * 3.6)} km/h dapat merusak tanaman. Pastikan penyangga tanaman kuat dan lindungi tanaman muda.`,
        type: "warning"
      });
    }

    // Visibility and fog analysis
    if (visibility < 1000) {
      newAlerts.push({
        title: "Kabut Tebal",
        description: `Visibilitas rendah (${visibility}m) dapat mempengaruhi penyemprotan pestisida. Tunda aktivitas penyemprotan sampai visibilitas membaik.`,
        type: "info"
      });
    }

    // Forecast-based alerts
    if (forecastData && forecastData.list) {
      const next24Hours = forecastData.list.slice(0, 8);
      const rainForecast = next24Hours.filter(item =>
        item.weather[0].main.toLowerCase().includes('rain') ||
        (item.rain && item.rain['3h'] > 0.5)
      );

      if (rainForecast.length >= 4) { // More than 12 hours of rain
        newAlerts.push({
          title: "Prakiraan Hujan Berkepanjangan",
          description: "Diprediksi hujan dalam 24 jam ke depan. Persiapkan lahan untuk mengurangi dampak genangan dan penyakit.",
          type: "warning"
        });
      }

      // Temperature forecast analysis
      const tempForecast = next24Hours.map(item => item.main.temp);
      const minTemp = Math.min(...tempForecast);
      const maxTemp = Math.max(...tempForecast);

      if (maxTemp - minTemp > 15) {
        newAlerts.push({
          title: "Fluktuasi Suhu Besar",
          description: `Perbedaan suhu harian ${Math.round(maxTemp - minTemp)}°C dapat menyebabkan stres tanaman. Monitor kesehatan tanaman.`,
          type: "info"
        });
      }
    }

    // Optimal conditions for agricultural activities
    if (humidity < 50 && temp >= 25 && temp <= 32 && windSpeed < 10 && rain < 1) {
      newAlerts.push({
        title: "Kondisi Ideal untuk Penyemprotan",
        description: "Cuaca sangat baik untuk penyemprotan pestisida dan fungisida. Efektivitas tinggi dengan risiko drift minimal.",
        type: "success"
      });
    }

    if (humidity < 60 && temp > 28 && windSpeed < 5 && rain < 1) {
      newAlerts.push({
        title: "Kondisi Ideal Penjemuran",
        description: "Cuaca sempurna untuk penjemuran panen, benih, dan pengeringan hasil pertanian.",
        type: "success"
      });
    }

    // Pressure-based weather prediction
    if (pressure < 1000) {
      newAlerts.push({
        title: "Tekanan Udara Rendah",
        description: "Tekanan udara rendah menunjukkan potensi perubahan cuaca. Monitor perkembangan cuaca secara berkala.",
        type: "info"
      });
    }

    setAlerts(newAlerts.length > 0 ? newAlerts : [
      {
        title: "Kondisi Cuaca Normal",
        description: "Cuaca saat ini kondusif untuk aktivitas pertanian. Lanjutkan rutinitas perawatan tanaman dengan normal.",
        type: "success"
      }
    ]);
  };

  const refreshWeather = () => {
    getCurrentLocation();
  };

  return (
    <section id="weather" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Prakiraan Cuaca & Peringatan Dini
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Informasi cuaca akurat untuk membantu perencanaan pertanian Anda
          </p>
        </div>

        {/* Current Conditions */}
        <Card className="mb-8 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Kondisi Saat Ini - {currentWeather.location}
              </CardTitle>
              <CardDescription>
                {currentWeather.lastUpdated
                  ? `Diperbarui ${currentWeather.lastUpdated.toLocaleTimeString('id-ID')}`
                  : 'Memuat data cuaca...'
                }
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshWeather}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Sun className="w-12 h-12 text-secondary" />
                <p className="text-3xl font-bold">{currentWeather.temperature}</p>
                <p className="text-sm text-muted-foreground">{currentWeather.condition}</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Droplets className="w-8 h-8 text-accent" />
                <p className="text-2xl font-bold">{currentWeather.humidity}</p>
                <p className="text-sm text-muted-foreground">Kelembaban</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Wind className="w-8 h-8 text-primary" />
                <p className="text-2xl font-bold">{currentWeather.windSpeed}</p>
                <p className="text-sm text-muted-foreground">Kecepatan Angin</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CloudRain className="w-8 h-8 text-accent" />
                <p className="text-2xl font-bold">{currentWeather.rainChance}</p>
                <p className="text-sm text-muted-foreground">Peluang Hujan</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 7-Day Forecast */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          {forecast.map((day, index) => {
            const IconComponent = day.icon;
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{day.day}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <IconComponent className="w-10 h-10 mx-auto text-primary" />
                  <p className="text-2xl font-bold">{day.temp}</p>
                  <p className="text-xs text-muted-foreground">{day.condition}</p>
                  <div className="flex items-center justify-center gap-1">
                    <Droplets className="w-3 h-3 text-accent" />
                    <span className="text-xs">{day.rain}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground mb-4">Rekomendasi Pertanian</h3>
          {alerts.map((alert, index) => (
            <Card 
              key={index} 
              className={`border-l-4 ${
                alert.type === 'success' 
                  ? 'border-l-primary bg-primary/5' 
                  : 'border-l-secondary bg-secondary/5'
              }`}
            >
              <CardHeader>
                <CardTitle className="text-lg">{alert.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{alert.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WeatherForecast;