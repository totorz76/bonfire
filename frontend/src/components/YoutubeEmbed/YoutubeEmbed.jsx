export default function YoutubeEmbed({ embedUrl, variant = "card", className = "" }) {
  const variantClasses = {
    card: "aspect-video h-48 max-h-48",
    modal: "aspect-video h-56 max-h-[45vh] sm:max-h-[50vh]",
    preview: "aspect-video h-48 min-h-[12rem] rounded-lg",
  };

  const sizeClass = variantClasses[variant] ?? variantClasses.card;

  if (!embedUrl) {
    return null;
  }

  return (
    <div
      className={`w-full ${sizeClass} bg-[#0A0A0A] overflow-hidden ${className}`}
    >
      <iframe
        src={embedUrl}
        title="Vidéo YouTube"
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
