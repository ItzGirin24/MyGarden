import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import MarketPrices from "@/components/MarketPrices";
import WeatherForecast from "@/components/WeatherForecast";
import NewsSection from "@/components/NewsSection";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <Hero />
        <MarketPrices />
        <WeatherForecast />
        <NewsSection />
        <AIChat />
      </main>
      <Footer />
    </div>
  );
};

export default Index;