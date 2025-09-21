import { useParams, useNavigate } from "react-router-dom";
import { manhwaData } from "@/data/manhwa";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { useState } from "react";

const ChapterReader = () => {
  const { id, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);

  const manhwa = manhwaData.find(m => m.id === id);
  const chapter = manhwa?.chapters.find(c => c.number === Number(chapterNumber));

  if (!manhwa || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Chapter not found</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const nextChapter = manhwa.chapters.find(c => c.number === chapter.number + 1);
  const prevChapter = manhwa.chapters.find(c => c.number === chapter.number - 1);

  const goToNextPage = () => {
    if (currentPage < chapter.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

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
              <h1 className="font-bold">Chapter {chapter.number}: {chapter.title}</h1>
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {chapter.pages.length}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {prevChapter && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${prevChapter.number}`)}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev Ch
                </Button>
              )}
              {nextChapter && (
                <Button 
                  size="sm"
                  onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${nextChapter.number}`)}
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
                onClick={() => navigate(`/manhwa/${manhwa.id}/chapter/${nextChapter.number}`)}
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