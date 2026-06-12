/* ============================================================
   THIN LENS EQUATION PAGE — Blueprint Lab Design
   Interactive calculator + formula derivation + comparison table
   ============================================================ */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import RayDiagram from "@/components/RayDiagram";

type SolveFor = "f" | "v" | "u";

function DataField({ label, value, unit, color = "oklch(0.78 0.18 200)", editable = false, onChange }: {
  label: string; value: string; unit?: string; color?: string;
  editable?: boolean; onChange?: (v: string) => void;
}) {
  return (
    <div
      className="rounded-lg p-4"
      style={{
        background: "oklch(0.17 0.04 250)",
        border: `1px solid ${color}30`,
      }}
    >
      <p className="text-xs mb-1" style={{ color: "oklch(0.55 0.04 250)" }}>{label}</p>
      <div className="flex items-baseline gap-1">
        {editable && onChange ? (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="text-xl font-bold bg-transparent border-b outline-none w-24"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color,
              borderColor: `${color}50`,
            }}
          />
        ) : (
          <span
            className="text-xl font-bold"
            style={{ fontFamily: "'JetBrains Mono', monospace", color }}
          >
            {value}
          </span>
        )}
        {unit && (
          <span className="text-xs" style={{ color: "oklch(0.50 0.04 250)" }}>{unit}</span>
        )}
      </div>
    </div>
  );
}

