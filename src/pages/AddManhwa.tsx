import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, Upload, BookOpen, ArrowLeft, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Chapter {
  title: string;
  number: number;
  pages: string[];
}

const AddManhwa = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"ongoing" | "completed">("ongoing");
  const [rating, setRating] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const predefinedGenres = [
    "Fantasy", "Action", "Romance", "Comedy", "Drama", "Supernatural", 
    "School", "Magic", "Adventure", "Thriller", "Mystery", "Slice of Life",
    "Cyberpunk", "Historical", "Horror", "Sports", "Psychological"
  ];

  const addGenre = (genre: string) => {
    if (genre && !genres.includes(genre)) {
      setGenres([...genres, genre]);
      setNewGenre("");
    }
  };

  const removeGenre = (genreToRemove: string) => {
    setGenres(genres.filter(genre => genre !== genreToRemove));
  };

  const addChapter = () => {
    const newChapter: Chapter = {
      title: `Chapter ${chapters.length + 1}`,
      number: chapters.length + 1,
      pages: []
    };
    setChapters([...chapters, newChapter]);
  };

  const updateChapter = (index: number, field: keyof Chapter, value: any) => {
    const updatedChapters = [...chapters];
    updatedChapters[index] = { ...updatedChapters[index], [field]: value };
    setChapters(updatedChapters);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
    // Renumber remaining chapters
    const renumbered = chapters.filter((_, i) => i !== index).map((chapter, i) => ({
      ...chapter,
      number: i + 1
    }));
    setChapters(renumbered);
  };

  const addPageToChapter = (chapterIndex: number) => {
    const pageUrl = prompt("Enter page image URL:");
    if (pageUrl) {
      const updatedChapters = [...chapters];
      updatedChapters[chapterIndex].pages.push(pageUrl);
      setChapters(updatedChapters);
    }
  };

  const removePageFromChapter = (chapterIndex: number, pageIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].pages.splice(pageIndex, 1);
    setChapters(updatedChapters);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !author) {
      toast({
        title: "Missing Information",
        description: "Title and author are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert manhwa first
      const { data: manhwaData, error: manhwaError } = await supabase
        .from('manhwa')
        .insert({
          title,
          author,
          description,
          cover_image: coverImage,
          genre: genres,
          status,
          rating
        })
        .select()
        .single();

      if (manhwaError) throw manhwaError;

      // Insert chapters if any
      if (chapters.length > 0) {
        const chaptersToInsert = chapters.map(chapter => ({
          manhwa_id: manhwaData.id,
          title: chapter.title,
          chapter_number: chapter.number,
          pages: chapter.pages
        }));

        const { error: chaptersError } = await supabase
          .from('chapters')
          .insert(chaptersToInsert);

        if (chaptersError) throw chaptersError;
      }

      toast({
        title: "Success!",
        description: `Manhwa "${title}" added successfully with ${chapters.length} chapters.`,
      });

      navigate('/');
    } catch (error) {
      console.error('Error adding manhwa:', error);
      toast({
        title: "Error",
        description: "Failed to add manhwa. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <div className="flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Add New Manhwa</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
          {/* Manhwa Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Manhwa Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter manhwa title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="author">Author *</Label>
                  <Input
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Enter author name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter manhwa description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="Enter cover image URL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={(value: "ongoing" | "completed") => setStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (0-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value) || 0)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Genres</Label>
                <div className="flex gap-2 mb-2">
                  <Select value="" onValueChange={addGenre}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select a genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedGenres.map((genre) => (
                        <SelectItem key={genre} value={genre} disabled={genres.includes(genre)}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-1">
                    <Input
                      value={newGenre}
                      onChange={(e) => setNewGenre(e.target.value)}
                      placeholder="Custom genre"
                      className="w-32"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => addGenre(newGenre)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {genres.map((genre) => (
                    <Badge key={genre} variant="secondary" className="cursor-pointer">
                      {genre}
                      <X
                        className="w-3 h-3 ml-1"
                        onClick={() => removeGenre(genre)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chapters Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Chapters ({chapters.length})
                </span>
                <Button type="button" onClick={addChapter} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Chapter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {chapters.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No chapters added yet. Click "Add Chapter" to get started.</p>
                </div>
              ) : (
                chapters.map((chapter, index) => (
                  <Card key={index} className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div>
                            <Label htmlFor={`chapter-title-${index}`}>Chapter Title</Label>
                            <Input
                              id={`chapter-title-${index}`}
                              value={chapter.title}
                              onChange={(e) => updateChapter(index, 'title', e.target.value)}
                              placeholder="Enter chapter title"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`chapter-number-${index}`}>Chapter Number</Label>
                            <Input
                              id={`chapter-number-${index}`}
                              type="number"
                              value={chapter.number}
                              onChange={(e) => updateChapter(index, 'number', parseInt(e.target.value))}
                              min="1"
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeChapter(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Pages ({chapter.pages.length})</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addPageToChapter(index)}
                          >
                            <Image className="w-4 h-4 mr-2" />
                            Add Page
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {chapter.pages.map((page, pageIndex) => (
                            <div key={pageIndex} className="relative group">
                              <img 
                                src={page} 
                                alt={`Page ${pageIndex + 1}`}
                                className="w-full h-24 object-cover rounded border"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removePageFromChapter(index, pageIndex)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Publishing..." : "Publish Manhwa"}
            </Button>
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddManhwa;