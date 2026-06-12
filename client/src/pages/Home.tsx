/* ============================================================
   HOME PAGE — Blueprint Lab Design
   Hero with animated rays, lens type cards, intro content
   ============================================================ */
import { Link } from "wouter";
import Navbar from "@/components/Navbar";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/hero-bg-oS6gUMdUkVJT5tE2uWE5sh.webp";
const CONVERGING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/converging-lens-hero-gDfNQGCspTUjnorJfiAciH.webp";
const CONCAVE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/concave-lens-hero-HpBZkx3QqC2SNWXMmxYy4M.webp";
const ASPHERIC_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/aspheric-lens-hero-6dZBaSH6MKYXdsRcYVdjCL.webp";

const lensCards = [
  {
    href: "/converging",
    title: "Converging Lens",
    subtitle: "Biconvex · Positive focal length",
    description:
      "Thicker at the center than the edges. Parallel rays converge to a real focal point. Used in cameras, magnifying glasses, and the human eye.",
    image: CONVERGING_IMG,
    tag: "f > 0",
    tagColor: "oklch(0.78 0.18 200)",
  },
  {
    href: "/concave",
    title: "Concave Lens",
    subtitle: "Biconcave · Negative focal length",
    description:
      "Thinner at the center than the edges. Parallel rays diverge as if from a virtual focal point. Used in eyeglasses for myopia correction.",
    image: CONCAVE_IMG,
    tag: "f < 0",
    tagColor: "oklch(0.75 0.14 75)",
  },
  {
    href: "/aspheric",
    title: "Aspheric Lens",
    subtitle: "Non-spherical profile · Aberration-free",
    description:
      "Surface profile deviates from a sphere to eliminate spherical aberration. One aspheric element can replace multiple spherical lenses.",
    image: ASPHERIC_IMG,
    tag: "ASPH",
    tagColor: "oklch(0.65 0.15 160)",
  },
];

