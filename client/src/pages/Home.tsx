/* ============================================================
   HOME PAGE — Blueprint Lab Design
   Hero + lens cards (4 types) + front-view previews + tools grid
   ============================================================ */
import { Link } from "wouter";
import Navbar from "@/components/Navbar";
import RayDiagram from "@/components/RayDiagram";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/hero-bg-oS6gUMdUkVJT5tE2uWE5sh.webp";
const CONVERGING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/converging-lens-hero-gDfNQGCspTUjnorJfiAciH.webp";
const CONCAVE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/concave-lens-hero-HpBZkx3QqC2SNWXMmxYy4M.webp";
const ASPHERIC_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/aspheric-lens-hero-6dZBaSH6MKYXdsRcYVdjCL.webp";

const lensCards = [
  {
    href: "/converging",
    title: "Converging Lens",
    subtitle: "Biconvex · Positive focal length",
    description: "Thicker at the center. Parallel rays converge to a real focal point. Used in cameras, magnifying glasses, and the human eye.",
    image: CONVERGING_IMG,
    tag: "f > 0",
    tagColor: "oklch(0.78 0.18 200)",
    diagramType: "converging" as const,
    previewF: 90,
    previewU: 200,
  },
  {
    href: "/convex",
    title: "Convex Lens",
    subtitle: "Plano-convex · One flat surface",
    description: "One flat and one curved surface. Ideal for collimating point sources with minimal spherical aberration.",
    image: CONVERGING_IMG,
    tag: "PLANO",
    tagColor: "oklch(0.78 0.18 200)",
    diagramType: "converging" as const,
    previewF: 100,
    previewU: 160,
  },
  {
    href: "/concave",
    title: "Concave Lens",
    subtitle: "Biconcave · Negative focal length",
    description: "Thinner at the center. Parallel rays diverge as if from a virtual focal point. Used in eyeglasses for myopia.",
    image: CONCAVE_IMG,
    tag: "f < 0",
    tagColor: "oklch(0.75 0.14 75)",
    diagramType: "concave" as const,
    previewF: -90,
    previewU: 180,
  },
  {
    href: "/aspheric",
    title: "Aspheric Lens",
    subtitle: "Non-spherical profile · Aberration-free",
    description: "Surface deviates from a sphere to eliminate spherical aberration. One element replaces many spherical lenses.",
    image: ASPHERIC_IMG,
    tag: "ASPH",
    tagColor: "oklch(0.65 0.15 160)",
    diagramType: "aspheric" as const,
    previewF: 110,
    previewU: 220,
  },
];

const toolCards = [
  {
    href: "/equation",
    title: "Thin Lens Equation",
    desc: "Solve for f, v, or u interactively with a live ray diagram.",
    badge: "1/f = 1/v − 1/u",
    color: "oklch(0.75 0.14 75)",
  },
  {
    href: "/compound",
    title: "Compound Lens",
    desc: "Two-lens system: model telescopes, microscopes, and telephoto designs.",
    badge: "L₁ + L₂",
    color: "oklch(0.65 0.15 160)",
  },
  {
    href: "/snells",
    title: "Snell's Law",
    desc: "Refraction at a boundary between two media. Discover total internal reflection.",
    badge: "n₁ sin θ₁ = n₂ sin θ₂",
    color: "oklch(0.78 0.18 200)",
  },
  {
    href: "/quiz",
    title: "Quiz Mode",
    desc: "Test your optics knowledge with randomized challenges and instant feedback.",
    badge: "CHALLENGE",
    color: "oklch(0.65 0.15 160)",
  },
];

