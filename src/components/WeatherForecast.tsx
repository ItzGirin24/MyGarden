import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, Wind, Droplets } from "lucide-react";

const WeatherForecast = () => {
  const forecast = [
    { day: "Senin", temp: "28°C", condition: "Cerah", rain: "10%", icon: Sun },
    { day: "Selasa", temp: "29°C", condition: "Berawan", rain: "20%", icon: Cloud },
    { day: "Rabu", temp: "27°C", condition: "Hujan Ringan", rain: "60%", icon: CloudRain },
    { day: "Kamis", temp: "26°C", condition: "Hujan", rain: "80%", icon: CloudRain },
    { day: "Jumat", temp: "28°C", condition: "Berawan", rain: "30%", icon: Cloud },
    { day: "Sabtu", temp: "30°C", condition: "Cerah", rain: "5%", icon: Sun },
    { day: "Minggu", temp: "29°C", condition: "Cerah", rain: "10%", icon: Sun },
  ];

  const alerts = [
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
  ];

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
          <CardHeader>
            <CardTitle className="text-2xl">Kondisi Saat Ini - Bogor, Jawa Barat</CardTitle>
            <CardDescription>Diperbarui 5 menit yang lalu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex flex-col items-center gap-2">
                <Sun className="w-12 h-12 text-secondary" />
                <p className="text-3xl font-bold">28°C</p>
                <p className="text-sm text-muted-foreground">Cerah</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Droplets className="w-8 h-8 text-accent" />
                <p className="text-2xl font-bold">65%</p>
                <p className="text-sm text-muted-foreground">Kelembaban</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Wind className="w-8 h-8 text-primary" />
                <p className="text-2xl font-bold">12 km/h</p>
                <p className="text-sm text-muted-foreground">Kecepatan Angin</p>
              </div>
              <div className="flex flex-col items-center gap-2">
                <CloudRain className="w-8 h-8 text-accent" />
                <p className="text-2xl font-bold">10%</p>
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