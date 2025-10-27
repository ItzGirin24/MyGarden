import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const MarketPrices = () => {
  // Sample data
  const priceData = [
    { date: "Sen", padi: 5200, jagung: 4800, cabai: 32000 },
    { date: "Sel", padi: 5300, jagung: 4850, cabai: 33000 },
    { date: "Rab", padi: 5250, jagung: 4900, cabai: 31500 },
    { date: "Kam", padi: 5400, jagung: 4950, cabai: 34000 },
    { date: "Jum", padi: 5450, jagung: 5000, cabai: 35000 },
    { date: "Sab", padi: 5500, jagung: 5100, cabai: 36000 },
    { date: "Min", padi: 5550, jagung: 5150, cabai: 35500 },
  ];

  const commodities = [
    { name: "Padi (GKP)", price: "Rp 5.550", unit: "/kg", change: "+6.7%", isUp: true },
    { name: "Jagung", price: "Rp 5.150", unit: "/kg", change: "+7.3%", isUp: true },
    { name: "Cabai Merah", price: "Rp 35.500", unit: "/kg", change: "+10.9%", isUp: true },
    { name: "Bawang Merah", price: "Rp 28.000", unit: "/kg", change: "-3.4%", isUp: false },
    { name: "Tomat", price: "Rp 8.500", unit: "/kg", change: "+5.2%", isUp: true },
    { name: "Kentang", price: "Rp 12.000", unit: "/kg", change: "+2.1%", isUp: true },
  ];

  const inputs = [
    { name: "Pupuk Urea (Subsidi)", price: "Rp 2.250", unit: "/kg" },
    { name: "Pupuk NPK (Subsidi)", price: "Rp 2.300", unit: "/kg" },
    { name: "Benih Padi IR64", price: "Rp 15.000", unit: "/kg" },
    { name: "Benih Jagung Hibrida", price: "Rp 85.000", unit: "/kg" },
  ];

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

        <Tabs defaultValue="commodities" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="commodities">Harga Jual Komoditas</TabsTrigger>
            <TabsTrigger value="inputs">Sarana Produksi</TabsTrigger>
          </TabsList>

          <TabsContent value="commodities" className="space-y-6">
            {/* Price Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {commodities.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <CardDescription>Harga Hari Ini</CardDescription>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
              ))}
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
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default MarketPrices;