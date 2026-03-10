import { Link } from "react-router-dom";
import Sign_in from "../ui/sign up.svg";

export default function Question_tag() {

    const handleClick = () => {
        window.location.href = "/";
    };

    return (
        <div className="mt-10">

            <button 
                    className="bg-[var(--color-primary)] text-[var(--color-surface)] px-4 py-2 flex items-center justify-center
                    rounded-full font-bold
                    transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5
                    h-11 w-34" onClick={handleClick}>
                SIGN UP
            </button>
            <p className="mt-6 text-gray-600">
                Already have an account?{" "}
                <Link
                    to="/log-in"
                    className="text-blue-600 font-medium hover:underline"
                >
                Login to your account
                </Link>
            </p>
        </div>
    );
}