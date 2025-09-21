-- Create manhwa table
CREATE TABLE public.manhwa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  genre TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('ongoing', 'completed')) DEFAULT 'ongoing',
  rating DECIMAL(2,1) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manhwa_id UUID NOT NULL REFERENCES public.manhwa(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  pages TEXT[] DEFAULT '{}',
  publish_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(manhwa_id, chapter_number)
);

-- Enable Row Level Security
ALTER TABLE public.manhwa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (anyone can read manhwa)
CREATE POLICY "Anyone can view manhwa" 
ON public.manhwa 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view chapters" 
ON public.chapters 
FOR SELECT 
USING (true);

-- For now, allow anyone to insert manhwa (you can restrict this later)
CREATE POLICY "Anyone can create manhwa" 
ON public.manhwa 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can create chapters" 
ON public.chapters 
FOR INSERT 
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_manhwa_updated_at
  BEFORE UPDATE ON public.manhwa
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();