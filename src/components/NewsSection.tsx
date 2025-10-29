import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Edit } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, doc, deleteDoc } from "firebase/firestore";
import NewsAdmin from "./NewsAdmin";

interface NewsArticle {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsSection = () => {
  const [user] = useAuthState(auth);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.email === "mygardenid2025@gmail.com";

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const q = query(collection(db, "news"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const articlesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as NewsArticle[];
      setArticles(articlesData);
    } catch (error) {
      console.error("Error loading articles:", error);
      // Fallback to empty array if Firestore fails
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteArticle = async (articleId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus artikel ini?")) return;

    try {
      await deleteDoc(doc(db, "news", articleId));
      await loadArticles();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

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

  if (isLoading) {
    return (
      <section id="news" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>Memuat berita...</p>
          </div>
        </div>
      </section>
    );
  }

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

        {/* Admin Panel */}
        {isAdmin && <NewsAdmin loadArticles={loadArticles} />}

        {/* Featured Article */}
        {articles.length > 0 && (
          <Card className="mb-8 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-64 md:h-auto">
                <img
                  src={articles[0].thumbnailUrl || "/placeholder.svg"}
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
                      <span>{articles[0].createdAt?.toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{articles[0].author}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button className="gap-2">
                      Baca Selengkapnya
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => (window as any).openEditDialog?.(articles[0])}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteArticle(articles[0].id!)}
                        >
                          Hapus
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </div>
            </div>
          </Card>
        )}

        {/* Other Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(1).map((article) => (
            <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48">
                <img
                  src={article.thumbnailUrl || "/placeholder.svg"}
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
                    <span>{article.createdAt?.toLocaleDateString('id-ID')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{article.author}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    Baca Artikel
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                  {isAdmin && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => (window as any).openEditDialog?.(article)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteArticle(article.id!)}
                      >
                        Hapus
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
