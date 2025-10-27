import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import farmerSuccessImage from "@/assets/farmer-success.jpg";
import marketCropsImage from "@/assets/market-crops.jpg";

const NewsSection = () => {
  const articles = [
    {
      title: "Kisah Sukses: Pak Budi Tingkatkan Hasil Panen 200% dengan Diversifikasi 4 Komoditas",
      excerpt: "Petani di Bogor berbagi strategi sukses membagi lahan menjadi 4 bagian untuk menanam padi, jagung, cabai, dan sayuran secara bersamaan...",
      category: "Kisah Sukses",
      date: "15 Des 2024",
      author: "Tim MyGarden",
      image: farmerSuccessImage,
      featured: true
    },
    {
      title: "Pemerintah Naikkan Harga Pembelian Padi untuk Melindungi Petani",
      excerpt: "Kementerian Pertanian mengumumkan kenaikan HPP (Harga Pembelian Pemerintah) untuk GKP menjadi Rp 5.500/kg efektif bulan depan...",
      category: "Kebijakan",
      date: "12 Des 2024",
      author: "Redaksi",
      image: marketCropsImage,
      featured: false
    },
    {
      title: "Teknologi Irigasi Tetes: Hemat Air hingga 50% dan Tingkatkan Produktivitas",
      excerpt: "Panduan lengkap menggunakan sistem irigasi tetes modern yang terbukti meningkatkan efisiensi penggunaan air dan pupuk...",
      category: "Teknologi",
      date: "10 Des 2024",
      author: "Dr. Ahmad Santoso",
      image: marketCropsImage,
      featured: false
    },
    {
      title: "Cara Mengatasi Hama Wereng pada Padi: Panduan Praktis",
      excerpt: "Metode pengendalian hama wereng yang efektif dan ramah lingkungan, termasuk penggunaan predator alami dan pestisida organik...",
      category: "Panduan",
      date: "8 Des 2024",
      author: "Prof. Siti Nurhaliza",
      image: farmerSuccessImage,
      featured: false
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Kisah Sukses":
        return "bg-primary text-primary-foreground";
      case "Kebijakan":
        return "bg-accent text-accent-foreground";
      case "Teknologi":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <section id="news" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Berita & Kisah Inspiratif
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tetap update dengan informasi terbaru dan belajar dari kisah sukses petani lainnya
          </p>
        </div>

        {/* Featured Article */}
        <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-64 md:h-auto">
              <img 
                src={articles[0].image} 
                alt={articles[0].title}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-4 left-4 ${getCategoryColor(articles[0].category)}`}>
                {articles[0].category}
              </Badge>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="text-2xl md:text-3xl mb-3">{articles[0].title}</CardTitle>
                <CardDescription className="text-base">{articles[0].excerpt}</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{articles[0].date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{articles[0].author}</span>
                  </div>
                </div>
                <Button className="gap-2">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </div>
          </div>
        </Card>

        {/* Other Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                <CardDescription className="line-clamp-2">{article.excerpt}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  Baca Artikel
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