const facts = [
  { value: "1621", label: "Year Snell's Law formulated", unit: "" },
  { value: "1/f", label: "Lens power formula", unit: "= 1/v − 1/u" },
  { value: "1.5", label: "Refractive index of glass", unit: "typical" },
  { value: "~10⁻⁶", label: "Surface tolerance of aspheres", unit: "meters" },
];

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ paddingTop: "4rem" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, oklch(0.12 0.04 250 / 0.92) 40%, oklch(0.12 0.04 250 / 0.5) 70%, transparent 100%)",
          }}
        />
        {/* Blueprint dot grid overlay */}
        <div className="absolute inset-0 blueprint-grid opacity-40" />

        <div className="relative container py-24">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
              style={{
                background: "oklch(0.78 0.18 200 / 0.12)",
                border: "1px solid oklch(0.78 0.18 200 / 0.3)",
                color: "oklch(0.78 0.18 200)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: "oklch(0.78 0.18 200)" }}
              />
              Interactive Optics Laboratory
            </div>

            <h1
              className="text-5xl md:text-7xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.95 0.01 250)",
                letterSpacing: "-0.02em",
              }}
            >
              Light bends.
              <br />
              <span style={{ color: "oklch(0.78 0.18 200)" }}>We show</span>
              <br />
              you how.
            </h1>

            <p
              className="text-lg mb-10 leading-relaxed"
              style={{ color: "oklch(0.72 0.04 250)", maxWidth: "480px" }}
            >
              Explore the physics of converging, concave, and aspheric lenses
              through interactive ray diagrams, the thin lens equation, and
              real-time simulations.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/converging"
                className="px-6 py-3 rounded font-semibold text-sm transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "oklch(0.78 0.18 200)",
                  color: "oklch(0.12 0.04 250)",
                  boxShadow: "0 0 20px oklch(0.78 0.18 200 / 0.35)",
                }}
              >
                Start Exploring →
              </Link>
              <Link
                href="/equation"
                className="px-6 py-3 rounded font-semibold text-sm transition-all duration-200 active:scale-95"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: "transparent",
                  color: "oklch(0.78 0.18 200)",
                  border: "1px solid oklch(0.78 0.18 200 / 0.4)",
                }}
              >
                Thin Lens Equation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div
        className="border-y"
        style={{
          background: "oklch(0.18 0.04 250)",
          borderColor: "oklch(0.28 0.04 250)",
        }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[oklch(0.28_0.04_250)]">
            {facts.map((f) => (
              <div key={f.label} className="px-6 py-5 text-center">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: "oklch(0.78 0.18 200)",
                  }}
                >
                  {f.value}
                </div>
                <div className="text-xs" style={{ color: "oklch(0.60 0.04 250)" }}>
                  {f.label}
                </div>
                {f.unit && (
                  <div
                    className="text-xs mt-0.5"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: "oklch(0.50 0.04 250)",
                    }}
                  >
                    {f.unit}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Lens type cards ── */}
      <section className="py-24 blueprint-grid">
        <div className="container">
          <div className="mb-14">
            <p
              className="text-xs font-medium mb-3 tracking-widest uppercase"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: "oklch(0.78 0.18 200)",
              }}
            >
              Three Lens Types
            </p>
            <h2
              className="text-4xl font-bold"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                color: "oklch(0.92 0.01 250)",
              }}
            >
              Every focal point
              <br />
              tells a story.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {lensCards.map((card) => (
              <Link key={card.href} href={card.href}>
                <div
                  className="lens-card rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: "oklch(0.20 0.035 250)",
                    border: "1px solid oklch(0.28 0.04 250)",
                  }}
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, oklch(0.20 0.035 250) 0%, transparent 60%)",
                      }}
                    />
                    <span
                      className="absolute top-3 right-3 px-2.5 py-1 rounded text-xs font-bold"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        background: `${card.tagColor}18`,
                        border: `1px solid ${card.tagColor}50`,
                        color: card.tagColor,
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p
                      className="text-xs mb-1"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: "oklch(0.55 0.04 250)",
                      }}
                    >
                      {card.subtitle}
                    </p>
                    <h3
                      className="text-xl font-bold mb-3"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: "oklch(0.92 0.01 250)",
                      }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(0.65 0.04 250)" }}
                    >
                      {card.description}
                    </p>
                    <div
                      className="mt-4 text-xs font-medium flex items-center gap-1"
                      style={{
                        color: "oklch(0.78 0.18 200)",
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      Explore simulation →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Thin lens equation CTA ── */}
      <section
        className="py-20"
        style={{ background: "oklch(0.18 0.04 250)" }}
      >
        <div className="container">
          <div
            className="rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8"
            style={{
              background: "oklch(0.20 0.035 250)",
              border: "1px solid oklch(0.30 0.04 250)",
            }}
          >
            <div>
              <p
                className="text-xs font-medium mb-3 tracking-widest uppercase"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: "oklch(0.75 0.14 75)",
                }}
              >
                The Fundamental Equation
              </p>
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  color: "oklch(0.92 0.01 250)",
                }}
              >
                1/f = 1/v − 1/u
              </h2>
              <p className="text-sm" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "420px" }}>
                The thin lens equation relates focal length, image distance, and object distance.
                Use our interactive calculator to explore how changing any variable shifts the image.
              </p>
            </div>
            <Link
              href="/equation"
              className="shrink-0 px-8 py-4 rounded-lg font-semibold transition-all duration-200 active:scale-95"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                background: "oklch(0.75 0.14 75)",
                color: "oklch(0.12 0.04 250)",
                boxShadow: "0 0 24px oklch(0.75 0.14 75 / 0.3)",
                whiteSpace: "nowrap",
              }}
            >
              Open Calculator →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="border-t py-8"
        style={{
          borderColor: "oklch(0.25 0.04 250)",
          background: "oklch(0.14 0.04 250)",
        }}
      >
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p
            className="text-xs"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "oklch(0.45 0.04 250)",
            }}
          >
            Lens Optics Explorer — Interactive Physics Laboratory
          </p>
          <p
            className="text-xs"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "oklch(0.40 0.04 250)",
            }}
          >
            Based on geometric optics & thin lens theory
          </p>
        </div>
      </footer>
    </div>
  );
}
