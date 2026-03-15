import { Link } from "react-router-dom";
import Sign_in from "../ui/sign up.svg";

export default function Question_tag() {

    const handleClick = () => {
        window.location.href = "/";
    };

    return (
        <div className="mt-10">


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