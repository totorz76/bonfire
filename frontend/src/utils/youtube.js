const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export function extractYoutubeVideoId(url) {
  if (!url?.trim()) {
    return null;
  }

  const match = url.trim().match(YOUTUBE_ID_REGEX);
  return match ? match[1] : null;
}

export function toYoutubeEmbedUrl(url) {
  const videoId = extractYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function isValidYoutubeUrl(url) {
  return toYoutubeEmbedUrl(url) !== null;
}
