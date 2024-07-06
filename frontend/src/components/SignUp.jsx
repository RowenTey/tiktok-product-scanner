import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";
const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const handleSubmit = (e) => {
    const user = {
      firstName: e.target[0].value,
      lastName: e.target[1].value,
      email: e.target[2].value,
      password: e.target[3].value,
      confirmPassword: e.target[4].value,
    };
    signup(user);
    e.preventDefault();
  };
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">New User</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input
          type="text"
          placeholder="First Name"
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        />
        <input
          type="text"
          placeholder="Last Name"
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          className="mb-4 p-2 border border-gray-300 rounded w-full max-w-md"
        />

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
      </form>
      <a
        className="underline py-4 text-sm hover:cursor-pointer"
        onClick={() => {
          navigate("/profile");
        }}
      >
        Already have an account?
      </a>
    </div>
  );
};

export default SignUp;