const facts = [
  { value: "1621", label: "Year Snell's Law formulated", unit: "" },
  { value: "1/f", label: "Lens power formula", unit: "= 1/v − 1/u" },
  { value: "1.5", label: "Refractive index of glass", unit: "typical" },
  { value: "~10⁻⁶", label: "Asphere surface tolerance", unit: "meters" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden" style={{ paddingTop: "4rem" }}>
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO_BG})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.12 0.04 250 / 0.92) 40%, oklch(0.12 0.04 250 / 0.5) 70%, transparent 100%)" }} />
        <div className="absolute inset-0 blueprint-grid opacity-40" />

        <div className="relative container py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6" style={{ background: "oklch(0.78 0.18 200 / 0.12)", border: "1px solid oklch(0.78 0.18 200 / 0.3)", color: "oklch(0.78 0.18 200)", fontFamily: "'JetBrains Mono', monospace" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.78 0.18 200)" }} />
              Interactive Optics Laboratory
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.01 250)", letterSpacing: "-0.02em" }}>
              Light bends.
              <br />
              <span style={{ color: "oklch(0.78 0.18 200)" }}>We show</span>
              <br />
              you how.
            </h1>

            <p className="text-lg mb-10 leading-relaxed" style={{ color: "oklch(0.72 0.04 250)", maxWidth: "480px" }}>
              Explore converging, convex, concave, and aspheric lenses through interactive ray diagrams, front-view aperture visualizations, Snell's Law, and real-time simulations.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/converging" className="px-6 py-3 rounded font-semibold text-sm transition-all duration-200 active:scale-95" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "oklch(0.78 0.18 200)", color: "oklch(0.12 0.04 250)", boxShadow: "0 0 20px oklch(0.78 0.18 200 / 0.35)" }}>
                Start Exploring →
              </Link>
              <Link href="/quiz" className="px-6 py-3 rounded font-semibold text-sm transition-all duration-200 active:scale-95" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "transparent", color: "oklch(0.65 0.15 160)", border: "1px solid oklch(0.65 0.15 160 / 0.4)" }}>
                Take the Quiz
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="border-y" style={{ background: "oklch(0.18 0.04 250)", borderColor: "oklch(0.28 0.04 250)" }}>
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[oklch(0.28_0.04_250)]">
            {facts.map((f) => (
              <div key={f.label} className="px-6 py-5 text-center">
                <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{f.value}</div>
                <div className="text-xs" style={{ color: "oklch(0.60 0.04 250)" }}>{f.label}</div>
                {f.unit && <div className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.50 0.04 250)" }}>{f.unit}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lens type cards with front-view ── */}
      <section className="py-24 blueprint-grid">
        <div className="container">
          <div className="mb-14">
            <p className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>Four Lens Types</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
              Every focal point
              <br />
              tells a story.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {lensCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <div className="lens-card rounded-xl overflow-hidden cursor-pointer h-full" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
                  {/* Side-view ray diagram preview */}
                  <div className="relative h-44 overflow-hidden">
                    <RayDiagram lensType={card.diagramType} focalLength={card.previewF} objectDistance={card.previewU} objectHeight={45} showVirtualRays={true} />
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold" style={{ fontFamily: "'JetBrains Mono', monospace", background: `${card.tagColor}18`, border: `1px solid ${card.tagColor}50`, color: card.tagColor }}>
                      {card.tag}
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs mb-1" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.55 0.04 250)" }}>{card.subtitle}</p>
                    <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>{card.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 250)" }}>{card.description}</p>
                    <div className="mt-4 text-xs font-medium flex items-center gap-1" style={{ color: card.tagColor, fontFamily: "'Space Grotesk', sans-serif" }}>
                      Explore simulation →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools section ── */}
      <section className="py-20" style={{ background: "oklch(0.18 0.04 250)" }}>
        <div className="container">
          <div className="mb-12">
            <p className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.15 160)" }}>Interactive Tools</p>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
              Go deeper.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
            {toolCards.map((t) => (
              <Link key={t.href} href={t.href}>
                <div className="rounded-xl p-5 h-full cursor-pointer transition-all duration-200 hover:border-opacity-60" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
                  <span className="inline-block px-2 py-0.5 rounded text-xs font-bold mb-3" style={{ fontFamily: "'JetBrains Mono', monospace", background: `${t.color}14`, border: `1px solid ${t.color}30`, color: t.color }}>
                    {t.badge}
                  </span>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>{t.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 250)" }}>{t.desc}</p>
                  <div className="mt-4 text-xs font-medium" style={{ color: t.color, fontFamily: "'Space Grotesk', sans-serif" }}>Open →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20" style={{ background: "oklch(0.15 0.04 250)" }}>
        <div className="container">
          <div className="rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.30 0.04 250)" }}>
            <div>
              <p className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.75 0.14 75)" }}>The Fundamental Equation</p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>1/f = 1/v − 1/u</h2>
              <p className="text-sm" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "420px" }}>
                The thin lens equation relates focal length, image distance, and object distance. Use our interactive calculator to explore how changing any variable shifts the image.
              </p>
            </div>
            <Link href="/equation" className="shrink-0 px-8 py-4 rounded-lg font-semibold transition-all duration-200 active:scale-95" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "oklch(0.75 0.14 75)", color: "oklch(0.12 0.04 250)", boxShadow: "0 0 24px oklch(0.75 0.14 75 / 0.3)", whiteSpace: "nowrap" }}>
              Open Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t py-8" style={{ borderColor: "oklch(0.25 0.04 250)", background: "oklch(0.14 0.04 250)" }}>
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.45 0.04 250)" }}>Lens Optics Explorer — Interactive Physics Laboratory</p>
          <p className="text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.40 0.04 250)" }}>Based on geometric optics & thin lens theory</p>
        </div>
      </footer>
    </div>
  );
}
