import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth-context";

const SignInPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            email: e.target[0].value,
            password: e.target[1].value,
        };
        console.log("Logging in: ", user);
        const resp = login(user);
        if (!resp) {
            console.log("Error logging in");
        }
        navigate("/");
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-stone-700 p-4">
        <h1 className="text-4xl font-bold mb-6 text-blue-600">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center mb-2">
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
                className="bg-blue-500 text-white py-2 px-4 mt-2 rounded hover:bg-blue-600 "
            >
                Sign In
            </button>
        </form>
        <a
            className="underline py-4 text-sm hover:cursor-pointer text-blue-500"
            onClick={() => {
                navigate("/signup");
            }}
        >
            Create an account
        </a>
        </div>
    );
};

export default SignInPage;