<?php

namespace App\Service;

class YoutubeService
{
    public function toEmbedUrl(?string $url): ?string
    {
        if ($url === null || $url === '') {
            return null;
        }

        $videoId = $this->extractVideoId(trim($url));

        if ($videoId === null) {
            return null;
        }

        return 'https://www.youtube.com/embed/' . $videoId;
    }

    private function extractVideoId(string $url): ?string
    {
        if (preg_match(
            '~(?:youtube\.com/(?:watch\?v=|embed/|shorts/)|youtu\.be/)([a-zA-Z0-9_-]{11})~',
            $url,
            $matches
        )) {
            return $matches[1];
        }

        return null;
    }
}
