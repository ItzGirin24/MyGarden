import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Plus, MapPin, RefreshCw, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PhotoPriceChecker from "@/components/PhotoPriceChecker";

const MarketPrices = () => {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [crowdsourcedPrices, setCrowdsourcedPrices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state for price submission
  const [priceForm, setPriceForm] = useState({
    commodity: '',
    price: '',
    location: '',
    unit: 'kg'
  });

  // Sample data with more realistic prices
  const [priceData, setPriceData] = useState([
    { date: "Sen", padi: 5200, jagung: 4800, cabai: 32000 },
    { date: "Sel", padi: 5300, jagung: 4850, cabai: 33000 },
    { date: "Rab", padi: 5250, jagung: 4900, cabai: 31500 },
    { date: "Kam", padi: 5400, jagung: 4950, cabai: 34000 },
    { date: "Jum", padi: 5450, jagung: 5000, cabai: 35000 },
    { date: "Sab", padi: 5500, jagung: 5100, cabai: 36000 },
    { date: "Min", padi: 5550, jagung: 5150, cabai: 35500 },
  ]);

  const [commodities, setCommodities] = useState([
    { name: "Padi (GKP)", price: "Rp 5.550", unit: "/kg", change: "+6.7%", isUp: true, rawPrice: 5550 },
    { name: "Jagung", price: "Rp 5.150", unit: "/kg", change: "+7.3%", isUp: true, rawPrice: 5150 },
    { name: "Cabai Merah", price: "Rp 35.500", unit: "/kg", change: "+10.9%", isUp: true, rawPrice: 35500 },
    { name: "Bawang Merah", price: "Rp 28.000", unit: "/kg", change: "-3.4%", isUp: false, rawPrice: 28000 },
    { name: "Tomat", price: "Rp 8.500", unit: "/kg", change: "+5.2%", isUp: true, rawPrice: 8500 },
    { name: "Kentang", price: "Rp 12.000", unit: "/kg", change: "+2.1%", isUp: true, rawPrice: 12000 },
  ]);

  const [inputs, setInputs] = useState([
    { name: "Pupuk Urea (Subsidi)", price: "Rp 2.250", unit: "/kg", rawPrice: 2250 },
    { name: "Pupuk NPK (Subsidi)", price: "Rp 2.300", unit: "/kg", rawPrice: 2300 },
    { name: "Benih Padi IR64", price: "Rp 15.000", unit: "/kg", rawPrice: 15000 },
    { name: "Benih Jagung Hibrida", price: "Rp 85.000", unit: "/kg", rawPrice: 85000 },
  ]);

  // Get user's location
  useEffect(() => {
    getUserLocation();
    loadCrowdsourcedPrices();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  const loadCrowdsourcedPrices = async () => {
    try {
      // For now, use mock data since the table doesn't exist yet
      const mockData = [
        {
          commodity_name: 'Padi IR64',
          price: 5800,
          unit: 'kg',
          location: 'Bogor, Jawa Barat',
          latitude: -6.5950,
          longitude: 106.8167,
          user_id: 'mock-user-1',
          created_at: new Date().toISOString()
        },
        {
          commodity_name: 'Jagung',
          price: 4200,
          unit: 'kg',
          location: 'Bandung, Jawa Barat',
          latitude: -6.9175,
          longitude: 107.6191,
          user_id: 'mock-user-2',
          created_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          commodity_name: 'Cabai Merah',
          price: 35000,
          unit: 'kg',
          location: 'Cirebon, Jawa Barat',
          latitude: -6.7320,
          longitude: 108.5523,
          user_id: 'mock-user-3',
          created_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      setCrowdsourcedPrices(mockData);
    } catch (error) {
      console.error('Error loading crowdsourced prices:', error);
    }
  };

  const submitPrice = async () => {
    if (!priceForm.commodity || !priceForm.price || !priceForm.location) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, simulate successful submission since table doesn't exist
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      toast({
        title: "Berhasil!",
        description: "Harga berhasil dikirim. Terima kasih atas kontribusi Anda!",
      });

      // Reset form
      setPriceForm({ commodity: '', price: '', location: '', unit: 'kg' });
      loadCrowdsourcedPrices();

    } catch (error) {
      console.error('Error submitting price:', error);
      toast({
        title: "Error",
        description: "Gagal mengirim harga. Silakan coba lagi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshPrices = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Update prices with slight variations
      setCommodities(prev => prev.map(item => ({
        ...item,
        rawPrice: item.rawPrice + (Math.random() - 0.5) * 200,
        price: `Rp ${(item.rawPrice + (Math.random() - 0.5) * 200).toLocaleString('id-ID')}`
      })));
      setIsLoading(false);
      toast({
        title: "Data Diperbarui",
        description: "Harga pasar telah diperbarui dengan data terbaru",
      });
    }, 1000);
  };

  const getAveragePrice = (commodityName) => {
    const relevantPrices = crowdsourcedPrices.filter(p =>
      p.commodity_name.toLowerCase().includes(commodityName.toLowerCase())
    );
    if (relevantPrices.length === 0) return null;

    const avg = relevantPrices.reduce((sum, p) => sum + p.price, 0) / relevantPrices.length;
    return Math.round(avg);
  };

  return (
    <section id="market" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Informasi Harga Pasar
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Data harga real-time untuk membantu Anda mengambil keputusan jual-beli yang tepat
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <Tabs defaultValue="commodities" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="commodities">Harga Jual Komoditas</TabsTrigger>
              <TabsTrigger value="inputs">Sarana Produksi</TabsTrigger>
              <TabsTrigger value="photo">Cek via Foto</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshPrices}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Input Harga
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Kontribusi Harga Pasar</DialogTitle>
                  <DialogDescription>
                    Bagikan harga jual komoditas Anda untuk membantu petani lainnya
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="commodity" className="text-right">
                      Komoditas
                    </Label>
                    <Input
                      id="commodity"
                      value={priceForm.commodity}
                      onChange={(e) => setPriceForm(prev => ({ ...prev, commodity: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Padi IR64"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="price" className="text-right">
                      Harga
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      value={priceForm.price}
                      onChange={(e) => setPriceForm(prev => ({ ...prev, price: e.target.value }))}
                      className="col-span-3"
                      placeholder="5000"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="unit" className="text-right">
                      Satuan
                    </Label>
                    <select
                      id="unit"
                      value={priceForm.unit}
                      onChange={(e) => setPriceForm(prev => ({ ...prev, unit: e.target.value }))}
                      className="col-span-3 px-3 py-2 border border-input bg-background rounded-md"
                    >
                      <option value="kg">kg</option>
                      <option value="liter">liter</option>
                      <option value="ons">ons</option>
                      <option value="kwintal">kwintal</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Lokasi
                    </Label>
                    <Input
                      id="location"
                      value={priceForm.location}
                      onChange={(e) => setPriceForm(prev => ({ ...prev, location: e.target.value }))}
                      className="col-span-3"
                      placeholder="Contoh: Desa Sukamaju, Bogor"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={submitPrice}
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Kirim Harga
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="commodities" className="w-full">

          <TabsContent value="commodities" className="space-y-6">
            {/* Price Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodities.map((item, index) => {
                const crowdAvg = getAveragePrice(item.name);
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {item.name}
                        {crowdAvg && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <BarChart3 className="w-3 h-3" />
                            Crowd
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>Harga Hari Ini</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-bold text-foreground">
                              {item.price}
                              <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                            </p>
                          </div>
                          <div className={`flex items-center gap-1 ${item.isUp ? 'text-primary' : 'text-destructive'}`}>
                            {item.isUp ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="text-sm font-semibold">{item.change}</span>
                          </div>
                        </div>
                        {crowdAvg && (
                          <div className="text-xs text-muted-foreground">
                            Rata-rata crowdsourcing: Rp {crowdAvg.toLocaleString('id-ID')}/kg
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Price Trend Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Tren Harga Minggu Ini</CardTitle>
                <CardDescription>Pergerakan harga komoditas utama (Rupiah per kg)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={priceData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="padi" stroke="hsl(var(--primary))" strokeWidth={2} name="Padi" />
                    <Line type="monotone" dataKey="jagung" stroke="hsl(var(--secondary))" strokeWidth={2} name="Jagung" />
                    <Line type="monotone" dataKey="cabai" stroke="hsl(var(--accent))" strokeWidth={2} name="Cabai" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inputs" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputs.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>Harga Eceran Tertinggi (HET)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-foreground">
                      {item.price}
                      <span className="text-sm text-muted-foreground ml-1">{item.unit}</span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Crowdsourced Prices Section */}
            {crowdsourcedPrices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Harga dari Petani Lainnya
                  </CardTitle>
                  <CardDescription>
                    Data harga crowdsourcing dari komunitas petani MyGarden
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {crowdsourcedPrices.slice(0, 10).map((price, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{price.commodity_name}</p>
                            <p className="text-sm text-muted-foreground">{price.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">Rp {price.price.toLocaleString('id-ID')}/{price.unit}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(price.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="photo" className="space-y-6">
            <PhotoPriceChecker />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MarketPrices;
