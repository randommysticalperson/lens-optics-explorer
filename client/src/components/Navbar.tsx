/* ============================================================
   NAVBAR — Blueprint Lab Design
   Dark navy header with dropdown groups: Lenses | Tools
   ============================================================ */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/logo-icon-TcJ7jNs3UjsxHVM55XKWKe.png";

const LENS_LINKS = [
  { href: "/converging", label: "Converging Lens", badge: "f > 0" },
  { href: "/convex", label: "Convex Lens", badge: "PLANO" },
  { href: "/concave", label: "Concave Lens", badge: "f < 0" },
  { href: "/aspheric", label: "Aspheric Lens", badge: "ASPH" },
];

const TOOL_LINKS = [
  { href: "/equation", label: "Thin Lens Equation", badge: "1/f" },
  { href: "/compound", label: "Compound Lens", badge: "L₁+L₂" },
  { href: "/snells", label: "Snell's Law", badge: "n₁θ₁" },
  { href: "/quiz", label: "Quiz Mode", badge: "TEST" },
];

function DropdownMenu({
  label,
  links,
  location,
  accentColor = "oklch(0.78 0.18 200)",
}: {
  label: string;
  links: { href: string; label: string; badge: string }[];
  location: string;
  accentColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isActive = links.some((l) => l.href === location);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded transition-all duration-150"
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: isActive ? accentColor : "oklch(0.72 0.04 250)",
          background: isActive ? `${accentColor}14` : "transparent",
          borderBottom: isActive ? `2px solid ${accentColor}` : "2px solid transparent",
        }}
      >
        {label}
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
            opacity: 0.6,
          }}
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-50 min-w-48"
          style={{
            background: "oklch(0.18 0.04 250)",
            border: "1px solid oklch(0.30 0.04 250)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
          }}
        >
          {links.map(({ href, label, badge }) => {
            const active = location === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-4 py-2.5 text-sm transition-all duration-100"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: active ? accentColor : "oklch(0.72 0.04 250)",
                  background: active ? `${accentColor}10` : "transparent",
                  borderLeft: active ? `2px solid ${accentColor}` : "2px solid transparent",
                }}
              >
                <span>{label}</span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded ml-3"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: `${accentColor}18`,
                    color: accentColor,
                    fontSize: "0.65rem",
                  }}
                >
                  {badge}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const allLinks = [
    { href: "/", label: "Overview" },
    ...LENS_LINKS,
    ...TOOL_LINKS,
  ];

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
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
          >
            Lens<span style={{ color: "oklch(0.78 0.18 200)" }}>Optics</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Overview */}
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium rounded transition-all duration-150"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              color: location === "/" ? "oklch(0.78 0.18 200)" : "oklch(0.72 0.04 250)",
              background: location === "/" ? "oklch(0.78 0.18 200 / 0.08)" : "transparent",
              borderBottom: location === "/" ? "2px solid oklch(0.78 0.18 200)" : "2px solid transparent",
            }}
          >
            Overview
          </Link>

          {/* Lenses dropdown */}
          <DropdownMenu
            label="Lenses"
            links={LENS_LINKS}
            location={location}
            accentColor="oklch(0.78 0.18 200)"
          />

          {/* Tools dropdown */}
          <DropdownMenu
            label="Tools"
            links={TOOL_LINKS}
            location={location}
            accentColor="oklch(0.65 0.15 160)"
          />
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
          style={{ background: "oklch(0.17 0.04 250 / 0.98)", borderColor: "oklch(0.30 0.04 250)" }}
        >
          <p className="px-6 pt-3 pb-1 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.45 0.04 250)" }}>Lenses</p>
          {LENS_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-2.5 text-sm font-medium border-b"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: location === href ? "oklch(0.78 0.18 200)" : "oklch(0.72 0.04 250)", borderColor: "oklch(0.22 0.03 250)", background: location === href ? "oklch(0.78 0.18 200 / 0.06)" : "transparent" }}>
              {label}
            </Link>
          ))}
          <p className="px-6 pt-3 pb-1 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.45 0.04 250)" }}>Tools</p>
          {TOOL_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)}
              className="block px-6 py-2.5 text-sm font-medium border-b"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: location === href ? "oklch(0.65 0.15 160)" : "oklch(0.72 0.04 250)", borderColor: "oklch(0.22 0.03 250)", background: location === href ? "oklch(0.65 0.15 160 / 0.06)" : "transparent" }}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
