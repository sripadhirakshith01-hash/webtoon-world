import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, BookOpen } from "lucide-react";
import { Manhwa } from "@/data/manhwa";
import { useNavigate } from "react-router-dom";

interface ManhwaCardProps {
  manhwa: Manhwa;
}

export const ManhwaCard = ({ manhwa }: ManhwaCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:shadow-[var(--manhwa-card-hover)] transition-all duration-300 hover:scale-105">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={manhwa.coverImage} 
          alt={manhwa.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            onClick={() => navigate(`/manhwa/${manhwa.id}`)}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Read Now
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{manhwa.rating}</span>
          <Badge variant={manhwa.status === 'ongoing' ? 'default' : 'secondary'} className="ml-auto">
            {manhwa.status}
          </Badge>
        </div>
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{manhwa.title}</h3>
        <p className="text-muted-foreground text-sm mb-2">by {manhwa.author}</p>
        <p className="text-sm line-clamp-2 mb-3">{manhwa.description}</p>
        <div className="flex flex-wrap gap-1">
          {manhwa.genre.slice(0, 2).map((genre) => (
            <Badge key={genre} variant="outline" className="text-xs">
              {genre}
            </Badge>
          ))}
          {manhwa.genre.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{manhwa.genre.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};