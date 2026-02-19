import LoginButton from "./loginButton.jsx";
import SignUpButton from "./signUpButton.jsx";

export default function NotLogged() {
    return (
        <div className="flex items-center gap-5">
            <LoginButton />
            <SignUpButton />
        </div>
    );
}