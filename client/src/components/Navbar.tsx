/* ============================================================
   NAVBAR — Blueprint Lab Design
   Dark navy header with cyan accent navigation
   ============================================================ */
import { useState } from "react";
import { Link, useLocation } from "wouter";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/logo-icon-TcJ7jNs3UjsxHVM55XKWKe.png";

const navLinks = [
  { href: "/", label: "Overview" },
  { href: "/converging", label: "Converging" },
  { href: "/concave", label: "Concave" },
  { href: "/aspheric", label: "Aspheric" },
  { href: "/equation", label: "Thin Lens Eq." },
];

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "oklch(0.15 0.04 250 / 0.92)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid oklch(0.30 0.04 250)",
      }}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <img
            src={LOGO_URL}
            alt="Lens Optics Explorer"
            className="w-8 h-8 object-contain"
            style={{ filter: "drop-shadow(0 0 6px oklch(0.78 0.18 200 / 0.6))" }}
          />
          <span
            className="text-lg font-semibold tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: "oklch(0.92 0.01 250)",
            }}
          >
            Lens<span style={{ color: "oklch(0.78 0.18 200)" }}>Optics</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                className="px-4 py-2 text-sm font-medium rounded transition-all duration-150"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: isActive ? "oklch(0.78 0.18 200)" : "oklch(0.72 0.04 250)",
                  background: isActive ? "oklch(0.78 0.18 200 / 0.08)" : "transparent",
                  borderBottom: isActive ? "2px solid oklch(0.78 0.18 200)" : "2px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block w-5 h-0.5 transition-all duration-200"
              style={{ background: "oklch(0.78 0.18 200)" }}
            />
          ))}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden border-t"
          style={{
            background: "oklch(0.17 0.04 250 / 0.98)",
            borderColor: "oklch(0.30 0.04 250)",
          }}
        >
          {navLinks.map(({ href, label }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="block px-6 py-3 text-sm font-medium border-b"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: isActive ? "oklch(0.78 0.18 200)" : "oklch(0.72 0.04 250)",
                  borderColor: "oklch(0.25 0.04 250)",
                  background: isActive ? "oklch(0.78 0.18 200 / 0.06)" : "transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
