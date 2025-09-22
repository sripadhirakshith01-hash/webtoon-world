import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Star, Calendar, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { useManhwa } from "@/hooks/useManhwa";
import { Manhwa, Chapter } from "@/hooks/useManhwa";

const ManhwaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getManhwaById, getChaptersByManhwaId } = useManhwa();
  
  const [manhwa, setManhwa] = useState<Manhwa | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [manhwaData, chaptersData] = await Promise.all([
          getManhwaById(id),
          getChaptersByManhwaId(id)
        ]);
        
        setManhwa(manhwaData as Manhwa);
        setChapters(chaptersData);
      } catch (err) {
        console.error('Error fetching manhwa details:', err);
        setError('Failed to load manhwa details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, getManhwaById, getChaptersByManhwaId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading manhwa...</p>
        </div>
      </div>
    );
  }

  if (error || !manhwa) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Manhwa not found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="hover:bg-manhwa-hover"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent z-10" />
        <div 
          className="h-96 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${manhwa.cover_image || '/placeholder.svg'})` }}
        />
        <div className="absolute inset-0 z-20 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <img 
                src={manhwa.cover_image || '/placeholder.svg'} 
                alt={manhwa.title}
                className="w-48 h-72 object-cover rounded-lg shadow-2xl border border-border"
              />
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-foreground">{manhwa.title}</h1>
                  <p className="text-xl text-muted-foreground">by {manhwa.author}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{manhwa.rating}</span>
                  </div>
                  <Badge variant={manhwa.status === 'ongoing' ? 'default' : 'secondary'}>
                    {manhwa.status}
                  </Badge>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{chapters.length} chapters</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {manhwa.genre.map((genre) => (
                    <Badge key={genre} variant="outline">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Description */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              {manhwa.description || 'No description available.'}
            </p>

            {/* Chapters */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Chapters</h2>
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No chapters available yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {chapters.map((chapter) => (
                    <Card key={chapter.id} className="hover:bg-card/80 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold">
                              Chapter {chapter.chapter_number}: {chapter.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(chapter.publish_date).toLocaleDateString()}
                            </div>
                          </div>
                          <Button 
                            onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${chapter.id}`)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            Read
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {chapters.length > 0 && (
                    <Button 
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${chapters[0].id}`)}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Reading
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManhwaDetail;