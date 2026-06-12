/* ============================================================
   CONVEX LENS PAGE — Blueprint Lab Design
   Plano-convex lens: one flat, one curved surface
   Includes side ray diagram + front-view aperture visualization
   ============================================================ */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import RayDiagram from "@/components/RayDiagram";
import LensFrontView from "@/components/LensFrontView";

const CONVERGING_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/converging-lens-hero-gDfNQGCspTUjnorJfiAciH.webp";

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
      <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.18 200)" }}>{title}</h3>
      <div className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.04 250)" }}>{children}</div>
    </div>
  );
}

export default function ConvexLens() {
  const [focalLength, setFocalLength] = useState(100);
  const [objectDistance, setObjectDistance] = useState(180);
  const [objectHeight, setObjectHeight] = useState(60);
  const [aperture, setAperture] = useState(1);
  const [view, setView] = useState<"side" | "front">("side");

  const v = (focalLength * objectDistance) / (objectDistance - focalLength);
  const magnification = -(v / objectDistance);
  const isReal = v > 0;
  const isInverted = magnification < 0;

  const caseDescription = () => {
    if (objectDistance > 2 * focalLength) return "Object beyond 2F → Real, inverted, diminished image";
    if (Math.abs(objectDistance - 2 * focalLength) < 5) return "Object at 2F → Real, inverted, same-size image";
    if (objectDistance > focalLength) return "Object between F and 2F → Real, inverted, magnified image";
    if (Math.abs(objectDistance - focalLength) < 5) return "Object at F → Image at infinity";
    return "Object inside F → Virtual, upright, magnified image";
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      {/* Header */}
      <div className="relative pt-16 pb-10 overflow-hidden" style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}>
        <div className="absolute inset-0 opacity-20 bg-cover bg-center" style={{ backgroundImage: `url(${CONVERGING_IMG})` }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.15 0.04 250) 50%, oklch(0.15 0.04 250 / 0.7))" }} />
        <div className="relative container pt-8">
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.78 0.18 200 / 0.12)", border: "1px solid oklch(0.78 0.18 200 / 0.3)", color: "oklch(0.78 0.18 200)" }}>
            PLANO-CONVEX
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
            Convex Lens
          </h1>
          <p className="text-base" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "520px" }}>
            A plano-convex lens has one flat and one outward-curved surface. It converges light to a focal point and is one of the most common optical elements in instruments.
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
                Simulation Controls
              </h2>

              {/* View toggle */}
              <div className="mb-5">
                <p className="text-xs mb-2" style={{ color: "oklch(0.60 0.04 250)" }}>View Mode</p>
                <div className="flex gap-2">
                  {(["side", "front"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => setView(v)}
                      className="flex-1 py-2 rounded text-xs font-semibold transition-all duration-150 capitalize"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: view === v ? "oklch(0.78 0.18 200)" : "oklch(0.17 0.04 250)",
                        color: view === v ? "oklch(0.12 0.04 250)" : "oklch(0.65 0.04 250)",
                        border: `1px solid ${view === v ? "oklch(0.78 0.18 200)" : "oklch(0.28 0.04 250)"}`,
                      }}
                    >
                      {v === "side" ? "Side View" : "Front View"}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: "Focal Length (f)", value: focalLength, min: 40, max: 160, step: 5, unit: "px", set: setFocalLength },
                { label: "Object Distance (u)", value: objectDistance, min: 20, max: 300, step: 5, unit: "px", set: setObjectDistance },
                { label: "Object Height (h)", value: objectHeight, min: 20, max: 100, step: 5, unit: "px", set: setObjectHeight },
              ].map(({ label, value, min, max, step, unit, set }) => (
                <div key={label} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.75 0.04 250)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{value}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(Number(e.target.value))} className="w-full" style={{ accentColor: "oklch(0.78 0.18 200)" }} />
                </div>
              ))}

              {view === "front" && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.75 0.04 250)" }}>Aperture</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{(aperture * 100).toFixed(0)}%</span>
                  </div>
                  <input type="range" min={0.3} max={1} step={0.05} value={aperture} onChange={(e) => setAperture(Number(e.target.value))} className="w-full" style={{ accentColor: "oklch(0.78 0.18 200)" }} />
                </div>
              )}
            </div>

            {/* Image properties */}
            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
                Image Properties
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Image Distance (v)", value: isFinite(v) ? `${v.toFixed(1)} px` : "∞" },
                  { label: "Magnification (m)", value: isFinite(magnification) ? magnification.toFixed(3) : "∞" },
                  { label: "Image Type", value: isReal ? "Real" : "Virtual" },
                  { label: "Orientation", value: isInverted ? "Inverted" : "Upright" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "oklch(0.25 0.04 250)" }}>
                    <span className="text-xs" style={{ color: "oklch(0.60 0.04 250)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed p-3 rounded" style={{ background: "oklch(0.17 0.04 250)", color: "oklch(0.65 0.04 250)", fontFamily: "'JetBrains Mono', monospace" }}>
                {caseDescription()}
              </p>
            </div>
          </div>

          {/* Canvas area */}
          <div className="lg:col-span-2 space-y-6">
            <div style={{ height: "340px" }}>
              {view === "side" ? (
                <RayDiagram lensType="converging" focalLength={focalLength} objectDistance={objectDistance} objectHeight={objectHeight} showVirtualRays={true} />
              ) : (
                <LensFrontView lensType="convex" focalLength={focalLength} aperture={aperture} animated={true} />
              )}
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-2 gap-4">
              <InfoBox title="Plano-convex vs biconvex">
                A plano-convex lens has one flat surface (R₂ = ∞) and one convex surface. It produces less spherical aberration than a biconvex lens when light enters from the curved side. Ideal for collimating point sources.
              </InfoBox>
              <InfoBox title="Lensmaker's equation">
                <span className="block font-mono text-sm mb-1" style={{ color: "oklch(0.78 0.18 200)" }}>
                  1/f = (n−1)[1/R₁ − 1/R₂]
                </span>
                For plano-convex: R₂ = ∞, so 1/f = (n−1)/R₁. With n=1.5 and R₁=100mm, f = 200mm.
              </InfoBox>
              <InfoBox title="Front view explained">
                The front view shows the lens aperture as seen head-on. The concentric rings represent Fresnel zones — regions where the optical path length differs by λ/2. The animated wavefronts show light converging toward the focal point.
              </InfoBox>
              <InfoBox title="Real-world uses">
                Laser beam collimation, fiber optic coupling, barcode scanners, overhead projectors, condensers in microscopes, and single-lens cameras. The flat side is placed toward the image for minimum aberration.
              </InfoBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
