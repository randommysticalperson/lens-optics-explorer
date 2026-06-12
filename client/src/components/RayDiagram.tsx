/* ============================================================
   RAY DIAGRAM — Interactive Canvas Simulation
   Blueprint Lab Design: dark navy + cyan rays + amber focal
   ============================================================ */
import { useEffect, useRef, useCallback } from "react";

export type LensType = "converging" | "concave" | "aspheric";

interface RayDiagramProps {
  lensType: LensType;
  focalLength: number;   // in pixels (positive = converging, negative = concave)
  objectDistance: number; // in pixels from lens (positive = left of lens)
  objectHeight: number;   // in pixels (positive = above axis)
  showVirtualRays?: boolean;
  showImageInfo?: boolean;
}

const CYAN = "oklch(0.78 0.18 200)";
const AMBER = "oklch(0.75 0.14 75)";
const NAVY_BORDER = "oklch(0.30 0.04 250)";
const VIRTUAL_COLOR = "rgba(100, 200, 255, 0.4)";
const GRID_COLOR = "rgba(100, 180, 255, 0.08)";
const AXIS_COLOR = "rgba(100, 180, 255, 0.35)";

function drawDotGrid(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = GRID_COLOR;
  for (let x = 0; x < w; x += 32) {
    for (let y = 0; y < h; y += 32) {
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawAxis(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number) {
  // Principal axis
  ctx.strokeStyle = AXIS_COLOR;
  ctx.lineWidth = 1;
  ctx.setLineDash([8, 4]);
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawLens(ctx: CanvasRenderingContext2D, cx: number, cy: number, h: number, lensType: LensType) {
  const halfH = h * 0.38;
  ctx.strokeStyle = CYAN;
  ctx.lineWidth = 2.5;

  if (lensType === "converging") {
    // Biconvex lens shape
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfH);
    ctx.bezierCurveTo(cx + 28, cy - halfH / 2, cx + 28, cy + halfH / 2, cx, cy + halfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfH);
    ctx.bezierCurveTo(cx - 28, cy - halfH / 2, cx - 28, cy + halfH / 2, cx, cy + halfH);
    ctx.stroke();
    // Arrows
    drawLensArrows(ctx, cx, cy, halfH, true);
  } else if (lensType === "concave") {
    // Biconcave lens shape — both surfaces curve INWARD (toward center)
    // Left surface: control points bow to the RIGHT (inward from left edge)
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - halfH);
    ctx.bezierCurveTo(cx + 18, cy - halfH / 2, cx + 18, cy + halfH / 2, cx - 8, cy + halfH);
    ctx.stroke();
    // Right surface: control points bow to the LEFT (inward from right edge)
    ctx.beginPath();
    ctx.moveTo(cx + 8, cy - halfH);
    ctx.bezierCurveTo(cx - 18, cy - halfH / 2, cx - 18, cy + halfH / 2, cx + 8, cy + halfH);
    ctx.stroke();
    // Connect top and bottom edges with straight lines
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy - halfH);
    ctx.lineTo(cx + 8, cy - halfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + halfH);
    ctx.lineTo(cx + 8, cy + halfH);
    ctx.stroke();
    // Arrows pointing inward
    drawLensArrows(ctx, cx, cy, halfH, false);
  } else {
    // Aspheric — slightly irregular convex profile
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfH);
    ctx.bezierCurveTo(cx + 32, cy - halfH * 0.6, cx + 22, cy + halfH * 0.6, cx, cy + halfH);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfH);
    ctx.bezierCurveTo(cx - 32, cy - halfH * 0.6, cx - 22, cy + halfH * 0.6, cx, cy + halfH);
    ctx.stroke();
    drawLensArrows(ctx, cx, cy, halfH, true);
  }

  // Lens center vertical line
  ctx.strokeStyle = "rgba(100,200,255,0.25)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, cy - halfH);
  ctx.lineTo(cx, cy + halfH);
  ctx.stroke();
}

function drawLensArrows(ctx: CanvasRenderingContext2D, cx: number, cy: number, halfH: number, outward: boolean) {
  const dir = outward ? 1 : -1;
  const tipOffset = outward ? 14 : -14;
  ctx.fillStyle = CYAN;
  // Top arrow
  ctx.beginPath();
  ctx.moveTo(cx, cy - halfH);
  ctx.lineTo(cx - 5 * dir, cy - halfH + 10);
  ctx.lineTo(cx + 5 * dir, cy - halfH + 10);
  ctx.closePath();
  ctx.fill();
  // Bottom arrow
  ctx.beginPath();
  ctx.moveTo(cx, cy + halfH);
  ctx.lineTo(cx - 5 * dir, cy + halfH - 10);
  ctx.lineTo(cx + 5 * dir, cy + halfH - 10);
  ctx.closePath();
  ctx.fill();
}

