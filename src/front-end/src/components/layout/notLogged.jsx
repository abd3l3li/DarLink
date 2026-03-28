import LoginButton from "../utils/loginButton.jsx";
import SignUpButton from "../utils/signUpButton.jsx";

export default function NotLogged() {
    return (
        <div className="flex items-center gap-3 sm:gap-5">
            <LoginButton />
            <SignUpButton />
        </div>
    );
}