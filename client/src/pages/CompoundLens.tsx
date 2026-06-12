/* ============================================================
   COMPOUND LENS SIMULATOR — Blueprint Lab Design
   Two lenses on one canvas; image of first = object of second
   Models telescopes, microscopes, telephoto systems
   ============================================================ */
import { useState, useEffect, useRef, useCallback } from "react";
import Navbar from "@/components/Navbar";

const CYAN = "#22d3ee";
const AMBER = "#fbbf24";
const NAVY = "oklch(0.17 0.04 250)";

function drawDotGrid(ctx: CanvasRenderingContext2D, W: number, H: number) {
  ctx.fillStyle = "rgba(100,180,255,0.07)";
  for (let x = 0; x < W; x += 32) for (let y = 0; y < H; y += 32) {
    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
  }
}

function drawLensShape(ctx: CanvasRenderingContext2D, lx: number, cy: number, H: number, positive: boolean) {
  const halfH = H * 0.32;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 2;
  if (positive) {
    ctx.beginPath();
    ctx.moveTo(lx, cy - halfH);
    ctx.bezierCurveTo(lx + 22, cy - halfH / 2, lx + 22, cy + halfH / 2, lx, cy + halfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx, cy - halfH);
    ctx.bezierCurveTo(lx - 22, cy - halfH / 2, lx - 22, cy + halfH / 2, lx, cy + halfH);
    ctx.stroke();
    // arrows
    ctx.fillStyle = CYAN;
    ctx.beginPath(); ctx.moveTo(lx, cy - halfH); ctx.lineTo(lx - 5, cy - halfH + 9); ctx.lineTo(lx + 5, cy - halfH + 9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx, cy + halfH); ctx.lineTo(lx - 5, cy + halfH - 9); ctx.lineTo(lx + 5, cy + halfH - 9); ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(lx, cy - halfH);
    ctx.bezierCurveTo(lx - 18, cy - halfH / 2, lx - 18, cy + halfH / 2, lx, cy + halfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx, cy - halfH);
    ctx.bezierCurveTo(lx + 18, cy - halfH / 2, lx + 18, cy + halfH / 2, lx, cy + halfH);
    ctx.stroke();
    ctx.fillStyle = CYAN;
    ctx.beginPath(); ctx.moveTo(lx, cy - halfH); ctx.lineTo(lx + 5, cy - halfH + 9); ctx.lineTo(lx - 5, cy - halfH + 9); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(lx, cy + halfH); ctx.lineTo(lx + 5, cy + halfH - 9); ctx.lineTo(lx - 5, cy + halfH - 9); ctx.closePath(); ctx.fill();
  }
}

function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, alpha = 1) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 7;
  ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
  ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.shadowBlur = 0;
}

function InfoBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
      <h3 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.78 0.18 200)" }}>{title}</h3>
      <div className="text-sm leading-relaxed" style={{ color: "oklch(0.70 0.04 250)" }}>{children}</div>
    </div>
  );
}

