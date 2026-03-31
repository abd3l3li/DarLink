import { Link } from "react-router-dom";
import contact from "../ui/Contact.png"; 

export default function Contact() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm 
        border border-[var(--color-border-gray)] 
        max-w-[1000px] w-full flex items-center justify-between 
        p-16 gap-16">
            <div className="flex-1 flex justify-center">
            <img
                src={contact}
                alt="Contact Us"
                className="object-contain"
                draggable={false}
            />
            </div>

            <div className="flex-1">

            <h2 className="text-[40px] font-bold text-[var(--color-text)]">
                Contact Us
            </h2>

            <p className="text-[var(--color-muted)] mt-4 max-w-[420px]">
               Have questions? Our support team is here to help you anytime.
            </p>
            <p className="text-[var(--color-muted)] mt-2 max-w-[420px]">
               Email: support@darlink.com
            </p>
            <p className="text-[var(--color-muted)] mt-2 max-w-[420px]">
               Phone: +1 234 567 890
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