import { Link } from "react-router-dom";
import darlinkFooter from "/src/components/ui/footer-logo.svg";

export default function Footer() {

    return (
        <footer
            className="mt-auto flex-shrink-0 w-full min-w-0 border-t border-[var(--color-muted)]/20 
                        bg-[var(--color-surface)] text-[var(--color-primary)] 
                        opacity-80 hover:opacity-100 transition-opacity duration-300"
        >
            <div className="min-w-0 max-w-7xl mx-auto px-7 
                            flex flex-col p-4 md:flex-row 
                            items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <img
                        src={darlinkFooter}
                        alt="DarLink Logo"
                        className="h-8 md:h-10"
                        draggable={false}
                    />
                </div>

                    <div className="flex items-center gap-8 text-sm md:text-base md:ml-22">
                        <Link to="/terms" className="hover:text-[var(--color-secondary)] transition-colors">
                            Terms
                        </Link>
                        <Link to="/privacy" className="hover:text-[var(--color-secondary)] transition-colors">
                            Privacy
                        </Link>
                        <Link to="/contact" className="hover:text-[var(--color-secondary)] transition-colors">
                            Contact
                        </Link>
                    </div>

                    <p className="text-xs md:text-sm text-center md:text-right ">
                        © 2025 DarLink. All rights reserved.
                    </p>
            </div>
        </footer>
    );
}