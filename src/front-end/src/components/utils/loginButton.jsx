import login from "../ui/login.svg";

export default function LoginButton() {
    return (
        <a href="/login" className=" rounded-full ring-1 ring-[var(--color-primary)] hover:opacity-80 cursor-pointer hover:drop-shadow-md hover:scale-[1.01] active:scale-100">
            <img src={login} alt="Login Icon" className="h-9" draggable={false}/>
        </a>
    );
}