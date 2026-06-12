/* ============================================================
   ASPHERIC LENS PAGE — Blueprint Lab Design
   Interactive simulation + aberration comparison + history
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";
import RayDiagram from "@/components/RayDiagram";
import LensFrontView from "@/components/LensFrontView";

const ASPHERIC_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663332318761/kNpwX6QkWsy4EfjLM84DYG/aspheric-lens-hero-6dZBaSH6MKYXdsRcYVdjCL.webp";

function InfoBox({ title, children, accentColor = "oklch(0.65 0.15 160)" }: {
  title: string; children: React.ReactNode; accentColor?: string;
}) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "oklch(0.20 0.035 250)",
        border: "1px solid oklch(0.28 0.04 250)",
      }}
    >
      <h3
        className="text-sm font-semibold mb-3"
        style={{ fontFamily: "'Space Grotesk', sans-serif", color: accentColor }}
      >
        {title}
      </h3>
      <div className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.04 250)" }}>
        {children}
      </div>
    </div>
  );
}

// Aberration comparison canvas
function AberrationCanvas({ showAspheric }: { showAspheric: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "oklch(0.17 0.04 250)";
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = "rgba(100,180,255,0.07)";
    for (let x = 0; x < W; x += 32) {
      for (let y = 0; y < H; y += 32) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Axis
    ctx.strokeStyle = "rgba(100,180,255,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.setLineDash([]);

    const lensX = cx - 60;
    const numRays = 9;
    const raySpacing = 10;

    if (!showAspheric) {
      // Spherical aberration: outer rays focus closer
      for (let i = 0; i < numRays; i++) {
        const yOffset = (i - Math.floor(numRays / 2)) * raySpacing;
        const aberration = (yOffset * yOffset) / 800; // outer rays focus shorter
        const focalX = lensX + 140 - aberration * 40;

        ctx.shadowColor = "oklch(0.78 0.18 200)";
        ctx.shadowBlur = 6;
        ctx.strokeStyle = `rgba(100,200,255,${0.5 + 0.05 * (numRays / 2 - Math.abs(i - numRays / 2))})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, cy + yOffset);
        ctx.lineTo(lensX, cy + yOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lensX, cy + yOffset);
        ctx.lineTo(focalX, cy);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      // Label
      ctx.fillStyle = "rgba(255,120,80,0.9)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Spherical aberration: rays don't converge", lensX + 10, cy - 65);
      ctx.fillStyle = "rgba(255,120,80,0.6)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("↑ blur circle instead of sharp focus", lensX + 10, cy - 50);
    } else {
      // Aspheric: all rays converge to single point
      const focalX = lensX + 140;
      for (let i = 0; i < numRays; i++) {
        const yOffset = (i - Math.floor(numRays / 2)) * raySpacing;
        ctx.shadowColor = "oklch(0.78 0.18 200)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = `rgba(100,220,255,${0.6 + 0.04 * (numRays / 2 - Math.abs(i - numRays / 2))})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(0, cy + yOffset);
        ctx.lineTo(lensX, cy + yOffset);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lensX, cy + yOffset);
        ctx.lineTo(focalX, cy);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      // Perfect focal point glow
      ctx.shadowColor = "oklch(0.75 0.14 75)";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "oklch(0.75 0.14 75)";
      ctx.beginPath();
      ctx.arc(focalX, cy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = "rgba(100,220,100,0.9)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.fillText("Aspheric: all rays converge perfectly", lensX + 10, cy - 65);
      ctx.fillStyle = "rgba(100,220,100,0.6)";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText("↑ single sharp focal point", lensX + 10, cy - 50);
    }

    // Draw lens shape
    const halfH = H * 0.35;
    ctx.strokeStyle = "oklch(0.78 0.18 200)";
    ctx.lineWidth = 2.5;
    if (!showAspheric) {
      // Spherical lens
      ctx.beginPath();
      ctx.moveTo(lensX, cy - halfH);
      ctx.bezierCurveTo(lensX + 22, cy - halfH / 2, lensX + 22, cy + halfH / 2, lensX, cy + halfH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, cy - halfH);
      ctx.bezierCurveTo(lensX - 22, cy - halfH / 2, lensX - 22, cy + halfH / 2, lensX, cy + halfH);
      ctx.stroke();
    } else {
      // Aspheric lens — slightly irregular profile
      ctx.beginPath();
      ctx.moveTo(lensX, cy - halfH);
      ctx.bezierCurveTo(lensX + 28, cy - halfH * 0.55, lensX + 18, cy + halfH * 0.55, lensX, cy + halfH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(lensX, cy - halfH);
      ctx.bezierCurveTo(lensX - 28, cy - halfH * 0.55, lensX - 18, cy + halfH * 0.55, lensX, cy + halfH);
      ctx.stroke();
    }
  }, [showAspheric]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      draw();
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    draw();
    return () => ro.disconnect();
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{
        display: "block",
        border: "1px solid oklch(0.28 0.04 250)",
        background: "oklch(0.17 0.04 250)",
      }}
    />
  );
}

export default function AsphericLens() {
  const [focalLength, setFocalLength] = useState(110);
  const [objectDistance, setObjectDistance] = useState(200);
  const [objectHeight, setObjectHeight] = useState(60);
  const [showAspheric, setShowAspheric] = useState(true);
  const [view, setView] = useState<"side" | "front">("side");
  const [aperture, setAperture] = useState(1);

  const v = (focalLength * objectDistance) / (objectDistance - focalLength);
  const magnification = -(v / objectDistance);

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      {/* Header */}
      <div
        className="relative pt-16 pb-10 overflow-hidden"
        style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}
      >
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${ASPHERIC_IMG})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, oklch(0.15 0.04 250) 50%, oklch(0.15 0.04 250 / 0.7))" }}
        />
        <div className="relative container pt-8">
          <span
            className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: "oklch(0.65 0.15 160 / 0.12)",
              border: "1px solid oklch(0.65 0.15 160 / 0.3)",
              color: "oklch(0.65 0.15 160)",
            }}
          >
            ASPH
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
          >
            Aspheric Lens
          </h1>
          <p className="text-base" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "520px" }}>
            A lens whose surface profile is not a sphere. Eliminates spherical aberration and reduces optical distortions — one element replacing many.
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-10">
        {/* Aberration comparison */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-bold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
            >
              Aberration Comparison
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAspheric(false)}
                className="px-4 py-2 rounded text-sm font-medium transition-all duration-150"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: !showAspheric ? "oklch(0.65 0.22 25 / 0.2)" : "oklch(0.22 0.03 250)",
                  border: `1px solid ${!showAspheric ? "oklch(0.65 0.22 25 / 0.5)" : "oklch(0.28 0.04 250)"}`,
                  color: !showAspheric ? "oklch(0.80 0.18 25)" : "oklch(0.65 0.04 250)",
                }}
              >
                Spherical
              </button>
              <button
                onClick={() => setShowAspheric(true)}
                className="px-4 py-2 rounded text-sm font-medium transition-all duration-150"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: showAspheric ? "oklch(0.65 0.15 160 / 0.2)" : "oklch(0.22 0.03 250)",
                  border: `1px solid ${showAspheric ? "oklch(0.65 0.15 160 / 0.5)" : "oklch(0.28 0.04 250)"}`,
                  color: showAspheric ? "oklch(0.65 0.15 160)" : "oklch(0.65 0.04 250)",
                }}
              >
                Aspheric
              </button>
            </div>
          </div>
          <div style={{ height: "220px" }}>
            <AberrationCanvas showAspheric={showAspheric} />
          </div>
        </div>

        {/* Ray diagram */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.20 0.035 250)",
                border: "1px solid oklch(0.28 0.04 250)",
              }}
            >
              <h2
                className="text-base font-semibold mb-5"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
              >
                Simulation Controls
              </h2>
              {[
                { label: "Focal Length (f)", value: focalLength, min: 40, max: 160, step: 5, unit: "px", set: setFocalLength },
                { label: "Object Distance (u)", value: objectDistance, min: 20, max: 300, step: 5, unit: "px", set: setObjectDistance },
                { label: "Object Height (h)", value: objectHeight, min: 20, max: 100, step: 5, unit: "px", set: setObjectHeight },
              ].map(({ label, value, min, max, step, unit, set }) => (
                <div key={label} className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.75 0.04 250)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.15 160)" }}>{value}{unit}</span>
                  </div>
                  <input type="range" min={min} max={max} step={step} value={value}
                    onChange={(e) => set(Number(e.target.value))} className="w-full"
                    style={{ accentColor: "oklch(0.65 0.15 160)" }} />
                </div>
              ))}
            </div>

            <div
              className="rounded-xl p-6"
              style={{
                background: "oklch(0.20 0.035 250)",
                border: "1px solid oklch(0.28 0.04 250)",
              }}
            >
              <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
                Image Properties
              </h2>
              <div className="space-y-3">
                {[
                  { label: "Image Distance (v)", value: isFinite(v) ? `${v.toFixed(1)} px` : "∞" },
                  { label: "Magnification (m)", value: isFinite(magnification) ? magnification.toFixed(3) : "∞" },
                  { label: "Image Type", value: v > 0 ? "Real" : "Virtual" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "oklch(0.25 0.04 250)" }}>
                    <span className="text-xs" style={{ color: "oklch(0.60 0.04 250)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.15 160)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex gap-2 mb-3">
              {(["side", "front"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} className="px-3 py-1.5 rounded text-xs font-semibold transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", background: view === v ? "oklch(0.65 0.15 160)" : "oklch(0.17 0.04 250)", color: view === v ? "oklch(0.12 0.04 250)" : "oklch(0.65 0.04 250)", border: `1px solid ${view === v ? "oklch(0.65 0.15 160)" : "oklch(0.28 0.04 250)"}` }}>
                  {v === "side" ? "Side View" : "Front View"}
                </button>
              ))}
            </div>
            <div style={{ height: "300px" }}>
              {view === "side" ? (
                <RayDiagram lensType="aspheric" focalLength={focalLength} objectDistance={objectDistance} objectHeight={objectHeight} showVirtualRays={true} />
              ) : (
                <LensFrontView lensType="aspheric" focalLength={focalLength} aperture={aperture} animated={true} />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InfoBox title="Surface profile equation" accentColor="oklch(0.65 0.15 160)">
                <span className="block font-mono text-xs mb-2" style={{ color: "oklch(0.65 0.15 160)" }}>
                  z = cr² / (1 + √(1−(1+K)c²r²)) + Σ Aᵢrⁱ
                </span>
                Where c = curvature, K = conic constant, Aᵢ = polynomial coefficients correcting the sphere.
              </InfoBox>
              <InfoBox title="Conic sections" accentColor="oklch(0.65 0.15 160)">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ color: "oklch(0.55 0.04 250)" }}>
                      <th className="text-left pb-1">K value</th>
                      <th className="text-left pb-1">Shape</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {[["K < −1", "Hyperbola"],["K = −1", "Parabola"],["−1 < K < 0", "Prolate ellipsoid"],["K = 0", "Sphere"],["K > 0", "Oblate ellipsoid"]].map(([k, s]) => (
                      <tr key={k}>
                        <td className="pr-3 font-mono" style={{ color: "oklch(0.65 0.15 160)" }}>{k}</td>
                        <td style={{ color: "oklch(0.68 0.04 250)" }}>{s}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </InfoBox>
              <InfoBox title="Manufacturing methods" accentColor="oklch(0.65 0.15 160)">
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Precision glass molding (consumer cameras)</li>
                  <li>Grinding and polishing (telescopes)</li>
                  <li>Single-point diamond turning (IR optics)</li>
                  <li>Ion-beam finishing (ultra-precision)</li>
                  <li>Magnetorheological finishing (MRF)</li>
                </ul>
              </InfoBox>
              <InfoBox title="Applications" accentColor="oklch(0.65 0.15 160)">
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>Camera lenses (labeled ASPH)</li>
                  <li>Laser diode collimation</li>
                  <li>Schmidt corrector plates</li>
                  <li>Eyeglasses for high prescriptions</li>
                  <li>Missile guidance systems</li>
                  <li>Optical fiber coupling</li>
                </ul>
              </InfoBox>
            </div>
          </div>
        </div>

        {/* History timeline */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.20 0.035 250)",
            border: "1px solid oklch(0.28 0.04 250)",
          }}
        >
          <h2
            className="text-xl font-bold mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
          >
            Historical Timeline
          </h2>
          <div className="relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-px"
              style={{ background: "oklch(0.65 0.15 160 / 0.3)", marginLeft: "7px" }}
            />
            <div className="space-y-6 pl-8">
              {[
                { year: "10th c.", event: "Ibn Sahl describes anaclastic (aspheric) lens focusing light with minimal aberration" },
                { year: "1620s", event: "René Descartes attempts aspheric lenses to correct spherical aberration; devises the Cartesian oval" },
                { year: "1670s", event: "Christiaan Huygens works on aspheric lens designs" },
                { year: "1668", event: "Francis Smethwick presents first high-quality aspheric lenses to the Royal Society" },
                { year: "10–11th c.", event: "Visby lenses (Viking treasures, Gotland) — some exhibit aspheric quality" },
                { year: "Modern", event: "Precision molding enables mass-produced aspheres in cameras, phones, and CD players" },
              ].map(({ year, event }) => (
                <div key={year} className="relative flex gap-4">
                  <div
                    className="absolute -left-8 w-3.5 h-3.5 rounded-full border-2 mt-0.5"
                    style={{
                      background: "oklch(0.17 0.04 250)",
                      borderColor: "oklch(0.65 0.15 160)",
                    }}
                  />
                  <div>
                    <span
                      className="text-xs font-bold"
                      style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.65 0.15 160)" }}
                    >
                      {year}
                    </span>
                    <p className="text-sm mt-0.5" style={{ color: "oklch(0.68 0.04 250)" }}>{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
