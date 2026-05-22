export default function PostImage({
  src,
  alt = "",
  variant = "card",
  className = "",
}) {
  const variantClasses = {
    card: "h-48",
    modal: "h-56 max-h-[45vh] sm:max-h-[50vh]",
    preview: "h-48 min-h-[12rem] rounded-lg",
  };

  const heightClass = variantClasses[variant] ?? variantClasses.card;

  return (
    <div
      className={`w-full ${heightClass} bg-[#0A0A0A] flex items-center justify-center overflow-hidden ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-full max-h-full w-auto h-auto object-contain"
      />
    </div>
  );
}
