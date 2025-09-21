import { manhwaData } from "@/data/manhwa";
import { ManhwaCard } from "@/components/ManhwaCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, BookOpen, Star } from "lucide-react";
import { useState } from "react";
import heroImage from "@/assets/hero-manhwa.jpg";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const allGenres = Array.from(new Set(manhwaData.flatMap(manhwa => manhwa.genre)));

  const filteredManhwa = manhwaData.filter(manhwa => {
    const matchesSearch = manhwa.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         manhwa.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || manhwa.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ManhwaHub
              </h1>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Manhwa
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <img 
          src={heroImage} 
          alt="Featured Manhwa"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold mb-4 text-foreground">
                Discover Amazing
                <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Manhwa Stories
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                Dive into captivating Korean webcomics with our comfortable reading experience
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{manhwaData.length} Manhwa</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  <span>High Quality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search manhwa or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedGenre === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(null)}
            >
              All
            </Button>
            {allGenres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>

        {/* Manhwa Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredManhwa.map((manhwa) => (
            <ManhwaCard key={manhwa.id} manhwa={manhwa} />
          ))}
        </div>

        {filteredManhwa.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No manhwa found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
