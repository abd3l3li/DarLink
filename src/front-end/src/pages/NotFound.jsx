import { Link } from "react-router-dom";
import notFoundImg from "../components/ui/404.svg"; 
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      {/* Card */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm 
        border border-[var(--color-border-gray)] 
        max-w-[1000px] w-full flex items-center justify-between 
        p-16 gap-16">
            <div className="flex-1 flex justify-center">
            <img
                src={notFoundImg}
                alt="Page not found"
                className="w-[260px] object-contain"
                draggable={false}
            />
            </div>

            <div className="flex-1">

            <h1 className="text-[70px] font-bold text-[var(--color-text)]">
                404
            </h1>

            <h2 className="text-3xl font-semibold mt-2 text-[var(--color-text)]">
                Page Not Found
            </h2>

            <p className="text-[var(--color-muted)] mt-4 max-w-[420px]">
                Sorry, the page you are looking for doesn’t exist or has been moved.
            </p>

            <Link
                to="/"
                className="inline-block mt-6 bg-[var(--color-primary)] 
                text-white px-7 py-3 rounded-full font-medium 
                hover:opacity-90 transition"
            >
                Back to Home
            </Link>

            </div>

      </div>

    </div>
  );
}