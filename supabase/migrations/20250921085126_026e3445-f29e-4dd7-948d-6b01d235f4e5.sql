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

-- Insert sample data from existing static data
INSERT INTO public.manhwa (id, title, author, description, cover_image, genre, status, rating) VALUES 
('shadow-realm', 'Shadow Realm Chronicles', 'Kim Hana', 'A young warrior discovers mysterious powers that connect him to an ancient shadow realm. As dark forces threaten both worlds, he must master his abilities to save everything he holds dear.', 'src/assets/manhwa-1.jpg', ARRAY['Fantasy', 'Action', 'Supernatural'], 'ongoing', 4.8),
('neon-assassin', 'Neon Assassin', 'Park Jinho', 'In a cyberpunk future, a skilled assassin navigates the neon-lit streets while uncovering a conspiracy that threatens the entire city. Technology and martial arts collide in this thrilling adventure.', 'src/assets/manhwa-2.jpg', ARRAY['Cyberpunk', 'Action', 'Thriller'], 'ongoing', 4.7),
('elemental-academy', 'Elemental Academy', 'Lee Minseo', 'A prestigious magical academy trains young mages to master the elements. Follow the journey of a talented student as they navigate friendships, rivalries, and ancient mysteries.', 'src/assets/manhwa-3.jpg', ARRAY['Magic', 'School', 'Adventure'], 'completed', 4.9);

-- Insert sample chapters
INSERT INTO public.chapters (manhwa_id, title, chapter_number, pages, publish_date) VALUES 
('shadow-realm', 'The Awakening', 1, ARRAY['src/assets/manhwa-1.jpg'], '2024-01-15'),
('shadow-realm', 'First Steps', 2, ARRAY['src/assets/manhwa-1.jpg'], '2024-01-22'),
('shadow-realm', 'Dark Secrets', 3, ARRAY['src/assets/manhwa-1.jpg'], '2024-01-29'),
('neon-assassin', 'Night Hunter', 1, ARRAY['src/assets/manhwa-2.jpg'], '2024-02-01'),
('neon-assassin', 'Corporate Secrets', 2, ARRAY['src/assets/manhwa-2.jpg'], '2024-02-08'),
('elemental-academy', 'Welcome to Academy', 1, ARRAY['src/assets/manhwa-3.jpg'], '2024-01-10'),
('elemental-academy', 'Fire and Ice', 2, ARRAY['src/assets/manhwa-3.jpg'], '2024-01-17'),
('elemental-academy', 'The Final Test', 3, ARRAY['src/assets/manhwa-3.jpg'], '2024-01-24');