function drawObject(ctx: CanvasRenderingContext2D, ox: number, cy: number, oh: number) {
  // Object arrow
  ctx.strokeStyle = "#7dd3fc";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(ox, cy);
  ctx.lineTo(ox, cy - oh);
  ctx.stroke();
  // Arrowhead
  ctx.fillStyle = "#7dd3fc";
  ctx.beginPath();
  ctx.moveTo(ox, cy - oh);
  ctx.lineTo(ox - 5, cy - oh + 10);
  ctx.lineTo(ox + 5, cy - oh + 10);
  ctx.closePath();
  ctx.fill();
  // Base dot
  ctx.beginPath();
  ctx.arc(ox, cy, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFocalPoints(ctx: CanvasRenderingContext2D, cx: number, cy: number, f: number) {
  const absF = Math.abs(f);
  // F on right
  ctx.fillStyle = AMBER;
  ctx.beginPath();
  ctx.arc(cx + absF, cy, 4, 0, Math.PI * 2);
  ctx.fill();
  // F on left
  ctx.beginPath();
  ctx.arc(cx - absF, cy, 4, 0, Math.PI * 2);
  ctx.fill();

  // Labels
  ctx.fillStyle = "rgba(255, 180, 60, 0.8)";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("F", cx + absF + 6, cy - 8);
  ctx.fillText("F", cx - absF + 6, cy - 8);
}

function glowLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, glow = true) {
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 8;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.shadowBlur = 0;
}

export default function RayDiagram({
  lensType,
  focalLength,
  objectDistance,
  objectHeight,
  showVirtualRays = true,
}: RayDiagramProps) {
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

    // Background
    ctx.fillStyle = "oklch(0.17 0.04 250)";
    ctx.fillRect(0, 0, W, H);

    drawDotGrid(ctx, W, H);
    drawAxis(ctx, cx, cy, W);

    // Focal length in canvas pixels (scale factor)
    const f = focalLength;
    const u = objectDistance; // positive = object on left
    const ho = objectHeight;

    // Object position
    const ox = cx - u;

    drawFocalPoints(ctx, cx, cy, f);
    drawObject(ctx, ox, cy, ho);

    // Thin lens equation: 1/v = 1/f - 1/(-u) = 1/f + 1/u  (sign convention: u positive left)
    // Using: 1/v - 1/u = 1/f  where u is negative (object on left)
    // Standard: 1/f = 1/v - 1/(-u) => 1/v = 1/f - 1/u
    // Let's use: object at -u from lens, image at v
    // 1/f = 1/v + 1/u  (real-is-positive convention, u>0 means object left)
    // v = fu / (u - f)
    const v = (f * u) / (u - f);
    const hi = -(v / u) * ho; // image height (negative = inverted)
    const ix = cx + v; // image x position

    // Ray 1: Parallel to axis → through focal point (converging) or away from focal (concave)
    const r1StartX = 0;
    const r1StartY = cy - ho;
    // Ray hits lens at (cx, cy - ho)
    // After lens: goes through right focal (converging) or appears to come from left focal (concave)
    let r1EndX: number, r1EndY: number;
    if (lensType === "converging" || lensType === "aspheric") {
      // Goes through right focal point (cx + f, cy)
      const slope = (cy - (cy - ho)) / (cx + f - cx);
      r1EndX = W;
      r1EndY = cy - ho + slope * (W - cx);
    } else {
      // Diverges as if coming from left focal (cx - |f|, cy)
      const slope = ((cy - ho) - cy) / (cx - (cx - Math.abs(f)));
      r1EndX = W;
      r1EndY = cy - ho + slope * (W - cx);
    }

    // Ray 2: Through optical center → continues straight
    const r2Slope = (cy - (cy - ho)) / (cx - ox);
    const r2EndX = W;
    const r2EndY = cy - ho + r2Slope * (W - ox);

    // Ray 3: Through left focal → parallel after lens (converging) or toward right focal (concave)
    let r3StartX: number, r3StartY: number, r3EndX: number, r3EndY: number;
    if (lensType === "converging" || lensType === "aspheric") {
      // Aimed at left focal, exits parallel
      r3StartX = 0;
      const leftF = cx - Math.abs(f);
      const slopeToF = ((cy - ho) - cy) / (cx - leftF);
      r3StartY = cy - ho - slopeToF * (cx - 0);
      r3EndX = W;
      r3EndY = cy - ho; // parallel to axis after lens
    } else {
      // Aimed at right focal, exits parallel
      r3StartX = 0;
      const rightF = cx + Math.abs(f);
      const slopeToF = ((cy - ho) - cy) / (cx - rightF);
      r3StartY = cy - ho - slopeToF * cx;
      r3EndX = W;
      r3EndY = cy - ho;
    }

    // Draw incoming rays (left of lens)
    glowLine(ctx, r1StartX, r1StartY, cx, cy - ho, CYAN);
    glowLine(ctx, ox, cy - ho, cx, cy - ho, "rgba(100,200,255,0.5)"); // Ray 2 incoming
    glowLine(ctx, r3StartX, r3StartY, cx, cy - ho, CYAN);

    // Draw outgoing rays (right of lens)
    if (lensType === "converging" || lensType === "aspheric") {
      if (v > 0) {
        // Real image
        glowLine(ctx, cx, cy - ho, r1EndX, r1EndY, CYAN);
        glowLine(ctx, cx, cy - ho, r2EndX, r2EndY, "rgba(100,200,255,0.5)");
        glowLine(ctx, cx, cy - ho, r3EndX, r3EndY, CYAN);

        // Image arrow
        if (ix > cx && ix < W - 20) {
          ctx.strokeStyle = AMBER;
          ctx.lineWidth = 2;
          ctx.shadowColor = AMBER;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(ix, cy);
          ctx.lineTo(ix, cy - hi);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.fillStyle = AMBER;
          ctx.beginPath();
          if (hi < 0) {
            ctx.moveTo(ix, cy - hi);
            ctx.lineTo(ix - 5, cy - hi - 10);
            ctx.lineTo(ix + 5, cy - hi - 10);
          } else {
            ctx.moveTo(ix, cy - hi);
            ctx.lineTo(ix - 5, cy - hi + 10);
            ctx.lineTo(ix + 5, cy - hi + 10);
          }
          ctx.closePath();
          ctx.fill();
        }
      } else {
        // Virtual image (object inside focal length)
        glowLine(ctx, cx, cy - ho, r1EndX, r1EndY, CYAN);
        glowLine(ctx, cx, cy - ho, r2EndX, r2EndY, "rgba(100,200,255,0.5)");
        glowLine(ctx, cx, cy - ho, r3EndX, r3EndY, CYAN);

        if (showVirtualRays) {
          // Virtual image on left
          const vix = cx + v;
          if (vix > 20 && vix < cx) {
            ctx.setLineDash([5, 4]);
            ctx.strokeStyle = VIRTUAL_COLOR;
            ctx.lineWidth = 1.2;
            // Extend back to virtual image
            ctx.beginPath();
            ctx.moveTo(cx, cy - ho);
            ctx.lineTo(0, cy - ho + (r1EndY - (cy - ho)) * cx / (r1EndX - cx) * -1);
            ctx.stroke();
            ctx.setLineDash([]);

            // Virtual image arrow
            ctx.strokeStyle = "rgba(255,180,60,0.5)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(vix, cy);
            ctx.lineTo(vix, cy - hi);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }
    } else {
      // Concave: always virtual image
      glowLine(ctx, cx, cy - ho, r1EndX, r1EndY, CYAN);
      glowLine(ctx, cx, cy - ho, r2EndX, r2EndY, "rgba(100,200,255,0.5)");
      glowLine(ctx, cx, cy - ho, r3EndX, r3EndY, CYAN);

      if (showVirtualRays && ix > 20 && ix < cx) {
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = VIRTUAL_COLOR;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy - ho);
        ctx.lineTo(0, r1StartY + (cy - ho - r1StartY) * (cx / (cx - 0)));
        ctx.stroke();
        ctx.setLineDash([]);

        // Virtual image
        ctx.strokeStyle = "rgba(255,180,60,0.5)";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(ix, cy);
        ctx.lineTo(ix, cy - hi);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    drawLens(ctx, cx, cy, H, lensType);

    // Image distance label
    if (v !== Infinity && isFinite(v)) {
      ctx.fillStyle = "rgba(255,180,60,0.75)";
      ctx.font = "11px 'JetBrains Mono', monospace";
      const vLabel = v > 0 ? `v = +${v.toFixed(0)}px` : `v = ${v.toFixed(0)}px`;
      ctx.fillText(vLabel, cx + 8, cy + 22);
    }

    // Object distance label
    ctx.fillStyle = "rgba(100,200,255,0.7)";
    ctx.font = "11px 'JetBrains Mono', monospace";
    ctx.fillText(`u = ${u.toFixed(0)}px`, ox + 6, cy + 22);

  }, [lensType, focalLength, objectDistance, objectHeight, showVirtualRays]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Resize observer
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
        border: `1px solid ${NAVY_BORDER}`,
        background: "oklch(0.17 0.04 250)",
      }}
    />
  );
}
