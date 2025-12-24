/**
 * Utilitaires pour gérer les URLs de vidéos externes
 */

export type VideoSource = 'youtube' | 'vimeo' | 'dailymotion' | 'direct' | 'unknown';

export interface VideoInfo {
  source: VideoSource;
  id: string | null;
  embedUrl: string | null;
}

/**
 * Extrait l'ID d'une vidéo YouTube depuis différents formats d'URL
 */
export function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Extrait l'ID d'une vidéo Vimeo
 */
export function extractVimeoId(url: string): string | null {
  const pattern = /vimeo\.com\/(?:video\/)?(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Extrait l'ID d'une vidéo Dailymotion
 */
export function extractDailymotionId(url: string): string | null {
  const pattern = /dailymotion\.com\/video\/([^_\n?#]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * Détermine la source et génère l'URL d'embed
 */
export function getVideoInfo(url: string): VideoInfo {
  if (!url) {
    return { source: 'unknown', id: null, embedUrl: null };
  }

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = extractYouTubeId(url);
    return {
      source: 'youtube',
      id,
      embedUrl: id ? `https://www.youtube.com/embed/${id}` : null,
    };
  }

  // Vimeo
  if (url.includes('vimeo.com')) {
    const id = extractVimeoId(url);
    return {
      source: 'vimeo',
      id,
      embedUrl: id ? `https://player.vimeo.com/video/${id}` : null,
    };
  }

  // Dailymotion
  if (url.includes('dailymotion.com')) {
    const id = extractDailymotionId(url);
    return {
      source: 'dailymotion',
      id,
      embedUrl: id ? `https://www.dailymotion.com/embed/video/${id}` : null,
    };
  }

  // URL directe (MP4, WebM, etc.)
  if (url.match(/\.(mp4|webm|ogg)$/i)) {
    return {
      source: 'direct',
      id: null,
      embedUrl: url,
    };
  }

  return { source: 'unknown', id: null, embedUrl: null };
}
