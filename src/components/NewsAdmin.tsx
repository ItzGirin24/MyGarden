import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Plus, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { NewsArticle } from "./NewsSection"; // Import the shared interface
import { supabase } from "@/integrations/supabase/client";

interface NewsAdminProps {
  loadArticles: () => Promise<void>;
}

const NewsAdmin = ({ loadArticles }: NewsAdminProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: ""
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadThumbnail = async (file: File): Promise<string> => {
    const filePath = `public/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from('MyGardenID')
      .upload(filePath, file);

    if (error) {
      throw new Error(`Supabase upload error: ${error.message}`);
    }

    const { data } = supabase.storage.from('MyGardenID').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const deleteThumbnail = async (url: string) => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      await supabase.storage.from('MyGardenID').remove([`public/${fileName}`]);
    } catch (error) {
      console.error("Error deleting thumbnail:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      let thumbnailUrl = editingArticle?.thumbnailUrl;

      // Upload new thumbnail if provided
      if (thumbnailFile) {
        if (editingArticle?.thumbnailUrl) {
          await deleteThumbnail(editingArticle.thumbnailUrl);
        }
        thumbnailUrl = await uploadThumbnail(thumbnailFile);
      }

      const articleData = {
        ...formData,
        thumbnailUrl,
        updatedAt: new Date()
      };

      if (editingArticle) {
        // Update existing article
        await updateDoc(doc(db, "news", editingArticle.id!), articleData);
      } else {
        // Create new article
        await addDoc(collection(db, "news"), {
          ...articleData,
          createdAt: new Date()
        });
      }

      await loadArticles();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving article:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditDialog = (article: NewsArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author
    });
    setThumbnailPreview(article.thumbnailUrl || "");
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      category: "",
      author: ""
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setEditingArticle(null);
  };

  // Expose the openEditDialog function globally so NewsSection can call it
  (window as any).openEditDialog = openEditDialog;

  return (
    <div className="mb-8">
      <Card className="bg-muted/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manajemen Berita</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Tambah Berita
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingArticle ? "Edit Berita" : "Tambah Berita Baru"}
                </DialogTitle>
                <DialogDescription>
                  Isi formulir di bawah ini untuk {editingArticle ? "memperbarui" : "membuat"} artikel berita.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Judul</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ringkasan</label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Konten Lengkap</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={8}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Kategori</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="Kisah Sukses, Kebijakan, Teknologi, dll"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Penulis</label>
                    <Input
                      value={formData.author}
                      onChange={(e) => setFormData({...formData, author: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Thumbnail</label>
                  <div className="flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {thumbnailPreview && (
                      <div className="relative">
                        <img
                          src={thumbnailPreview}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 w-6 h-6 p-0"
                          onClick={() => {
                            setThumbnailFile(null);
                            setThumbnailPreview("");
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingArticle ? "Update" : "Simpan")}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
      </Card>
    </div>
  );
};

export default NewsAdmin;
