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

  const [apiCallCount, setApiCallCount] = useState(0);
  const [lastApiCall, setLastApiCall] = useState(0);

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
  const [locationError, setLocationError] = useState(false);

  // Get user's location and fetch weather
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          console.log('Location obtained:', {
            latitude,
            longitude,
            accuracy: `${accuracy.toFixed(0)} meters`,
            timestamp: new Date(position.timestamp).toISOString()
          });
          setLocationError(false);
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', {
            code: error.code,
            message: error.message,
            type: 'geolocation_error',
            timestamp: new Date().toISOString()
          });
          setLocationError(true);
          setCurrentWeather(prev => ({
            ...prev,
            location: "Izin lokasi ditolak. Menggunakan lokasi default."
          }));
          // Fallback to current user's approximate location based on IP
          // For Indonesia, use a more general fallback that tries to detect region
          getLocationFromIP();
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, // Increased timeout for better accuracy
          maximumAge: 300000 // 5 minutes cache
        }
      );
    } else {
      setLocationError(true);
      setCurrentWeather(prev => ({
        ...prev,
        location: "Geolocation tidak didukung. Menggunakan lokasi default."
      }));
      getLocationFromIP();
    }
  };

  const getLocationFromIP = async () => {
    try {
      // Use a free IP geolocation service to get approximate location
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        console.log('IP-based location:', data);
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);
        if (!isNaN(lat) && !isNaN(lon)) {
          fetchWeatherData(lat, lon);
          return;
        }
      }
    } catch (error) {
      console.log('IP geolocation failed, using default location');
    }

    // Final fallback - use Jakarta as default for Indonesia
    fetchWeatherData(-6.2088, 106.8456);
  };

  const requestLocationPermission = () => {
    setLocationError(false);
    getCurrentLocation();
  };

  const fetchWeatherData = async (lat, lon) => {
    setIsLoading(true);

    try {
      // Using Open-Meteo API (free, no API key required, 10,000 calls/day)
      // Get current weather and forecast in one request
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia/Jakarta&forecast_days=7`
      );

      if (!response.ok) {
        throw new Error(`Open-Meteo API request failed: ${response.status}`);
      }

      const data = await response.json();

      // Get location name using a free geocoding service
      let locationName = `Koordinat: ${lat.toFixed(4)}, ${lon.toFixed(4)}`;
      try {
        const locationResponse = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=id`
        );
        if (locationResponse.ok) {
          const locationData = await locationResponse.json();
          if (locationData.city && locationData.countryName) {
            locationName = `${locationData.city}, ${locationData.countryName}`;
          } else if (locationData.locality) {
            locationName = `${locationData.locality}, ${locationData.countryName || 'Indonesia'}`;
          }
        }
      } catch (locationError) {
        console.log('Location service failed, using coordinates');
      }

      // Open-Meteo weather code mapping
      const weatherCode = data.current.weather_code;
      let condition = 'Cerah';
      let icon = Sun;

      // Open-Meteo weather codes
      switch (weatherCode) {
        case 0: condition = 'Cerah'; icon = Sun; break;
        case 1: condition = 'Sebagian Berawan'; icon = Sun; break;
        case 2: condition = 'Berawan'; icon = Cloud; break;
        case 3: condition = 'Mendung'; icon = Cloud; break;
        case 45: condition = 'Kabut'; icon = Cloud; break;
        case 48: condition = 'Kabut Beku'; icon = Cloud; break;
        case 51: condition = 'Gerimis Ringan'; icon = CloudRain; break;
        case 53: condition = 'Gerimis'; icon = CloudRain; break;
        case 55: condition = 'Gerimis Lebat'; icon = CloudRain; break;
        case 56: condition = 'Gerimis Beku Ringan'; icon = CloudRain; break;
        case 57: condition = 'Gerimis Beku'; icon = CloudRain; break;
        case 61: condition = 'Hujan Ringan'; icon = CloudRain; break;
        case 63: condition = 'Hujan'; icon = CloudRain; break;
        case 65: condition = 'Hujan Lebat'; icon = CloudRain; break;
        case 66: condition = 'Hujan Beku Ringan'; icon = CloudRain; break;
        case 67: condition = 'Hujan Beku'; icon = CloudRain; break;
        case 71: condition = 'Salju Ringan'; icon = Cloud; break;
        case 73: condition = 'Salju'; icon = Cloud; break;
        case 75: condition = 'Salju Lebat'; icon = Cloud; break;
        case 77: condition = 'Butiran Salju'; icon = Cloud; break;
        case 80: condition = 'Hujan Ringan'; icon = CloudRain; break;
        case 81: condition = 'Hujan'; icon = CloudRain; break;
        case 82: condition = 'Hujan Lebat'; icon = CloudRain; break;
        case 85: condition = 'Salju Ringan'; icon = Cloud; break;
        case 86: condition = 'Salju Lebat'; icon = Cloud; break;
        case 95: condition = 'Badai Petir'; icon = CloudRain; break;
        case 96: condition = 'Badai Petir dengan Hail'; icon = CloudRain; break;
        case 99: condition = 'Badai Petir Berat dengan Hail'; icon = CloudRain; break;
        default: condition = 'Cerah'; icon = Sun;
      }

      // Calculate rain chance from hourly data (next 24 hours)
      const next24Hours = data.hourly.precipitation_probability.slice(0, 24);
      const avgRainChance = next24Hours.reduce((a, b) => a + b, 0) / next24Hours.length;
      const rainChance = `${Math.round(avgRainChance)}%`;

      setCurrentWeather({
        location: locationName,
        temperature: `${Math.round(data.current.temperature_2m)}°C`,
        condition: condition,
        humidity: `${data.current.relative_humidity_2m}%`,
        windSpeed: `${Math.round(data.current.wind_speed_10m)} km/h`,
        rainChance: rainChance,
        lastUpdated: new Date()
      });

      // Update forecast
      updateForecast(data);

      // Generate agricultural alerts based on current weather
      generateAlerts(data);

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

  const updateForecast = (data) => {
    const dailyForecasts = [];

    // Open-Meteo provides daily data directly
    data.daily.weather_code.forEach((code, index) => {
      // Map weather code to condition and icon
      let condition = 'Cerah';
      let icon = Sun;

      switch (code) {
        case 0: condition = 'Cerah'; icon = Sun; break;
        case 1: condition = 'Sebagian Berawan'; icon = Sun; break;
        case 2: condition = 'Berawan'; icon = Cloud; break;
        case 3: condition = 'Mendung'; icon = Cloud; break;
        case 45: condition = 'Kabut'; icon = Cloud; break;
        case 48: condition = 'Kabut Beku'; icon = Cloud; break;
        case 51: condition = 'Gerimis Ringan'; icon = CloudRain; break;
        case 53: condition = 'Gerimis'; icon = CloudRain; break;
        case 55: condition = 'Gerimis Lebat'; icon = CloudRain; break;
        case 56: condition = 'Gerimis Beku Ringan'; icon = CloudRain; break;
        case 57: condition = 'Gerimis Beku'; icon = CloudRain; break;
        case 61: condition = 'Hujan Ringan'; icon = CloudRain; break;
        case 63: condition = 'Hujan'; icon = CloudRain; break;
        case 65: condition = 'Hujan Lebat'; icon = CloudRain; break;
        case 66: condition = 'Hujan Beku Ringan'; icon = CloudRain; break;
        case 67: condition = 'Hujan Beku'; icon = CloudRain; break;
        case 71: condition = 'Salju Ringan'; icon = Cloud; break;
        case 73: condition = 'Salju'; icon = Cloud; break;
        case 75: condition = 'Salju Lebat'; icon = Cloud; break;
        case 77: condition = 'Butiran Salju'; icon = Cloud; break;
        case 80: condition = 'Hujan Ringan'; icon = CloudRain; break;
        case 81: condition = 'Hujan'; icon = CloudRain; break;
        case 82: condition = 'Hujan Lebat'; icon = CloudRain; break;
        case 85: condition = 'Salju Ringan'; icon = Cloud; break;
        case 86: condition = 'Salju Lebat'; icon = Cloud; break;
        case 95: condition = 'Badai Petir'; icon = CloudRain; break;
        case 96: condition = 'Badai Petir dengan Hail'; icon = CloudRain; break;
        case 99: condition = 'Badai Petir Berat dengan Hail'; icon = CloudRain; break;
        default: condition = 'Cerah'; icon = Sun;
      }

      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const date = new Date(data.daily.time[index]);
      const dayName = index === 0 ? 'Hari Ini' : dayNames[date.getDay()];

      // Calculate average temperature
      const avgTemp = (data.daily.temperature_2m_max[index] + data.daily.temperature_2m_min[index]) / 2;

      dailyForecasts.push({
        day: dayName,
        temp: `${Math.round(avgTemp)}°C`,
        condition: condition,
        rain: `${data.daily.precipitation_probability_max[index]}%`,
        icon: icon
      });
    });

    setForecast(dailyForecasts);
  };

  const generateAlerts = (data) => {
    const newAlerts = [];
    const humidity = data.current.relative_humidity_2m;
    const temp = data.current.temperature_2m;
    const windSpeed = data.current.wind_speed_10m;
    const rain = data.current.precipitation;

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
        description: `Kecepatan angin ${Math.round(windSpeed)} km/h dapat merusak tanaman. Pastikan penyangga tanaman kuat dan lindungi tanaman muda.`,
        type: "warning"
      });
    }

    // Forecast-based alerts using hourly data
    const next24Hours = data.hourly.precipitation_probability.slice(0, 24);
    const rainHours = next24Hours.filter(prob => prob > 50).length;

    if (rainHours >= 12) { // More than 12 hours of rain probability > 50%
      newAlerts.push({
        title: "Prakiraan Hujan Berkepanjangan",
        description: "Diprediksi hujan dalam 24 jam ke depan. Persiapkan lahan untuk mengurangi dampak genangan dan penyakit.",
        type: "warning"
      });
    }

    // Temperature forecast analysis
    const tempForecast = data.hourly.temperature_2m.slice(0, 24);
    const minTemp = Math.min(...tempForecast);
    const maxTemp = Math.max(...tempForecast);

    if (maxTemp - minTemp > 15) {
      newAlerts.push({
        title: "Fluktuasi Suhu Besar",
        description: `Perbedaan suhu harian ${Math.round(maxTemp - minTemp)}°C dapat menyebabkan stres tanaman. Monitor kesehatan tanaman.`,
        type: "info"
      });
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

        {/* Location Permission Notice */}
        {locationError && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">Izin Lokasi Diperlukan</p>
                    <p className="text-sm text-yellow-700">
                      Untuk mendapatkan cuaca real-time di lokasi Anda, izinkan akses lokasi di browser.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestLocationPermission}
                  className="border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  Izinkan Lokasi
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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