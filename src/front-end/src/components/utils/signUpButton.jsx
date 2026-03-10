import { Link } from "react-router-dom";
import signUp from "../ui/sign up.svg";

export default function SignUpButton() {
    return (
        <Link to="/sign-up" className="cursor-pointer hover:opacity-80 hover:drop-shadow-md hover:scale-[1.01] active:scale-100">
            <img src={signUp} alt="Sign Up Icon" className="h-9" draggable={false}/>
        </Link>
    );
}