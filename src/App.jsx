import { Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

export default function App() {

    return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-6">
        <Outlet />
        </main>
    </div>
    );
}
