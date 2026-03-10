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
                
                    <img
                        src="/src/components/ui/footer-logo.svg"
                        alt="DarLink Logo"
                        className="h-8 md:h-10"
                        draggable={false}
                    />

                    <div className="flex items-center gap-8 text-sm md:text-base md:ml-22">
                        <a href="#" className="hover:text-[var(--color-secondary)] transition-colors">
                            Terms
                        </a>
                        <a href="#" className="hover:text-[var(--color-secondary)] transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="hover:text-[var(--color-secondary)] transition-colors">
                            Contact
                        </a>
                    </div>

                    <p className="text-xs md:text-sm text-center md:text-right ">
                        © 2025 DarLink. All rights reserved.
                    </p>
            </div>
        </footer>
    );
}