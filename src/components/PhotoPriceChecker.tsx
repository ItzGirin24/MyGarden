import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle, Eye } from "lucide-react";
import { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { analyzeImage } from "@/lib/imageAnalysis";
import { useToast } from "@/hooks/use-toast";

interface AnalysisResult {
  commodity: string;
  confidence: number;
  estimatedPrice: {
    buy: number;
    sell: number;
    unit: string;
  };
  marketAverage?: number;
  priceRange: {
    min: number;
    max: number;
  };
}

const PhotoPriceChecker = () => {
  const [user] = useAuthState(auth);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File terlalu besar",
          description: "Ukuran file maksimal 5MB",
          variant: "destructive"
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast({
          title: "Format file tidak didukung",
          description: "Silakan pilih file gambar (JPG, PNG, JPEG)",
          variant: "destructive"
        });
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeImage(selectedFile);
      setAnalysisResult(result);
      toast({
        title: "Analisis selesai!",
        description: `Komoditas terdeteksi: ${result.commodity}`,
      });
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Gagal menganalisis gambar. Silakan coba lagi.');
      toast({
        title: "Analisis gagal",
        description: "Terjadi kesalahan saat menganalisis gambar",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Camera className="w-6 h-6" />
            Cek Harga via Foto
          </CardTitle>
          <CardDescription>
            Fitur ini memerlukan autentikasi. Silakan login untuk menggunakan fitur cek harga via foto.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Upload Foto Produk
          </CardTitle>
          <CardDescription>
            Upload foto produk pertanian Anda untuk mendapatkan estimasi harga real-time
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-full max-w-md h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Klik untuk upload foto atau drag & drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: JPG, PNG, JPEG • Max: 5MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex gap-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                {selectedFile ? 'Ganti Foto' : 'Pilih Foto'}
              </Button>

              {selectedFile && (
                <>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Menganalisis...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        Analisis Harga
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={resetAnalysis}
                    variant="outline"
                    size="sm"
                  >
                    Reset
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Hasil Analisis
            </CardTitle>
            <CardDescription>
              Estimasi harga berdasarkan analisis AI dan data pasar terkini
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Commodity Identification */}
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">{analysisResult.commodity}</h3>
              <Badge variant={analysisResult.confidence > 0.8 ? "default" : "secondary"}>
                Confidence: {Math.round(analysisResult.confidence * 100)}%
              </Badge>
            </div>

            {/* Price Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium">Harga AI</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <span className="text-sm">Harga Beli</span>
                    <span className="font-bold text-green-700 dark:text-green-300">
                      Rp {analysisResult.estimatedPrice.buy.toLocaleString('id-ID')}/{analysisResult.estimatedPrice.unit}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <span className="text-sm">Harga Jual</span>
                    <span className="font-bold text-blue-700 dark:text-blue-300">
                      Rp {analysisResult.estimatedPrice.sell.toLocaleString('id-ID')}/{analysisResult.estimatedPrice.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Data Pasar</h4>
                <div className="space-y-2">
                  {analysisResult.marketAverage && (
                    <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <span className="text-sm">Rata-rata Pasar</span>
                      <span className="font-bold text-orange-700 dark:text-orange-300">
                        Rp {analysisResult.marketAverage.toLocaleString('id-ID')}/{analysisResult.estimatedPrice.unit}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
                    <span className="text-sm">Rentang Harga</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Rp {analysisResult.priceRange.min.toLocaleString('id-ID')} - {analysisResult.priceRange.max.toLocaleString('id-ID')}/{analysisResult.estimatedPrice.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Rekomendasi</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Harga AI adalah estimasi berdasarkan kondisi pasar terkini</li>
                <li>• Periksa harga lokal di daerah Anda untuk akurasi terbaik</li>
                <li>• Pertimbangkan biaya transportasi dan kualitas produk</li>
                <li>• Konsultasikan dengan pedagang setempat untuk harga aktual</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PhotoPriceChecker;
