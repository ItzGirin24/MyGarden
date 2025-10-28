import Navigation from "@/components/Navigation";
import MarketPrices from "@/components/MarketPrices";
import Footer from "@/components/Footer";

const Market = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        <MarketPrices />
      </main>
      <Footer />
    </div>
  );
};

export default Market;
