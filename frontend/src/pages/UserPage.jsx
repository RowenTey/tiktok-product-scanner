import SignIn from "../components/SignIn";
import Profile from "../components/Profile";
import { useAuth } from "../store/auth-context";

const UserPage = () => {
  const { isLoggedIn } = useAuth();

  return !isLoggedIn ? <Profile /> : <SignIn />;
};

export default UserPage;