export default function CompoundLens() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [f1, setF1] = useState(80);
  const [f2, setF2] = useState(120);
  const [separation, setSeparation] = useState(160);
  const [objDist, setObjDist] = useState(160);
  const [objH, setObjH] = useState(50);
  const [lens1Positive, setLens1Positive] = useState(true);
  const [lens2Positive, setLens2Positive] = useState(true);

  // Compound system: image of lens1 becomes object for lens2
  const v1 = (f1 * objDist) / (objDist - f1) * (lens1Positive ? 1 : -1);
  const u2 = separation - v1; // object distance for lens2 (positive = left of lens2)
  const effectiveF2 = lens2Positive ? f2 : -f2;
  const v2 = (effectiveF2 * u2) / (u2 - effectiveF2);
  const m1 = -(v1 / objDist);
  const m2 = -(v2 / u2);
  const totalMag = m1 * m2;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = NAVY;
    ctx.fillRect(0, 0, W, H);
    drawDotGrid(ctx, W, H);

    // Principal axis
    ctx.strokeStyle = "rgba(100,180,255,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 4]);
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(W, cy); ctx.stroke();
    ctx.setLineDash([]);

    // Lens positions
    const l1x = W * 0.28;
    const l2x = l1x + separation;

    // Focal point markers
    const drawF = (x: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath(); ctx.arc(x, cy, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = color;
      ctx.fillText("F", x + 5, cy - 7);
    };
    drawF(l1x + (lens1Positive ? f1 : -f1), AMBER);
    drawF(l1x - (lens1Positive ? f1 : -f1), AMBER);
    if (l2x + (lens2Positive ? f2 : -f2) < W) drawF(l2x + (lens2Positive ? f2 : -f2), "#34d399");
    if (l2x - (lens2Positive ? f2 : -f2) > 0) drawF(l2x - (lens2Positive ? f2 : -f2), "#34d399");

    // Object arrow
    const ox = l1x - objDist;
    ctx.strokeStyle = "#7dd3fc"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(ox, cy); ctx.lineTo(ox, cy - objH); ctx.stroke();
    ctx.fillStyle = "#7dd3fc";
    ctx.beginPath(); ctx.moveTo(ox, cy - objH); ctx.lineTo(ox - 5, cy - objH + 9); ctx.lineTo(ox + 5, cy - objH + 9); ctx.closePath(); ctx.fill();

    // Intermediate image (from lens 1)
    const i1x = l1x + v1;
    const i1h = m1 * objH;
    if (isFinite(i1x) && i1x > 0 && i1x < W) {
      ctx.strokeStyle = "rgba(251,191,36,0.5)"; ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.beginPath(); ctx.moveTo(i1x, cy); ctx.lineTo(i1x, cy - i1h); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "rgba(251,191,36,0.5)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("I₁", i1x + 4, cy - Math.abs(i1h) - 5);
    }

    // Final image (from lens 2)
    const i2x = l2x + v2;
    const i2h = totalMag * objH;
    if (isFinite(i2x) && i2x > 0 && i2x < W) {
      ctx.strokeStyle = AMBER; ctx.lineWidth = 2;
      ctx.shadowColor = AMBER; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(i2x, cy); ctx.lineTo(i2x, cy - i2h); ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.fillStyle = AMBER;
      ctx.beginPath();
      if (i2h < 0) {
        ctx.moveTo(i2x, cy - i2h); ctx.lineTo(i2x - 5, cy - i2h - 9); ctx.lineTo(i2x + 5, cy - i2h - 9);
      } else {
        ctx.moveTo(i2x, cy - i2h); ctx.lineTo(i2x - 5, cy - i2h + 9); ctx.lineTo(i2x + 5, cy - i2h + 9);
      }
      ctx.closePath(); ctx.fill();
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillStyle = AMBER;
      ctx.fillText("I₂", i2x + 4, cy - Math.abs(i2h) - 5);
    }

    // Rays through lens 1
    const rays = [-1, 0, 1].map(i => cy - objH + i * 0.01); // 3 rays from object tip
    [cy - objH].forEach(ry => {
      // Ray 1: parallel to axis → through F1
      glowLine(ctx, ox, ry, l1x, ry, CYAN);
      if (lens1Positive) {
        const slope = (cy - ry) / (l1x + f1 - l1x);
        const endY = ry + slope * (W - l1x);
        glowLine(ctx, l1x, ry, Math.min(l2x, W), ry + slope * (Math.min(l2x, W) - l1x), CYAN, 0.7);
      } else {
        const slope = (ry - cy) / (l1x - (l1x - f1));
        glowLine(ctx, l1x, ry, Math.min(l2x, W), ry + slope * (Math.min(l2x, W) - l1x), CYAN, 0.7);
      }
      // Ray 2: through center
      const slope2 = (cy - ry) / (l1x - ox);
      glowLine(ctx, ox, ry, l1x, ry, "rgba(100,200,255,0.4)");
      glowLine(ctx, l1x, ry, Math.min(l2x, W), ry + slope2 * (Math.min(l2x, W) - l1x), "rgba(100,200,255,0.4)");
    });

    // Separation line
    ctx.strokeStyle = "rgba(52,211,153,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 5]);
    ctx.beginPath(); ctx.moveTo(l2x, 10); ctx.lineTo(l2x, H - 10); ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = CYAN;
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`L₁ f=${lens1Positive ? "" : "−"}${f1}px`, l1x - 20, H - 12);
    ctx.fillStyle = "#34d399";
    ctx.fillText(`L₂ f=${lens2Positive ? "" : "−"}${f2}px`, l2x - 20, H - 12);

    drawLensShape(ctx, l1x, cy, H, lens1Positive);
    drawLensShape(ctx, l2x, cy, H, lens2Positive);

  }, [f1, f2, separation, objDist, objH, lens1Positive, lens2Positive, v1, v2, m1, m2, totalMag]);

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

  const presets = [
    { name: "Telescope", f1: 120, f2: 40, sep: 160, obj: 200, desc: "Objective + eyepiece" },
    { name: "Microscope", f1: 30, f2: 60, sep: 120, obj: 35, desc: "Short f objective" },
    { name: "Telephoto", f1: 100, f2: 80, sep: 60, obj: 250, desc: "Compressed system" },
    { name: "Beam Expander", f1: 40, f2: 120, sep: 160, obj: 200, desc: "Laser beam widening" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.15 0.04 250)" }}>
      <Navbar />

      <div className="pt-24 pb-10" style={{ borderBottom: "1px solid oklch(0.25 0.04 250)" }}>
        <div className="container">
          <span className="inline-block px-2.5 py-1 rounded text-xs font-bold mb-4" style={{ fontFamily: "'JetBrains Mono', monospace", background: "oklch(0.65 0.15 160 / 0.12)", border: "1px solid oklch(0.65 0.15 160 / 0.3)", color: "oklch(0.65 0.15 160)" }}>
            L₁ + L₂
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>
            Compound Lens Simulator
          </h1>
          <p className="text-base" style={{ color: "oklch(0.65 0.04 250)", maxWidth: "520px" }}>
            Two lenses in series. The image formed by the first lens becomes the object for the second. Models telescopes, microscopes, and telephoto systems.
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-8">
        {/* Presets */}
        <div>
          <p className="text-xs font-medium mb-3 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.55 0.04 250)" }}>Quick Presets</p>
          <div className="flex flex-wrap gap-3">
            {presets.map(p => (
              <button
                key={p.name}
                onClick={() => { setF1(p.f1); setF2(p.f2); setSeparation(p.sep); setObjDist(p.obj); setLens1Positive(true); setLens2Positive(true); }}
                className="px-4 py-2 rounded text-sm font-medium transition-all duration-150"
                style={{ fontFamily: "'Space Grotesk', sans-serif", background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)", color: "oklch(0.78 0.18 200)" }}
              >
                {p.name}
                <span className="ml-2 text-xs" style={{ color: "oklch(0.50 0.04 250)" }}>{p.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-5">
            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>Lens 1</h2>
              <div className="flex gap-2 mb-4">
                {["Converging", "Diverging"].map((t, i) => (
                  <button key={t} onClick={() => setLens1Positive(i === 0)} className="flex-1 py-1.5 rounded text-xs font-medium transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif", background: (lens1Positive ? i === 0 : i === 1) ? "oklch(0.78 0.18 200)" : "oklch(0.17 0.04 250)", color: (lens1Positive ? i === 0 : i === 1) ? "oklch(0.12 0.04 250)" : "oklch(0.65 0.04 250)", border: "1px solid oklch(0.28 0.04 250)" }}>{t}</button>
                ))}
              </div>
              {[
                { label: "f₁", value: f1, min: 20, max: 200, set: setF1 },
              ].map(({ label, value, min, max, set }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm" style={{ color: "oklch(0.70 0.04 250)" }}>Focal Length</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: CYAN }}>{lens1Positive ? "" : "−"}{value}px</span>
                  </div>
                  <input type="range" min={min} max={max} step={5} value={value} onChange={e => set(Number(e.target.value))} className="w-full" style={{ accentColor: CYAN }} />
                </div>
              ))}
            </div>

            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-5" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>Lens 2</h2>
              <div className="flex gap-2 mb-4">
                {["Converging", "Diverging"].map((t, i) => (
                  <button key={t} onClick={() => setLens2Positive(i === 0)} className="flex-1 py-1.5 rounded text-xs font-medium transition-all" style={{ fontFamily: "'Space Grotesk', sans-serif", background: (lens2Positive ? i === 0 : i === 1) ? "#34d399" : "oklch(0.17 0.04 250)", color: (lens2Positive ? i === 0 : i === 1) ? "oklch(0.12 0.04 250)" : "oklch(0.65 0.04 250)", border: "1px solid oklch(0.28 0.04 250)" }}>{t}</button>
                ))}
              </div>
              <div className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: "oklch(0.70 0.04 250)" }}>Focal Length</span>
                  <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "#34d399" }}>{lens2Positive ? "" : "−"}{f2}px</span>
                </div>
                <input type="range" min={20} max={200} step={5} value={f2} onChange={e => setF2(Number(e.target.value))} className="w-full" style={{ accentColor: "#34d399" }} />
              </div>
            </div>

            <div className="rounded-xl p-6" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-base font-semibold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>Object & Separation</h2>
              {[
                { label: "Lens Separation (d)", value: separation, min: 40, max: 280, set: setSeparation, color: "oklch(0.65 0.04 250)" },
                { label: "Object Distance (u₁)", value: objDist, min: 20, max: 300, set: setObjDist, color: "oklch(0.65 0.04 250)" },
                { label: "Object Height (h)", value: objH, min: 10, max: 90, set: setObjH, color: "oklch(0.65 0.04 250)" },
              ].map(({ label, value, min, max, set, color }) => (
                <div key={label} className="mb-4">
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm" style={{ color: "oklch(0.70 0.04 250)" }}>{label}</span>
                    <span className="text-sm font-medium" style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{value}px</span>
                  </div>
                  <input type="range" min={min} max={max} step={5} value={value} onChange={e => set(Number(e.target.value))} className="w-full" style={{ accentColor: "oklch(0.78 0.18 200)" }} />
                </div>
              ))}
            </div>

            {/* Results */}
            <div className="rounded-xl p-5" style={{ background: "oklch(0.20 0.035 250)", border: "1px solid oklch(0.28 0.04 250)" }}>
              <h2 className="text-sm font-semibold mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.01 250)" }}>System Results</h2>
              {[
                { label: "v₁ (intermediate)", value: isFinite(v1) ? `${v1.toFixed(1)}px` : "∞" },
                { label: "v₂ (final image)", value: isFinite(v2) ? `${v2.toFixed(1)}px` : "∞" },
                { label: "m₁", value: isFinite(m1) ? m1.toFixed(3) : "∞" },
                { label: "m₂", value: isFinite(m2) ? m2.toFixed(3) : "∞" },
                { label: "Total magnification", value: isFinite(totalMag) ? totalMag.toFixed(3) : "∞" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1.5 border-b text-xs" style={{ borderColor: "oklch(0.22 0.03 250)" }}>
                  <span style={{ color: "oklch(0.55 0.04 250)" }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "oklch(0.78 0.18 200)" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div style={{ height: "360px" }}>
              <canvas ref={canvasRef} className="w-full h-full rounded-xl" style={{ display: "block", border: "1px solid oklch(0.28 0.04 250)", background: NAVY }} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <InfoBox title="How compound lenses work">
                The image formed by lens 1 (I₁) acts as the object for lens 2. If I₁ falls between L₁ and L₂, it is a real intermediate image. The total magnification is m = m₁ × m₂.
              </InfoBox>
              <InfoBox title="Effective focal length">
                <span className="block font-mono text-xs mb-1" style={{ color: "oklch(0.78 0.18 200)" }}>1/f = 1/f₁ + 1/f₂ − d/(f₁·f₂)</span>
                Where d is the separation between lenses. When d = f₁ + f₂, the system is afocal (telescope mode).
              </InfoBox>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
