/* ============================================================
   LENS FRONT VIEW — Cross-section from the front (circular view)
   Blueprint Lab Design: shows the lens aperture, zones, and
   light intensity distribution as seen head-on
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

export type LensType = "converging" | "concave" | "aspheric" | "convex";

interface LensFrontViewProps {
  lensType: LensType;
  focalLength?: number;   // used to compute zone rings
  aperture?: number;      // 0–1, fraction of max aperture open
  animated?: boolean;
}

const CYAN = "oklch(0.78 0.18 200)";
const AMBER = "oklch(0.75 0.14 75)";
const GREEN = "oklch(0.65 0.15 160)";

function hexFromOklch(lensType: LensType) {
  switch (lensType) {
    case "converging": return { primary: "#22d3ee", secondary: "#0891b2", glow: "rgba(34,211,238,0.35)" };
    case "convex":     return { primary: "#22d3ee", secondary: "#0891b2", glow: "rgba(34,211,238,0.35)" };
    case "concave":    return { primary: "#fbbf24", secondary: "#d97706", glow: "rgba(251,191,36,0.35)" };
    case "aspheric":   return { primary: "#34d399", secondary: "#059669", glow: "rgba(52,211,153,0.35)" };
  }
}

export default function LensFrontView({
  lensType,
  focalLength = 100,
  aperture = 1,
  animated = true,
}: LensFrontViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef<number>(0);

  const colors = hexFromOklch(lensType);

  const draw = useCallback((t: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const R = Math.min(W, H) * 0.42 * aperture;

    ctx.clearRect(0, 0, W, H);

    // Background
    ctx.fillStyle = "oklch(0.17 0.04 250)";
    ctx.fillRect(0, 0, W, H);

    // Dot grid
    ctx.fillStyle = "rgba(100,180,255,0.07)";
    for (let x = 0; x < W; x += 24) {
      for (let y = 0; y < H; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // ── Outer lens housing ring ──
    ctx.beginPath();
    ctx.arc(cx, cy, R + 18, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(100,180,255,0.2)";
    ctx.lineWidth = 8;
    ctx.stroke();

    // Mounting screw notches
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2 + Math.PI / 4;
      const nx = cx + (R + 18) * Math.cos(angle);
      const ny = cy + (R + 18) * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(nx, ny, 5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(100,180,255,0.25)";
      ctx.fill();
    }

    // ── Lens glass fill ──
    const glassGrad = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);

    if (lensType === "converging" || lensType === "convex") {
      // Biconvex: brighter center (thicker glass = more refraction)
      glassGrad.addColorStop(0, "rgba(34,211,238,0.18)");
      glassGrad.addColorStop(0.4, "rgba(34,211,238,0.10)");
      glassGrad.addColorStop(0.8, "rgba(34,211,238,0.04)");
      glassGrad.addColorStop(1, "rgba(34,211,238,0.01)");
    } else if (lensType === "concave") {
      // Biconcave: brighter edge (thicker at edge)
      glassGrad.addColorStop(0, "rgba(251,191,36,0.03)");
      glassGrad.addColorStop(0.5, "rgba(251,191,36,0.06)");
      glassGrad.addColorStop(0.85, "rgba(251,191,36,0.14)");
      glassGrad.addColorStop(1, "rgba(251,191,36,0.18)");
    } else {
      // Aspheric: smooth gradient with slight asymmetry
      glassGrad.addColorStop(0, "rgba(52,211,153,0.15)");
      glassGrad.addColorStop(0.5, "rgba(52,211,153,0.08)");
      glassGrad.addColorStop(1, "rgba(52,211,153,0.03)");
    }

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = glassGrad;
    ctx.fill();

    // ── Fresnel / zone rings ──
    const numZones = lensType === "aspheric" ? 6 : 5;
    for (let i = 1; i <= numZones; i++) {
      const zr = R * (i / numZones);
      const alpha = lensType === "aspheric"
        ? 0.06 + 0.04 * Math.sin(i * 0.8)
        : 0.08;
      ctx.beginPath();
      ctx.arc(cx, cy, zr, 0, Math.PI * 2);
      ctx.strokeStyle = `${colors.primary}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
      ctx.lineWidth = lensType === "aspheric" ? 0.8 : 0.6;
      ctx.stroke();
    }

    // ── Animated light wavefronts (concentric rings pulsing inward for converging) ──
    if (animated) {
      const speed = lensType === "concave" ? -0.4 : 0.4; // inward vs outward
      const numWaves = 3;
      for (let w = 0; w < numWaves; w++) {
        const phase = ((t * speed * 0.001 + w / numWaves) % 1 + 1) % 1;
        const wr = lensType === "concave"
          ? R * (0.1 + phase * 0.9)
          : R * (1 - phase);
        const wAlpha = Math.sin(phase * Math.PI) * 0.35;
        ctx.beginPath();
        ctx.arc(cx, cy, wr, 0, Math.PI * 2);
        ctx.strokeStyle = `${colors.primary}${Math.round(wAlpha * 255).toString(16).padStart(2, "0")}`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // ── Lens edge ring ──
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 12;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // ── Cross-hairs (optical axis markers) ──
    ctx.strokeStyle = "rgba(100,180,255,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - R - 12, cy);
    ctx.lineTo(cx + R + 12, cy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - R - 12);
    ctx.lineTo(cx, cy + R + 12);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── Center optical axis dot ──
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.glow;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    // ── Thickness profile indicator (side profile silhouette) ──
    // Draw a small cross-section profile in bottom-right corner
    const px = cx + R * 0.55;
    const py = cy + R * 0.55;
    const pr = R * 0.28;
    drawMiniProfile(ctx, px, py, pr, lensType, colors.primary);

    // ── Label ──
    ctx.fillStyle = colors.primary;
    ctx.font = "bold 11px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    const labelMap: Record<LensType, string> = {
      converging: "BICONVEX",
      convex: "PLANO-CONVEX",
      concave: "BICONCAVE",
      aspheric: "ASPHERIC",
    };
    ctx.fillText(labelMap[lensType], cx, cy + R + 32);
    ctx.textAlign = "left";

    // Diameter annotation
    ctx.strokeStyle = "rgba(100,180,255,0.3)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(cx - R, cy + R + 14);
    ctx.lineTo(cx + R, cy + R + 14);
    ctx.stroke();
    // tick marks
    ctx.beginPath(); ctx.moveTo(cx - R, cy + R + 10); ctx.lineTo(cx - R, cy + R + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + R, cy + R + 10); ctx.lineTo(cx + R, cy + R + 18); ctx.stroke();

    ctx.fillStyle = "rgba(100,180,255,0.5)";
    ctx.font = "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText(`Ø ${(R * 2).toFixed(0)}px`, cx, cy + R + 26);
    ctx.textAlign = "left";

  }, [lensType, aperture, animated, colors]);

  function drawMiniProfile(
    ctx: CanvasRenderingContext2D,
    px: number, py: number, pr: number,
    type: LensType, color: string
  ) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.6;

    if (type === "converging" || type === "convex") {
      // Biconvex side profile
      ctx.beginPath();
      ctx.moveTo(px, py - pr);
      ctx.bezierCurveTo(px + pr * 0.6, py - pr / 2, px + pr * 0.6, py + pr / 2, px, py + pr);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px, py - pr);
      ctx.bezierCurveTo(px - pr * 0.6, py - pr / 2, px - pr * 0.6, py + pr / 2, px, py + pr);
      ctx.stroke();
    } else if (type === "concave") {
      // Biconcave side profile — surfaces curve inward
      const edgeOff = pr * 0.12;
      ctx.beginPath();
      ctx.moveTo(px - edgeOff, py - pr);
      ctx.bezierCurveTo(px + pr * 0.45, py - pr / 2, px + pr * 0.45, py + pr / 2, px - edgeOff, py + pr);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px + edgeOff, py - pr);
      ctx.bezierCurveTo(px - pr * 0.45, py - pr / 2, px - pr * 0.45, py + pr / 2, px + edgeOff, py + pr);
      ctx.stroke();
      // top and bottom edge lines
      ctx.beginPath(); ctx.moveTo(px - edgeOff, py - pr); ctx.lineTo(px + edgeOff, py - pr); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px - edgeOff, py + pr); ctx.lineTo(px + edgeOff, py + pr); ctx.stroke();
    } else {
      // Aspheric — irregular
      ctx.beginPath();
      ctx.moveTo(px, py - pr);
      ctx.bezierCurveTo(px + pr * 0.7, py - pr * 0.5, px + pr * 0.5, py + pr * 0.5, px, py + pr);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(px, py - pr);
      ctx.bezierCurveTo(px - pr * 0.7, py - pr * 0.5, px - pr * 0.5, py + pr * 0.5, px, py + pr);
      ctx.stroke();
    }
    ctx.restore();
  }

  useEffect(() => {
    if (!animated) {
      draw(0);
      return;
    }
    const loop = (t: number) => {
      timeRef.current = t;
      draw(t);
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [draw, animated]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-xl"
      style={{
        display: "block",
        border: "1px solid oklch(0.28 0.04 250)",
        background: "oklch(0.17 0.04 250)",
      }}
    />
  );
}
