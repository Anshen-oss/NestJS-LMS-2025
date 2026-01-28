"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, Upload } from "lucide-react";
import { useState } from "react";
import { VideoUpload } from "./VideoUpload";

interface VideoSourceSelectorProps {
  videoUrl?: string;
  videoKey?: string;
  externalVideoUrl?: string;
  onChange: (data: {
    videoUrl?: string;
    videoKey?: string;
    externalVideoUrl?: string;
  }) => void;
  disabled?: boolean;
}

export function VideoSourceSelector({
  videoUrl,
  videoKey,
  externalVideoUrl,
  onChange,
  disabled = false,
}: VideoSourceSelectorProps) {
  // Déterminer le mode initial
  const initialMode = externalVideoUrl ? "external" : videoUrl ? "upload" : "upload";
  const [mode, setMode] = useState<"upload" | "external">(initialMode);

  const handleModeChange = (newMode: "upload" | "external") => {
    setMode(newMode);

    // Réinitialiser les valeurs selon le mode
    if (newMode === "upload") {
      onChange({
        videoUrl: "",
        videoKey: "",
        externalVideoUrl: "",
      });
    } else {
      onChange({
        videoUrl: "",
        videoKey: "",
        externalVideoUrl: "",
      });
    }
  };

  const handleExternalUrlChange = (url: string) => {
    onChange({
      videoUrl: "",
      videoKey: "",
      externalVideoUrl: url,
    });
  };

  return (
    <div className="space-y-4">
      {/* Toggle entre Upload et URL externe */}
      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
        <Button
          type="button"
          variant={mode === "upload" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("upload")}
          disabled={disabled}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          Uploader une vidéo
        </Button>
        <Button
          type="button"
          variant={mode === "external" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleModeChange("external")}
          disabled={disabled}
          className="gap-2"
        >
          <Link className="h-4 w-4" />
          URL externe
        </Button>
      </div>

      {/* Contenu selon le mode */}
      {mode === "upload" ? (
        <VideoUpload
          videoUrl={videoUrl || ""}
          videoKey={videoKey || ""}
          onChange={(data) =>
            onChange({
              videoUrl: data.videoUrl,
              videoKey: data.videoKey,
              externalVideoUrl: "",
            })
          }
          onRemove={() =>
            onChange({
              videoUrl: "",
              videoKey: "",
              externalVideoUrl: "",
            })
          }
          disabled={disabled}
        />
      ) : (
        <div className="space-y-2">
          <Label htmlFor="external-video-url">
            URL de la vidéo (YouTube, Vimeo, etc.)
          </Label>
          <Input
            id="external-video-url"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={externalVideoUrl || ""}
            onChange={(e) => handleExternalUrlChange(e.target.value)}
            disabled={disabled}
          />
          <p className="text-sm text-muted-foreground">
            Formats supportés : YouTube, Vimeo, Dailymotion, ou lien direct MP4/WebM
          </p>

          {/* Preview de l'URL */}
          {externalVideoUrl && (
            <div className="mt-4 p-4 border rounded-lg bg-slate-50">
              <p className="text-sm font-medium mb-2">Aperçu :</p>
              <p className="text-sm text-slate-600 break-all">{externalVideoUrl}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