export default function ThinLensEquation() {
  const [solveFor, setSolveFor] = useState<SolveFor>("v");
  const [fInput, setFInput] = useState("100");
  const [vInput, setVInput] = useState("200");
  const [uInput, setUInput] = useState("200");
  const [lensType, setLensType] = useState<"converging" | "concave">("converging");

  const f = parseFloat(fInput) || 0;
  const v = parseFloat(vInput) || 0;
  const u = parseFloat(uInput) || 0;

  let result = 0;
  let resultLabel = "";
  let resultUnit = "px";

  if (solveFor === "v") {
    result = (f * u) / (u - f);
    resultLabel = "Image Distance (v)";
  } else if (solveFor === "u") {
    result = (f * v) / (v - f);
    resultLabel = "Object Distance (u)";
  } else {
    result = (v * u) / (v + u);
    resultLabel = "Focal Length (f)";
  }

  const magnification = solveFor === "v"
    ? -(result / u)
    : solveFor === "u"
    ? -(v / result)
    : -(v / u);

  const isReal = result > 0;
  const isInverted = magnification < 0;

  // For simulation
  const simF = solveFor === "f" ? result : f;
  const simU = solveFor === "u" ? result : u;
  const simH = 60;

  const lensColor = lensType === "converging" ? "oklch(0.78 0.18 200)" : "oklch(0.75 0.14 75)";

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      {/* Header */}
      <div
        className="pt-24 pb-10"
        style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}
      >
        <div className="container">
          <span
            className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              background: "oklch(0.75 0.14 75 / 0.12)",
              border: "1px solid oklch(0.75 0.14 75 / 0.3)",
              color: "oklch(0.75 0.14 75)",
            }}
          >
            1/f = 1/v − 1/u
          </span>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
          >
            Thin Lens Equation
          </h1>
          <p className="text-base" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "520px" }}>
            The fundamental relationship between focal length, object distance, and image distance.
            Solve for any variable interactively.
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-10">
        {/* Formula display */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: "oklch(0.20 0.035 250)",
            border: "1px solid oklch(0.28 0.04 250)",
          }}
        >
          <div
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "oklch(0.92 0.01 250)",
              letterSpacing: "0.05em",
            }}
          >
            <span style={{ color: "oklch(0.75 0.14 75)" }}>1</span>
            <span style={{ color: "oklch(0.55 0.04 250)" }}>/</span>
            <span style={{ color: "oklch(0.75 0.14 75)" }}>f</span>
            <span className="mx-4" style={{ color: "oklch(0.55 0.04 250)" }}>=</span>
            <span style={{ color: "oklch(0.78 0.18 200)" }}>1</span>
            <span style={{ color: "oklch(0.55 0.04 250)" }}>/</span>
            <span style={{ color: "oklch(0.78 0.18 200)" }}>v</span>
            <span className="mx-3" style={{ color: "oklch(0.55 0.04 250)" }}>−</span>
            <span style={{ color: "oklch(0.65 0.15 160)" }}>1</span>
            <span style={{ color: "oklch(0.55 0.04 250)" }}>/</span>
            <span style={{ color: "oklch(0.65 0.15 160)" }}>u</span>
          </div>
          <p className="text-sm" style={{ color: "oklch(0.55 0.04 250)" }}>
            f = focal length · v = image distance · u = object distance (negative, real-is-positive convention)
          </p>
        </div>

        {/* Calculator */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div
            className="rounded-xl p-6 space-y-6"
            style={{
              background: "oklch(0.20 0.035 250)",
              border: "1px solid oklch(0.28 0.04 250)",
            }}
          >
            <div>
              <h2
                className="text-base font-semibold mb-4"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
              >
                Solve For
              </h2>
              <div className="flex gap-2">
                {(["f", "v", "u"] as SolveFor[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setSolveFor(s)}
                    className="flex-1 py-2.5 rounded font-bold text-sm transition-all duration-150"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: solveFor === s ? lensColor : "oklch(0.17 0.04 250)",
                      color: solveFor === s ? "oklch(0.12 0.04 250)" : "oklch(0.65 0.04 250)",
                      border: `1px solid ${solveFor === s ? lensColor : "oklch(0.28 0.04 250)"}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Lens type */}
            <div>
              <h2
                className="text-base font-semibold mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
              >
                Lens Type
              </h2>
              <div className="flex gap-2">
                {(["converging", "concave"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setLensType(t)}
                    className="flex-1 py-2.5 rounded text-sm font-medium transition-all duration-150 capitalize"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      background: lensType === t ? (t === "converging" ? "oklch(0.78 0.18 200 / 0.15)" : "oklch(0.75 0.14 75 / 0.15)") : "oklch(0.17 0.04 250)",
                      color: lensType === t ? (t === "converging" ? "oklch(0.78 0.18 200)" : "oklch(0.75 0.14 75)") : "oklch(0.65 0.04 250)",
                      border: `1px solid ${lensType === t ? (t === "converging" ? "oklch(0.78 0.18 200 / 0.4)" : "oklch(0.75 0.14 75 / 0.4)") : "oklch(0.28 0.04 250)"}`,
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {solveFor !== "f" && (
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "oklch(0.60 0.04 250)" }}>
                    Focal Length (f) — px
                  </label>
                  <input
                    type="number"
                    value={fInput}
                    onChange={(e) => setFInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded text-sm"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "oklch(0.17 0.04 250)",
                      border: "1px solid oklch(0.30 0.04 250)",
                      color: "oklch(0.75 0.14 75)",
                      outline: "none",
                    }}
                  />
                </div>
              )}
              {solveFor !== "v" && (
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "oklch(0.60 0.04 250)" }}>
                    Image Distance (v) — px
                  </label>
                  <input
                    type="number"
                    value={vInput}
                    onChange={(e) => setVInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded text-sm"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "oklch(0.17 0.04 250)",
                      border: "1px solid oklch(0.30 0.04 250)",
                      color: "oklch(0.78 0.18 200)",
                      outline: "none",
                    }}
                  />
                </div>
              )}
              {solveFor !== "u" && (
                <div>
                  <label className="block text-xs mb-1.5" style={{ color: "oklch(0.60 0.04 250)" }}>
                    Object Distance (u) — px
                  </label>
                  <input
                    type="number"
                    value={uInput}
                    onChange={(e) => setUInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded text-sm"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "oklch(0.17 0.04 250)",
                      border: "1px solid oklch(0.30 0.04 250)",
                      color: "oklch(0.65 0.15 160)",
                      outline: "none",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Result */}
            <div
              className="rounded-xl p-5"
              style={{
                background: `${lensColor}10`,
                border: `1px solid ${lensColor}30`,
              }}
            >
              <p className="text-xs mb-2" style={{ color: "oklch(0.55 0.04 250)" }}>{resultLabel}</p>
              <p
                className="text-3xl font-bold"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: lensColor }}
              >
                {isFinite(result) ? result.toFixed(2) : "∞"} <span className="text-base font-normal" style={{ color: "oklch(0.50 0.04 250)" }}>px</span>
              </p>
              <div className="mt-3 flex gap-4 text-xs" style={{ color: "oklch(0.60 0.04 250)" }}>
                <span>m = {isFinite(magnification) ? magnification.toFixed(3) : "∞"}</span>
                <span>{isReal ? "Real image" : "Virtual image"}</span>
                <span>{isInverted ? "Inverted" : "Upright"}</span>
              </div>
            </div>
          </div>

          {/* Live simulation */}
          <div className="space-y-4">
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
            >
              Live Ray Diagram
            </h2>
            <div style={{ height: "320px" }}>
              <RayDiagram
                lensType={lensType}
                focalLength={lensType === "concave" ? -Math.abs(simF) : Math.abs(simF)}
                objectDistance={Math.abs(simU)}
                objectHeight={simH}
                showVirtualRays={true}
              />
            </div>
          </div>
        </div>

        {/* Sign convention table */}
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
            Sign Convention (Real-is-Positive)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid oklch(0.28 0.04 250)" }}>
                  {["Quantity", "Positive (+)", "Negative (−)"].map((h) => (
                    <th
                      key={h}
                      className="text-left pb-3 pr-6"
                      style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.65 0.04 250)", fontWeight: 600 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Object distance (u)", "Object on incoming side (real object)", "Object on outgoing side (virtual object)"],
                  ["Image distance (v)", "Image on outgoing side (real image)", "Image on incoming side (virtual image)"],
                  ["Focal length (f)", "Converging lens", "Diverging (concave) lens"],
                  ["Magnification (m)", "Upright image", "Inverted image"],
                  ["Object/image height", "Above principal axis", "Below principal axis"],
                ].map(([qty, pos, neg]) => (
                  <tr
                    key={qty as string}
                    className="border-b"
                    style={{ borderColor: "oklch(0.22 0.03 250)" }}
                  >
                    <td className="py-3 pr-6 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)", fontSize: "0.8rem" }}>{qty}</td>
                    <td className="py-3 pr-6" style={{ color: "oklch(0.68 0.04 250)" }}>{pos}</td>
                    <td className="py-3" style={{ color: "oklch(0.60 0.04 250)" }}>{neg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lens maker's equation */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "oklch(0.20 0.035 250)",
            border: "1px solid oklch(0.28 0.04 250)",
          }}
        >
          <h2
            className="text-xl font-bold mb-4"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}
          >
            Lensmaker's Equation
          </h2>
          <div
            className="text-2xl font-bold mb-4"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "oklch(0.78 0.18 200)",
            }}
          >
            1/f = (n − 1) [ 1/R₁ − 1/R₂ ]
          </div>
          <p className="text-sm leading-relaxed" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "600px" }}>
            Where <strong style={{ color: "oklch(0.78 0.18 200)" }}>n</strong> is the refractive index of the lens material,{" "}
            <strong style={{ color: "oklch(0.78 0.18 200)" }}>R₁</strong> is the radius of curvature of the first surface (positive if center of curvature is to the right),
            and <strong style={{ color: "oklch(0.78 0.18 200)" }}>R₂</strong> is the radius of curvature of the second surface.
            For a biconvex lens: R₁ &gt; 0, R₂ &lt; 0, giving f &gt; 0.
          </p>
        </div>
      </div>
    </div>
  );
}
