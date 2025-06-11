import React from "react";

export interface YoutubeEmbedProps {
  videoId: string;
  width?: number | string;
  height?: number | string;
}

export default function YoutubeEmbed({
  videoId,
  width = 560,
  height = 315,
}: YoutubeEmbedProps) {
  return (
    <iframe
      width={width}
      height={height}
      src={`https://www.youtube-nocookie.com/embed/${videoId}`}
      title="YouTube video player"
      frameBorder="0"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      sandbox="allow-scripts allow-same-origin allow-presentation"
      style={{ maxWidth: "100%" }}
    />
  );
}
