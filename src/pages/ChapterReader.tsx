import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Manhwa, Chapter } from "@/hooks/useManhwa";

const ChapterReader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [manhwa, setManhwa] = useState<Manhwa | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id || !chapterId) return;
      
      try {
        setLoading(true);
        
        // Fetch chapter details
        const { data: chapterData, error: chapterError } = await supabase
          .from('chapters')
          .select('*')
          .eq('id', chapterId)
          .single();

        if (chapterError) throw chapterError;
        
        // Fetch manhwa details
        const { data: manhwaData, error: manhwaError } = await supabase
          .from('manhwa')
          .select('*')
          .eq('id', id)
          .single();

        if (manhwaError) throw manhwaError;
        
        // Fetch all chapters for navigation
        const { data: chaptersData, error: chaptersError } = await supabase
          .from('chapters')
          .select('*')
          .eq('manhwa_id', id)
          .order('chapter_number', { ascending: true });

        if (chaptersError) throw chaptersError;
        
        setChapter(chapterData);
        setManhwa(manhwaData as Manhwa);
        setAllChapters(chaptersData);
      } catch (err) {
        console.error('Error fetching chapter data:', err);
        setError('Failed to load chapter');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, chapterId]);

  const nextChapter = allChapters.find(c => c.chapter_number === (chapter?.chapter_number || 0) + 1);
  const prevChapter = allChapters.find(c => c.chapter_number === (chapter?.chapter_number || 0) - 1);

  const goToNextPage = () => {
    if (chapter && currentPage < chapter.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !manhwa || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (chapter.pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No pages available</h1>
          <p className="text-muted-foreground mb-4">This chapter doesn't have any pages yet.</p>
          <Button onClick={() => navigate(`/manhwa/${manhwa.id}`)}>Back to Chapters</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Reader Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="hover:bg-manhwa-hover"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate(`/manhwa/${manhwa.id}`)}
                className="hover:bg-manhwa-hover"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {manhwa.title}
              </Button>
            </div>
            <div className="text-center">
              <h1 className="font-bold">Chapter {chapter.chapter_number}: {chapter.title}</h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {chapter.pages.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {prevChapter && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${prevChapter.id}`)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev Ch
                </Button>
              )}
              {nextChapter && (
                <Button 
                  size="sm"
                  onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${nextChapter.id}`)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next Ch
                  <ChevronRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Reader Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="relative max-w-4xl w-full">
          {/* Navigation Areas */}
          <div 
            className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer flex items-center justify-start pl-4"
            onClick={goToPrevPage}
          >
            {currentPage > 0 && (
              <div className="bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <ChevronLeft className="w-6 h-6" />
              </div>
            )}
          </div>
          
          <div 
            className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer flex items-center justify-end pr-4"
            onClick={goToNextPage}
          >
            {currentPage < chapter.pages.length - 1 && (
              <div className="bg-black/50 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <ChevronRight className="w-6 h-6" />
              </div>
            )}
          </div>

          {/* Page Image */}
          <img 
            src={chapter.pages[currentPage]} 
            alt={`${chapter.title} - Page ${currentPage + 1}`}
            className="w-full h-auto max-h-[90vh] object-contain mx-auto rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Reader Controls */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-full px-6 py-3 flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <span className="text-sm font-medium min-w-[100px] text-center">
          {currentPage + 1} / {chapter.pages.length}
        </span>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={goToNextPage}
          disabled={currentPage === chapter.pages.length - 1}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Chapter Navigation */}
      {(currentPage === chapter.pages.length - 1) && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-card/90 backdrop-blur-sm border border-border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground mb-3">Chapter Complete!</p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/manhwa/${manhwa.id}`)}
            >
              Back to Chapters
            </Button>
            {nextChapter && (
              <Button 
                size="sm"
                onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${nextChapter.id}`)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Next Chapter
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChapterReader;