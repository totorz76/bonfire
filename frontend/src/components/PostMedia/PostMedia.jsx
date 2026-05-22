import PostImage from "../PostImage/PostImage";
import YoutubeEmbed from "../YoutubeEmbed/YoutubeEmbed";

const API_BASE = "http://localhost:8000";

export default function PostMedia({ post, variant = "card", className = "" }) {
  if (post?.youtube_url) {
    return (
      <YoutubeEmbed
        embedUrl={post.youtube_url}
        variant={variant}
        className={className}
      />
    );
  }

  if (post?.image) {
    return (
      <PostImage
        src={`${API_BASE}${post.image}`}
        alt={post.title}
        variant={variant}
        className={className}
      />
    );
  }

  return null;
}
