import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border-gray)] mt-20">

      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text)]">
            Darlink
          </h3>

          <p className="text-[var(--color-muted)] mt-3 text-sm">
            Helping people discover and rent apartments easily,
            securely, and without hassle.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-[var(--color-text)] mb-3">
            Quick Links
          </h4>

          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/slots">Apartments</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-[var(--color-text)] mb-3">
            Contact
          </h4>

          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li>support@darlink.com</li>
            <li>+1 234 567 890</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-[var(--color-text)] mb-3">
            Legal
          </h4>

          <ul className="space-y-2 text-sm text-[var(--color-muted)]">
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-[var(--color-border-gray)] text-center py-4 text-sm text-[var(--color-muted)]">
        © 2026 Darlink — All rights reserved
      </div>

    </footer>
  );
}