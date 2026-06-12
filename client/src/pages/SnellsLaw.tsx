/* ============================================================
   SNELL'S LAW REFRACTION DEMO — Blueprint Lab Design
   Interactive: angle of incidence, two media, TIR detection
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const GREEN = "#34d399";
const RED = "#f87171";

const MATERIALS: Record<string, number> = {
  "Air": 1.000,
  "Water": 1.333,
  "Glass (crown)": 1.523,
  "Glass (flint)": 1.620,
  "Diamond": 2.417,
  "Acrylic": 1.491,
  "Sapphire": 1.762,
  "Quartz": 1.544,
};

function drawDotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "rgba(100,180,255,0.06)";
  for (let x = 0; x < W; x += 28) for (let y = 0; y < H; y += 28) {
    ctx.beginPath(); ctx.arc(x, y, 0.8, 0, Math.PI * 2); ctx.fill();
  }
}

function InfoBox({ title, children, accent = "oklch(0.78 0.18 200)" }: { title: string; children: React.ReactNode; accent?: string }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
      <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: accent }}>{title}</h3>
      <div className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.04 250)" }}>{children}</div>
    </div>
  );
}

export default function SnellsLaw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angleI, setAngleI] = useState(35);
  const [mat1, setMat1] = useState("Air");
  const [mat2, setMat2] = useState("Glass (crown)");
  const [showWavefronts, setShowWavefronts] = useState(true);

  const n1 = MATERIALS[mat1];
  const n2 = MATERIALS[mat2];
  const sinT2 = (n1 * Math.sin((angleI * Math.PI) / 180)) / n2;
  const isTIR = sinT2 > 1;
  const angleT = isTIR ? null : (Math.asin(sinT2) * 180) / Math.PI;
  const criticalAngle = n1 > n2 ? (Math.asin(n2 / n1) * 180) / Math.PI : null;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const interfaceY = H / 2;
    const rayLen = Math.min(W, H) * 0.42;

    ctx.clearRect(0, 0, W, H);

    // Media backgrounds
    const grad1 = ctx.createLinearGradient(0, 0, 0, interfaceY);
    grad1.addColorStop(0, "rgba(34,211,238,0.04)");
    grad1.addColorStop(1, "rgba(34,211,238,0.10)");
    ctx.fillStyle = grad1;
    ctx.fillRect(0, 0, W, interfaceY);

    const grad2 = ctx.createLinearGradient(0, interfaceY, 0, H);
    grad2.addColorStop(0, "rgba(251,191,36,0.08)");
    grad2.addColorStop(1, "rgba(251,191,36,0.03)");
    ctx.fillStyle = grad2;
    ctx.fillRect(0, interfaceY, W, H);

    drawDotGrid(ctx, W, H);

    // Interface line
    ctx.strokeStyle = "rgba(100,180,255,0.4)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(0, interfaceY); ctx.lineTo(W, interfaceY); ctx.stroke();
    ctx.setLineDash([]);

    // Normal (dashed vertical)
    ctx.strokeStyle = "rgba(100,180,255,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(cx, interfaceY - rayLen * 0.9); ctx.lineTo(cx, interfaceY + rayLen * 0.9); ctx.stroke();
    ctx.setLineDash([]);

    // Media labels
    ctx.font = "bold 12px 'Space Grotesk', sans-serif";
    ctx.fillStyle = CYAN;
    ctx.fillText(`n₁ = ${n1.toFixed(3)}  (${mat1})`, 16, 24);
    ctx.fillStyle = AMBER;
    ctx.fillText(`n₂ = ${n2.toFixed(3)}  (${mat2})`, 16, interfaceY + 24);

    // Incident ray
    const iRad = (angleI * Math.PI) / 180;
    const ix = cx - rayLen * Math.sin(iRad);
    const iy = interfaceY - rayLen * Math.cos(iRad);
    ctx.shadowColor = CYAN;
    ctx.shadowBlur = 10;
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(cx, interfaceY); ctx.stroke();
    ctx.shadowBlur = 0;

    // Arrow on incident ray
    const midX = (ix + cx) / 2, midY = (iy + interfaceY) / 2;
    const dx = cx - ix, dy = interfaceY - iy;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len, uy = dy / len;
    ctx.fillStyle = CYAN;
    ctx.beginPath();
    ctx.moveTo(midX + ux * 8, midY + uy * 8);
    ctx.lineTo(midX - ux * 8 - uy * 6, midY - uy * 8 + ux * 6);
    ctx.lineTo(midX - ux * 8 + uy * 6, midY - uy * 8 - ux * 6);
    ctx.closePath(); ctx.fill();

    if (!isTIR && angleT !== null) {
      // Refracted ray
      const tRad = (angleT * Math.PI) / 180;
      const tx = cx + rayLen * Math.sin(tRad);
      const ty = interfaceY + rayLen * Math.cos(tRad);
      ctx.shadowColor = AMBER;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, interfaceY); ctx.lineTo(tx, ty); ctx.stroke();
      ctx.shadowBlur = 0;

      // Arrow on refracted ray
      const mx2 = (cx + tx) / 2, my2 = (interfaceY + ty) / 2;
      const dx2 = tx - cx, dy2 = ty - interfaceY;
      const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
      const ux2 = dx2 / len2, uy2 = dy2 / len2;
      ctx.fillStyle = AMBER;
      ctx.beginPath();
      ctx.moveTo(mx2 + ux2 * 8, my2 + uy2 * 8);
      ctx.lineTo(mx2 - ux2 * 8 - uy2 * 6, my2 - uy2 * 8 + ux2 * 6);
      ctx.lineTo(mx2 - ux2 * 8 + uy2 * 6, my2 - uy2 * 8 - ux2 * 6);
      ctx.closePath(); ctx.fill();

      // Wavefronts
      if (showWavefronts) {
        const waveSpacing = 28;
        const numWaves = 4;
        // Incident wavefronts (perpendicular to incident ray)
        for (let w = 1; w <= numWaves; w++) {
          const d = w * waveSpacing;
          const wx = ix + ux * d;
          const wy = iy + uy * d;
          ctx.strokeStyle = `rgba(34,211,238,${0.3 - w * 0.05})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(wx - uy * 40, wy + ux * 40);
          ctx.lineTo(wx + uy * 40, wy - ux * 40);
          ctx.stroke();
        }
        // Refracted wavefronts
        const ux2w = (tx - cx) / Math.sqrt((tx - cx) ** 2 + (ty - interfaceY) ** 2);
        const uy2w = (ty - interfaceY) / Math.sqrt((tx - cx) ** 2 + (ty - interfaceY) ** 2);
        for (let w = 1; w <= numWaves; w++) {
          const d = w * waveSpacing;
          const wx = cx + ux2w * d;
          const wy = interfaceY + uy2w * d;
          ctx.strokeStyle = `rgba(251,191,36,${0.3 - w * 0.05})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(wx - uy2w * 40, wy + ux2w * 40);
          ctx.lineTo(wx + uy2w * 40, wy - ux2w * 40);
          ctx.stroke();
        }
      }
    } else {
      // TIR: reflected ray
      const rx = cx + rayLen * Math.sin(iRad);
      const ry = interfaceY - rayLen * Math.cos(iRad);
      ctx.shadowColor = RED;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = RED;
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(cx, interfaceY); ctx.lineTo(rx, ry); ctx.stroke();
      ctx.shadowBlur = 0;

      // Evanescent wave indicator
      ctx.strokeStyle = "rgba(248,113,113,0.3)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.beginPath(); ctx.moveTo(cx - 80, interfaceY + 8); ctx.lineTo(cx + 80, interfaceY + 8); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = RED;
      ctx.font = "11px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("TOTAL INTERNAL REFLECTION", cx, interfaceY + 30);
      ctx.fillText("evanescent wave →", cx, interfaceY + 46);
      ctx.textAlign = "left";
    }

    // Angle arcs
    const arcR = 40;
    // Angle of incidence arc
    ctx.strokeStyle = CYAN;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, interfaceY, arcR, -Math.PI / 2, -Math.PI / 2 - iRad, true);
    ctx.stroke();
    ctx.fillStyle = CYAN;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`θ₁=${angleI}°`, cx - arcR - 38, interfaceY - 14);

    if (!isTIR && angleT !== null) {
      ctx.strokeStyle = AMBER;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const tRad2 = (angleT * Math.PI) / 180;
      ctx.arc(cx, interfaceY, arcR, Math.PI / 2, Math.PI / 2 - tRad2, true);
      ctx.stroke();
      ctx.fillStyle = AMBER;
      ctx.fillText(`θ₂=${angleT.toFixed(1)}°`, cx + arcR + 6, interfaceY + 18);
    }

    // Incident point dot
    ctx.beginPath(); ctx.arc(cx, interfaceY, 4, 0, Math.PI * 2);
    ctx.fillStyle = "white"; ctx.fill();

  }, [angleI, mat1, mat2, n1, n2, isTIR, angleT, showWavefronts]);

  useEffect(() => { draw(); }, [draw]);

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
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      <div className="pt-24 pb-10" style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}>
        <div className="container">
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.75 0.14 75 / 0.12)", border: "1px solid oklch(0.75 0.14 75 / 0.3)", color: "oklch(0.75 0.14 75)" }}>
            n₁ sin θ₁ = n₂ sin θ₂
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
            Snell's Law
          </h1>
          <p className="text-base" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "520px" }}>
            When light crosses a boundary between two media, it bends according to the ratio of their refractive indices. Drag the angle slider to see refraction — and discover total internal reflection.
          </p>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>Controls</h2>

              <div className="mb-5">
                <div className="flex justify-between mb-2">
                  <span className="text-sm" style={{ color: "oklch(0.75 0.04 250)" }}>Angle of Incidence (θ₁)</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN }}>{angleI}°</span>
                </div>
                <input type="range" min={0} max={89} step={1} value={angleI} onChange={e => setAngleI(Number(e.target.value))} className="w-full" style={{ accentColor: CYAN }} />
              </div>

              <div className="mb-4">
                <label className="block text-xs mb-1.5" style={{ color: "oklch(0.60 0.04 250)" }}>Medium 1 (top)</label>
                <select value={mat1} onChange={e => setMat1(e.target.value)} className="w-full px-3 py-2 rounded text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.17 0.04 250)", border: "1px solid oklch(0.30 0.04 250)", color: CYAN, outline: "none" }}>
                  {Object.keys(MATERIALS).map(m => <option key={m} value={m}>{m} (n={MATERIALS[m]})</option>)}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-xs mb-1.5" style={{ color: "oklch(0.60 0.04 250)" }}>Medium 2 (bottom)</label>
                <select value={mat2} onChange={e => setMat2(e.target.value)} className="w-full px-3 py-2 rounded text-sm" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.17 0.04 250)", border: "1px solid oklch(0.30 0.04 250)", color: AMBER, outline: "none" }}>
                  {Object.keys(MATERIALS).map(m => <option key={m} value={m}>{m} (n={MATERIALS[m]})</option>)}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showWavefronts} onChange={e => setShowWavefronts(e.target.checked)} style={{ accentColor: CYAN }} />
                <span className="text-sm" style={{ color: "oklch(0.70 0.04 250)" }}>Show wavefronts</span>
              </label>
            </div>

            {/* Results */}
            <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>Results</h2>
              {[
                { label: "n₁", value: n1.toFixed(3), color: CYAN },
                { label: "n₂", value: n2.toFixed(3), color: AMBER },
                { label: "θ₁ (incidence)", value: `${angleI}°`, color: CYAN },
                { label: "θ₂ (refraction)", value: isTIR ? "TIR" : `${angleT?.toFixed(2)}°`, color: isTIR ? RED : AMBER },
                { label: "Critical angle", value: criticalAngle ? `${criticalAngle.toFixed(1)}°` : "N/A", color: GREEN },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between py-1.5 border-b text-xs" style={{ borderColor: "oklch(0.22 0.03 250)" }}>
                  <span style={{ color: "oklch(0.55 0.04 250)" }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color }}>{value}</span>
                </div>
              ))}
              {isTIR && (
                <div className="mt-3 p-2.5 rounded text-xs" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: RED }}>
                  θ₁ exceeds critical angle → Total Internal Reflection
                </div>
              )}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div style={{ height: "380px" }}>
              <canvas ref={canvasRef} className="w-full h-full rounded-xl" style={{ display: "block", border: "1px solid oklch(0.28 0.04 250)", background: "oklch(0.17 0.04 250)" }} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InfoBox title="Snell's Law">
                <span className="block font-mono text-sm mb-2" style={{ color: CYAN }}>n₁ sin θ₁ = n₂ sin θ₂</span>
                Light bends toward the normal when entering a denser medium (n₂ &gt; n₁) and away from it when entering a less dense medium.
              </InfoBox>
              <InfoBox title="Total Internal Reflection" accent={RED}>
                When light travels from a denser to a less dense medium and θ₁ exceeds the critical angle (θ_c = arcsin(n₂/n₁)), all light is reflected. This is the principle behind optical fibers and diamond brilliance.
              </InfoBox>
              <InfoBox title="Refractive index">
                n = c/v, the ratio of the speed of light in vacuum to its speed in the medium. Higher n means slower light and more bending. Diamond's n=2.417 causes its spectacular sparkle.
              </InfoBox>
              <InfoBox title="Wavefronts">
                Wavefronts are surfaces of equal phase. They are perpendicular to the ray direction. The change in wavelength (λ = λ₀/n) across the interface causes the wavefronts to tilt — this is why the ray bends.
              </InfoBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
