import { useParams } from "react-router-dom";
import Profile from "./Profile";

export default function ProfilePage() {
  const { userId } = useParams();

  return <Profile key={userId ?? "me"} />;
}
