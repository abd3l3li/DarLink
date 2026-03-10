import { Link } from "react-router-dom";
import privacy from "../ui/Privacy.png"; 

export default function Privacy() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      {/* Card */}
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm 
        border border-[var(--color-border-gray)] 
        max-w-[1000px] w-full flex items-center justify-between 
        p-16 gap-16">
            <div className="flex-1 flex justify-center">
            <img
                src={privacy}
                alt="Privacy Policy"
                className="object-contain"
                draggable={false}
            />
            </div>

            <div className="flex-1">

            <h2 className="text-[40px] font-bold text-[var(--color-text)]">
                Privacy Policy
            </h2>

            <p className="text-[var(--color-muted)] mt-4 max-w-[420px]">
               Your privacy is important to us. We are committed to protecting your personal information.
            </p>
            <ul className="text-(--color-muted) mt-4 max-w-105 list-disc pl-5">
              <li>We collect basic account information.</li>
              <li>We use data to improve our services.</li>
              <li>We do not sell your personal data.</li>
            </ul>

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