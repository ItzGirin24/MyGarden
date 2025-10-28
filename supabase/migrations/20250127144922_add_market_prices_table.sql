-- Create market_prices table for crowdsourced price data
CREATE TABLE public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  commodity_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  location TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

-- Policies for market_prices
CREATE POLICY "Anyone can view market prices"
  ON public.market_prices FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert market prices"
  ON public.market_prices FOR INSERT
  WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own market prices"
  ON public.market_prices FOR UPDATE
  USING (auth.uid() = user_id);

-- Create index for better query performance
CREATE INDEX idx_market_prices_commodity ON public.market_prices(commodity_name);
CREATE INDEX idx_market_prices_location ON public.market_prices(location);
CREATE INDEX idx_market_prices_created_at ON public.market_prices(created_at DESC);

-- Create updated_at trigger
CREATE TRIGGER update_market_prices_updated_at
  BEFORE UPDATE ON public.market_prices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
