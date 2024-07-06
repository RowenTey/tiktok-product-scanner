import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: e.target[0].value,
      password: e.target[1].value,
    };
    login(user);
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="email"
          placeholder="Email"
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 "
        >
          Sign In
        </button>
      </form>
      <a
        className="underline py-4 text-sm hover:cursor-pointer"
        onClick={() => {
          navigate("/signup");
        }}
      >
        Create an account
      </a>
    </div>
  );
};

export default SignIn;
