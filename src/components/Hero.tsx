import { Button } from "@/components/ui/button";
import { Sprout, TrendingUp, Cloud, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-farm.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Indonesian Rice Fields"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="max-w-3xl animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <Sprout className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-primary">Platform Pendukung Petani Indonesia</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="text-foreground">MyGarden</span>
            <br />
            <span className="text-primary">Petani Sejahtera</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Informasi harga pasar real-time, prakiraan cuaca akurat, dan asisten AI cerdas
            untuk membantu petani Indonesia meraih hasil panen optimal.
          </p>

          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/about">
              <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all">
                <Sprout className="w-5 h-5" />
                Mulai Sekarang
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="gap-2">
                <BookOpen className="w-5 h-5" />
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="bg-primary/10 p-2 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Harga Pasar</p>
                <p className="text-sm text-muted-foreground">Data Real-Time</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="bg-accent/10 p-2 rounded-lg">
                <Cloud className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">Prakiraan Cuaca</p>
                <p className="text-sm text-muted-foreground">7-14 Hari</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-card/80 backdrop-blur-sm rounded-lg p-4 shadow-md">
              <div className="bg-secondary/10 p-2 rounded-lg">
                <Sprout className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-card-foreground">AI Tani Cerdas</p>
                <p className="text-sm text-muted-foreground">24/7 Konsultasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
