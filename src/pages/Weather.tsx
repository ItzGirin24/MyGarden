import Navigation from "@/components/Navigation";
import WeatherForecast from "@/components/WeatherForecast";
import Footer from "@/components/Footer";

const Weather = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <WeatherForecast />
      </main>
      <Footer />
    </div>
  );
};

export default Weather;
