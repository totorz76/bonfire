import { Link } from "react-router-dom";
import { getUserId } from "../../utils/user";

export default function AuthorLink({ user, userId, className = "" }) {
  const authorId = userId ?? getUserId(user);

  if (!user?.pseudo || !authorId) {
    return <span className={className}>{user?.pseudo}</span>;
  }

  return (
    <Link
      to={`/profile/${authorId}`}
      onClick={(e) => e.stopPropagation()}
      className={`text-left hover:text-[#E25822] transition cursor-pointer ${className}`}
    >
      {user.pseudo}
    </Link>
  );
}
