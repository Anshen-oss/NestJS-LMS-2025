"use client";

import { Play, Pause, Clock, Calendar, Download, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import Image from "next/image";

interface PodcastCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  publishDate: string;
  imageUrl?: string;
  audioUrl: string;
  host: {
    name: string;
    avatar?: string;
  };
  category?: string;
  isNew?: boolean;
  variant?: "default" | "compact" | "featured";
  className?: string;
}

export function PodcastCard({
  id,
  title,
  description,
  duration,
  publishDate,
  imageUrl,
  audioUrl,
  host,
  category,
  isNew = false,
  variant = "default",
  className = "",
}: PodcastCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Ici vous pouvez ajouter la logique pour jouer/pauser l'audio
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (variant === "compact") {
    return (
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {/*   <Image
                src={imageUrl || "/placeholder.png"}
                alt={title}
                className="w-16 h-16 rounded-lg object-cover"
                width="400"
                height="300"
              /> */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3 ml-0.5" />
                )}
              </Button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isNew && (
                  <Badge variant="secondary" className="text-xs">
                    Nouveau
                  </Badge>
                )}
                {category && (
                  <Badge variant="outline" className="text-xs">
                    {category}
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {duration}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {formatDate(publishDate)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "featured") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-lg transition-shadow ${className}`}
      >
        <div className="relative">
          {/*     <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="w-full h-48"
            height="300"
            width="400"
          /> */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              {isNew && (
                <Badge className="bg-red-500 hover:bg-red-600">Nouveau</Badge>
              )}
              {category && <Badge variant="secondary">{category}</Badge>}
            </div>
            <h3 className="font-bold text-white text-xl mb-2 line-clamp-2">
              {title}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={host.avatar || "/placeholder.png"} />
                  <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-white text-sm">{host.name}</span>
              </div>
              <Button
                size="lg"
                className="rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-1" />
                )}
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {duration}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(publishDate)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant par défaut
  return (
    <Card
      className={`overflow-hidden hover:shadow-md transition-shadow ${className}`}
    >
      <CardHeader className="p-0">
        <div className="relative">
          {/*   <Image
            src={imageUrl || "/placeholder.png"}
            alt={title}
            className="w-full h-48 object-cover"
            width="500"
            height="300"
          /> */}
          <Button
            size="lg"
            className="absolute top-0 right-4 rounded-full shadow-lg"
            onClick={handlePlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-1" />
            )}
          </Button>
          {isNew && (
            <Badge className="absolute top- left-4 bg-red-500 hover:bg-red-600">
              Nouveau
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={host.avatar || "/placeholder.svg"} />
            <AvatarFallback>{host.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{host.name}</span>
          {category && (
            <Badge variant="outline" className="ml-auto">
              {category}
            </Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(publishDate)}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
